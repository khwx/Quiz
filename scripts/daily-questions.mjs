import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORIES = [
  'CIENCIA', 'CULTURA_GERAL', 'ANIMAIS', 'HISTÓRIA', 'GASTRONOMIA',
  'MUSICA', 'TECNOLOGIA', 'DESPORTO', 'ARTE', 'GEOGRAFIA',
  'MATEMATICA', 'CINEMA', 'POLITICA', 'CAPITAIS_DO_MUNDO', 'BANDEIRAS',
];

const AGE_RATINGS = [8, 10, 12, 14, 16];

async function getExistingPairs() {
  const pairs = new Set();
  let offset = 0;
  while (true) {
    const { data } = await supabase.from('questions').select('text, category').range(offset, offset + 999);
    if (!data || data.length === 0) break;
    data.forEach(r => pairs.add(`${r.text}|${r.category}`));
    if (data.length < 1000) break;
    offset += 1000;
  }
  return pairs;
}

async function generateAIQuestion(category, ageRating) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) return null;
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Gera uma pergunta de quiz em PORTUGUES para a categoria "${category}" com idade ${ageRating}. Retorna APENAS JSON: {"text":"...","options":["...","...","...","..."],"correct_option":0,"category":"${category}","age_rating":${ageRating},"hint":"..."}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(text);
  return {
    text: parsed.text,
    options: parsed.options,
    correct_option: parsed.correct_option,
    category: parsed.category || category,
    age_rating: parsed.age_rating,
    metadata: { hint: parsed.hint || '' }
  };
}

function getFallbackQuestion(category) {
  const fallbacks = {
    CIENCIA: { text: "Qual é o elemento mais abundante no universo?", options: ["Oxigénio", "Carbono", "Hélio", "Hidrogénio"], correct_option: 3, metadata: { hint: "Elemento mais leve" } },
    CULTURA_GERAL: { text: "Qual é a maior cidade do mundo por área?", options: ["Nova Iorque", "São Paulo", "Pequim", "Cairo"], correct_option: 2, metadata: { hint: "Capital chinesa" } },
    ANIMAIS: { text: "Quantas patas tem um caranguejo?", options: ["6", "8", "10", "12"], correct_option: 1, metadata: { hint: "Crustáceo" } },
    HISTÓRIA: { text: "Quem descobriu a América?", options: ["Cristóvão Colombo", "Vasco da Gama", "Pedro Álvares Cabral", "Amerigo Vespucci"], correct_option: 0, metadata: { hint: "1492" } },
    GASTRONOMIA: { text: "Qual é o ingrediente principal do pesto?", options: ["Tomate", "Manjericão", "Cebola", "Alho"], correct_option: 1, metadata: { hint: "Erva aromática" } },
    MUSICA: { text: "Qual é o instrumento de cordas mais antigo?", options: ["Violino", "Arpa", "Lira", "Cítara"], correct_option: 2, metadata: { hint: "Instrumento grego" } },
    TECNOLOGIA: { text: "Qual é a sigla de Protocolo de Transferência?", options: ["HTTP", "FTP", "DNS", "SMTP"], correct_option: 0, metadata: { hint: "World Wide Web" } },
    DESPORTO: { text: "Qual é o esporte mais antigo do mundo?", options: ["Futebol", "Boxe", "Atletismo", "Polo"], correct_option: 1, metadata: { hint: "Boxe antigo" } },
    ARTE: { text: "Quem pintou a Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Caravaggio"], correct_option: 1, metadata: { hint: "Renaissance" } },
    GEOGRAFIA: { text: "Qual é o maior país da América do Sul?", options: ["Argentina", "Brasil", "Colômbia", "Peru"], correct_option: 1, metadata: { hint: "Maior país" } },
    MATEMATICA: { text: "Qual é o valor de π?", options: ["3.14", "2.71", "1.41", "1.61"], correct_option: 0, metadata: { hint: "Circunferência/diagrama" } },
    CINEMA: { text: "Quem escreveu e dirigiu 'Pulp Fiction'?", options: ["Martin Scorsese", "Quentin Tarantino", "Steven Spielberg", "James Cameron"], correct_option: 1, metadata: { hint: "Culto" } },
    POLITICA: { text: "Quantos presidentes teve a República Portuguesa?", options: ["10", "15", "20", "25"], correct_option: 1, metadata: { hint: "Desde 1910" } },
    CAPITAIS_DO_MUNDO: { text: "Qual é a capital do Reino Unido?", options: ["Londres", "Edimburgo", "Cardiff", "Belfast"], correct_option: 0, metadata: { hint: "Capital inglesa" } },
    BANDEIRAS: { text: "Qual é a cor do céu?", options: ["Azul", "Verde", "Vermelho", "Branco"], correct_option: 0, metadata: { hint: "Dia ensolarado" } },
  };
  const fb = fallbacks[category] || fallbacks.CULTURA_GERAL;
  return { ...fb, category, age_rating: 10 };
}

async function main() {
  const date = new Date().toISOString().split('T')[0];
  console.log(`📅 Daily Question Generation — ${date}`);
  console.log(`🎯 Goal: 2 questions per category (${CATEGORIES.length * 2} total)`);

  const existingPairs = await getExistingPairs();
  const newQuestions = [];
  let attempts = 0;

  for (const category of CATEGORIES) {
    for (let i = 0; i < 2; i++) {
      attempts++;
      const ageRating = AGE_RATINGS[Math.floor(Math.random() * AGE_RATINGS.length)];
      let q = await generateAIQuestion(category, ageRating);
      if (!q) q = getFallbackQuestion(category);
      if (q && !existingPairs.has(`${q.text}|${q.category}`)) {
        newQuestions.push(q);
        existingPairs.add(`${q.text}|${q.category}`);
        console.log(`✅ ${q.category}: "${q.text.substring(0, 60)}..."`);
      } else {
        console.log(`⏭️ Duplicate skipped for ${category}`);
      }
    }
  }

  console.log(`\n📝 Generated ${newQuestions.length}/${attempts} unique questions`);

  if (newQuestions.length === 0) {
    console.log('✅ No new questions to insert');
    return;
  }

  const BATCH_SIZE = 25;
  let inserted = 0;
  for (let i = 0; i < newQuestions.length; i += BATCH_SIZE) {
    const batch = newQuestions.slice(i, i + BATCH_SIZE).map(q => ({
      text: q.text,
      image_url: null,
      options: q.options,
      correct_option: q.correct_option,
      category: q.category,
      age_rating: q.age_rating,
      metadata: q.metadata,
    }));
    const { error } = await supabase.from('questions').insert(batch);
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} inserted`);
      inserted += batch.length;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n🎉 Total inserted: ${inserted}`);
}

main().catch(console.error);