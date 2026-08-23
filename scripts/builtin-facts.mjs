// Deterministic fact-table question generators used by the built-in fallback
// in scripts/daily-questions.mjs. Each generator returns fully verified
// multiple-choice questions: the correct answer always appears among the
// options and `correct_option` is computed (never hardcoded), so the bank can
// keep ALL categories growing even when AI keys and the curated pool are empty.

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function factOptions(answer, pool) {
  const set = new Set([answer]);
  const shuffled = [...new Set(pool)].sort(() => Math.random() - 0.5);
  for (const x of shuffled) { if (set.size >= 4) break; if (x !== answer) set.add(x); }
  let k = 0;
  while (set.size < 4) { const v = `${answer}-alt${k++}`; set.add(v); }
  return [...set].sort(() => Math.random() - 0.5);
}

function factQuestion(text, answer, pool, hint, category) {
  const options = factOptions(answer, pool);
  return {
    text, options, correct_option: options.indexOf(answer),
    category, age_rating: 10,
    metadata: { hint, explanation: `${text.replace(/\?$/, '')} → ${answer}.` },
  };
}

const ELEMENTS = [['Oxigénio', 'O'], ['Hidrogénio', 'H'], ['Carbono', 'C'], ['Azoto', 'N'], ['Ferro', 'Fe'], ['Ouro', 'Au'], ['Prata', 'Ag'], ['Sódio', 'Na'], ['Potássio', 'K'], ['Cálcio', 'Ca'], ['Cobre', 'Cu'], ['Zinco', 'Zn'], ['Chumbo', 'Pb'], ['Enxofre', 'S'], ['Fósforo', 'P'], ['Cloro', 'Cl'], ['Magnésio', 'Mg'], ['Alumínio', 'Al'], ['Silício', 'Si'], ['Mercúrio', 'Hg']];
const ELEMENT_SYMS = ELEMENTS.map((e) => e[1]);

const ANIMAL_CLASSES = {
  Mamífero: ['Cão', 'Gato', 'Elefante', 'Baleia', 'Cavalo', 'Leão', 'Gorila', 'Urso'],
  Ave: ['Águia', 'Papagaio', 'Pinguim', 'Corvo', 'Falcão'],
  Réptil: ['Cobra', 'Lagarto', 'Tartaruga', 'Crocodilo'],
  Anfíbio: ['Sapo', 'Rã', 'Salamandra'],
  Peixe: ['Salmão', 'Tubarão', 'Atum'],
};
const ANIMAL_ALL = Object.values(ANIMAL_CLASSES).flat();

const HISTORY = [['a Primeira Guerra Mundial terminou', '1918'], ['a Segunda Guerra Mundial terminou', '1945'], ['Pedro Álvares Cabral chegou ao Brasil', '1500'], ['o Muro de Berlim caiu', '1989'], ['o Homem pisou a Lua pela primeira vez', '1969'], ['a Revolução Francesa começou', '1789'], ['Portugal se tornou independente', '1139'], ['os EUA declararam independência', '1776'], ['a imprensa de tipos móveis foi inventada', '1440'], ['o Império Romano do Ocidente caiu', '476']];
const HISTORY_YEARS = HISTORY.map((h) => h[1]);

const GASTRONOMY = [['Sushi', 'Japão'], ['Pizza', 'Itália'], ['Paella', 'Espanha'], ['Feijoada', 'Brasil'], ['Croissant', 'França'], ['Tacos', 'México'], ['Curry', 'Índia'], ['Couscous', 'Marrocos'], ['Pasta', 'Itália'], ['Kimchi', 'Coreia do Sul'], ['Ceviche', 'Peru'], ['Waffle', 'Bélgica']];
const GASTRONOMY_COUNTRIES = GASTRONOMY.map((g) => g[1]);

const INSTRUMENT_TYPES = {
  cordas: ['Violino', 'Guitarra', 'Piano', 'Harpa', 'Violoncelo'],
  sopro: ['Flauta', 'Saxofone', 'Trompete', 'Clarinete'],
  percussão: ['Bateria', 'Tambor', 'Xilofone'],
};
const INSTRUMENT_ALL = Object.values(INSTRUMENT_TYPES).flat();

const TECH = [['um documento de texto simples', '.txt'], ['uma imagem', '.jpg'], ['uma página web', '.html'], ['uma folha de cálculo', '.xls'], ['um ficheiro de áudio', '.mp3'], ['um vídeo', '.mp4'], ['uma apresentação', '.ppt'], ['uma base de dados', '.db']];
const TECH_EXT = TECH.map((t) => t[1]);

