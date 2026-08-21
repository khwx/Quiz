import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { config as loadDotenv } from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

loadDotenv();

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORIES = [
  'CIENCIA', 'CULTURA_GERAL', 'ANIMAIS', 'HISTÓRIA', 'GASTRONOMIA',
  'MUSICA', 'TECNOLOGIA', 'DESPORTO', 'ARTE', 'GEOGRAFIA',
  'MATEMATICA', 'CINEMA', 'POLITICA', 'CAPITAIS_DO_MUNDO', 'BANDEIRAS',
];

const AGE_RATINGS = [8, 10, 12, 14, 16];

const CATEGORY_HINTS = {
  CIENCIA: 'ciência, biologia, física, química ou astronomia',
  CULTURA_GERAL: 'geografia, recordes ou factos gerais do mundo',
  ANIMAIS: 'animais, espécies e comportamento animal',
  'HISTÓRIA': 'história universal, descobrimentos ou acontecimentos históricos',
  GASTRONOMIA: 'comida, pratos típicos, bebidas ou ingredientes',
  MUSICA: 'instrumentos, géneros musicais ou compositores',
  TECNOLOGIA: 'informática, internet ou dispositivos tecnológicos',
  DESPORTO: 'desportos, regras ou atletas',
  ARTE: 'pintura, escultura, arquitetura ou dança',
  GEOGRAFIA: 'países, rios, montanhas ou fenómenos naturais',
  MATEMATICA: 'cálculo, geometria ou lógica matemática',
  CINEMA: 'filmes, realizadores ou atores',
  POLITICA: 'política, governos ou organizações internacionais',
  CAPITAIS_DO_MUNDO: 'capitais de países',
  BANDEIRAS: 'bandeiras de países e respetivos símbolos',
};

async function getExistingPairs() {
  const pairs = new Set();
  let offset = 0;
  while (true) {
    const { data } = await supabase.from('questions').select('text, category').range(offset, offset + 999);
    if (!data || data.length === 0) break;
    data.forEach(r => pairs.add(`${r.text}|${r.category.toUpperCase()}`));
    if (data.length < 1000) break;
    offset += 1000;
  }
  return pairs;
}

function buildPrompt(category, ageRating) {
  const tema = CATEGORY_HINTS[category] || category;
  return `Gera UMA pergunta de quiz em PORTUGUÊS (de Portugal) sobre ${tema}.
Regras:
- Não uses perguntas óbvias de senso comum.
- A resposta correta deve estar entre as opções.
- Público-alvo: idade ${ageRating} anos.
Responde APENAS com JSON válido, sem comentários:
{"text":"pergunta?","options":["A","B","C","D"],"correct_option":0,"category":"${category}","age_rating":${ageRating},"hint":"dica curta"}`;
}

async function generateGemini(category, ageRating) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
    const res = await model.generateContent(buildPrompt(category, ageRating));
    const text = res.response.text().replace(/```json|```/g, '').trim();
    const p = JSON.parse(text);
    if (!p.text || !Array.isArray(p.options) || p.options.length < 2) return null;
    return { text: p.text, options: p.options, correct_option: p.correct_option, category: p.category || category, age_rating: p.age_rating || ageRating, metadata: { hint: p.hint || '' } };
  } catch (e) {
    console.warn(`⚠️ Gemini falhou (${category}): ${e.message}`);
    return null;
  }
}

async function generateGroq(category, ageRating) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  try {
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: buildPrompt(category, ageRating) }],
      response_format: { type: 'json_object' },
      temperature: 0.9,
    });
    const text = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const p = JSON.parse(text);
    if (!p.text || !Array.isArray(p.options) || p.options.length < 2) return null;
    return { text: p.text, options: p.options, correct_option: p.correct_option, category: p.category || category, age_rating: p.age_rating || ageRating, metadata: { hint: p.hint || '' } };
  } catch (e) {
    console.warn(`⚠️ Groq falhou (${category}): ${e.message}`);
    return null;
  }
}

