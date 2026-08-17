import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { readFileSync, writeFileSync } from 'fs';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const QUESTIONS = [
  { text: "O que significa a sigla API na área da tecnologia?", options: ["Advanced Programming Interface", "Application Programming Interface", "Automated Process Integration", "Applied Protocol Interface"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Conjunto de regras que permite a comunicação entre programas" } },
  { text: "O que é phishing?", options: ["Um tipo de malware", "Uma técnica de engenharia social para roubar dados", "Um protocolo de rede", "Uma linguagem de programação"], correct_option: 1, category: "TECNOLOGIA", age_rating: 14, metadata: { hint: "Geralmente feito através de e-mails falsos" } },
  { text: "Qual empresa criou o sistema Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct_option: 2, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Baseado no kernel Linux" } },

  { text: "Qual é a capital da Nova Zelândia?", options: ["Auckland", "Wellington", "Christchurch", "Hamilton"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade mais a sul de uma capital de estado" } },
  { text: "Qual é a capital da Turquia?", options: ["Istambul", "Ancara", "Esmirna", "Bursa"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Escolhida capital em 1923 por Atatürk" } },
  { text: "Qual é a capital da Irlanda do Norte?", options: ["Dublin", "Belfast", "Cork", "Galway"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Capital da província britânica" } },

  { text: "Quantos membros permanentes com direito de veto tem o Conselho de Segurança da ONU?", options: ["3", "5", "7", "10"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "EUA, Rússia, China, França e Reino Unido" } },
  { text: "O que é o NATO?", options: ["Organização económica", "Aliança militar de defesa coletiva", "Tribunal internacional", "Banco central europeu"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Tratado do Atlântico Norte" } },

  { text: "Qual é o prato tradicional português à base de bacalhau desfiado, batata e cebola?", options: ["Bacalhau à Brás", "Bacalhau com natas", "Bacalhau à Gomes de Sá", "Bacalhau assado"], correct_option: 0, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Misturado com ovos mexidos" } },
  { text: "Qual é a bebida alcoólica destilada da cana-de-açúcar muito popular no Brasil?", options: ["Cachaça", "Rum", "Tequila", "Gin"], correct_option: 0, category: "GASTRONOMIA", age_rating: 16, metadata: { hint: "Base da caipirinha" } },

  { text: "Quantos anéis tem o símbolo dos Jogos Olímpicos?", options: ["4", "5", "6", "7"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "Representam os cinco continentes" } },
  { text: "Qual é o desporto em que se usa um puck de borracha?", options: ["Futebol", "Hóquei no gelo", "Rugby", "Críquete"], correct_option: 1, category: "DESPORTO", age_rating: 10, metadata: { hint: "Muito popular no Canadá" } },

  { text: "Qual é o nome do astromech droid companheiro de Luke Skywalker em Star Wars?", options: ["R2-D2", "C-3PO", "BB-8", "K-2SO"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "Robô cilíndrico azul" } },
  { text: "Quem dirigiu o filme Jurassic Park (1993)?", options: ["James Cameron", "Steven Spielberg", "Ridley Scott", "Peter Jackson"], correct_option: 1, category: "CINEMA", age_rating: 10, metadata: { hint: "Também realizou E.T." } },

  { text: "Qual é o país mais populoso do mundo?", options: ["China", "Índia", "Estados Unidos", "Indonésia"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Ultrapassou a China em 2023" } },
  { text: "Em que ano terminou a Segunda Guerra Mundial?", options: ["1943", "1945", "1947", "1950"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Vitória aliada em setembro" } },

  { text: "Quem foi o primeiro presidente dos Estados Unidos?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Comandante durante a guerra de independência" } },
  { text: "Em que ano o Brasil proclamou a sua independência?", options: ["1808", "1822", "1889", "1500"], correct_option: 1, category: "HISTÓRIA", age_rating: 10, metadata: { hint: "Grito do Ipiranga" } },

  { text: "Qual movimento artístico é associado a Salvador Dalí?", options: ["Cubismo", "Surrealismo", "Futurismo", "Dadaísmo"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Explora o inconsciente e os sonhos" } },
  { text: "Quem esculpiu a Pietà de São Pedro, no Vaticano?", options: ["Michelangelo", "Donatello", "Bernini", "Rodin"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Escultor renascentista italiano" } },

  { text: "Qual é o país com mais fusos horários do mundo?", options: ["Rússia", "Estados Unidos", "China", "França"], correct_option: 3, category: "GEOGRAFIA", age_rating: 14, metadata: { hint: "Devido aos seus territórios ultramarinos" } },
  { text: "Qual é o estreito que separa a Europa de África?", options: ["Estreito de Gibraltar", "Bósforo", "Dardanelos", "Messina"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Liga o Atlântico ao Mediterrâneo" } },

  { text: "Qual é o elemento químico com símbolo O?", options: ["Ouro", "Oxigénio", "Osmio", "Ónix"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Gás essencial à respiração" } },
  { text: "Qual é a estrela mais próxima do Sistema Solar?", options: ["Sirius", "Proxima Centauri", "Betelgeuse", "Vega"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Está na constelação de Centauro" } },

  { text: "Quanto é 7 x 8?", options: ["54", "56", "63", "49"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Tabela básica de multiplicar" } },
  { text: "Qual é a raiz quadrada de 144?", options: ["11", "12", "13", "14"], correct_option: 1, category: "MATEMATICA", age_rating: 10, metadata: { hint: "12 x 12 = 144" } },

  { text: "Qual é o animal terrestre mais pesado do mundo?", options: ["Elefante africano", "Hipopótamo", "Rinoceronte", "Gorila"], correct_option: 0, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Pode passar de 6 toneladas" } },
  { text: "Qual ave é conhecida por imitar a voz humana?", options: ["Pardal", "Papagaio", "Pomba", "Canário"], correct_option: 1, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Muito comum como animal de estimação" } },

  { text: "Qual instrumento tem cordas dedilhadas e é símbolo do fado português?", options: ["Viola", "Guitarra portuguesa", "Cravo", "Bandolim"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Tem forma de pirilau" } },
  { text: "Quem compôs a Sinfonia nº 5 (com o tema ta-ta-ta-tá)?", options: ["Mozart", "Beethoven", "Bach", "Chopin"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Compositor alemão surdo" } },

  { text: "Qual é o país cuja bandeira tem um mapa da ilha em branco?", options: ["Chipre", "Grécia", "Malta", "Islândia"], correct_option: 0, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "Única bandeira com um mapa de si mesma" } },
  { text: "Qual é o país cuja bandeira tem uma suástica antiga substituída por um disco solar em 1945?", options: ["Japão", "Tailândia", "Mongólia", "Nepal"], correct_option: 1, category: "BANDEIRAS", age_rating: 16, metadata: { hint: "Bandeira histórica siamesa" } },
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
  all.forEach(q => { cats[q.category] = (cats[q.category] || 0) + 1; });
  const backup = readFileSync('questions_backup.json', 'utf8');
  const arr = JSON.parse(backup);
  arr.push(...unique.map(q => ({ ...q, image_url: null })));
  writeFileSync('questions_backup.json', JSON.stringify(arr, null, 2));
  console.log(`\n🎉 Inseridas: ${inserted}. Total BD: ${all.length}`);
  console.log('📊 Distribuição:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${String(n).padStart(3)} | ${c}`));
}

main().catch(console.error);
