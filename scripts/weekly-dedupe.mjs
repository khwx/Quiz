import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { config as loadDotenv } from 'dotenv';
import { writeFileSync } from 'fs';

loadDotenv();

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Categories whose questions are legitimately similar by design (e.g. the same
// "Qual é a bandeira de X?" template for every country). Near-duplicate
// detection on these produces false positives and is therefore skipped.
const FUZZY_SKIP_CATEGORIES = new Set(['BANDEIRAS']);

const FUZZY_SIMILARITY_THRESHOLD = 0.9;

// Exat duplicate key (text + category + options), case-insensitive.
function exactKey(r) {
  return `${r.text}|${r.category.toUpperCase()}|${JSON.stringify(r.options)}`.toLowerCase();
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

// Two questions that share a long common prefix/suffix are likely members of
// the same question *template* (e.g. "Qual é o símbolo químico do elemento X?"
// for every element, or "Qual é a capital de Y?" for every country). Such pairs
// are NOT genuine near-duplicates — they are by-design template families
// produced by the built-in generator — and would otherwise flood the fuzzy
// report with hundreds of useless false positives. We detect and exclude them.
function isTemplateFamily(a, b) {
  const ta = a.split(/\s+/).filter(Boolean);
  const tb = b.split(/\s+/).filter(Boolean);
  if (ta.length === 0 || tb.length === 0) return false;
  const minLen = Math.min(ta.length, tb.length);

  let prefixLen = 0;
  while (prefixLen < minLen && ta[prefixLen] === tb[prefixLen]) prefixLen++;
  let suffixLen = 0;
  while (suffixLen < minLen && ta[ta.length - 1 - suffixLen] === tb[tb.length - 1 - suffixLen]) suffixLen++;

  const shared = Math.max(prefixLen, suffixLen);
  // Exclude when the shared template spans most of both questions (and is
  // substantial in absolute terms). This keeps genuinely reworded near-dupes.
  return shared >= 3 && shared >= minLen * 0.6;
}

async function getAllQuestions() {
  const rows = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, text, category, options')
      .range(offset, offset + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < 1000) break;
    offset += 1000;
  }
  return rows;
}

async function main() {
  const date = new Date().toISOString().split('T')[0];
  console.log(`🧹 Weekly Duplicate Check — ${date}`);

  const all = await getAllQuestions();
  console.log(`📊 Total perguntas na BD: ${all.length}`);

  // 1. Exact duplicates -> remove, keep lowest id
  const seen = new Map();
  const toDelete = [];
  for (const r of all) {
    const key = exactKey(r);
    if (seen.has(key)) {
      toDelete.push(r.id); // keep the first (lower id)
    } else {
      seen.set(key, r.id);
    }
  }

  let removedExact = 0;
  if (toDelete.length > 0) {
    console.log(`🔎 ${toDelete.length} duplicados exatos encontrados (texto+categoria+opções).`);
    for (let i = 0; i < toDelete.length; i += 50) {
      const batch = toDelete.slice(i, i + 50);
      const { error } = await supabase.from('questions').delete().in('id', batch);
      if (error) console.error(`❌ Falha ao remover lote: ${error.message}`);
      else removedExact += batch.length;
    }
  } else {
    console.log('✅ Nenhum duplicado exato encontrado.');
  }

  // 2. Near-duplicate report (text + category only) for manual review
  const near = new Map();
  for (const r of all) {
    const key = `${r.text}|${r.category.toUpperCase()}`.toLowerCase();
    if (!near.has(key)) near.set(key, []);
    near.get(key).push(r.id);
  }
  const nearDupes = [...near.values()].filter((ids) => ids.length > 1);
  console.log(`🔎 ${nearDupes.length} grupos de possíveis duplicados (texto+categoria, ignorando opções).`);

  // 3. Fuzzy near-duplicate detection (same category, similar text).
  //    Skips categories that are similar by design (e.g. BANDEIRAS) to avoid
  //    the documented false-positive clusters.
  const byCategory = new Map();
  for (const r of all) {
    const cat = r.category.toUpperCase();
    if (FUZZY_SKIP_CATEGORIES.has(cat)) continue;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push({ id: r.id, norm: normalizeText(r.text) });
  }

  const fuzzyGroups = [];
  let templateFamilyPairs = 0;
  for (const [cat, items] of byCategory) {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (similarity(items[i].norm, items[j].norm) >= FUZZY_SIMILARITY_THRESHOLD) {
          if (isTemplateFamily(items[i].norm, items[j].norm)) {
            templateFamilyPairs++;
            continue; // by-design template family, not a real duplicate
          }
          fuzzyGroups.push({ category: cat, ids: [items[i].id, items[j].id] });
        }
      }
    }
  }
  const fuzzyCount = new Set(fuzzyGroups.flatMap((g) => g.ids)).size;
  console.log(`🔍 ${fuzzyGroups.length} pares com texto muito semelhante (similaridade ≥ ${FUZZY_SIMILARITY_THRESHOLD}) fora de ${[...FUZZY_SKIP_CATEGORIES].join(', ')}.`);
  console.log(`🧩 ${templateFamilyPairs} pares de famílias de template (ignorados como falsos positivos).`);

  console.log(`\n🎉 Duplicados exatos removidos: ${removedExact}`);
  if (nearDupes.length > 0) {
    console.log('ℹ️ Rever duplicados aproximados (falsos positivos prováveis em Bandeiras):');
    nearDupes.slice(0, 10).forEach((ids) => console.log(`   - ids: ${ids.join(', ')}`));
  }
  if (fuzzyGroups.length > 0) {
    console.log('🔍 Pares fuzzy (candidatos a revisão manual):');
    fuzzyGroups.slice(0, 10).forEach((g) => console.log(`   - [${g.category}] ${g.ids.join(' ↔ ')}`));
  }

  // 4. Persist a machine-readable report for trend tracking.
  const reportPath = 'scripts/dedupe-report.json';
  const report = {
    date,
    totalQuestions: all.length,
    exactDuplicatesRemoved: removedExact,
    exactDuplicatesFound: toDelete.length,
    nearDuplicateGroups: nearDupes.length,
    fuzzyPairs: fuzzyGroups.length,
    templateFamilyPairs,
    fuzzyAffectedQuestions: fuzzyCount,
    fuzzySkippedCategories: [...FUZZY_SKIP_CATEGORIES],
    fuzzyThreshold: FUZZY_SIMILARITY_THRESHOLD,
    fuzzySample: fuzzyGroups.slice(0, 25),
  };
  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`💾 Relatório gravado em ${reportPath}`);
  } catch (e) {
    console.warn('⚠️ Relatório não gravado:', e.message);
  }
}

main().catch((e) => {
  console.error('❌ Erro:', e.message);
  process.exit(1);
});
