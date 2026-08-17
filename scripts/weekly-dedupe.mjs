import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { config as loadDotenv } from 'dotenv';

loadDotenv();

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Exat duplicate key (text + category + options), case-insensitive.
function exactKey(r) {
  return `${r.text}|${r.category.toUpperCase()}|${JSON.stringify(r.options)}`.toLowerCase();
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

  console.log(`\n🎉 Duplicados exatos removidos: ${removedExact}`);
  if (nearDupes.length > 0) {
    console.log('ℹ️ Rever duplicados aproximados (falsos positivos prováveis em Bandeiras):');
    nearDupes.slice(0, 10).forEach((ids) => console.log(`   - ids: ${ids.join(', ')}`));
  }
}

main().catch((e) => {
  console.error('❌ Erro:', e.message);
  process.exit(1);
});
