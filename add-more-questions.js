const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

// Additional questions for underrepresented categories
const newQuestions = [
  // ARTE
  { text: "Quem pintou o teto da Capela Sistina?", options: ["Rafael", "Leonardo da Vinci", "Michelangelo", "Donatello"], correct: 2, age: 8, category: "ARTE", hint: "Um génio do Renascimento italiano." },
  { text: "Qual é o estilo arquitetónico da Torre de Belém?", options: ["Barroco", "Gótico", "Manuelino", "Romanico"], correct: 2, age: 12, category: "ARTE", hint: "Estilo português único." },
  { text: "Quem é o autor da escultura 'O Pensador'?", options: ["Rodin", "Michelangelo", "Donatello", "Bernini"], correct: 0, age: 12, category: "ARTE", hint: "Famoso escultor francês." },
  { text: "Quem pintou 'A Persistência da Memória'?", options: ["Picasso", "Salvador Dalí", "Miró", "Kandinsky"], correct: 1, age: 16, category: "ARTE", hint: "Relógios derretidos numa pintura surrealista." },
  { text: "Qual é a técnica de pintura em que se usam água e pigmentos?", options: ["Óleo", "Acrílico", "Aquarela", "Tempera"], correct: 2, age: 8, category: "ARTE", hint: "Papel e água." },
  { text: "O Louvre é um museu em qual cidade?", options: ["Londres", "Paris", "Roma", "Viena"], correct: 1, age: 8, category: "ARTE", hint: "Capital francesa." },
  { text: "Quem é considerado o pai da arte moderna?", options: ["Van Gogh", "Picasso", "Cézanne", "Monet"], correct: 2, age: 16, category: "ARTE", hint: "Influenciou Picasso." },
  { text: "Qual é o espaço negativo numa composição artística?", options: ["A cor preta", "A área vazia", "A sombra", "O fundo"], correct: 1, age: 12, category: "ARTE", hint: "Área sem objetos." },
  { text: "Quem compôs 'A Noite Estrelada' como música?", options: ["Mozart", "Beethoven", "Debussy", "Mussorgsky"], correct: 3, age: 16, category: "ARTE", hint: "Quadro de Van Gogh musicado por um russo." },
  { text: "Qual destas cores não é uma cor primária?", options: ["Azul", "Vermelho", "Verde", "Amarelo"], correct: 2, age: 8, category: "ARTE", hint: "As primárias são usadas para misturar." },

  // CINEMA
  { text: "Quem realizou o filme 'O Padrinho'?", options: ["Martin Scorsese", "Francis Ford Coppola", "Steven Spielberg", "Brian De Palma"], correct: 1, age: 16, category: "CINEMA", hint: "Realizador de família Coppola." },
  { text: "Qual o primeiro filme de animação da Disney?", options: ["Pinóquio", "Branca de Neve", "Fantasia", "Dumbo"], correct: 1, age: 8, category: "CINEMA", hint: "Princesa e sete anões." },
  { text: "Quem interpretou o Padrinho?", options: ["Al Pacino", "Marlon Brando", "Robert De Niro", "Jack Nicholson"], correct: 1, age: 16, category: "CINEMA", hint: "Ator com algodão na boca." },
  { text: "Qual é o filme com mais Oscars de sempre?", options: ["Titanic", "Ben-Hur", "O Senhor dos Anéis", "Todas as opções anteriores"], correct: 3, age: 12, category: "CINEMA", hint: "Três filmes partilham o recorde." },
  { text: "Em que ano foi lançado o primeiro filme do Homem de Ferro?", options: ["2006", "2008", "2010", "2012"], correct: 1, age: 8, category: "CINEMA", hint: "Início do MCU." },

  // MUSICA
  { text: "Quem é o autor de 'Grândola, Vila Morena'?", options: ["Amália Rodrigues", "Zeca Afonso", "José Afonso", "Rui Veloso"], correct: 1, age: 8, category: "MUSICA", hint: "Cantor da Revolução." },
  { text: "Qual é o instrumento principal do fado?", options: ["Viola", "Guitarra portuguesa", "Piano", "Bandolim"], correct: 1, age: 8, category: "MUSICA", hint: "Cordas portuguesas." },
  { text: "Quem compôs a 'Sinfonia n.9'?", options: ["Mozart", "Bach", "Beethoven", "Haydn"], correct: 2, age: 12, category: "MUSICA", hint: "Surdo, compôs a 'Ode à Alegria'." },
  { text: "O que é um pentagrama musical?", options: ["Um instrumento", "Um tipo de partitura", "Um ritmo", "Um gênero"], correct: 1, age: 8, category: "MUSICA", hint: "Cinco linhas." },
  { text: "Em que cidade nasceu Amália Rodrigues?", options: ["Lisboa", "Porto", "Coimbra", "Funchal"], correct: 0, age: 8, category: "MUSICA", hint: "Capital." },
  { text: "Qual é a nota mais grave num piano standard?", options: ["Lá", "Mi", "Dó", "Ré"], correct: 2, age: 12, category: "MUSICA", hint: "Começa com 'C'." },

  // POLITICA
  { text: "Quantos anos dura um mandato presidencial em Portugal?", options: ["4", "5", "6", "7"], correct: 1, age: 8, category: "POLITICA", hint: "Mandato quinquenal." },
  { text: "Quem é o Chefe de Estado em Portugal?", options: ["Primeiro-ministro", "Presidente da República", "Presidente da Assembleia", "Rei"], correct: 1, age: 8, category: "POLITICA", hint: "Maior figura política." },
  { text: "Em que ano Portugal entrou para a União Europeia?", options: ["1981", "1986", "1992", "1995"], correct: 1, age: 12, category: "POLITICA", hint: "Anos 80." },
  { text: "Quem foi o primeiro Presidente da República Portuguesa?", options: ["Teófilo Braga", "Bernardino Machado", "Manuel de Arriaga", "Sidónio Pais"], correct: 2, age: 16, category: "POLITICA", hint: "1911." },
  { text: "Qual é a capital de Portugal?", options: ["Lisboa", "Porto", "Coimbra", "Faro"], correct: 0, age: 8, category: "POLITICA", hint: "Cidade mais populosa." },

  // GASTRONOMIA
  { text: "De que região é o vinho do Porto?", options: ["Minho", "Douro", "Dão", "Alentejo"], correct: 1, age: 12, category: "GASTRONOMIA", hint: "Região vinícola do Norte." },
  { text: "O que é bacalhau à Brás?", options: ["Um prato de carne", "Um prato de peixe desfiado", "Um doce", "Uma sopa"], correct: 1, age: 8, category: "GASTRONOMIA", hint: "Ouro do mar desfiado." },
  { text: "Qual é o principal ingrediente do caldo verde?", options: ["Couve", "Batata", "Feijão", "Espinafre"], correct: 0, age: 8, category: "GASTRONOMIA", hint: "Folha verde." },
  { text: "De onde vem o pastel de nata?", options: ["Portugal", "Espanha", "Franca", "Brasil"], correct: 0, age: 8, category: "GASTRONOMIA", hint: "Pastelaria portuguesa." },

  // TECNOLOGIA
  { text: "O que é um algoritmo?", options: ["Um computador", "Um programa", "Um conjunto de passos", "Um vírus"], correct: 2, age: 8, category: "TECNOLOGIA", hint: "Receita ou regra." },
  { text: "Quem criou a World Wide Web?", options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg"], correct: 2, age: 12, category: "TECNOLOGIA", hint: "Cientista britânico." },
  { text: "Qual é a linguagem de programação mais usada para web?", options: ["Python", "JavaScript", "C++", "Java"], correct: 1, age: 8, category: "TECNOLOGIA", hint: "Corre no navegador." },
  { text: "O que é phishing?", options: ["Pesca esportiva", "Falsificação eletrónica", "Um vírus informático", "Um tipo de hardware"], correct: 1, age: 12, category: "TECNOLOGIA", hint: "Golpe online." },
  { text: "Em que ano foi lançado o primeiro iPhone?", options: ["2005", "2007", "2009", "2010"], correct: 1, age: 8, category: "TECNOLOGIA", hint: "2007." },

  // HISTORIA
  { text: "Quem foi o último rei de Portugal?", options: ["D. Manuel II", "D. Carlos I", "D. João VI", "D. Pedro IV"], correct: 0, age: 12, category: "HISTORIA", hint: "Monarquia terminou em 1910." },
  { text: "Em que século foi a revolta de 25 de Abril?", options: ["XVIII", "XIX", "XX", "XXI"], correct: 2, age: 8, category: "HISTORIA", hint: "1974." },
  { text: "Quem foi Salazar?", options: ["Um ator", "Um ditador", "Um escritor", "Um cientista"], correct: 1, age: 16, category: "HISTORIA", hint: "Regime do Estado Novo." },
  { text: "Qual foi a primeira democracia da história?", options: ["Roma", "Atenas", "Esparta", "Egito"], correct: 1, age: 12, category: "HISTORIA", hint: "Polis grega." },
  { text: "Quem foi o primeiro presidente dos EUA?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], correct: 1, age: 8, category: "HISTORIA", hint: "General revolucionário." },

  // DESPORTO
  { text: "Em que ano Portugal ganhou o Euro2016?", options: ["2014", "2016", "2018", "2020"], correct: 1, age: 8, category: "DESPORTO", hint: "Ano com final contra França." },
  { text: "Quem é o melhor marcador de sempre da seleção portuguesa?", options: ["Eusébio", "Pauleta", "Cristiano Ronaldo", "Nani"], correct: 2, age: 8, category: "DESPORTO", hint: "Conhecido como CR7." },
  { text: "Qual é o clube com mais títulos da Primeira Liga?", options: ["Benfica", "Porto", "Sporting", "Boavista"], correct: 0, age: 8, category: "DESPORTO", hint: "Clube das águias." },
  { text: "Em que país nasceu Lionel Messi?", options: ["Brasil", "Argentina", "Espanha", "Itália"], correct: 1, age: 8, category: "DESPORTO", hint: "Albiceleste." },
  { text: "Quantos jogadores tem uma equipa de futebol em campo?", options: ["9", "10", "11", "12"], correct: 2, age: 8, category: "DESPORTO", hint: "Onze à parte." },

  // GEOGRAFIA
  { text: "Qual é o maior oceano do mundo?", options: ["Atlântico", "Índico", "Pacífico", "Ártico"], correct: 2, age: 8, category: "GEOGRAFIA", hint: "Maior que todos os continentes juntos." },
  { text: "Qual é o rio mais longo do mundo?", options: ["Nilo", "Amazonas", "Mississípi", "Yangtzé"], correct: 0, age: 12, category: "GEOGRAFIA", hint: "Continente africano." },
  { text: "Em que continente está o Brasil?", options: ["Europa", "África", "América do Sul", "Ásia"], correct: 2, age: 8, category: "GEOGRAFIA", hint: "América Latina." },
  { text: "Qual é a capital da Austrália?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2, age: 12, category: "GEOGRAFIA", hint: "Não é Sydney." },
  { text: "Quantos continentes existem?", options: ["5", "6", "7", "8"], correct: 2, age: 8, category: "GEOGRAFIA", hint: "Sete continentes." },

  // MATEMATICA
  { text: "Quanto é 7 x 8?", options: ["54", "56", "64", "48"], correct: 1, age: 8, category: "MATEMATICA", hint: "Sete vezes oito." },
  { text: "Quanto é 12 x 12?", options: ["124", "144", "132", "148"], correct: 1, age: 8, category: "MATEMATICA", hint: "Dúzia ao quadrado." },
  { text: "Qual é o valor de pi?", options: ["2.14", "3.14", "3.41", "4.14"], correct: 1, age: 8, category: "MATEMATICA", hint: "Circunferência sobre diâmetro." },
  { text: "Quanto é 1000 / 8?", options: ["125", "120", "130", "100"], correct: 0, age: 12, category: "MATEMATICA", hint: "Mil dividido por oito." },
  { text: "Qual é a raiz quadrada de 144?", options: ["10", "11", "12", "13"], correct: 2, age: 8, category: "MATEMATICA", hint: "12 ao quadrado." },
];

async function main() {
  const rows = newQuestions.map(q => ({
    text: q.text,
    options: q.options,
    correct_option: q.correct,
    age_rating: q.age,
    category: q.category,
    image_url: null,
    country_code: null,
    metadata: { hint: q.hint }
  }));
  
  console.log('Inserindo ' + rows.length + ' perguntas novas...');
  
  
  const { error } = await supabase.from('questions').insert(rows);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Inseridas com sucesso!');
  
  // Update backup
  const fs = require('fs');
  const backup = JSON.parse(fs.readFileSync('questions_backup.json', 'utf8'));
  for (const q of newQuestions) {
    if (!backup[q.category]) backup[q.category] = [];
    backup[q.category].push({
      text: q.text,
      options: q.options,
      correct_option: q.correct,
      age_rating: q.age,
      category: q.category,
      metadata: { hint: q.hint }
    });
  }
  fs.writeFileSync('questions_backup.json', JSON.stringify(backup, null, 2));
  console.log('Backup updated!');
}

main().catch(console.error);
