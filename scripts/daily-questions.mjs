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

async function main() {
  const date = new Date().toISOString().split('T')[0];
  const PER_CATEGORY = Number(process.env.QUESTIONS_PER_CATEGORY || 2);
  console.log(`📅 Daily Question Generation — ${date}`);
  console.log(`🎯 Objetivo: ${PER_CATEGORY} pergunta(s) por categoria (${CATEGORIES.length * PER_CATEGORY} total)`);

  const existingPairs = await getExistingPairs();
  const newQuestions = [];
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
}

main().catch(console.error);
