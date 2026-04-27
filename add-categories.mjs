import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const newQuestions = [
  // TECNOLOGIA - Level 8
  { text: "O que é um computador?", options: ["Uma máquina de escrever", "Um dispositivo eletrónico", "Um teléfono", "Uma televisão"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "Para que serve um teclado?", options: ["Para desenhar", "Para escrever", "Para jogar", "Para ouvir música"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que é um ratón de computador?", options: ["Um animal", "Um periférico", "Um jogo", "Uma pessoa"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "Para que serve o ecrã?", options: ["Para ver imagens", "Para ouvir", "Para falar", "Para correr"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que é a internet?", options: ["Uma estrada", "Uma rede de computadores", "Um libro", "Um jogo"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que é um smartphone?", options: ["Um telephone", "Um tablet", "Um computador portatil", "Todos"], correct_option: 3, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que podes fazer com um tablet?", options: ["Desenhar", "Ver videos", "Jogar", "Todas as anteriores"], correct_option: 3, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que é um aplicativo?", options: ["Um jogo", "Um programa", "Uma camera", "Um rádio"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "Para que serve uma camera digital?", options: ["Para tirar fotos", "Para cozinhar", "Para escrever", "Para dormir"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que é um livro digital?", options: ["Um caderno", "Um ebook", "Um jornal", "Uma revista"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },

  // TECNOLOGIA - Level 12
  { text: "O que é um processador?", options: ["Um jogo", "CPU do computador", "Um programa", "Uma memória"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que significa RAM?", options: ["Random Access Memory", "Read All Memory", "Rapid Access", "Random All"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é um sistema operativo?", options: ["Um jogo", "Windows ou Mac", "Um programa", "Um hardware"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é a nuvem (cloud)?", options: ["O céu", "Armazenamento online", "Um programa", "Um servidor"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é o Wi-Fi?", options: ["Um fio", "Internet sem fios", "Um router", "Um cabo"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é um antivírus?", options: ["Um jogo", "Programa de segurança", "Um firewall", "Um antivirus"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é um URL?", options: ["Um archivo", "Endereço web", "Um link", "Um código"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é o Bluetooth?", options: ["Uma tecnologia sem fios", "Um jogo", "Um programa", "Um cable"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é inteligência artificial?", options: ["Um робот", "Simulação de inteligência", "Um programa", "Um jogo"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que é um pixel?", options: ["Um ponto de imagem", "Um quadro", "Um ecra", "Uma foto"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },

  // TECNOLOGIA - Level 16
  { text: "O que é um algoritmo?", options: ["Um programa", "Um conjunto de instruções", "Um código", "Um software"], correct_option: 1, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é machine learning?", options: ["Aprendizagem", "IA que aprende", "Um robô", "Um algoritmo"], correct_option: 1, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é blockchain?", options: ["Um jogo", "Registos distribuidos", "Uma base de dados", "Uma crypto"], correct_option: 1, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é um banco de dados relacional?", options: ["SQL", "MySQL", "Bases com relações", "Todas"], correct_option: 3, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é uma API?", options: ["Um programa", "Interface de comunicação", "Um servidor", "Um código"], correct_option: 1, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é CSS?", options: ["Uma linguagem de estilo", "Um programa", "Um jogo", "Um servidor"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é Docker?", options: ["Um contentor", "Plataforma de containers", "Um servidor", "Um virtual"], correct_option: 1, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é Git?", options: ["Um jogo", "Sistema de controle de versões", "Um servidor", "Um código"], correct_option: 1, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é Cloud Computing?", options: ["Computação em nuvem", "Um tipo de PC", "Um servidor", "Um data center"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que é um endpoint?", options: ["Um ponto final", "Uma API", "Um servidor", "Um URL"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },

  // POLITICA - Level 8
  { text: "O que é um presidente?", options: ["Um professor", "Chefe de Estado", "Um médico", "Um jogador"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que é um rei?", options: ["Um monarca", "Um presidente", "Um primeiro ministro", "Um general"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "O que é um país?", options: ["Uma cidade", "Uma nação", "Um continente", "Uma vila"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que é a bandeira?", options: ["Um símbolo nacional", "Um jogo", "Um uniforme", "Um edificio"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "O que é um governo?", options: ["Um grupo que governa", "Um partido", "Uma assembleia", "Um pais"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "O que é democracy?", options: ["Governo do povo", "Reino", "Ditadura", "Monarquia"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "O que é uma eleição?", options: ["Um jogo", "Votação", "Um concurso", "Um festival"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que é um partido político?", options: ["Um clube", "Grupo político", "Um partido", "Uma associação"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que é o Presidente da República?", options: ["Primeiro ministro", "Chefe de Estado", "Ministro", "Parlamentar"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que é a Constituição?", options: ["Um livro", "Lei fundamental", "Um jornal", "Um documento"], correct_option: 1, category: "POLITICA", age_rating: 8 },

  // POLITICA - Level 12
  { text: "O que é a ONU?", options: ["Organização das Nações Unidas", "União Europeia", "NATO", "UNESCO"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que é a União Europeia?", options: ["Um pais", "Bloco de países", "Uma organização", "Um governo"], correct_option: 1, category: "POLITICA", age_rating: 12 },
  { text: "O que é a NATO?", options: ["Uma alliance militar", "Uma organização", "Um partido", "Um pais"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que é um referendo?", options: ["Uma eleição", "Votação popular direta", "Um plebiscito", "Uma consulta"], correct_option: 1, category: "POLITICA", age_rating: 12 },
  { text: "O que é o Parlamento Europeu?", options: ["Governo da UE", "Assembleia da UE", "Comissão da UE", "Conselho da UE"], correct_option: 1, category: "POLITICA", age_rating: 12 },
  { text: "O que é um embaixador?", options: ["Um diplomata", "Um ministro", "Um presidente", "Um consultor"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que é um tratado internacional?", options: ["Um acordo entre países", "Um contrato", "Uma lei", "Um documento"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que é a ONU?", options: ["Organização das Nações Unidas", "União Europeia", "NATO", "UNESCO"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que é a crise migratória?", options: ["Movimento de povos", "Problema de refugiados", "Fluxo migratório", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 12 },
  { text: "O que é a globalização?", options: ["Um processo", "Interdependência mundial", "Economia global", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 12 },

  // POLITICA - Level 16
  { text: "O que é a地道民主?", options: ["Democracia direta", "Sistema politico", "Votação", "Eleição"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que é o liberalismo?", options: ["Uma ideologia", "Livre mercado", "Direitos individuais", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é o socialismo?", options: ["Uma ideologia", "Propriedade coletiva", "Estado forte", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é o nacionalismo?", options: ["Amor à Pátria", "Ideologia", "Política", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é a外交?", options: ["Política externa", "Relações internacionais", "Diplomacia", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é a política monetária?", options: ["Gestão da moeda", "Taxas de juro", "Inflação", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que são as Nações Unidas?", options: ["Organização internacional", "220 países", "Segurança mundial", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é a Corte Internacional de Justiça?", options: ["Tribunal da ONU", "Justiça internacional", "Haia", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é o Conselho de Segurança da ONU?", options: ["Órgão da ONU", "5 membros permanentes", "Veto", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
  { text: "O que é a sustentabilidade?", options: ["Desenvolvimento durável", "Preservação", "Equilíbrio", "Todas"], correct_option: 3, category: "POLITICA", age_rating: 16 },
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
  const questionsWithHints = newQuestions.map(q => ({
    ...q,
    metadata: { hint: 'A resposta correta é: ' + q.options[q.correct_option] }
  }));
  
  const { error } = await supabase.from('questions').insert(questionsWithHints);
  if (error) {
    console.log('Erro:', error.message);
  } else {
    console.log('Inseridas ' + questionsWithHints.length + ' perguntas');
  }
}

insert();