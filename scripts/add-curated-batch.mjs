import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { readFileSync, writeFileSync } from 'fs';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const QUESTIONS = [
  // CIENCIA
  { text: "Qual é o planeta do Sistema Solar conhecido como 'planeta vermelho'?", options: ["Vénus", "Marte", "Júpiter", "Mercúrio"], correct_option: 1, category: "CIENCIA", age_rating: 10, metadata: { hint: "Lar do rover Curiosity" } },
  { text: "Qual é a velocidade aproximada da luz no vácuo?", options: ["300 km/s", "300 000 km/s", "3 000 km/s", "30 000 km/s"], correct_option: 1, category: "CIENCIA", age_rating: 14, metadata: { hint: "Cerca de 3×10⁸ m/s" } },

  // CULTURA_GERAL
  { text: "Qual é a moeda oficial do Japão?", options: ["Yuan", "Won", "Iene", "Ringgit"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Símbolo ¥" } },
  { text: "Quantos continentes existem no mundo?", options: ["5", "6", "7", "8"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "África, América, Ásia, Europa, Oceânia, Antártida" } },

  // ANIMAIS
  { text: "Qual é o único mamífero capaz de voar verdadeiramente?", options: ["Morcego", "Esquilo voador", "Pássaro", "Cambaleira"], correct_option: 0, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Usa ecolocalização" } },
  { text: "Quantos corações tem um polvo?", options: ["1", "2", "3", "5"], correct_option: 2, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Sistema circulatório distribuído" } },

  // HISTÓRIA
  { text: "Em que ano caiu o Muro de Berlim?", options: ["1987", "1989", "1991", "1993"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Fim da Guerra Fria" } },
  { text: "Quem foi o primeiro homem a pisar a Lua?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"], correct_option: 2, category: "HISTÓRIA", age_rating: 10, metadata: { hint: "Missão Apollo 11, 1969" } },

  // GASTRONOMIA
  { text: "De que país é originário o sushi?", options: ["China", "Coreia", "Japão", "Tailândia"], correct_option: 2, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Arroz e peixe cru" } },
  { text: "Qual é o principal ingrediente do guacamole?", options: ["Tomate", "Abacate", "Cebola", "Pimento"], correct_option: 1, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Fruto verde cremoso" } },

  // MUSICA
  { text: "Qual banda britânica ficou famosa com a canção 'Hey Jude'?", options: ["Rolling Stones", "The Beatles", "Queen", "The Who"], correct_option: 1, category: "MUSICA", age_rating: 10, metadata: { hint: "Lennon e McCartney" } },
  { text: "Quantas cordas tem uma guitarra clássica padrão?", options: ["4", "5", "6", "7"], correct_option: 2, category: "MUSICA", age_rating: 10, metadata: { hint: "E A D G B e" } },

  // TECNOLOGIA
  { text: "O que significa a sigla 'URL'?", options: ["Uniform Resource Locator", "Universal Reference Link", "Unified Routing Layer", "User Redirect Login"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Endereço de uma página web" } },
  { text: "Qual linguagem de marcação é usada para estruturar páginas web?", options: ["Python", "HTML", "C++", "SQL"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "HyperText Markup Language" } },

  // DESPORTO
  { text: "Quantos anéis tem o símbolo dos Jogos Olímpicos?", options: ["4", "5", "6", "7"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "Representam os cinco continentes" } },
  { text: "Em que desporto se joga com uma bola laranja e cestos?", options: ["Futebol", "Basquetebol", "Voleibol", "Ténis"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "NBA" } },

  // ARTE
  { text: "Qual movimento artístico é associado a Salvador Dalí?", options: ["Cubismo", "Surrealismo", "Futurismo", "Dadaísmo"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Explora o inconsciente" } },
  { text: "Quem pintou o teto da Capela Sistina?", options: ["Rafael", "Michelangelo", "Leonardo da Vinci", "Caravaggio"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Renascimento italiano" } },

  // GEOGRAFIA
  { text: "Qual é o maior oceano do mundo?", options: ["Atlântico", "Índico", "Pacífico", "Ártico"], correct_option: 2, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Cobre quase metade da Terra" } },
  { text: "Qual é o deserto mais extenso do mundo?", options: ["Saara", "Gobi", "Kalahari", "Antártico"], correct_option: 3, category: "GEOGRAFIA", age_rating: 14, metadata: { hint: "Maior deserto frio, na Antártida" } },

  // MATEMATICA
  { text: "Quanto é 9 x 7?", options: ["56", "63", "64", "72"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Tabela básica" } },
  { text: "Qual é o resultado de 2 elevado a 5 (2⁵)?", options: ["10", "16", "32", "64"], correct_option: 2, category: "MATEMATICA", age_rating: 12, metadata: { hint: "2×2×2×2×2" } },

  // CINEMA
  { text: "Quem dirigiu o filme 'Titanic' (1997)?", options: ["James Cameron", "Steven Spielberg", "Christopher Nolan", "Ridley Scott"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Também fez Avatar" } },
  { text: "Qual personagem é interpretado por Daniel Radcliffe na saga Harry Potter?", options: ["Ron Weasley", "Harry Potter", "Draco Malfoy", "Neville Longbottom"], correct_option: 1, category: "CINEMA", age_rating: 8, metadata: { hint: "O 'menino que sobreviveu'" } },

  // POLITICA
  { text: "Quantos estados membros tem a União Europeia (desde 2020)?", options: ["26", "27", "28", "30"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Após a saída do Reino Unido" } },
  { text: "O que é a ONU?", options: ["Organização Não Governamental", "Organização das Nações Unidas", "Ordem Nacional Unida", "Organização de Negócios Unidos"], correct_option: 1, category: "POLITICA", age_rating: 12, metadata: { hint: "Fundada em 1945" } },

  // CAPITAIS_DO_MUNDO
  { text: "Qual é a capital do Egito?", options: ["Alexandria", "Gizé", "Cairo", "Luxor"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Junto ao Nilo" } },
  { text: "Qual é a capital da Austrália?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Não é a maior cidade" } },

  // BANDEIRAS
  { text: "Qual é o país cuja bandeira tem uma folha de bordo vermelha no centro?", options: ["Estados Unidos", "Canadá", "Austrália", "Nova Zelândia"], correct_option: 1, category: "BANDEIRAS", age_rating: 10, metadata: { hint: "Símbolo nacional do Canadá" } },
  { text: "Qual é o país cuja bandeira tem uma estrela solitária branca num triângulo azul?", options: ["Cuba", "Chile", "Líbia", "São Vicente"], correct_option: 0, category: "BANDEIRAS", age_rating: 14, metadata: { hint: "País caribenho" } },
];

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

async function main() {
  const existing = await getExistingPairs();
  const unique = QUESTIONS.filter(q => !existing.has(`${q.text}|${q.category.toUpperCase()}`));
  console.log(`📊 Batch: ${QUESTIONS.length} | Novas: ${unique.length} | Duplicadas: ${QUESTIONS.length - unique.length}`);
  if (unique.length === 0) { console.log('✅ Nenhuma pergunta nova'); return; }

  let inserted = 0;
  for (let i = 0; i < unique.length; i += 15) {
    const batch = unique.slice(i, i + 15).map(q => ({
      text: q.text, image_url: null, options: q.options,
      correct_option: q.correct_option, category: q.category,
      age_rating: q.age_rating, metadata: q.metadata,
    }));
    const { error } = await supabase.from('questions').insert(batch);
    if (error) console.error('❌ Falha:', error.message);
    else { inserted += batch.length; console.log(`✅ ${batch.length} inseridas`); }
  }

  const { data: all } = await supabase.from('questions').select('*');
  const cats = {};
  (all || []).forEach(q => { cats[q.category] = (cats[q.category] || 0) + 1; });
  try {
    const backup = JSON.parse(readFileSync('questions_backup.json', 'utf8'));
    backup.push(...unique.map(q => ({ ...q, image_url: null })));
    writeFileSync('questions_backup.json', JSON.stringify(backup, null, 2));
  } catch (e) {
    console.warn('⚠️ Backup não atualizado:', e.message);
  }
  console.log(`\n🎉 Inseridas: ${inserted}. Total BD: ${all?.length || 0}`);
  console.log('📊 Distribuição:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${String(n).padStart(3)} | ${c}`));
}

main().catch(console.error);
