import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function getExistingPairs() {
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
  { text: "Qual é o símbolo químico do ouro?", options: ["Go", "Au", "Ag", "Gd"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Do latim Aurum" } },
  { text: "Qual é o planeta mais próximo do Sol?", options: ["Vénus", "Mercúrio", "Marte", "Terra"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "O menor planeta" } },
  { text: "Quantos metros tem um quilómetro?", options: ["100", "500", "1000", "10000"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Kilo = mil" } },
  { text: "Em que ano começou a Primeira Guerra Mundial?", options: ["1912", "1914", "1916", "1918"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Assassinato de Sarajevo" } },
  { text: "Quem pintou 'A Última Ceia'?", options: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Caravaggio"], correct_option: 1, category: "ARTE", age_rating: 8, metadata: { hint: "Quadro mural milanês" } },
  { text: "Qual é a capital da Tailândia?", options: ["Banguecoque", "Pequim", "Jacarta", "Hanoi"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Cidade dos Anjos" } },
  { text: "Qual bandeira tem uma estrela solitária?", options: ["Chile", "Cuba", "Brasil", "Turquia"], correct_option: 0, category: "BANDEIRAS", age_rating: 10, metadata: { hint: "País sul-americano" } },
  { text: "Qual molho é feito com tomate, carne picada e massa?", options: ["Bolognese", "Pesto", "Carbonara", "Matriciana"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Molho italiano" } },
  { text: "Quem pintou 'A Rendeira'?", options: ["Vermeer", "Rembrandt", "Van Gogh", "Picasso"], correct_option: 0, category: "ARTE", age_rating: 10, metadata: { hint: "Pintor holandês" } },
  { text: "Qual é o maior oceano do mundo?", options: ["Atlântico", "Índico", "Pacífico", "Ártico"], correct_option: 2, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Cobre um terço da superfície" } },
  { text: "Qual é a língua mais falada no mundo?", options: ["Inglês", "Espanhol", "Mandarim", "Hindi"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Língua chinesa" } },
  { text: "Que fruta é usada para fazer ketchup original?", options: ["Tomate", "Morango", "Framboesa", "Cereja"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Fruto vermelho" } },
  { text: "Qual é a capital da Mongólia?", options: ["Ulan Bator", "Pequim", "Astana", "Tóquio"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Cidade mais fria do mundo" } },
  { text: "Qual é o compositor de 'Quatro Estações'?", options: ["Mozart", "Bach", "Vivaldi", "Beethoven"], correct_option: 2, category: "MUSICA", age_rating: 10, metadata: { hint: "Violinista italiano" } },
  { text: "Quantos ossos tem um adulto?", options: ["186", "206", "226", "256"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Esqueleto humano" } },
  { text: "O que significa DNA?", options: ["Ácido Desoxirribonucleico", "Ácido Didático Natural", "Dióxido de Nitrogénio", "Ácido Ribonucleico"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Código genético" } },
  { text: "Qual é a fórmula da área do triângulo?", options: ["b × h", "b × h ÷ 2", "b + h", "2 × b × h"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Metade da base vezes altura" } },
  { text: "Em que ano foi fundada a NATO?", options: ["1945", "1949", "1952", "1955"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Aliança do Atlântico Norte" } },
  { text: "Que instrumento tem teclas pretas e brancas?", options: ["Guitarra", "Piano", "Violino", "Trompete"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Teclado musical" } },
  { text: "Qual é o fruto mais consumido no mundo?", options: ["Maçã", "Banana", "Laranja", "Tomate"], correct_option: 1, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Fruto tropical" } },
  { text: "Qual é o maior país da Europa por área?", options: ["Alemanha", "França", "Ucrânia", "Espanha"], correct_option: 2, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "País europeu maior que França" } },
  { text: "Quem escreveu 'Dom Quixote'?", options: ["Cervantes", "Shakespeare", "Tolstói", "Dostoiévski"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Autor espanhol" } },
  { text: "Qual é o rio mais longo da Europa?", options: ["Danúbio", "Volga", "Reno", "Tejo"], correct_option: 1, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Russo, 3531 km" } },
  { text: "Quantos jogadores de cada equipa no futebol?", options: ["9", "10", "11", "12"], correct_option: 2, category: "DESPORTO", age_rating: 8, metadata: { hint: "Inclui guarda-redes" } },
  { text: "Qual é o metal mais duro naturalmente?", options: ["Ouro", "Prata", "Ferro", "Diamante"], correct_option: 3, category: "CIENCIA", age_rating: 8, metadata: { hint: "Forma cristalina de carbono" } },
  { text: "Que artista pintou 'A Persistência da Memória'?", options: ["Picasso", "Dalí", "Magritte", "Kandinsky"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Relógios derretidos" } },
  { text: "Qual é a capital da Indonésia?", options: ["Jacarta", "Bali", "Surabaya", "Bandung"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Ilha de Java" } },
  { text: "Qual é a cor do céu durante o dia?", options: ["Azul", "Verde", "Rosa", "Branco"], correct_option: 0, category: "CIENCIA", age_rating: 8, metadata: { hint: "Dispersão de Rayleigh" } },
  { text: "Se um carro anda a 60 km/h durante 2 horas, quantos km percorre?", options: ["60", "120", "180", "240"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Velocidade × tempo" } },
  { text: "Qual é a ilha mais pequena do mundo?", options: ["Ilha Justa", "Ilha de Páscoa", "Ilha de Man", "Ilha de Wight"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "No rio Niágara" } },
  { text: "Qual é o maior lago de água doce do mundo?", options: ["Lago Superior", "Mar Cáspio", "Lago Victoria", "Lago Baikal"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "América do Norte" } },
  { text: "Qual é a capital do Butão?", options: ["Kathmandu", "Thimphu", "Doijam", "Colombo"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Cidade no vale Himalaia" } },
  { text: "Quantos continentes tem a Terra?", options: ["5", "6", "7", "8"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Europa, Ásia, África, América, Oceania, Antártida" } },
  { text: "O que é fotossíntese?", options: ["Respiração", "Processo das plantas fazerem comida", "Divisão celular", "Digestão"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Usa luz solar" } },
  { text: "Qual é a capital da Nova Zelândia?", options: ["Auckland", "Wellington", "Canterbury", "Queenstown"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Ilha do Norte" } },
  { text: "Que tipo de triângulo tem todos os lados iguais?", options: ["Isósceles", "Escaleno", "Equilátero", "Retângulo"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Três lados iguais" } },
  { text: "Quantas cores tem o arco-íris?", options: ["5", "6", "7", "8"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "VAMBERDOYI" } },
  { text: "Qual é a capital do Sri Lanka?", options: ["Colombo", "Kandy", "Galle", "Jaffna"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Antiga capital" } },
  { text: "Quem dirigiu 'Titanic'?", options: ["James Cameron", "Steven Spielberg", "Peter Jackson", "Ridley Scott"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "1997, Leonardo DiCaprio" } },
  { text: "Qual o instrumento mais tocado nos conservatórios?", options: ["Guitarra", "Piano", "Violino", "Flauta"], correct_option: 2, category: "MUSICA", age_rating: 8, metadata: { hint: "Instrumento de cordas" } },
  { text: "Qual é o maior deserto da Ásia?", options: ["Gobi", "Saara", "Arabíco", "Taklamakan"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Na China e Mongólia" } },
  { text: "Qual é o símbolo da paz?", options: ["Cruz", "Estrela", "Pomba com ramo de oliveira", "Coroa"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Uso antigo" } },
  { text: "Que fruta é conhecida como a rainha das frutas?", options: ["Manga", "Papoia", "Banana", "Abacaxi"], correct_option: 1, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Origem tropical" } },
  { text: "Qual é o número de jogadores de um equipa de voleibol em campo?", options: ["5", "6", "7", "8"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "6 + 1 guarda-redes" } },
  { text: "Qual país tem o maior número de ilhas?", options: ["Japão", "Filipinas", "Indonésia", "Suécia"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Mais de 17000 ilhas" } },
  { text: "Em que cidade foi fundada a UEFA?", options: ["Paris", "Zurique", "Londres", "Roma"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Paraíso" } },
  { text: "Qual é o instrumento nacional da Escócia?", options: ["Harpa", "Gaita de foles", "Violino", "Acordeão"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Instrumento de sopro" } },
  { text: "Qual é o fruto seco mais caro do mundo?", options: ["Avelã", "Castanha", "Amêndoa", "Noz-pecã"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Usado em pasteis" } },
  { text: "Quanto tempo a Terra demora a dar uma volta ao Sol?", options: ["365 dias", "365 e 1/4 dias", "366 dias", "360 dias"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Ano bissexto a cada 4 anos" } },
  { text: "Qual é a capital da Venezuela?", options: ["Caracas", "Bogotá", "Lima", "Quito"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Cidade ao pé do Avila" } },
  { text: "Qual é a forma de governo de Portugal?", options: ["Monarquia", "República presidencial", "República parlamentar", "Ditadura"], correct_option: 2, category: "POLITICA", age_rating: 12, metadata: { hint: "Primeiro-ministro governa" } },
  { text: "Qual é o maior animal marinho que existiu?", options: ["Baleia azul", "Megatherium", "Mosasaurus", "Ichthyosaurio"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Animal aquático" } },
  { text: "Que fruta é um fruto falso?", options: ["Morango", "Maçã", "Banana", "Pera"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Falso fruto" } },
  { text: "Qual é a capital da Guiné Equatorial?", options: ["Malabo", "Bata", "Libreville", "Nairobi"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 14, metadata: { hint: "País africano de língua espanhola" } },
  { text: "Quantas pontas tem a estrela da bandeira do Chile?", options: ["Uma", "Duas", "Três", "Quatro"], correct_option: 0, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "Uma estrela solitária" } },
  { text: "Que cidade é conhecida como a Cidade das Luzes?", options: ["Londres", "Nova Iorque", "Paris", "Xangai"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Cidade francesa" } },
  { text: "Qual é a capital do Qatar?", options: ["Doha", "Dubai", "Riade", "Manama"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "País da península Arábica" } },
  { text: "Que estilo musical surgiu nos subúrbios de Chicago nos anos 1980?", options: ["House music", "Blues", "Jazz", "Country"], correct_option: 0, category: "MUSICA", age_rating: 12, metadata: { hint: "Dança eletrónica" } },
  { text: "Qual é a unidade de medida de resistência eléctrica?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct_option: 2, category: "CIENCIA", age_rating: 12, metadata: { hint: "Símbolo: Ω" } },
  { text: "O que é um eclipse lunar?", options: ["A Lua cobre o Sol", "A Terra cobre a Lua", "A Lua entra na sombra da Terra", "O Sol desaparece"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Sombras da Terra" } },
  { text: "Quem pintou 'A Persistência da Memória'?", options: ["Picasso", "Dalí", "Magritte", "Duchamp"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Relógios derretidos" } },
  { text: "O que é um algoritmo?", options: ["Um programa", "Conjunto de instruções", "Um hardware", "Uma linguagem"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "Sequência lógica de passos" } },
  { text: "Qual é a capital da Bolívia?", options: ["La Paz", "Sucre", "Ambas", "Cochabamba"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 14, metadata: { hint: "Duas capitais oficiais" } },
  { text: "Qual é o maior país da América do Sul?", options: ["Argentina", "Brasil", "Colômbia", "Peru"], correct_option: 1, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Maior país da América do Sul" } },
  { text: "Que tipo de nuvem indica tempo bom?", options: ["Cumulonimbus", "Cirrus", "Stratus", "Cumulus"], correct_option: 3, category: "CIENCIA", age_rating: 8, metadata: { hint: "Nuvem branca e fofa" } },
  { text: "Quantas medalhas de ouro ganhou Nadal em Roland Garros?", options: ["10", "12", "14", "16"], correct_option: 2, category: "DESPORTO", age_rating: 12, metadata: { hint: "Rei da terra batida" } },
  { text: "Qual é o filme mais bilheteiro de todos os tempos?", options: ["Avatar", "Titanic", "Vingadores", "Star Wars"], correct_option: 1, category: "CINEMA", age_rating: 8, metadata: { hint: "Leonardo DiCaprio no navio" } },
  { text: "Que compositor escreveu a Nona Sinfonia?", options: ["Mozart", "Brahms", "Beethoven", "Tchaikovsky"], correct_option: 2, category: "MUSICA", age_rating: 10, metadata: { hint: "Ode à Alegria" } },
  { text: "Qual país sediou a Copa do Mundo de 2014?", options: ["Argentina", "Brasil", "Alemanha", "Itália"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "País sul-americano" } },
  { text: "Qual é o elemento mais abundante no universo?", options: ["Oxigênio", "Carbono", "Hélio", "Hidrogénio"], correct_option: 3, category: "CIENCIA", age_rating: 10, metadata: { hint: "Elemento mais leve" } },
  { text: "O que é um referendo?", options: ["Eleição legislativa", "Votação popular em questões específicas", "Nomeação de ministro", "Dissolução do parlamento"], correct_option: 1, category: "POLITICA", age_rating: 12, metadata: { hint: "Democracia directa" } },
  { text: "Qual o primeiro satélite artificial da Terra?", options: ["Sputnik", "Explorer", "Apollo", "Vostok"], correct_option: 0, category: "CIENCIA", age_rating: 10, metadata: { hint: "Lançado pela URSS, 1957" } },
  { text: "Que cidade é sede da NASCAR?", options: ["Nova Iorque", "Daytona Beach", "Los Angeles", "Chicago"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Corridas de automóveis" } },
  { text: "Qual é a maior reserva natural de Portugal?", options: ["Parque Nacional da Peneda-Gerês", "Reserva Natural da Serra da Estrela", "Reserva Natural do Estuário do Sado", "Parque Natural da Madeira"], correct_option: 0, category: "GEGRAFIA", age_rating: 12, metadata: { hint: "Norte de Portugal" } },
]

async function main() {
  console.log('🔍 Checking for duplicates...');
  const existingPairs = await getExistingPairs();

  const unique = newQuestions.filter(q => !existingPairs.has(`${q.text}|${q.category}`));
  const dupes = newQuestions.length - unique.length;
  console.log(`📊 Total: ${newQuestions.length} | New: ${unique.length} | Duplicates: ${dupes}`);

  if (unique.length === 0) {
    console.log('✅ No new questions to insert');
    return;
  }

  const BATCH_SIZE = 25;
  let inserted = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE).map(q => ({
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
      console.error(`❌ Batch failed:`, error.message);
    } else {
      console.log(`✅ Batch ${Math.floor(i/BATCH_SIZE)+1}: ${batch.length} inserted`);
      inserted += batch.length;
    }
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n🎉 Done! ${inserted} new questions inserted`);

  const { data: all } = await supabase.from('questions').select('category');
  const cats = {};
  for (const q of all || []) {
    cats[q.category] = (cats[q.category] || 0) + 1;
  }
  console.log('\n📊 Final Distribution:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
    console.log(`  ${n.toString().padStart(3)} | ${c}`);
  });
}

main().catch(console.error);