const SPORT = [['uma bola de basquetebol', 'Basquetebol'], ['uma raquete', 'Ténis'], ['um puck', 'Hóquei no gelo'], ['um taco de golfe', 'Golfe'], ['uma bola de futebol', 'Futebol'], ['uma bola de voleibol', 'Voleibol'], ['um remo', 'Canoagem']];
const SPORT_NAMES = SPORT.map((s) => s[1]);

const ART = [['Guernica', 'Picasso'], ['A Noite Estrelada', 'Van Gogh'], ['Os Girassóis', 'Van Gogh'], ['A Última Ceia', 'Da Vinci'], ['O Grito', 'Munch'], ['As Meninas', 'Velázquez'], ['A Persistência da Memória', 'Dalí'], ['O Nascimento de Vénus', 'Botticelli']];
const ART_ARTISTS = ART.map((a) => a[1]);

const FILM = [['Titanic', 'James Cameron'], ['O Senhor dos Anéis', 'Peter Jackson'], ['Star Wars', 'George Lucas'], ['Jurassic Park', 'Steven Spielberg'], ['O Padrinho', 'Francis Ford Coppola'], ['Interestelar', 'Christopher Nolan'], ['Avatar', 'James Cameron'], ['E.T.', 'Steven Spielberg']];
const FILM_DIRECTORS = FILM.map((f) => f[1]);

const POLITICS = [['a ONU', 'Nova Iorque'], ['a União Europeia', 'Bruxelas'], ['a NATO', 'Bruxelas'], ['a UNESCO', 'Paris'], ['o FMI', 'Washington'], ['a Interpol', 'Lyon'], ['a OMS', 'Genebra']];
const POLITICS_CITIES = POLITICS.map((p) => p[1]);

const CULTURA_GERAL = [
  { text: 'Qual é o maior oceano do mundo?', answer: 'Oceano Pacífico', pool: ['Oceano Atlântico', 'Oceano Índico', 'Oceano Ártico', 'Oceano Antártico'], hint: 'Maior e mais profundo' },
  { text: 'Qual é o rio mais longo do mundo?', answer: 'Rio Nilo', pool: ['Rio Amazonas', 'Rio Yangtzé', 'Rio Mississipi', 'Rio Congo'], hint: 'Maioria em África' },
  { text: 'Qual é a montanha mais alta do mundo?', answer: 'Everest', pool: ['K2', 'Monte Branco', 'Monte Kilimanjaro', 'Monte McKinley'], hint: 'Himalaia' },
  { text: 'Qual é o país mais populoso do mundo?', answer: 'China', pool: ['Índia', 'Estados Unidos', 'Indonésia', 'Brasil'], hint: 'Ásia Oriental' },
  { text: 'Qual é o continente mais extenso?', answer: 'Ásia', pool: ['África', 'América', 'Europa', 'Antártida'], hint: 'Maior população' },
  { text: 'Qual é o planeta mais próximo do Sol?', answer: 'Mercúrio', pool: ['Vénus', 'Terra', 'Marte', 'Júpiter'], hint: 'Menor planeta' },
  { text: 'Qual é o maior planeta do Sistema Solar?', answer: 'Júpiter', pool: ['Saturno', 'Terra', 'Netuno', 'Urano'], hint: 'Gigante gasoso' },
  { text: 'Qual é o deserto mais extenso do mundo?', answer: 'Antártida', pool: ['Sahara', 'Gobi', 'Kalahari', 'Atacama'], hint: 'Frio e gelado' },
  { text: 'Qual é o animal terrestre mais rápido?', answer: 'Guepardo', pool: ['Leão', 'Cavalo', 'Gazela', 'Antílope'], hint: 'Felino' },
  { text: 'Qual é o osso mais longo do corpo humano?', answer: 'Fémur', pool: ['Tíbia', 'Úmero', 'Rádio', 'Fíbula'], hint: 'Coxa' },
  { text: 'Quantos continentes existem no mundo?', answer: '7', pool: ['5', '6', '8', '9'], hint: 'Inclui a Antártida' },
  { text: 'Qual é a língua mais falada como língua materna?', answer: 'Mandarim', pool: ['Inglês', 'Espanhol', 'Árabe', 'Hindi'], hint: 'China' },
  { text: 'Qual é a moeda oficial do Japão?', answer: 'Iene', pool: ['Won', 'Yuan', 'Dólar', 'Baht'], hint: 'Ásia Oriental' },
  { text: 'Qual é o país com maior número de fusos horários?', answer: 'França', pool: ['Estados Unidos', 'Rússia', 'China', 'Reino Unido'], hint: 'Devido aos territórios ultramarinos' },
  { text: 'Qual é a capital da Austrália?', answer: 'Canberra', pool: ['Sydney', 'Melbourne', 'Perth', 'Brisbane'], hint: 'Não é a maior cidade' },
  { text: 'Qual é o órgão mais pesado do corpo humano?', answer: 'Fígado', pool: ['Coração', 'Cérebro', 'Pulmão', 'Rim'], hint: 'Metabolismo' },
  { text: 'Qual é o maior mamífero do mundo?', answer: 'Baleia-azul', pool: ['Elefante', 'Girafa', 'Hipopótamo', 'Rinoceronte'], hint: 'Vive no oceano' },
  { text: 'Em que ano o homem chegou à Lua pela primeira vez?', answer: '1969', pool: ['1959', '1965', '1972', '1961'], hint: 'Apollo 11' },
  { text: 'Qual é o país com maior população da Europa?', answer: 'Rússia', pool: ['Alemanha', 'França', 'Reino Unido', 'Itália'], hint: 'Maior país do mundo em área' },
  { text: 'Qual é a montanha mais alta da Europa (fora dos Cáucasos)?', answer: 'Monte Branco', pool: ['Monte Etna', 'Pirinéus', 'Alpes Suíços', 'Monte Olympo'], hint: 'Fronteira França-Itália' },
];

