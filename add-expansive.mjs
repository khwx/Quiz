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
  console.log("🚀 Iniciando expansão contínua...");

  const allQuestions = [
    // ==================== EXTRAS PARA HISTÓRIA ====================
    { text: "Qual foi a primeira civilização a desenvolver um sistema de escrita?", options: ["Egito", "Suméria", "China", "Índia"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Desenvolveu cuneiforme" } },
    { text: "Em que ano Colombo chegou à América?", options: ["1492", "1500", "1498", "1510"], correct_option: 0, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Era um navegador genovês" } },
    { text: "Qual foi o império que construiu a maioria das Grandes Muralhas da China?", options: ["Han", "Ming", "Qin", "Tang"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Construiu entre 1368-1644" } },
    { text: "Qual antigo império tinha a capital em Roma?", options: ["Egípcio", "Grego", "Macedônio", "Persa"], correct_option: 3, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Anti-romana desde o início" } },
    { text: "Qual único evento matou mais de 50 milhões de pessoas?", options: ["Gripe Espanhola", "Guerra Fria", "Segunda Guerra Mundial", "Primeira Guerra Mundial"], correct_option: 0, category: "HISTÓRIA", age_rating: 16, metadata: { hint: "Pandemia de 1918-1919" } },
    { text: "Qual país primeiro instituiu uma representação feminina no governo?", options: ["França", "Reino Unido", "Nova Zelândia", "Estados Unidos"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Permitiu voto em 1893" } },
    { text: "Qual foi o primeiro imperador romano?", options: ["Júlio César", "Augusto", "Tibério", "Calígula"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Sobrinho adotado de Júlio César" } },
    { text: "Qual civilização antiga construiu Pompeia?", options: ["Egípcia", "Grega", "Romana", "Persa"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Em 79 d.C., enterrada por erupção de Vesúvio" } },
    { text: "Qual foi o criador do cristianismo?", options: ["Paulo", "Pedro", "Jesus", "Marcos"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Pregador judeu da Galileia" } },
    { text: "Qual tratado criou o Estado de Israel moderno?", options: ["Treaty of London", "Treaty of Versailles", "Declaração Balfour", "Mandato da Liga das Nações para a Palestina"], correct_option: 1, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "1917, declaração britânica" } },
    { text: "Qual era a capital do Império Inca?", options: ["Lima", "Bogotá", "Cusco", "La Paz"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Cidade sagrada incá" } },
    { text: "Qual império durou mais de mil anos?", options: ["Bizantino", "Árabe", "Mongol", "Otomano"], correct_option: 0, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Tornou-se Império Otomano em 1453" } },
    { text: "Qual foi a causa principal da queda do Muro de Berlim em 1989?", options: ["Guerra fria", "Reconceção", "Movimento Solidarność", "Ambos B e C"], correct_option: 3, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "Pressão tanto interna quanto externa" } },
    { text: "Qual guerreira egípcia queen tornou-se governante regente?", options: ["Cleópatra", "Nefertiti", "Hatshepsut", "Tiy"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Um dos poucos faraós mulheres" } },

    // ==================== EXTRAS PARA ARTE ====================
    { text: "Quem dirigiu 'Romeu e Julieta' em 1968?", options: ["Kenneth Branagh", "Fritz Lang", "François Truffaut", "George Cukor"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Adaptação da peça de Shakespeare" } },
    { text: "Qual ator ganhou três Oscars consecutivos no início dos anos 2000?", options: ["Tom Hanks", "Tom Cruise", "Brad Pitt", "George Clooney"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Por 'Jornalista Investigativo', 'O Franco Atirador' e 'Minions'" } },
    { text: "Qual é o filme com maior bilheteria da história?", options: ["Avatar", "Titanic", "Star Wars", "O Rei Leão"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Estreou em 2009" } },
    { text: "Quem fundou o grupo de arte Dadá em Zurique?", options: ["Marcel Duchamp", "Hannah Höch", "Tristan Tzara", "Man Ray"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Poeta romeno, fundador principal" } },
    { text: "Em que ano o Impressionismo surgiu pela primeira vez?", options: ["1874", "1880", "1890", "1900"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Exposição de 1874 com 'Impression, Sunrise'" } },
    { text: "Qual foi o primeiro filme vencedor do Oscar de Melhor Filme?", options: ["O Nascimento de Uma Nação", "Intolerância", "O Poderoso Chefão", "Casablanca"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Lançado em 1916" } },

    // ==================== EXTRAS PARA CIENCIA ====================
    { text: "Qual é a partícula subatômica que compõe os átomos?", options: ["Elétrons", "Prótons", "Neutrons", "Nêutrons"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Peso negativo" } },
    { text: "Qual descoberta viciou o carbono nos raios X?", options: ["Hans Christian Ørsted", "Marie Curie", "Wilhelm Röntgen", "Albert Einstein"], correct_option: 2, category: "CIENCIA", age_rating: 12, metadata: { hint: "Em 1895" } },
    { text: "Qual é a velocidade da luz?", options: ["299,792 km/s", "300,000 km/s", "299,792 km/s", "299,792 km/s"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "31.300.000 km por segundo" } },
    { text: "Qual processo é o oposto da fotossíntese?", options: ["Respiração", "Geração", "Transpiraçãão", "Fotosíntese"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Os seres vivos fazem isso" } },
    { text: "Qual elemento tem o número atômico 1?", options: ["Hélio", "Hidrogênio", "Oxigênio", "Carbono"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "O primeiro elemento da tabela periódica" } },

    // ==================== EXTRAS PARA TECNOLOGIA ====================
    { text: "Quem é creditado como o inventor do computador moderno?", options: ["Charles Babbage", "Alan Turing", "John von Neumann", "Grace Hopper"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Da década de 1830" } },
    { text: "Qual linguagem de programação recebeu esse nome em homenagem a uma peça musical?", options: ["Perl", "Ruby", "Lisp", "C++"], correct_option: 1, metadata: { hint: "Criada pelo Dan Moonee's Bowie" } },

    // ==================== EXTRAS PARA MUSICA ====================
    { text: "Qual gênero musical surgiu no início do século XX?", options: ["Blues", "Jazz", "Folk", "Pop"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Originário de New Orleans" } },
    { text: "Qual tecladista do The Who quebrou suas próprias cordas do piano?", options: ["Pete Townshend", "Roger Daltrey", "John Entwistle", "Zak Starkweather"], correct_option: 0, category: "MUSICA", age_rating: 12, metadata: { hint: "Conhecido por seu estilo de tocar" } },

    // ==================== EXTRAS PARA DESPORTO ====================
    { text: "Qual dos esportes abaixo é tradicionalmente jogado no gramado?", options: ["Críquete", "Rugby", "Basebol", "Hóquei no gelo"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Típico do Commonwealth" } },
    { text: "Quem ganhou o primeiro Campeonato Mundial de Fórmula 1 em 1950?", options: ["Juan Manuel Fangio", "Nino Farina", "Luigi Villoresi", "Louis Chiron"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Itália sagrou-se campeã" } },
  ];

  console.log(`📊 Preparando ${allQuestions.length} novas perguntas para inserção...`);

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