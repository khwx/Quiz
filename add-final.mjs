import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const questions = [
  // CULTURA_GERAL - Level 8 (need +0 to reach 30, currently 30)
  { text: "Quantos dias tem o ano bissexto?", options: ["364", "365", "366", "367"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8 },
  { text: "Qual e o mes mais curto?", options: ["Fevereiro", "Janeiro", "Marco", "Abril"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8 },
  { text: "O que e o Carnaval?", options: ["Uma festa", "Um jogo", "Um filme", "Um deporte"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8 },
  { text: "Qual e o mes do Natal?", options: ["Dezembro", "Novembro", "Janeiro", "Outubro"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8 },
  { text: "O que se celebra em Portugal no dia 10 de Junho?", options: ["O Dia de Portugal", "Natal", "Ano Novo", "Pascoa"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8 },
  
  // CULTURA_GERAL - Level 12
  { text: "Quantos meses tem um trimestre?", options: ["2", "3", "4", "6"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "O que e o Dia de Portugal?", options: ["Dia Nacional", "Natal", "Pascoa", "Ano Novo"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Qual e o rio mais longo de Portugal?", options: ["Tejo", "Douro", "Mondego", "Sado"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Em que oceano fica Portugal?", options: ["Atlantico", "Indico", "Pacifico", "Artico"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Quantas-ilhas tem Portugal?", options: ["2", "3", "4", "1"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12 },
  
  // ARTE - more for levels
  { text: "O que e um painter?", options: ["Pintor", "Escultor", "Arquiteto", "Poeta"], correct_option: 0, category: "ARTE", age_rating: 8 },
  { text: "Qual e a cor do ceu?", options: ["Azul", "Verde", "Vermelho", "Amarelo"], correct_option: 0, category: "ARTE", age_rating: 8 },
  { text: "O que e uma-pintura?", options: ["Arte", "Musica", "Danca", "Teatro"], correct_option: 0, category: "ARTE", age_rating: 8 },
  { text: "Qual e a principal artist?", options: ["Pintor", "Ator", "Cantautor", "Escritor"], correct_option: 0, category: "ARTE", age_rating: 12 },
  { text: "O que e o barroco?", options: ["Estilo artistico", "Musica", "Danca", "Teatro"], correct_option: 0, category: "ARTE", age_rating: 12 },
  
  // DESPORTO - more
  { text: "Quantos minutos tem um jogo de futebol?", options: ["45", "60", "90", "100"], correct_option: 2, category: "DESPORTO", age_rating: 8 },
  { text: "Quantos jogadores tem uma equipa de futebol?", options: ["9", "10", "11", "12"], correct_option: 2, category: "DESPORTO", age_rating: 8 },
  { text: "Em que pais se realizou o Euro 2004?", options: ["Portugal", "Espanha", "Grecia", "Italia"], correct_option: 0, category: "DESPORTO", age_rating: 12 },
  { text: " Qual e o maior estadio de Portugal?", options: ["Da Luz", "Jose Alvalade", "Dragao", "Bessa"], correct_option: 0, category: "DESPORTO", age_rating: 12 },
  
  // GEOGRAFIA - more
  { text: "Portugal fica na Europa?", options: ["Sim", "Nao", "Talvez", "Depends"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8 },
  { text: "Qual e o maior rio do mundo?", options: ["Amazonas", "Nilo", "Yangtse", "Mississippi"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12 },
  { text: "Qual e o deserto maior?", options: ["Sahara", "Gobi", "Atacama", "Kalahari"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12 },
  { text: "Quantos continentes existem?", options: ["5", "6", "7", "8"], correct_option: 1, category: "GEOGRAFIA", age_rating: 8 },
  
  // HISTORIA - more  
  { text: "Quem descobriu o Brasil?", options: ["Vasco da Gama", "Pedro Alvares Cabral", "Cristovao Colombo", "Fernao de Magalhaes"], correct_option: 1, category: "HISTORIA", age_rating: 8 },
  { text: "Em que ano foi o 25 de Abril?", options: ["1974", "1975", "1976", "1973"], correct_option: 0, category: "HISTORIA", age_rating: 12 },
  { text: "Quem foi D. Afonso Henriques?", options: ["Primeiro Rei", "Ultimo Rei", "Primeiro Presidente", "Primeiro Ministro"], correct_option: 0, category: "HISTORIA", age_rating: 12 },
  
  // MATEMATICA - more
  { text: "Quanto e 5 + 5?", options: ["8", "9", "10", "11"], correct_option: 2, category: "MATEMATICA", age_rating: 8 },
  { text: "Quanto e 2 x 3?", options: ["5", "6", "7", "8"], correct_option: 1, category: "MATEMATICA", age_rating: 8 },
  { text: "Quanto e 10 / 2?", options: ["3", "4", "5", "6"], correct_option: 2, category: "MATEMATICA", age_rating: 8 },
  { text: "Quanto e a raiz de 81?", options: ["7", "8", "9", "10"], correct_option: 2, category: "MATEMATICA", age_rating: 12 },
  
  // MUSICA - more
  { text: "O que e o fado?", options: ["Musica portuguesa", "Musica brasileira", "Musica espanhola", "Musica francesa"], correct_option: 0, category: "MUSICA", age_rating: 8 },
  { text: "Quem e Amalia Rodrigues?", options: ["Cantora de fado", "Atriz", "Escritora", "Pintora"], correct_option: 0, category: "MUSICA", age_rating: 8 },
  { text: "Qual e o instrumento do fado?", options: ["Viola", "Piano", "Guitarra", "Flauta"], correct_option: 0, category: "MUSICA", age_rating: 12 },
  
  // GASTRONOMIA - more
  { text: "Qual e o prato mais portugues?", options: ["Bacalhau", "Paella", "Pizza", "Hamburger"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8 },
  { text: "O que e o pastel de nata?", options: ["Doce", "Salgado", "Bebida", "Prato"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8 },
  { text: "O que e o vinho verde?", options: ["Vinho", "Agua", "Cerveja", "Sumo"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12 },
  
  // CINEMA - more
  { text: "O que e um filme?", options: ["Filme de cinema", "Musica", "Livro", "Jogo"], correct_option: 0, category: "CINEMA", age_rating: 8 },
  { text: "Quem e o actor principal?", options: ["Protagonista", "Coadjuvante", "Extra", "Figurante"], correct_option: 0, category: "CINEMA", age_rating: 12 },
];

async function insert() {
  const questionsWithHints = questions.map(q => ({
    ...q,
    metadata: { hint: 'A resposta correta e: ' + q.options[q.correct_option] }
  }));
  
  const { error } = await supabase.from('questions').insert(questionsWithHints);
  if (error) {
    console.log('Erro:', error.message);
  } else {
    console.log('Inseridas ' + questionsWithHints.length + ' perguntas');
  }
}

insert();