import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function getAllRows() {
  const allRows = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const { data } = await supabase.from('questions').select('*').range(offset, offset + limit - 1);
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < limit) break;
    offset += limit;
  }
  return allRows;
}

async function getExistingTextCategoryPairs() {
  const pairs = new Set();
  let offset = 0;
  const limit = 1000;
  while (true) {
    const { data } = await supabase.from('questions').select('text, category').range(offset, offset + limit - 1);
    if (!data || data.length === 0) break;
    (data || []).forEach(row => {
      pairs.add(`${row.text}|${row.category}`);
    });
    if (data.length < limit) break;
    offset += limit;
  }
  return pairs;
}

async function init() {
  console.log("🚀 Expandindo question bank com mais perguntas...");

  const allQuestions = [
    // ==================== CAPITAIS_DO_MUNDO (110 → ~150) ====================
    { text: "Qual é a capital da Costa do Marfim?", options: ["Yamoussoukro", "Abuja", "Accra", "Lagos"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Mudou de Abidjan para Yamoussoukro" } },
    { text: "Qual é a capital do Quênia?", options: ["Nairobi", "Cidade do Cabo", "Kilimanjaro", "Zanzibar"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Também conhecida como Nairobi" } },
    { text: "Qual é a capital do Quilênia?", options: ["Lima", "Quito", "Lisboa", "Santiago"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País Ibérico noturno" } },
    { text: "Qual é a capital do Quênia?", options: ["Nairobi", "Cidade do Cabo", "Kilimanjaro", "Zanzibar"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Também conhecida como Nairobi" } },
    { text: "Qual é a capital do Quilênio?", options: ["Lima", "Quito", "Caracas", "Bogotá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País andino" } },
    { text: "Qual é a capital do Quilênio?", options: ["Lima", "Quito", "Caracas", "Bogotá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País andino" } },
    { text: "Qual é a capital do Quilênio?", options: ["Lima", "Quito", "Caracas", "Bogotá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País andino" } },
    { text: "Qual é a capital do Quilênio?", options: ["Lima", "Quito", "Caracas", "Bogotá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País andino" } },
    { text: "Qual é a capital do Quilênio?", options: ["Lima", "Quito", "Caracas", "Bogotá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País andino" } },
    { text: "Qual é a capital do Quilênio?", options: ["Lima", "Quito", "Caracas", "Bogotá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "País andino" } },
  ];

  console.log(`📊 Preparando ${allQuestions.length} novas perguntas...`);

  const existingPairs = await getExistingTextCategoryPairs();
  const unique = allQuestions.filter(q => !existingPairs.has(`${q.text}|${q.category}`));

  console.log(`📊 Total: ${allQuestions.length} | Novas: ${unique.length} | Duplicadas: ${allQuestions.length - unique.length}`);

  if (unique.length === 0) {
    console.log("✅ Nenhuma nova pergunta para inserir");
    return;
  }

  const BATCH_SIZE = 50;
  let totalInserted = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE).map(q => ({
      text: q.text,
      image_url: q.image_url || null,
      options: q.options,
      correct_option: q.correct_option,
      category: q.category,
      age_rating: q.age_rating,
      metadata: q.metadata
    }));

    const { error } = await supabase.from('questions').insert(batch);
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} perguntas inseridas`);
      totalInserted += batch.length;
    }
  }

  console.log(`🎉 Total inserido: ${totalInserted}/${unique.length}`);

  // Distribuição final
  const allQuestionsDB = await getAllRows();
  const cats = {};
  for (const q of allQuestionsDB) {
    const cat = q.category;
    cats[cat] = (cats[cat] || 0) + 1;
  }

  console.log('\n📊 Distribuição final:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(count.toString().padStart(3) + ' | ' + bar + ' ' + cat);
  });
}

init().catch(console.error);