export const FACT_GENERATORS = {
  CIENCIA() {
    const [name, sym] = pick(ELEMENTS);
    return factQuestion(`Qual é o símbolo químico do elemento ${name}?`, sym, ELEMENT_SYMS.filter((s) => s !== sym), 'Química', 'CIENCIA');
  },
  ANIMAIS() {
    const cls = pick(Object.keys(ANIMAL_CLASSES));
    const answer = pick(ANIMAL_CLASSES[cls]);
    const pool = ANIMAL_ALL.filter((a) => !ANIMAL_CLASSES[cls].includes(a));
    return factQuestion(`Qual destes animais é um ${cls}?`, answer, pool, `Classe: ${cls}`, 'ANIMAIS');
  },
  'HISTÓRIA'() {
    const [evt, year] = pick(HISTORY);
    return factQuestion(`Em que ano ${evt}?`, year, HISTORY_YEARS.filter((y) => y !== year), 'História', 'HISTÓRIA');
  },
  GASTRONOMIA() {
    const [dish, country] = pick(GASTRONOMY);
    return factQuestion(`De que país é originário o prato ${dish}?`, country, GASTRONOMY_COUNTRIES.filter((c) => c !== country), 'Culinária', 'GASTRONOMIA');
  },
  MUSICA() {
    const type = pick(Object.keys(INSTRUMENT_TYPES));
    const answer = pick(INSTRUMENT_TYPES[type]);
    const pool = INSTRUMENT_ALL.filter((i) => !INSTRUMENT_TYPES[type].includes(i));
    return factQuestion(`Qual destes é um instrumento de ${type}?`, answer, pool, `Família: ${type}`, 'MUSICA');
  },
  TECNOLOGIA() {
    const [thing, ext] = pick(TECH);
    return factQuestion(`Qual é a extensão de ficheiro mais associada a ${thing}?`, ext, TECH_EXT.filter((e) => e !== ext), 'Informática', 'TECNOLOGIA');
  },
  DESPORTO() {
    const [equip, sport] = pick(SPORT);
    return factQuestion(`Em que desporto se utiliza principalmente ${equip}?`, sport, SPORT_NAMES.filter((s) => s !== sport), 'Desporto', 'DESPORTO');
  },
  ARTE() {
    const [work, artist] = pick(ART);
    return factQuestion(`Quem pintou a obra "${work}"?`, artist, ART_ARTISTS.filter((a) => a !== artist), 'Pintura', 'ARTE');
  },
  CINEMA() {
    const [film, director] = pick(FILM);
    return factQuestion(`Quem realizou o filme "${film}"?`, director, FILM_DIRECTORS.filter((d) => d !== director), 'Cinema', 'CINEMA');
  },
  POLITICA() {
    const [org, city] = pick(POLITICS);
    return factQuestion(`Qual é a cidade sede de ${org}?`, city, POLITICS_CITIES.filter((c) => c !== city), 'Organização', 'POLITICA');
  },
  CULTURA_GERAL() {
    const item = pick(CULTURA_GERAL);
    return factQuestion(item.text, item.answer, item.pool.filter((p) => p !== item.answer), item.hint, 'CULTURA_GERAL');
  },
};