function getFallbackQuestion(category) {
  const fallbacks = {
    CIENCIA: { text: "Qual é o elemento mais abundante no universo?", options: ["Oxigénio", "Carbono", "Hélio", "Hidrogénio"], correct_option: 3, metadata: { hint: "Elemento mais leve" } },
    CULTURA_GERAL: { text: "Qual é a maior cidade do mundo por área?", options: ["Nova Iorque", "São Paulo", "Pequim", "Cairo"], correct_option: 2, metadata: { hint: "Capital chinesa" } },
    ANIMAIS: { text: "Quantas patas tem um caranguejo?", options: ["6", "8", "10", "12"], correct_option: 1, metadata: { hint: "Crustáceo" } },
    'HISTÓRIA': { text: "Quem descobriu a América em 1492?", options: ["Cristóvão Colombo", "Vasco da Gama", "Pedro Álvares Cabral", "Amerigo Vespucci"], correct_option: 0, metadata: { hint: "Navegador genovês" } },
    GASTRONOMIA: { text: "Qual é o ingrediente principal do pesto?", options: ["Tomate", "Manjericão", "Cebola", "Alho"], correct_option: 1, metadata: { hint: "Erva aromática" } },
    MUSICA: { text: "Qual é o instrumento de cordas mais antigo de que se tem registo?", options: ["Violino", "Arpa", "Lira", "Cítara"], correct_option: 2, metadata: { hint: "Instrumento grego" } },
    TECNOLOGIA: { text: "Qual é a sigla do protocolo de transferência de hipertexto?", options: ["HTTP", "FTP", "DNS", "SMTP"], correct_option: 0, metadata: { hint: "World Wide Web" } },
    DESPORTO: { text: "Quantos jogadores tem uma equipa de futebol em campo?", options: ["9", "10", "11", "12"], correct_option: 2, metadata: { hint: "Incluindo o guarda-redes" } },
    ARTE: { text: "Quem pintou a Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Caravaggio"], correct_option: 1, metadata: { hint: "Renascimento" } },
    GEOGRAFIA: { text: "Qual é o maior país da América do Sul?", options: ["Argentina", "Brasil", "Colômbia", "Peru"], correct_option: 1, metadata: { hint: "Maior país" } },
    MATEMATICA: { text: "Qual é o valor de π aproximado a duas casas?", options: ["3,10", "3,12", "3,14", "3,16"], correct_option: 2, metadata: { hint: "Circunferência/diâmetro" } },
    CINEMA: { text: "Quem escreveu e realizou 'Pulp Fiction'?", options: ["Martin Scorsese", "Quentin Tarantino", "Steven Spielberg", "James Cameron"], correct_option: 1, metadata: { hint: "Culto" } },
    POLITICA: { text: "Quantos presidentes teve a República Portuguesa?", options: ["10", "15", "20", "25"], correct_option: 1, metadata: { hint: "Desde 1910" } },
    CAPITAIS_DO_MUNDO: { text: "Qual é a capital do Reino Unido?", options: ["Londres", "Edimburgo", "Cardiff", "Belfast"], correct_option: 0, metadata: { hint: "Capital inglesa" } },
    BANDEIRAS: { text: "Qual é o país cuja bandeira tem uma folha de bordo vermelha no centro?", options: ["Estados Unidos", "Canadá", "Austrália", "Nova Zelândia"], correct_option: 1, metadata: { hint: "Símbolo nacional do Canadá" } },
  };
  const fb = fallbacks[category] || fallbacks.CULTURA_GERAL;
  return { ...fb, category, age_rating: 10 };
}

