import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const questions = [
  // POLITICA - Level 8
  { text: "O que e o Presidente da Republica?", options: ["Um professor", "O chefe do pais", "Um jogador", "Um medico"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que e uma eleicao?", options: ["Um jogo", "Uma votacao", "Um concurso", "Um festival"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que e a bandeira de Portugal?", options: ["Um simbolo", "Um vestido", "Um chapéu", "Uma绑o"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "Quem governa Portugal?", options: ["O Primeiro-Ministro", "O Rei", "O Presidente", "O Papa"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "O que e o Parlamento?", options: ["Um edificio", "Uma assembleia", "Um estadio", "Um museu"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que e um votO?", options: ["Uma escolha", "Um ponto", "Um jogo", "Um numero"], correct_option: 0, category: "POLITICA", age_rating: 8 },
  { text: "O que e a Constituicao?", options: ["Um livro", "Uma lei", "Um jornal", "Uma revista"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  { text: "O que e um partido politico?", options: ["Um clube", "Um grupo politico", "Uma equipa", "Uma associaO"], correct_option: 1, category: "POLITICA", age_rating: 8 },
  
  // POLITICA - Level 12
  { text: "O que e a Uniao Europeia?", options: ["Um pais", "Um grupo de paises", "Uma cidade", "Um continente"], correct_option: 1, category: "POLITICA", age_rating: 12 },
  { text: "O que e a ONU?", options: ["Uma organizacao", "Um pais", "Um exercito", "Um partido"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que e a NATO?", options: ["Uma aliada militar", "Um pais", "Uma cidade", "Um rio"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que e um embaixador?", options: ["Um diplomata", "Um jornalista", "Um advogado", "Um medico"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que e um referendo?", options: ["Uma eleicao", "Uma votacao direta", "Um concurso", "Um jogo"], correct_option: 1, category: "POLITICA", age_rating: 12 },
  { text: "O que e democracia?", options: ["Governo do povo", "Um rei", "Uma ditadura", "Um imperador"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que e a fiscalidade?", options: ["Impostos", "Aeroportos", "CamiOnferreas", "Ruas"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  { text: "O que sao as eleicoes legislativas?", options: ["Eleicoes para Parlamento", "Eleicoes para Presidente", "Eleicoes Autarquicas", "Eleicoes Europeias"], correct_option: 0, category: "POLITICA", age_rating: 12 },
  
  // POLITICA - Level 16
  { text: "O que e o liberalismo?", options: ["Uma ideologia", "Um jogo", "Um partido", "Um filme"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que e o socialismo?", options: ["Uma ideologia", "Um jogo", "Um partido", "Um filme"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que e o nacionalismo?", options: ["Amor a Pátria", "Um desporto", "Uma arte", "Um jogo"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que e a politica monetaria?", options: ["Gestao da moeda", "Politica de saude", "Politica educativa", "Politica externa"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que e a globalizacao?", options: ["Interdependencia mundial", "Um jogo", "Um partido", "Um filme"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que e o Conselho de Seguranca da ONU?", options: ["Orgao da ONU", "Um conselho", "Um tribunal", "Um parlamento"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que e a cortes internacionais?", options: ["Tribunal da ONU", "Um tribunal", "Um conselho", "Um partido"], correct_option: 0, category: "POLITICA", age_rating: 16 },
  { text: "O que sao direitos humanos?", options: ["Direitos fundamentais", "Direitos de autor", "Direitos de menores", "Direitos antigos"], correct_option: 0, category: "POLITICA", age_rating: 16 },

  // TECNOLOGIA - Level 8
  { text: "Para que serve o ratO?", options: ["Para desenhar no ecra", "Para escrever", "Para imprimir", "Para limpar"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que e um tablet?", options: ["Um medicamento", "Um computador portatil", "Um telefone", "Uma televisO"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que e a internet?", options: ["Uma estrada", "Uma rede de computadores", "Um livro", "Um jogo"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que e um smartphone?", options: ["Um telemovel", "Um radio", "Uma camera", "Um tablet"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "Para que serve o teclado?", options: ["Para escrever", "Para desenhar", "Para jogar", "Para ouvir"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que e um aplicativo?", options: ["Um programa", "Um jogo", "Um video", "Uma foto"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que significa Wi-Fi?", options: ["Internet sem fios", "Um fio", "Um cabo", "Um router"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  { text: "O que e um e-mail?", options: ["Uma mensagem", "Um jogo", "Um video", "Uma foto"], correct_option: 0, category: "TECNOLOGIA", age_rating: 8 },
  
  // TECNOLOGIA - Level 12
  { text: "O que e um processador?", options: ["CPU", "Um jogo", "Um programa", "Um video"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que significa RAM?", options: ["Memoria", "Um processador", "Um disco", "Um ecra"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que e um sistema operativo?", options: ["Windows/Mac", "Um jogo", "Um programa", "Um video"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que e a nuvem (cloud)?", options: ["Armazenamento online", "Um ceu", "Uma.nvagem", "Um lugar"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que e um antivrus?", options: ["Programa de seguranca", "Um jogo", "Um virus", "Um programa"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que e um URL?", options: ["Endereco web", "Um jogo", "Um programa", "Um video"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que e Bluetooth?", options: ["Tecnologia sem fios", "Um jogo", "Um som", "Um azul"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  { text: "O que e um pixel?", options: ["Ponto de imagem", "Um ponto", "Um quadro", "Uma foto"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12 },
  
  // TECNOLOGIA - Level 16
  { text: "O que e um algoritmo?", options: ["Conjunto de instrucoes", "Um jogo", "Um programa", "Um codigo"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e machine learning?", options: ["IA que aprende", "Um jogo", "Um programa", "Um robO"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e blockchain?", options: ["Registos distribuidos", "Um jogo", "Uma corrente", "Um bloco"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e uma API?", options: ["Interface de comunicacao", "Um programa", "Um servidor", "Um codigo"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e CSS?", options: ["Linguagem de estilo", "Um programa", "Um jogo", "Um estilo"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e Docker?", options: ["Plataforma de containers", "Um contentor", "Um naviO", "Um jogo"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e Git?", options: ["Sistema de controle de versoes", "Um jogo", "Um programa", "Um codigo"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
  { text: "O que e Cloud Computing?", options: ["Computacao em nuvem", "Um tipo de nvim", "Um servidor", "Um dado"], correct_option: 0, category: "TECNOLOGIA", age_rating: 16 },
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