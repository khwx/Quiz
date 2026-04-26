import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const newQuestions = [
  // CULTURA_GERAL L8 (need 0 to reach 30, currently 33)
  {
    text: "Qual é o menor océano do mundo?",
    options: ["Oceano Ártico", "Oceano Atlântico", "Oceano Índico", "Oceano Pacífico"],
    correct_option: 0,
    category: "CULTURA_GERAL",
    age_rating: 8
  },
  {
    text: "Quantas cores tem o arco-íris?",
    options: ["5", "6", "7", "8"],
    correct_option: 2,
    category: "CULTURA_GERAL",
    age_rating: 8
  },
  {
    text: "O que as abelhas fazem para fazer mel?",
    options: ["Colhem néctar das flores", "Comem açúcar", "Caçam insetos", "Regam flores"],
    correct_option: 0,
    category: "CULTURA_GERAL",
    age_rating: 8
  },
  
  // CAPITAIS_DO_MUNDO L12 (need ~16 more, currently 14)
  {
    text: "Qual é a capital do Brasil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 12
  },
  {
    text: "Qual é a capital de França?",
    options: ["Lyon", "Marselha", "Paris", "Nice"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 12
  },
  {
    text: "Qual é a capital do Japãeste?",
    options: ["Osaka", "Quioto", "Tóquio", "Nagoia"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 12
  },
  {
    text: "Qual é a capital da Austrália?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 12
  },
  
  // CAPITAIS_DO_MUNDO L16 (need ~20 more, currently 9)
  {
    text: "Qual é a capital da Coreia do Sul?",
    options: ["Busan", "Incheon", "Seul", "Daegu"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital da Nova Zelândia?",
    options: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
    correct_option: 1,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital da África do Sul?",
    options: ["Joanesburgo", "Cidade do Cabo", "Pretória", "Durban"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital do Canadá?",
    options: ["Toronto", "Vancouver", "Otava", "Montreal"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital da Turquíaa?",
    options: ["Istambul", "Ancara", "Izmir", "Antalya"],
    correct_option: 1,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital da Suécia?",
    options: ["Gotemburgo", "Malmö", "Estocolmo", "Upsália"],
    correct_option: 2,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital da Grécia?",
    options: ["Atenas", "Salónica", "Creta", "Patras"],
    correct_option: 0,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  {
    text: "Qual é a capital da Polónia?",
    options: ["Cracovia", "Varsóvia", "Gdańsk", "Wroclaw"],
    correct_option: 1,
    category: "CAPITAIS_DO_MUNDO",
    age_rating: 16
  },
  
  // GEOGRAFIA L12 (need ~15 more, currently 14)
  {
    text: "Qual é o rio mais longo do mundo?",
    options: ["Amazonas", "Nilo", "Yangtsé", "Mississippi"],
    correct_option: 1,
    category: "GEOGRAFIA",
    age_rating: 12
  },
  {
    text: "Em que continente está o deserto do Sáara?",
    options: ["Ásia", "América", "África", "Europa"],
    correct_option: 2,
    category: "GEOGRAFIA",
    age_rating: 12
  },
  {
    text: "Qual é o maior país do mundo em área?",
    options: ["China", "EUA", "Rússia", "Canadá"],
    correct_option: 2,
    category: "GEOGRAFIA",
    age_rating: 12
  },
  {
    text: "Qué半岛 é a maior península da Europa?",
    options: ["Ibérica", "Itálica", "Escandinava", "Balcânica"],
    correct_option: 2,
    category: "GEOGRAFIA",
    age_rating: 12
  },
  {
    text: "Qual é o ponto mais alto do mundo?",
    options: ["K2", "Everest", "Kangchenjunga", "Lhotse"],
    correct_option: 1,
    category: "GEOGRAFIA",
    age_rating: 12
  },
  
  // GEOGRAFIA L16 (need ~16 more, currently 12)
  {
    text: "Qual é a cordilheira mais longa do mundo?",
    options: ["Alpes", "Andes", "Himalaias", "Rocky Mountains"],
    correct_option: 1,
    category: "GEOGRAFIA",
    age_rating: 16
  },
  {
    text: "Em que país está o lago Baikal?",
    options: ["China", "Mongólia", "Rússia", "Cazaquistão"],
    correct_option: 2,
    category: "GEOGRAFIA",
    age_rating: 16
  },
  {
    text: "Qual é o menor país do mundo?",
    options: ["Mónaco", "Vaticano", "São Marino", "Liechtenstein"],
    correct_option: 1,
    category: "GEOGRAFIA",
    age_rating: 16
  },
  {
    text: "Quantos países fazem parte da União Europeia?",
    options: ["25", "27", "30", "32"],
    correct_option: 1,
    category: "GEOGRAFIA",
    age_rating: 16
  },
  {
    text: "Em que oceano está a fossa das Marianas?",
    options: ["Atlântico", "Índico", "Pacífico", "Ártico"],
    correct_option: 2,
    category: "GEOGRAFIA",
    age_rating: 16
  },
  {
    text: "Qual é o país com mais ilhas do mundo?",
    options: ["Indonésia", "Filipinas", "Suécia", "Japão"],
    correct_option: 2,
    category: "GEOGRAFIA",
    age_rating: 16
  },
  
  // CULTURA_GERAL L12 (need ~18 more, currently 12)
  {
    text: "Quem pintou a Mona Lisa?",
    options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Botticelli"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 12
  },
  {
    text: "Quantos dias tem um ano bissexto?",
    options: ["364", "365", "366", "367"],
    correct_option: 2,
    category: "CULTURA_GERAL",
    age_rating: 12
  },
  {
    text: "O que é um telescópio?",
    options: ["Um instrumento musical", "Um instrumento óptico", "Um instrumento médico", "Um instrumento de medição"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 12
  },
  {
    text: "Qual planeta é conhecido como planeta vermelho?",
    options: ["Venus", "Marte", "Júpiter", "Saturno"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 12
  },
  {
    text: "Quantosossos tem o corpo humano adulto?",
    options: ["186", "206", "226", "246"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 12
  },
  {
    text: "O que significa DNA?",
    options: ["Ácido desoxirribonucleico", "Ácido dinucleico", "Ácido diazotizado", "Açúcar duplo"],
    correct_option: 0,
    category: "CULTURA_GERAL",
    age_rating: 12
  },
  
  // CULTURA_GERAL L16 (need ~17 more, currently 13)
  {
    text: "Qual é a constante de Planck?",
    options: ["6,626 × 10⁻³⁴ J·s", "3,14 × 10¹⁵", "9,81 m/s²", "1,602 × 10⁻¹⁹ C"],
    correct_option: 0,
    category: "CULTURA_GERAL",
    age_rating: 16
  },
  {
    text: "Quem formulou a teoria da relatividade?",
    options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Stephen Hawking"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 16
  },
  {
    text: "Qual é o número de Avogadro?",
    options: ["6,022 × 10²³", "3,14159", "9,81 × 10³", "1,38 × 10⁻²³"],
    correct_option: 0,
    category: "CULTURA_GERAL",
    age_rating: 16
  },
  {
    text: "O que é a entropia em termodinâmica?",
    options: ["Energia cinética", "Desordem", "Pressão", "Volume"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 16
  },
  {
    text: "Qual é a frequência da luz visível?",
    options: ["10³ Hz", "10⁶ Hz", "10¹⁴ Hz", "10²⁰ Hz"],
    correct_option: 2,
    category: "CULTURA_GERAL",
    age_rating: 16
  },
  {
    text: "O que é um buraco negro?",
    options: ["Uma estrela", "Uma região de gravidade extrema", "Um planeta", "Uma galáxia"],
    correct_option: 1,
    category: "CULTURA_GERAL",
    age_rating: 16
  },
];

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function insert() {
  const questions = newQuestions.map(q => ({
    ...q,
    metadata: { hint: 'A resposta correta é: ' + q.options[q.correct_option] }
  }));
  
  const { error } = await supabase.from('questions').insert(questions);
  if (error) {
    console.log('Erro:', error.message);
  } else {
    console.log('Inseridas ' + questions.length + ' perguntas');
  }
}

insert();