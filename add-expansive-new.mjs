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
    data.forEach(row => pairs.add(`${row.text}|${row.category}`));
    if (data.length < limit) break;
    offset += limit;
  }
  return pairs;
}

const newQuestions = [
  { text: "Qual é o elemento químico cujo símbolo é 'O'?", options: ["Osmio", "Ouro", "Oxigênio", "Ósmio"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Elemento mais abundante na crosta terrestre" } },
  { text: "Quantos ossos tem o corpo humano adulto?", options: ["186", "206", "226", "256"], correct_option: 1, category: "CIENCIA", age_rating: 10, metadata: { hint: "Mais de duzentos" } },
  { text: "Qual é a velocidade da luz aproximadamente?", options: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "100.000 km/s"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "3 × 10^8 m/s" } },
  { text: "Qual é o maior órgão do corpo humano?", options: ["Cérebro", "Fígado", "Pele", "Pulmões"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Maior pelo peso e área" } },
  { text: "Qual planeta é conhecido como o planeta vermelho?", options: ["Vênus", "Marte", "Júpiter", " Saturno"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Quarta posição a partir do Sol" } },
  { text: "Qual é a fórmula da água?", options: ["H2O", "CO2", "NaCl", "O2"], correct_option: 0, category: "CIENCIA", age_rating: 8, metadata: { hint: "Dois elementos químicos" } },
  { text: "Quantos países existem no mundo actualmente?", options: ["190", "195", "210", "220"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Entre 190 e 200" } },
  { text: "Quantos continents existem?", options: ["5", "6", "7", "8"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Europa, Ásia, África, América, Oceania, Antártida" } },
  { text: "Qual é o maior animal do mundo?", options: ["Elefante africano", "Baleia azul", "Girafa", "Polvo gigante"], correct_option: 1, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Animal marinho" } },
  { text: "Qual é o maior predador terrestre?", options: ["Leão", "Urso polar", "Tigre siberiano", "Lobo"], correct_option: 1, category: "ANIMAIS", age_rating: 10, metadata: { hint: "O mais pesado" } },
  { text: "Qual é o animal terrestre mais rápido?", options: ["Leão", "Guepardo", "Antílope", "Cavalo"], correct_option: 1, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Alcança 112 km/h" } },
  { text: "Quantas patas tem uma aranha?", options: ["6", "8", "10", "12"], correct_option: 1, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Arachnida" } },
  { text: "Qual é o maior mamífero marinho?", options: ["Baleia azul", "Orga", "Elefante marinho", "Tubarão branco"], correct_option: 0, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Também o maior animal do mundo" } },
  { text: "Qual é o animal mais venenoso do mundo?", options: ["Cobra cascavel", "Dragão de Komodo", "Sapos venenoso", "Aranha viúva-negra"], correct_option: 2, category: "ANIMAIS", age_rating: 12, metadata: { hint: "De tamanho pequeno" } },
  { text: "Quem foi o primeiro homem a pisar a Lua?", options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Missão Apollo 11, 1969" } },
  { text: "Em que ano começou a Segunda Guerra Mundial?", options: ["1935", "1939", "1941", "1945"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Alemanha invade a Polónia" } },
  { text: "Quem descobriu o Brasil?", options: ["Vasco da Gama", "Pedro Álvares Cabral", "Fernão de Magalhães", "Cristóvão Colombo"], correct_option: 1, category: "HISTÓRIA", age_rating: 8, metadata: { hint: "22 de abril de 1500" } },
  { text: "Qual foi a primeira cidade europeia a atingir 1 milhão de habitantes?", options: ["Roma", "Paris", "Londres", "Istambul"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Durante o Império Romano" } },
  { text: "Qual civilização construiu as pirâmides de Gizé?", options: ["Romanos", "Gregos", "Egípcios", "Sumérios"], correct_option: 2, category: "HISTÓRIA", age_rating: 8, metadata: { hint: "Antigo Egito" } },
  { text: "Qual é a capital da Macedônia do Norte?", options: ["Sófia", "Tirana", "Skopje", "Podgorica"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Antiga capital jugoslava" } },
  { text: "Qual é a capital da Mongólia?", options: ["Ulan Bator", "Pequim", "Pyongyang", "Astana"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Uma das capitais mais frias" } },
  { text: "Qual é a capital do Camboja?", options: ["Banguecoque", "Hanói", "Phnom Penh", "Vientiane"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Confluência do Mekong" } },
  { text: "Qual é a capital do Quénia?", options: ["Nairóbi", "Dar es Salaam", "Mombaça", "Kampala"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Significa 'lugar fresco' em Maasai" } },
  { text: "Qual é a capital do Mali?", options: ["Bamako", "Niamey", "OUAGADOUGOU", "Dakar"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "País do oeste de África" } },
  { text: "Qual é a capital do Nepal?", options: ["Katmandu", "Nova Deli", "Thimphu", "Colombo"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade aos pés do Himalaia" } },
  { text: "Qual é a bandeira do país onde está a Torre Eiffel?", options: ["França", "Bélgica", "Suíça", "Alemanha"], correct_option: 0, category: "BANDEIRAS", age_rating: 8, metadata: { hint: "Tricolor com listras verticais" } },
  { text: "Qual é a bandeira da Itália?", options: ["Vertical verde, branco, vermelho", "Horizontal verde, branco, vermelho", "Vertical azul, branco, vermelho", "Triângulo verde e vermelho"], correct_option: 0, category: "BANDEIRAS", age_rating: 8, metadata: { hint: "Tricolor italiano" } },
  { text: "Qual bandeira tem uma foice e um martelo?", options: ["Rússia", "Cuba", "União Soviética (histórica)", "China"], correct_option: 2, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "Símbolo comunista" } },
  { text: "Qual é a capital da gastronomia mundial segundo muitos?", options: ["Paris", "Tóquio", "Nova Iorque", "Londres"], correct_option: 1, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Mais estrelas Michelin" } },
  { text: "O que é um consommé?", options: ["Um doce francês", "Um caldo clarificado e concentrado", "Um tipo de queijo", "Um vinho fortificado"], correct_option: 1, category: "GASTRONOMIA", age_rating: 14, metadata: { hint: "Sopa clara e pura" } },
  { text: "Qual é o ingrediente principal do guacamole?", options: ["Tomate", "Abacate", "Pimentão", "Cebola"], correct_option: 1, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Fruto mexicano" } },
  { text: "Que peixe é usado para fazer sushi?", options: ["Salmão", "Atum", "Sardinha", "Bacalhau"], correct_option: 1, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Peixe cru" } },
  { text: "Qual é a capital musical da Áustria?", options: ["Berlim", "Viena", "Praga", "Zurique"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Mozart nasceu aqui" } },
  { text: "Quem compôs a ópera 'Aida'?", options: ["Verdi", "Puccini", "Wagner", "Mozart"], correct_option: 0, category: "MUSICA", age_rating: 12, metadata: { hint: "Ópera egípcia" } },
  { text: "Que instrumento de cordas tem um formato semelhante a uma viola?", options: ["Cello", "Violino", "Contrabaixo", "Guitarra"], correct_option: 0, category: "MUSICA", age_rating: 10, metadata: { hint: "Toca-se entre as pernas" } },
  { text: "Qual é o maior festival de música do mundo?", options: ["Coachella", "Glastonbury", "Rock in Rio", "Tomorrowland"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Festival britânico de rock" } },
  { text: "Qual é o idioma mais falado na América do Sul?", options: ["Espanhol", "Português", "Inglês", "Francês"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "Maior país sul-americano" } },
  { text: "Quem criou o primeiro smartphone comercial?", options: ["Apple", "IBM", "Nokia", "Samsung"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "IBM Simon, 1994" } },
  { text: "O que significa 'HTML'?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "Linguagem de marcação" } },
  { text: "O que é um algoritmo?", options: ["Um tipo de computador", "Um conjunto de instruções", "Uma linguagem de programação", "Um hardware"], correct_option: 1, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Sequência lógica de passos" } },
  { text: "Qual é o desporto mais popular do mundo?", options: ["Basquetebol", "Ciclismo", "Futebol", "Atletismo"], correct_option: 2, category: "DESPORTO", age_rating: 8, metadata: { hint: "Jogado em mais de 200 países" } },
  { text: "Quantas equipas participam na Copa do Mundo de Futebol?", options: ["24", "32", "48", "16"], correct_option: 1, category: "DESPORTO", age_rating: 10, metadata: { hint: "Rússia 2018 foi a última com 32" } },
  { text: "Em que ano foi fundado o Sport Lisboa e Benfica?", options: ["1904", "1914", "1894", "1924"], correct_option: 2, category: "DESPORTO", age_rating: 10, metadata: { hint: "Fundado em 1904" } },
  { text: "Que artista pintou o teto da Capela Sistina?", options: ["Leonardo da Vinci", "Rafael", "Donatello", "Michelangelo"], correct_option: 3, category: "ARTE", age_rating: 12, metadata: { hint: "Pintor e escultor italiano" } },
  { text: "Qual é o museu mais visitado do mundo?", options: ["Museu do Louvre", "Museu Metropolitano", "Museu Britânico", "Museu de Arte Moderna"], correct_option: 0, category: "ARTE", age_rating: 10, metadata: { hint: "Mona Lisa está aqui" } },
  { text: "Que movimento artístico surgiu em França na década de 1960?", options: ["Impressionismo", "Cubismo", "Pop Art", "Surrealismo"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Andy Warhol foi seu representante" } },
  { text: "Qual é a pintura mais famosa de Leonardo da Vinci?", options: ["A Última Ceia", "Vitória de Samotrácia", "Mona Lisa", "A Criação de Adão"], correct_option: 2, category: "ARTE", age_rating: 8, metadata: { hint: "Rosto misterioso" } },
  { text: "Quantos ossos tem a mão humana?", options: ["27", "22", "32", "18"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Inclui carpais, metacarpais e falanges" } },
  { text: "Se um triângulo tem dois lados iguais e um ângulo de 90 graus, como se chama?", options: ["Isósceles retângulo", "Equilátero", "Escaleno", "Obtusângulo"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Isósceles + retângulo" } },
  { text: "Qual é o valor de π (pi) arredondado a duas casas decimais?", options: ["3.12", "3.14", "3.16", "3.18"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Relação entre circunferência e diâmetro" } },
  { text: "Qual filme ganhou o Óscar de Melhor Filme em 2024?", options: ["Oppenheimer", "Anatomia de uma Queda", "Everything Everywhere All at Once", "The Whale"], correct_option: 1, category: "CINEMA", age_rating: 14, metadata: { hint: "Filme francês de Justine Triet" } },
  { text: "Quem dirigiu 'Cidade de Deus'?", options: ["Fernando Meirelles", "José Padilha", "Braulio Mantovani", "Walter Salles"], correct_option: 1, category: "CINEMA", age_rating: 12, metadata: { hint: "Baseado no livro de Paulo Lins" } },
  { text: "Qual é a saga mais bilheteira de todos os tempos?", options: ["Harry Potter", "Star Wars", "Marvel Cinematic Universe", "O Senhor dos Anéis"], correct_option: 2, category: "CINEMA", age_rating: 8, metadata: { hint: "Super-heróis da Marvel" } },
  { text: "Qual país tem mais capitais diferentes?", options: ["Nenhum, cada país tem uma capital", "Bolívia", "Chile", "Brasil"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "La Paz e Sucre" } },
  { text: "Quem escreveu '1984'?", options: ["George Bernard Shaw", "George Orwell", "Aldous Huxley", "Ray Bradbury"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Novela distópica sobre vigilância" } },
  { text: "Qual é a cidade mais populosa da América do Sul?", options: ["Buenos Aires", "São Paulo", "Rio de Janeiro", "Lima"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Maior cidade do hemisfério sul" } },
  { text: "Quantos estados tem a Alemanha?", options: ["14", "16", "18", "12"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Bundesländer" } },
  { text: "O que é um referendo?", options: ["Eleição de deputados", "Votação popular sobre uma questão", "Nomeação governamental", "Dissolução do parlamento"], correct_option: 1, category: "POLITICA", age_rating: 12, metadata: { hint: "Democracia directa" } },
  { text: "Quantos países africanos existem?", options: ["44", "54", "64", "34"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "União Africana reconhece 54" } },
  { text: "Qual é o primeiro livro da Bíblia?", options: ["Êxodo", "Génesis", "Levítico", "Mateus"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Livro dos princípios" } },
  { text: "Quantos miligramas há numa grama?", options: ["10", "100", "1000", "10000"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Factor 1000" } },
  { text: "O que significa o símbolo '∞'?", options: ["Infinito", "Integração", "Raiz quadrada", "Aproximadamente"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Lemniscata" } },
  { text: "Qual é a unidade de medida da intensidade sonora?", options: ["Hertz", "Decibel", "Lux", "Joule"], correct_option: 1, category: "CIENCIA", age_rating: 10, metadata: { hint: "Mede o volume do som" } },
  { text: "Qual é o metal líquido à temperatura ambiente?", options: ["Ouro", "Prata", "Mercúrio", "Estanho"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Usado em termómetros antigos" } },
  { text: "O que é fotossíntese?", options: ["Respiração celular", "Processo de fabricar glucose com luz", "Divisão celular", "Combustão"], correct_option: 1, category: "CIENCIA", age_rating: 10, metadata: { hint: "Plantas convertem luz em energia" } },
  { text: "Qual é o estado da matéria sem forma nem volume definido?", options: ["Sólido", "Líquido", "Gasoso", "Plasma"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Expande-se para preencher o espaço" } },
  { text: "Qual metal é líquido à temperatura ambiente?", options: ["Galium", "Mercúrio", "Francium", "Carbono"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Simbolizado por Hg" } },
  { text: "O que é um eclipse?", options: ["Quando a Lua desaparece", "Oclusão de um corpo celeste por outro", "Uma fase da Lua", "Um cometa"], correct_option: 1, category: "CIENCIA", age_rating: 10, metadata: { hint: "Sol, Lua ou Terra alinhados" } },
  { text: "Quem pintou 'A Criação de Adão'?", options: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Ticiano"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Teto da Capela Sistina" } },
  { text: "Qual é a capital do Camboja?", options: ["Banguecoque", "Hanói", "Phnom Penh", "Vientiane"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Na confluência do Mekong e Tonle Sap" } },
  { text: "Qual é a capital do Líbano?", options: ["Damasco", "Beirute", "Amã", "Bagdá"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Cidade mediterrânica" } },
  { text: "Qual é o segundo idioma mais falado no mundo?", options: ["Espanhol", "Inglês", "Mandarim", "Hindi"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Língua franca global" } },
  { text: "O que é um referendumo?", options: ["Uma eleição", "Uma votação popular directamente", "Um decreto presidencial", "Uma lei aprovada pelo parlamento"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Democracia directa" } },
  { text: "Qual é o país mais pequeno de África?", options: ["Seychelles", "Gâmbia", "Burundi", "Lesoto"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Arquipélago no Oceano Índico" } },
  { text: "Qual é o rio mais longo do mundo?", options: ["Nilo", "Amazonia", "Yangtze", "Mississippi"], correct_option: 1, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "6.400 km de extensão" } },
  { text: "Qual é o deserto mais quente do mundo?", options: ["Saara", "Gobi", "Atacama", "Kalahari"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: " Norte de África" } },
  { text: "Que estilo musical combina jazz com ritmos africanos?", options: ["Blues", "Bossa Nova", "Samba", "Salsa"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Brasil, anos 1950" } },
  { text: "Quem pintou 'O Nascimento de Vénus'?", options: ["Michelangelo", "Botticelli", "Da Vinci", "Raphael"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Quadro renascentista italiano" } },
  { text: "Quem pintou 'A Escola de Atenas'?", options: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Ticiano"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Rafael Sanzio" } },
  { text: "Qual é a unidade de medida de pressão atmosférica chamada?", options: ["Joule", "Pascal", "Watt", "Ampere"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Unidade SI de pressão" } },
  { text: "Que processo transforma água em água potável?", options: ["Destilação", "Filtração", "Osmose reversa", "Todos os anteriores"], correct_option: 3, category: "CIENCIA", age_rating: 10, metadata: { hint: "Múltiplos métodos" } },
  { text: "Qual destes filmes ganhou 11 Óscares?", options: ["Titanic", "O Senhor dos Anéis", "Ben-Hur", "Avengers"], correct_option: 2, category: "CINEMA", age_rating: 12, metadata: { hint: "1959, épico bíblico" } },
  { text: "Quem jogou 'O Rei Leão' na versão original?", options: ["Matthew Broderick", "James Earl Jones", "Jeremy Irons", "Nathan Lane"], correct_option: 1, category: "CINEMA", age_rating: 8, metadata: { hint: "Voz de Mufasa" } },
  { text: "Quantos Oscar ganhou Titanic?", options: ["11", "9", "13", "7"], correct_option: 1, category: "CINEMA", age_rating: 10, metadata: { hint: "Filme de James Cameron" } },
  { text: "Que instrumento é tocado a bater com baquetas?", options: ["Violão", "Piano", "Bateria", "Violino"], correct_option: 2, category: "MUSICA", age_rating: 8, metadata: { hint: "Instrumento de percussão" } },
  { text: "Qual é a capital da Guiné Equatorial?", options: ["Malabo", "Bata", "Libreville", "Douala"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 14, metadata: { hint: "País na costa ocidental de África" } },
  { text: "Qual é a capital do Butão?", options: ["Kathmandu", "Thimphu", "Doijam", "Gangtok"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Situada num vale na cordilheira do Himalaias" } }
];

async function main() {
  console.log('🔍 Checking for existing duplicates...');
  const existingPairs = await getExistingTextCategoryPairs();
  console.log('✅ Loaded existing pairs');

  const unique = newQuestions.filter(q => !existingPairs.has(`${q.text}|${q.category}`));
  const duplicates = newQuestions.length - unique.length;

  console.log(`📊 Total in script: ${newQuestions.length}`);
  console.log(`📊 Unique (new): ${unique.length}`);
  console.log(`📊 Duplicates skipped: ${duplicates}`);

  if (unique.length === 0) {
    console.log('✅ No new questions to insert');
    return;
  }

  const BATCH_SIZE = 25;
  let totalInserted = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE).map(q => ({
      text: q.text,
      image_url: q.image_url || null,
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
      totalInserted += batch.length;
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 Total inserted: ${totalInserted}/${unique.length}`);

  // Show final distribution
  console.log('\n📈 Final distribution...');
  const { data: allQs } = await supabase.from('questions').select('category');
  const cats = {};
  if (allQs) {
    allQs.forEach(q => {
      cats[q.category] = (cats[q.category] || 0) + 1;
    });
  }
  console.log('\n📊 Distribution:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${count.toString().padStart(3)} | ${cat}`);
  });
}

main().catch(console.error);