// --- Built-in deterministic generator (no AI keys, no curated pool) -----------
// Guarantees the bank keeps growing even after the curated pool + seed bank are
// fully consumed. MATEMATICA produces essentially infinite unique questions via
// random operands; a small fact table tops up CAPITAIS_DO_MUNDO / GEOGRAFIA.
const COUNTRY_FACTS = [
  { c: 'Portugal', cap: 'Lisboa' }, { c: 'Espanha', cap: 'Madrid' },
  { c: 'França', cap: 'Paris' }, { c: 'Itália', cap: 'Roma' },
  { c: 'Alemanha', cap: 'Berlim' }, { c: 'Reino Unido', cap: 'Londres' },
  { c: 'Irlanda', cap: 'Dublin' }, { c: 'Grécia', cap: 'Atenas' },
  { c: 'Turquia', cap: 'Ancara' }, { c: 'Egito', cap: 'Cairo' },
  { c: 'Marrocos', cap: 'Rabat' }, { c: 'África do Sul', cap: 'Pretória' },
  { c: 'Nigéria', cap: 'Abuja' }, { c: 'Quénia', cap: 'Nairobi' },
  { c: 'Brasil', cap: 'Brasília' }, { c: 'Argentina', cap: 'Buenos Aires' },
  { c: 'Chile', cap: 'Santiago' }, { c: 'Peru', cap: 'Lima' },
  { c: 'México', cap: 'Cidade do México' }, { c: 'Canadá', cap: 'Ottawa' },
  { c: 'Estados Unidos', cap: 'Washington' }, { c: 'Japão', cap: 'Tóquio' },
  { c: 'China', cap: 'Pequim' }, { c: 'Índia', cap: 'Nova Deli' },
  { c: 'Coreia do Sul', cap: 'Seul' }, { c: 'Tailândia', cap: 'Banguecoque' },
  { c: 'Indonésia', cap: 'Jacarta' }, { c: 'Austrália', cap: 'Canberra' },
  { c: 'Rússia', cap: 'Moscovo' }, { c: 'Ucrânia', cap: 'Quieve' },
  { c: 'Polónia', cap: 'Varsóvia' }, { c: 'Suécia', cap: 'Estocolmo' },
  { c: 'Noruega', cap: 'Oslo' }, { c: 'Suíça', cap: 'Berna' },
  { c: 'Países Baixos', cap: 'Amesterdão' }, { c: 'Bélgica', cap: 'Bruxelas' },
  { c: 'Áustria', cap: 'Viena' }, { c: 'República Checa', cap: 'Praga' },
  { c: 'Hungria', cap: 'Budapeste' }, { c: 'Roménia', cap: 'Bucareste' },
];

function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function makeOptions(answer) {
  const correct = String(answer);
  const set = new Set([correct]);
  const deltas = shuffle([1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 10, -10, 7, -7]);
  for (const d of deltas) {
    if (set.size >= 4) break;
    const v = answer + d;
    if (v < 0) continue;
    set.add(String(v));
  }
  let k = 6;
  while (set.size < 4) { const v = answer + k; if (String(v) !== correct) set.add(String(v)); k++; }
  return shuffle([...set]);
}
function mathQuestion(ageRating) {
  const types = ['add', 'sub', 'mul', 'div', 'sqrt', 'pow', 'pct'];
  const t = types[rndInt(0, types.length - 1)];
  let text, ans, hint;
  switch (t) {
    case 'add': { const a = rndInt(2, 99), b = rndInt(2, 99); text = `Quanto é ${a} + ${b}?`; ans = a + b; hint = 'Soma simples.'; break; }
    case 'sub': { const a = rndInt(10, 99), b = rndInt(2, a); text = `Quanto é ${a} - ${b}?`; ans = a - b; hint = 'Diferença.'; break; }
    case 'mul': { const a = rndInt(2, 12), b = rndInt(2, 12); text = `Quanto é ${a} × ${b}?`; ans = a * b; hint = 'Tabuada.'; break; }
    case 'div': { const b = rndInt(2, 12), q = rndInt(2, 12); const a = b * q; text = `Quanto é ${a} ÷ ${b}?`; ans = q; hint = 'Divisão exata.'; break; }
    case 'sqrt': { const n = rndInt(2, 15); const sq = n * n; text = `Qual é a raiz quadrada de ${sq}?`; ans = n; hint = 'Quadrado perfeito.'; break; }
    case 'pow': { const base = rndInt(2, 9), exp = rndInt(2, 4); text = `Quanto é ${base} elevado a ${exp}?`; ans = Math.pow(base, exp); hint = 'Potência.'; break; }
    case 'pct': { const p = [10, 20, 25, 50][rndInt(0, 3)]; const tot = [40, 60, 80, 100, 200][rndInt(0, 4)]; text = `Quanto é ${p}% de ${tot}?`; ans = tot * p / 100; hint = 'Percentagem.'; break; }
  }
  const options = makeOptions(ans);
  const correct_option = options.indexOf(String(ans));
  return {
    text, options, correct_option, category: 'MATEMATICA',
    age_rating: ageRating || 10,
    metadata: { hint, explanation: `${text.replace('?', '')} = ${ans}.` },
  };
}
function builtinGenerate(category, ageRating) {
  if (category === 'MATEMATICA') return mathQuestion(ageRating);
  if (category === 'CAPITAIS_DO_MUNDO' || category === 'GEOGRAFIA') {
    const fact = COUNTRY_FACTS[rndInt(0, COUNTRY_FACTS.length - 1)];
    const distractors = shuffle(COUNTRY_FACTS.filter(f => f.cap !== fact.cap).map(f => f.cap)).slice(0, 3);
    const options = shuffle([fact.cap, ...distractors]);
    return {
      text: `Qual é a capital de ${fact.c}?`,
      options, correct_option: options.indexOf(fact.cap),
      category, age_rating: ageRating || 10,
      metadata: { hint: `País: ${fact.c}.`, explanation: `${fact.c} tem como capital ${fact.cap}.` },
    };
  }
  return null;
}

