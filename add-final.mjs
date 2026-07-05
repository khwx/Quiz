import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const newQuestions = [
  // GEOGRAFÍGRAFIA (92→100, need 8)
  { text: "Qual é o rio mais longo da América do Sul?", options: ["Amazonas", "Orinoco", "Paraná", "Magdalena"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Passa pelo Brasil e Peru" } },
  { text: "text: "Em que oceano estão as Ilhas Maldivas?", options: ["Índico", "Pacífico", "Atlântico", "Ártico"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Sudoeste da Índia" } },
  "text: "Qual é o ponto mais baixo da Terra?", options: ["Mar Morto", "Depressão da Bácia", "Vale da Morte", "Caspian"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "-430 metros abaixo do nível do mar" } },
  "text: "Qual é o maior lago da África?", options: ["Victória", "Chade", "Tanganica", "Niassa"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Fronteira de Tanzânia e Uganda" } },
  "text: "Em que país está o Deserto do Atacama?", options: ["Chile", "Peru", "Bolívia", "Argentina"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Mais seco do mundo" } },
  "text: "Qual é o país com mais fronteiras terrestres?", options: ["China", "Rússia", "Brasil", "Alemanha"], correct_option: 0, category: "GEOGRAFIA", age_rating: "hint: "Faz fronteira com 14 países" } },
  "text: "Qual é o menor estado dos EUA?", options: ["Havaí", "Delaware", "Connecticut", "Rhode Island"], correct_option: 3, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Menor que o Distrito Federal" } },
  "text: "Qual é o mar interior mais salgado do mundo?", options: ["Mar Morto", "Mar Cáspio", "Mar Aral", "Grande Lago Salgado"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Entre Israel e Jordânia" } },

  // CULTURA_GERAL (92→100, need 8)
  "text: "Quem escreveu 'Dom Casmurro'?", options: ["Machado de Assis", "José de Alencar", "Graciliano Ramos", "Euclides da Cunha"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Romano realista brasileiro" } ],
    16,
  "text: "Qual é a moeda oficial do Japão?", options: ["Iene", "Won", "Yuan", "Baht"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Símbolo: ¥" } },
  "text: "Quem pintou o teto da Capela Sistina?", options: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Tiziano"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Artista renascentista italiano" } },
  "text: "Em que ano foi a queda do Muro de Berlim?", options: ["1989", "1991", "1987", "1990"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Fim da Guerra Fria" } },
  "text: "Qual é o idioma mais falado no mundo como língua materna?", options: ["Espanhol", "Inglês", "Chinês", "Hindi"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Mais de 900 milhões de nativos" } },
  "text: "Quem descobriu a penicilina?", options: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Edward Jenner"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Bactériologista escocês" } },
  "text: "Qual é o maior oceano do planeta?", options: ["Atlântico", "Índico", "Ártico", "Pacífico"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Cobre mais de 30% da Terra" } },
  "text: "Em que país nasceu Mozart?", options: ["Alemanha", "Áustria", "Itália", "França"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Cidade de Salzburgo" } },

  // TECNOLOGIA (93→100, need 7)
  "text: "O que significa CPU?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Core Processing Unit"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "O 'cérebro' do computador" } },
  "text: "Qual empresa criou o sistema operacional Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Também dona do YouTube" } },
  "text: "O que é HTML?", options: ["HyperText Markup Language", "High Transfer Machine Language", "Home Tool Markup Language", "Hyperlink Text Management Language"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Linguagem de marcação para web" } },
  "text: "Qual foi o primeiro vídeo a atingir 1 bilhão de visualizações no YouTube?", options: ["Gangnam Style", "Baby Shark", "Despacito", "See You Again"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "PSY, 2012" } },
  "text: "O que significa RAM em computadores?", options: ["Random Access Memory", "Read Access Memory", "Run Access Memory", "Random Allocation Memory"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Memória volátil" } },
  "text: "Qual linguagem de programação foi criada pelo Google?", options: ["Java", "Python", "Go", "C#"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Also known as Golang" } },
  "text: "Em que ano foi lançado o primeiro iPhone?", options: ["2005", "2007", "2008", "2010"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Steve Jobs apresent o dispositivo" } },

  // MATEMATICA (97→100, need 3)
  "text: "Quanto é 20% de 150?", options: ["30", "25", "35", "40"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "10% de 150 = 15, então 20% = 30" } },
  "text: "Qual é a raíz quadrada de 144?", options: ["10", "12", "14", "16"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "12 × 12 = 144" } },
  "text: "Se um triângulo tem dois ângulos de 45° e 90°, qual é o terceiro ângulo?", options: ["30°", "45°", "60°", "90°"], correct_option: 1, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Soma dos ângulos internos é 180°" } },

  // MUSICA (96→100, need 4)
  "text: "Quantas notas tem uma escala diatônica?", options: ["5", "6", "7", "8"], correct_option: 2, category: "MUSICA", age_rating: 8, metadata: { hint: "Do Ré Mi Fa Sol Lá Si" } },
  "text: "Qual instrumento é conhecido como 'rei dos instrumentos'?", options: ["Violino", "Piano", "Órgão", "Harpa"], correct_option: 2, category: "MUSICA", age_rating: 12, metadata: { hint: "Tem teclas e pedais" } },
  "text: "Quem compôs a 'Sinfon a N.º 9'?", options: ["Beethoven", "Mozart", "Bach", "Chopin"], correct_option: 0, category: "category: "MUSICA", age_rating: 12, metadata: { hint: "Inclui o 'Hino à Alegria'" } },
  "text: "Qual é a duração mínima de uma nota semicolcheia?", options: ["1/2 tempo", "1/4 tempo", "1/8 tempo", "1/16 tempo"], correct_option: 3, category: "MUSICA", age_rating: 12, metadata: { hint: "Metade da semicolcheia" } },

  // CAPITAIS_DO_MUNDO (94→100, need 6)
  "text: "Qual é a capital da Suíça?", options: ["Zurique", "Genebra", "Berna", "Basileia"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Não é a maior cidade" } },
  "text: "Qual é a capital da Irlanda?", options: ["Dublin", "Cork", "Limerick", "Galway"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Na costa leste" } },
  "text: "Qual é a capital do Catar?", options: ["Doha", "Riade", "Dubai", "Kuwait City"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Sede da Copa do Mundo de 2022" } },
  "text: "Qual é a capital de Oman?", options: ["Mascate", "Dubai", "Riade", "Doha"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "No sudeste da Península Arábiga" } },
  "text: "Qual é a capital da Letônia?", options: ["Riga", "Tallinn", "Vilnius", "Helsinquia"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Na costa do Mar Báltico" } },
  "text: "Qual é a capital de Malta?", options: ["Valletta", "Venice", "Marrakesh", "Tunis"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Ilha no Mediterrâneo" } },
];

async function insertBatch() {
  const { data: existing } = await supabase.from('questions').select('text, category');
  const existingSet = new Set((existing || []).map(q => `${q.text}|${q.category}`));
  const unique = newQuestions.filter(q => !existingSet.has(`${q.text}|${q.category}`));

  console.log(`📝 Total: ${newQuestions.length} | Novas: ${unique.length} | Duplicadas: ${newQuestions.length - unique.length}`);

  const BATCH_SIZE = 20;
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

  // Get final distribution
  const { data: all } = await supabase.from('questions').select('category').range(0, 9999);
  const cats = {};
  for (const q of all || []) cats[q.category] = (cats[q.category] || 0) + 1;

  console.log('\n📊 Distribuição final:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(count.toString().padStart(3) + ' | ' + bar + ' ' + cat);
  });
}

insertBatch().catch(console.error);