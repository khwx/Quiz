import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const questions = [
  // ANIMAIS L12
  { text: "Qual e o mamifero mais rapido do mundo?", options: ["Leao", "Guepardo", "Leopardo", "Gazela"], correct_option: 1, category: "ANIMAIS", age_rating: 12 },
  { text: "Os polvos tem quantos coracoes?", options: ["1", "2", "3", "4"], correct_option: 2, category: "ANIMAIS", age_rating: 12 },
  { text: "Qual animal e conhecido como rei dos animais?", options: ["Tigre", "Leao", "Elefante", "Urso"], correct_option: 1, category: "ANIMAIS", age_rating: 12 },
  { text: "Quanto tempo vive em media um cao?", options: ["5 anos", "10 anos", "15 anos", "20 anos"], correct_option: 2, category: "ANIMAIS", age_rating: 12 },
  { text: "Qual e o maior felino do mundo?", options: ["Tigre siberiano", "Leao", "Jaguar", "Leopardo"], correct_option: 0, category: "ANIMAIS", age_rating: 12 },
  
  // ANIMAIS L16
  { text: "Qual e o periodo de gestacao de um elefante?", options: ["12 meses", "18 meses", "22 meses", "24 meses"], correct_option: 2, category: "ANIMAIS", age_rating: 16 },
  { text: "Os golfinhos dormem?", options: ["Nao dormem nunca", "Com um olho aberto", "Flutuam de pe", "Nao precisam de dormir"], correct_option: 1, category: "ANIMAIS", age_rating: 16 },
  { text: "Qual e o animal mais venenoso do mundo?", options: ["Cobra real", "Aranha viuva negra", "Medusa caixa", "Escorpiao"], correct_option: 2, category: "ANIMAIS", age_rating: 16 },
  
  // CIENCIA L8
  { text: "O que as plantas precisam para fazer Fotosintese?", options: ["Agua", "Sol", "Solo", "Ar"], correct_option: 1, category: "CIENCIA", age_rating: 8 },
  { text: "De que sao feitas as nuvens?", options: ["Algodao", "Vapor de agua", "Gelo", "Ar"], correct_option: 1, category: "CIENCIA", age_rating: 8 },
  
  // CIENCIA L12
  { text: "Qual e o elemento quimico mais abundante no universo?", options: ["Oxigenio", "Hidrogenio", "Carbono", "Helio"], correct_option: 1, category: "CIENCIA", age_rating: 12 },
  { text: "O que acontece quando a agua congela?", options: ["Aumenta de volume", "Diminui de volume", "Mantem o mesmo", "Evapora"], correct_option: 0, category: "CIENCIA", age_rating: 12 },
  
  // CIENCIA L16
  { text: "Qual e a velocidade da luz no vacuo?", options: ["300000 km/s", "150000 km/s", "100000 km/s", "500000 km/s"], correct_option: 0, category: "CIENCIA", age_rating: 16 },
  
  // CINEMA L8
  { text: "Qual e o filme de animacao mais antigo?", options: ["Branca de Neve", "Aventuras de Pinocchio", "O mago de Oz", "Dumbo"], correct_option: 1, category: "CINEMA", age_rating: 8 },
  { text: "Em que ano surgiu o primeiro filme do Walt Disney?", options: ["1928", "1937", "1940", "1950"], correct_option: 1, category: "CINEMA", age_rating: 8 },
  
  // CULTURA_GERAL L12
  { text: "Quem escreveu Dom Quixote?", options: ["Lope de Vega", "Cervantes", "Calderon", "Quevedo"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Qual e a capital de Portugal?", options: ["Porto", "Lisboa", "Coimbra", "Faro"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Quantas Coroas tem o escudo de Portugal?", options: ["5", "6", "7", "8"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Em que ano entrou Portugal na Uniao Europeia?", options: ["1982", "1986", "1992", "1996"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Qual e o rio que atravessa Lisboa?", options: ["Tejo", "Douro", "Mondego", "Sado"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Quem foi o primeiro Rei de Portugal?", options: ["D. Afonso Henriques", "D. Sancho I", "D. Afonso II", "D. Denis"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12 },
  { text: "Qual e a montanha mais alta de Portugal?", options: ["Serra da Estrela", "Pico", "Monte Geral", "Sera do Mirao"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12 },
  
  // CULTURA_GERAL L16
  { text: "O que estabelece a Lei de Moore?", options: ["Velocidade da luz", "Numero de transistores", "Evolucao biologica", "Lei da gravidade"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 16 },
  { text: "Qual e a unidade de pressao no SI?", options: ["Pascal", "Newton", "Watt", "Joule"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 16 },
  { text: "O que e um buraco de verme?", options: ["Fenomeno", "Saida gravitacional", "Buraco", "Falha"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 16 },
  
  // GEOGRAFIA L12
  { text: "Qual e o maior oceano do mundo?", options: ["Atlantico", "Indico", "Pacifico", "Artico"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12 },
  { text: "Em que continente esta o Brasil?", options: ["Europa", "Asia", "America", "Africa"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12 },
  { text: "Qual e o rio mais extenso da Europa?", options: ["Danubio", "Reno", "Volga", "Tejo"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12 },
  { text: "Quantos paises tem a Uniao Europeia?", options: ["25", "27", "30", "32"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12 },
  
  // GEOGRAFIA L16
  { text: "Qual e a profundidade media do oceano?", options: ["3.5 km", "4.5 km", "5.5 km", "6.5 km"], correct_option: 0, category: "GEOGRAFIA", age_rating: 16 },
  { text: "O que e uma dorsal medio-oceanica?", options: ["Montanha submarina", "Ilha vulcanica", "Fossa", "Plataforma"], correct_option: 0, category: "GEOGRAFIA", age_rating: 16 },
  
  // CAPITAIS L12
  { text: "Qual e a capital de Espanha?", options: ["Barcelona", "Madrid", "Valencia", "Sevilha"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12 },
  { text: "Qual e a capital de Italia?", options: ["Milao", "Napoles", "Roma", "Veneza"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12 },
  { text: "Qual e a capital do Reino Unido?", options: ["Manchester", "Liverpool", "Londres", "Birmingham"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12 },
  { text: "Qual e a capital de Alemanha?", options: ["Munique", "Berlim", "Frankfurt", "Hamburgo"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 12 },
  
  // CAPITAIS L16
  { text: "Qual e a capital da India?", options: ["Mumbai", "Nova Deli", "Calcuta", "Chennai"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 16 },
  { text: "Qual e a capital da Argentina?", options: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 16 },
  { text: "Qual e a capital do Mexico?", options: ["Guadalajara", "Monterrei", "Cidade do Mexico", "Cancun"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 16 },
  
  // DESPORTO L8
  { text: "Quantos jogadores tem uma equipa de futbol?", options: ["9", "10", "11", "12"], correct_option: 2, category: "DESPORTO", age_rating: 8 },
  { text: "Em que desporto se usa uma raquete?", options: ["Futbol", "Tenis", "Natação", "Atletismo"], correct_option: 1, category: "DESPORTO", age_rating: 8 },
  { text: "O que e um golo no futbol?", options: ["Falta", "Penalty", "Ponto", "Vitoria"], correct_option: 2, category: "DESPORTO", age_rating: 8 },
  
  // GASTRONOMIA L16
  { text: "Qual e o prato tipico do Japao?", options: ["Paella", "Sushi", "Pizza", "Tacos"], correct_option: 1, category: "GASTRONOMIA", age_rating: 16 },
  { text: "O que e o kimchi?", options: ["Sopa coreana", "Prato japones", "Prato indiano", "Prato chines"], correct_option: 0, category: "GASTRONOMIA", age_rating: 16 },
  
  // HISTORIA L8
  { text: "Quem descobriu o Brasil?", options: ["Vasco da Gama", "Pedro Alvares Cabral", "Cristovao Colombo", "Fernao de Magalhaes"], correct_option: 1, category: "HISTORIA", age_rating: 8 },
  { text: "Em que ano foi proclamada a Republica em Portugal?", options: ["1908", "1910", "1914", "1917"], correct_option: 1, category: "HISTORIA", age_rating: 8 },
  
  // HISTORIA L12
  { text: "Em que data foi a Revoluhao Francesa?", options: ["14 de julho", "15 de maio", "12 de outubro", "25 de abril"], correct_option: 0, category: "HISTORIA", age_rating: 12 },
  { text: "Quem foi Napoleao Bonaparte?", options: ["Rei de Italia", "Imperador de Franca", "Rei de espanha", "Imperador de Portugal"], correct_option: 1, category: "HISTORIA", age_rating: 12 },
  
  // ARTE L16
  { text: "Quem pintou O Jardim das Delicias?", options: ["Velazquez", "Bosch", "El Greco", "Goya"], correct_option: 1, category: "ARTE", age_rating: 16 },
  
  // MATEMATICA L8
  { text: "Quanto e 7 + 8?", options: ["13", "14", "15", "16"], correct_option: 2, category: "MATEMATICA", age_rating: 8 },
  { text: "Quanto e 9 x 9?", options: ["72", "81", "90", "99"], correct_option: 1, category: "MATEMATICA", age_rating: 8 },
  { text: "Quanto e 100 - 37?", options: ["63", "73", "83", "53"], correct_option: 0, category: "MATEMATICA", age_rating: 8 },
  
  // MATEMATICA L12
  { text: "Quanto e a raiz quadrada de 144?", options: ["10", "11", "12", "14"], correct_option: 2, category: "MATEMATICA", age_rating: 12 },
  { text: "Quanto e 3 elevado a 4?", options: ["12", "27", "81", "243"], correct_option: 2, category: "MATEMATICA", age_rating: 12 },
  { text: "Quanto e o MMC de 12 e 18?", options: ["36", "48", "54", "72"], correct_option: 0, category: "MATEMATICA", age_rating: 12 },
  
  // MATEMATICA L16
  { text: "Quanto e log de 1000 na base 10?", options: ["1", "2", "3", "4"], correct_option: 2, category: "MATEMATICA", age_rating: 16 },
  { text: "Quanto e i ao quadrado?", options: ["-1", "1", "i", "-i"], correct_option: 0, category: "MATEMATICA", age_rating: 16 },
  
  // MUSICA L16
  { text: "Quem compes a 5a Sinfonia de Beethoven?", options: ["Mozart", "Beethoven", "Brahms", "Bach"], correct_option: 1, category: "MUSICA", age_rating: 16 },
  { text: "O que e um requiem?", options: ["Danca", "Missa funebre", "Sonata", "Concerto"], correct_option: 1, category: "MUSICA", age_rating: 16 },
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