function refillPoolFromSeed(currentPool, existingPairs, target, poolPath) {
  const seedPath = path.join(process.cwd(), 'scripts', 'curated-seed.json');
  let seed = [];
  try {
    seed = JSON.parse(readFileSync(seedPath, 'utf8'));
  } catch {
    console.warn('⚠️ Sem scripts/curated-seed.json — não é possível auto-repor o pool.');
    return currentPool;
  }
  if (seed.length === 0) return currentPool;

  const currentKeys = new Set(
    currentPool.map((q) => `${q.text}|${String(q.category || '').toUpperCase()}`)
  );
  const available = seed.filter((q) => {
    const key = `${q.text}|${String(q.category || '').toUpperCase()}`;
    return !currentKeys.has(key) && !existingPairs.has(key);
  });

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const needed = target - currentPool.length;
  const topUp = shuffled.slice(0, Math.max(0, needed));
  const merged = [...currentPool, ...topUp];
  try {
    writeFileSync(poolPath, JSON.stringify(merged, null, 2));
    console.log(`🔁 Pool auto-reposto a partir do seed bank: +${topUp.length} (total ${merged.length})`);
  } catch (e) {
    console.warn('⚠️ Não consegui repor o pool curado:', e.message);
  }
  return merged;
}

async function main() {
  const date = new Date().toISOString().split('T')[0];
  const PER_CATEGORY = Number(process.env.QUESTIONS_PER_CATEGORY || 2);
  console.log(`📅 Daily Question Generation — ${date}`);
  console.log(`🎯 Objetivo: ${PER_CATEGORY} pergunta(s) por categoria (${CATEGORIES.length * PER_CATEGORY} total)`);

  const hasGemini = Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  console.log(`🤖 Provedores de IA: Gemini=${hasGemini ? 'on' : 'off'} · Groq=${hasGroq ? 'on' : 'off'}`);

  const existingPairs = await getExistingPairs();
  const newQuestions = [];

  if (!hasGemini && !hasGroq) {
    // No AI keys: draw fresh, non-duplicate questions from a curated pool so the
    // bank keeps growing daily without manual intervention. The pool shrinks as used.
    const poolPath = path.join(process.cwd(), 'scripts', 'curated-pool.json');
    let pool = [];
    try {
      pool = JSON.parse(readFileSync(poolPath, 'utf8'));
    } catch {
      console.warn('⚠️ Sem scripts/curated-pool.json — não é possível gerar pelo pool curado.');
    }
    // Auto-refill: if the pool is running low and a seed bank exists, top it up
    // so the 8-hour loop keeps producing questions without manual intervention.
    const target = CATEGORIES.length * PER_CATEGORY;
    if (pool.length < target) {
      pool = refillPoolFromSeed(pool, existingPairs, target, poolPath);
    }
    if (pool.length === 0) {
      // Last-resort built-in generator so the bank never fully freezes even
      // when the curated pool AND seed bank are exhausted (no AI keys).
      console.warn('⚠️ Pool curado e seed bank vazios — a usar gerador incorporado (built-in).');
      for (const category of CATEGORIES) {
        if (newQuestions.length >= CATEGORIES.length) break;
        const ageRating = AGE_RATINGS[Math.floor(Math.random() * AGE_RATINGS.length)];
        const q = builtinGenerate(category, ageRating);
        if (!q) continue;
        const key = `${q.text}|${q.category.toUpperCase()}`;
        if (existingPairs.has(key)) continue;
        newQuestions.push(q);
        existingPairs.add(key);
        console.log(`🔧 built-in ${q.category}: "${q.text.substring(0, 60)}..."`);
      }
      if (newQuestions.length === 0) {
        console.warn('⚠️ AVISO: Nenhuma API key de IA, pool curado, seed bank e built-in esgotados.');
      }
    } else {
      console.log(`🔄 Modo pool curado: ${pool.length} perguntas disponíveis em scripts/curated-pool.json`);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const target = CATEGORIES.length * PER_CATEGORY;
      const usedKeys = [];
      for (const q of shuffled) {
        if (newQuestions.length >= target) break;
        const category = q.category || 'CULTURA_GERAL';
        const key = `${q.text}|${String(category).toUpperCase()}`;
        usedKeys.push(key);
        if (existingPairs.has(key)) continue;
        newQuestions.push({
          text: q.text,
          options: q.options,
          correct_option: q.correct_option,
          category,
          age_rating: q.age_rating || 10,
          metadata: q.metadata || {},
        });
        existingPairs.add(key);
        console.log(`✅ ${category}: "${q.text.substring(0, 60)}..."`);
      }
      const remaining = pool.filter((q) => !usedKeys.includes(`${q.text}|${String(q.category || '').toUpperCase()}`));
      try {
        writeFileSync(poolPath, JSON.stringify(remaining, null, 2));
        console.log(`🗂️ Pool curado: ${pool.length} → ${remaining.length} (usadas ${usedKeys.length}, novas ${newQuestions.length})`);
      } catch (e) {
        console.warn('⚠️ Não atualizei o pool curado:', e.message);
      }
    }
  } else {
    let attempts = 0;
    for (const category of CATEGORIES) {
      for (let i = 0; i < PER_CATEGORY; i++) {
        attempts++;
        const ageRating = AGE_RATINGS[Math.floor(Math.random() * AGE_RATINGS.length)];
        let q = await generateGemini(category, ageRating) || await generateGroq(category, ageRating);
        if (!q) q = getFallbackQuestion(category);
        if (q && !existingPairs.has(`${q.text}|${q.category.toUpperCase()}`)) {
          newQuestions.push(q);
          existingPairs.add(`${q.text}|${q.category.toUpperCase()}`);
          console.log(`✅ ${q.category}: "${q.text.substring(0, 60)}..."`);
        } else {
          console.log(`⏭️ Duplicado ignorado para ${category}`);
        }
      }
    }
    console.log(`\n📝 Geradas ${newQuestions.length}/${attempts} perguntas únicas`);
  }

  console.log(`\n📝 Geradas ${newQuestions.length} perguntas únicas`);

  if (newQuestions.length === 0) {
    console.log('✅ Nenhuma pergunta nova para inserir');
    return;
  }

  let inserted = 0;
  for (let i = 0; i < newQuestions.length; i += 25) {
    const batch = newQuestions.slice(i, i + 25).map(q => ({
      text: q.text, image_url: null, options: q.options,
      correct_option: q.correct_option, category: q.category,
      age_rating: q.age_rating, metadata: q.metadata,
    }));
    const { error } = await supabase.from('questions').insert(batch);
    if (error) console.error(`❌ Lote ${Math.floor(i / 25) + 1} falhou:`, error.message);
    else { inserted += batch.length; console.log(`✅ Lote ${Math.floor(i / 25) + 1}: ${batch.length} inseridas`); }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\n🎉 Total inserido: ${inserted}`);

  // Keep questions_backup.json in sync with the database.
  try {
    const backup = JSON.parse(readFileSync('questions_backup.json', 'utf8'));
    const before = backup.length;
    backup.push(...newQuestions.map(q => ({ ...q, image_url: null })));
    writeFileSync('questions_backup.json', JSON.stringify(backup, null, 2));
    console.log(`💾 Backup: ${before} → ${backup.length}`);
  } catch (e) {
    console.warn('⚠️ Backup não atualizado:', e.message);
  }
}

main().catch(console.error);
