// Deterministic fact-table question generators used by the built-in fallback
// in scripts/daily-questions.mjs. Each generator returns fully verified
// multiple-choice questions: the correct answer always appears among the
// options and `correct_option` is computed (never hardcoded), so the bank can
// keep ALL categories growing even when AI keys and the curated pool are empty.
//
// To keep the bank growing sustainably, every fact is asked in >=2 directions
// (forward + reverse) wherever it makes sense, and the fact tables were
// expanded well beyond the database's current size so the 8h loop keeps
// producing fresh, non-duplicate questions for a long time without manual
// intervention.

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function flip() { return Math.random() < 0.5; }

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

// --- CIENCIA: símbolos químicos (expandido) ----------------------------------
const ELEMENTS = [
  ['Oxigénio', 'O'], ['Hidrogénio', 'H'], ['Carbono', 'C'], ['Azoto', 'N'], ['Ferro', 'Fe'],
  ['Ouro', 'Au'], ['Prata', 'Ag'], ['Sódio', 'Na'], ['Potássio', 'K'], ['Cálcio', 'Ca'],
  ['Cobre', 'Cu'], ['Zinco', 'Zn'], ['Chumbo', 'Pb'], ['Enxofre', 'S'], ['Fósforo', 'P'],
  ['Cloro', 'Cl'], ['Magnésio', 'Mg'], ['Alumínio', 'Al'], ['Silício', 'Si'], ['Mercúrio', 'Hg'],
  ['Hélio', 'He'], ['Lítio', 'Li'], ['Bário', 'Ba'], ['Níquel', 'Ni'], ['Estanho', 'Sn'],
  ['Titânio', 'Ti'], ['Cobalto', 'Co'], ['Manganês', 'Mn'], ['Iodo', 'I'],
  ['Boro', 'B'], ['Flúor', 'F'], ['Bromo', 'Br'], ['Crómio', 'Cr'], ['Césio', 'Cs'],
  ['Tungsténio', 'W'], ['Platina', 'Pt'], ['Urânio', 'U'], ['Zirconio', 'Zr'], ['Arsénio', 'As'],
];
const ELEMENT_SYMS = ELEMENTS.map((e) => e[1]);
const ELEMENT_NAMES = ELEMENTS.map((e) => e[0]);

// --- ANIMAIS: classes (expandido) -------------------------------------------
const ANIMAL_CLASSES = {
  Mamífero: ['Cão', 'Gato', 'Elefante', 'Baleia', 'Cavalo', 'Leão', 'Gorila', 'Urso', 'Girafa', 'Tigre', 'Rato', 'Lobo'],
  Ave: ['Águia', 'Papagaio', 'Pinguim', 'Corvo', 'Falcão', 'Coruja', 'Cisne', 'Pavão'],
  Réptil: ['Cobra', 'Lagarto', 'Tartaruga', 'Crocodilo', 'Iguana', 'Camaleão'],
  Anfíbio: ['Sapo', 'Rã', 'Salamandra', 'Tritão'],
  Peixe: ['Salmão', 'Tubarão', 'Atum', 'Carpa', 'Dourado', 'Bacalhau'],
  Inseto: ['Abelha', 'Formiga', 'Borboleta', 'Mosca', 'Gafanhoto'],
};
const ANIMAL_ALL = Object.values(ANIMAL_CLASSES).flat();

// --- HISTÓRIA: eventos (expandido) ------------------------------------------
const HISTORY = [
  ['a Primeira Guerra Mundial terminou', '1918'], ['a Segunda Guerra Mundial terminou', '1945'],
  ['Pedro Álvares Cabral chegou ao Brasil', '1500'], ['o Muro de Berlim caiu', '1989'],
  ['o Homem pisou a Lua pela primeira vez', '1969'], ['a Revolução Francesa começou', '1789'],
  ['Portugal se tornou independente', '1139'], ['os EUA declararam independência', '1776'],
  ['a imprensa de tipos móveis foi inventada', '1440'], ['o Império Romano do Ocidente caiu', '476'],
  ['a Primeira Guerra Mundial começou', '1914'], ['o Tratado de Tordesilhas foi assinado', '1494'],
  ['a queda do Império Romano do Oriente', '1453'], ['o 11 de Setembro ocorreu em Nova Iorque', '2001'],
  ['a descoberta da América por Colombo', '1492'], ['a Revolução Industrial começou', '1760'],
  ['a fundação da ONU', '1945'], ['a independência de Angola', '1975'],
  ['a Revolução de 25 de Abril em Portugal', '1974'], ['a queda da União Soviética', '1991'],
];
const HISTORY_YEARS = HISTORY.map((h) => h[1]);
const HISTORY_EVENTS = HISTORY.map((h) => h[0]);

// --- GASTRONOMIA: pratos (expandido) ----------------------------------------
const GASTRONOMY = [
  ['Sushi', 'Japão'], ['Pizza', 'Itália'], ['Paella', 'Espanha'], ['Feijoada', 'Brasil'],
  ['Croissant', 'França'], ['Tacos', 'México'], ['Curry', 'Índia'], ['Couscous', 'Marrocos'],
  ['Pasta', 'Itália'], ['Kimchi', 'Coreia do Sul'], ['Ceviche', 'Peru'], ['Waffle', 'Bélgica'],
  ['Bacalhau à Brás', 'Portugal'], ['Hambúrguer', 'Estados Unidos'], ['Risotto', 'Itália'],
  ['Fondue', 'Suíça'], ['Goulash', 'Hungria'], ['Pierogi', 'Polónia'], ['Dim Sum', 'China'],
  ['Falafel', 'Oriente Médio'], ['Pad Thai', 'Tailândia'], ['Moussaka', 'Grécia'],
];
const GASTRONOMY_COUNTRIES = GASTRONOMY.map((g) => g[1]);
const GASTRONOMY_DISHES = GASTRONOMY.map((g) => g[0]);

// --- MUSICA: instrumentos (expandido) ---------------------------------------
const INSTRUMENT_TYPES = {
  cordas: ['Violino', 'Guitarra', 'Piano', 'Harpa', 'Violoncelo', 'Viola', 'Baixo', 'Bandolim'],
  sopro: ['Flauta', 'Saxofone', 'Trompete', 'Clarinete', 'Oboé', 'Fagote', 'Tuba'],
  percussão: ['Bateria', 'Tambor', 'Xilofone', 'Gongo', 'Pandeireta', 'Vibrafone'],
  teclas: ['Piano', 'Órgão', 'Cravo', 'Acordeão'],
};
const INSTRUMENT_ALL = Object.values(INSTRUMENT_TYPES).flat();

// --- TECNOLOGIA: extensões (expandido) --------------------------------------
const TECH = [
  ['um documento de texto simples', '.txt'], ['uma imagem', '.jpg'], ['uma página web', '.html'],
  ['uma folha de cálculo', '.xls'], ['um ficheiro de áudio', '.mp3'], ['um vídeo', '.mp4'],
  ['uma apresentação', '.ppt'], ['uma base de dados', '.db'], ['um documento PDF', '.pdf'],
  ['um ficheiro comprimido', '.zip'], ['um executável', '.exe'], ['um ficheiro de código', '.js'],
  ['uma imagem vetorial', '.svg'], ['um ficheiro de vídeo', '.avi'], ['um documento Word', '.doc'],
];
const TECH_EXT = TECH.map((t) => t[1]);
const TECH_THINGS = TECH.map((t) => t[0]);

// --- DESPORTO: equipamento (expandido) --------------------------------------
const SPORT = [
  ['uma bola de basquetebol', 'Basquetebol'], ['uma raquete', 'Ténis'], ['um puck', 'Hóquei no gelo'],
  ['um taco de golfe', 'Golfe'], ['uma bola de futebol', 'Futebol'], ['uma bola de voleibol', 'Voleibol'],
  ['um remo', 'Canoagem'], ['uma tabela e prancha', 'Surf'], ['uma bicicleta', 'Ciclismo'],
  ['uma espada', 'Esgrima'], ['um arco e flechas', 'Tiro com arco'], ['uma bola de andebol', 'Andebol'],
];
const SPORT_NAMES = SPORT.map((s) => s[1]);
const SPORT_EQUIP = SPORT.map((s) => s[0]);

// --- ARTE: obras (expandido) ------------------------------------------------
const ART = [
  ['Guernica', 'Picasso'], ['A Noite Estrelada', 'Van Gogh'], ['Os Girassóis', 'Van Gogh'],
  ['A Última Ceia', 'Da Vinci'], ['O Grito', 'Munch'], ['As Meninas', 'Velázquez'],
  ['A Persistência da Memória', 'Dalí'], ['O Nascimento de Vénus', 'Botticelli'],
  ['A Criação de Adão', 'Miguel Ângelo'], ['O Beijo', 'Klimt'], ['O Instituto', 'Vermeer'],
  ['A Ronda Noturna', 'Rembrandt'], ['As Bodas de Caná', 'Veronese'], ['Impressão, Nascer do Sol', 'Monet'],
];
const ART_ARTISTS = ART.map((a) => a[1]);
const ART_WORKS = ART.map((a) => a[0]);

// --- CINEMA: filmes (expandido) ---------------------------------------------
const FILM = [
  ['Titanic', 'James Cameron'], ['O Senhor dos Anéis', 'Peter Jackson'], ['Star Wars', 'George Lucas'],
  ['Jurassic Park', 'Steven Spielberg'], ['O Padrinho', 'Francis Ford Coppola'], ['Interestelar', 'Christopher Nolan'],
  ['Avatar', 'James Cameron'], ['E.T.', 'Steven Spielberg'], ['O Resgate do Soldado Ryan', 'Steven Spielberg'],
  ['Gladiador', 'Ridley Scott'], ['A Lista de Schindler', 'Steven Spielberg'], ['Matrix', 'Irmãos Wachowski'],
  ['O Rei Leão', 'Roger Allers'], ['Forrest Gump', 'Robert Zemeckis'], ['Cidade de Deus', 'Fernando Meirelles'],
];
const FILM_DIRECTORS = FILM.map((f) => f[1]);
const FILM_TITLES = FILM.map((f) => f[0]);

// --- POLITICA: organizações (expandido) -------------------------------------
const POLITICS = [
  ['a ONU', 'Nova Iorque'], ['a União Europeia', 'Bruxelas'], ['a NATO', 'Bruxelas'],
  ['a UNESCO', 'Paris'], ['o FMI', 'Washington'], ['a Interpol', 'Lyon'], ['a OMS', 'Genebra'],
  ['a ONU (sede europeia)', 'Genebra'], ['o Banco Mundial', 'Washington'], ['a Anistia Internacional', 'Londres'],
  ['a Cruz Vermelha', 'Genebra'], ['a Corte Penal Internacional', 'Haia'], ['a OMC', 'Genebra'],
];
const POLITICS_CITIES = POLITICS.map((p) => p[1]);
const POLITICS_ORGS = POLITICS.map((p) => p[0]);

// --- CULTURA_GERAL: factos (expandido) --------------------------------------
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
  { text: 'Qual é o maior animal marinho?', answer: 'Baleia-azul', pool: ['Tubarão-baleia', 'Orca', 'Golfinho', 'Baleia-cachalote'], hint: 'Mamífero marinho' },
  { text: 'Qual é o planeta mais quente do Sistema Solar?', answer: 'Vénus', pool: ['Mercúrio', 'Terra', 'Marte', 'Júpiter'], hint: 'Efeito de estufa intenso' },
  { text: 'Qual é o maior país do mundo em área?', answer: 'Rússia', pool: ['Canadá', 'China', 'Estados Unidos', 'Brasil'], hint: 'Maioria na Ásia e Europa' },
  { text: 'Quantos planetas tem o Sistema Solar?', answer: '8', pool: ['7', '9', '10', '6'], hint: 'Desde 2006' },
  { text: 'Qual é o oceano mais profundo do mundo?', answer: 'Oceano Pacífico', pool: ['Oceano Atlântico', 'Oceano Índico', 'Oceano Ártico', 'Oceano Antártico'], hint: 'Fossa das Marianas' },
  { text: 'Qual é a maior floresta tropical do mundo?', answer: 'Amazónia', pool: ['Congo', 'Borneu', 'Sumatra', 'Daintree'], hint: 'América do Sul' },
  { text: 'Qual é a estrela mais próxima da Terra (além do Sol)?', answer: 'Proxima Centauri', pool: ['Alfa Centauri', 'Sirius', 'Betelgeuse', 'Vega'], hint: 'Sistema Alpha Centauri' },
  { text: 'Qual é a moeda oficial do Reino Unido?', answer: 'Libra', pool: ['Euro', 'Dólar', 'Coroa', 'Franco'], hint: 'Não adotou o euro' },
  { text: 'Qual é o menor país do mundo em área?', answer: 'Vaticano', pool: ['Mónaco', 'Nauru', 'Tuvalu', 'San Marino'], hint: 'Em Roma' },
  { text: 'Qual é o rio mais longo da Europa?', answer: 'Rio Volga', pool: ['Rio Danúbio', 'Rio Reno', 'Rio Tamisa', 'Rio Tejo'], hint: 'Rússia' },
  { text: 'Qual é o metal mais precioso e caro do mundo?', answer: 'Ródio', pool: ['Ouro', 'Platina', 'Prata', 'Paládio'], hint: 'Usado em catalisadores' },
  { text: 'Qual é o maior deserto quente do mundo?', answer: 'Sahara', pool: ['Gobi', 'Kalahari', 'Atacama', 'Arábico'], hint: 'África do Norte' },
  { text: 'Qual é o país com mais habitantes de língua portuguesa?', answer: 'Brasil', pool: ['Angola', 'Moçambique', 'Portugal', 'Guiné-Bissau'], hint: 'Maior país lusófono' },
  { text: 'Qual é a unidade básica da vida?', answer: 'Célula', pool: ['Átomo', 'Molécula', 'Tecido', 'Órgão'], hint: 'Biologia' },
  { text: 'Qual é o gás mais abundante na atmosfera terrestre?', answer: 'Azoto', pool: ['Oxigénio', 'Dióxido de carbono', 'Hidrogénio', 'Hélio'], hint: 'Cerca de 78%' },
  { text: 'Qual é a velocidade da luz no vácuo?', answer: '300 000 km/s', pool: ['150 000 km/s', '1 000 000 km/s', '30 000 km/s', '3 000 km/s'], hint: 'Constante c' },
  { text: 'Qual é o elemento mais abundante no universo?', answer: 'Hidrogénio', pool: ['Hélio', 'Oxigénio', 'Carbono', 'Ferro'], hint: 'Estrelas' },
  { text: 'Qual é o órgão responsável por bombear o sangue?', answer: 'Coração', pool: ['Fígado', 'Pulmão', 'Rim', 'Cérebro'], hint: 'Sistema circulatório' },
];

export const FACT_GENERATORS = {
  CIENCIA() {
    const [name, sym] = pick(ELEMENTS);
    if (flip()) {
      return factQuestion(`Qual é o símbolo químico do elemento ${name}?`, sym, ELEMENT_SYMS.filter((s) => s !== sym), 'Química', 'CIENCIA');
    }
    return factQuestion(`Qual é o elemento cujo símbolo químico é ${sym}?`, name, ELEMENT_NAMES.filter((n) => n !== name), `Símbolo ${sym}`, 'CIENCIA');
  },
  ANIMAIS() {
    const cls = pick(Object.keys(ANIMAL_CLASSES));
    const members = ANIMAL_CLASSES[cls];
    const others = ANIMAL_ALL.filter((a) => !members.includes(a));
    if (flip()) {
      const answer = pick(members);
      return factQuestion(`Qual destes animais é um ${cls}?`, answer, others, `Classe: ${cls}`, 'ANIMAIS');
    }
    const answer = pick(others);
    return factQuestion(`Qual destes animais NÃO é um ${cls}?`, answer, members, `Classe: ${cls}`, 'ANIMAIS');
  },
  'HISTÓRIA'() {
    const [evt, year] = pick(HISTORY);
    if (flip()) {
      return factQuestion(`Em que ano ${evt}?`, year, HISTORY_YEARS.filter((y) => y !== year), 'História', 'HISTÓRIA');
    }
    return factQuestion(`Que acontecimento histórico ocorreu no ano ${year}?`, evt, HISTORY_EVENTS.filter((e) => e !== evt), 'História', 'HISTÓRIA');
  },
  GASTRONOMIA() {
    const [dish, country] = pick(GASTRONOMY);
    if (flip()) {
      return factQuestion(`De que país é originário o prato ${dish}?`, country, GASTRONOMY_COUNTRIES.filter((c) => c !== country), 'Culinária', 'GASTRONOMIA');
    }
    return factQuestion(`Qual destes pratos é originário de ${country}?`, dish, GASTRONOMY_DISHES.filter((d) => d !== dish), 'Culinária', 'GASTRONOMY');
  },
  MUSICA() {
    const type = pick(Object.keys(INSTRUMENT_TYPES));
    const members = INSTRUMENT_TYPES[type];
    const others = INSTRUMENT_ALL.filter((i) => !members.includes(i));
    if (flip()) {
      const answer = pick(members);
      return factQuestion(`Qual destes é um instrumento de ${type}?`, answer, others, `Família: ${type}`, 'MUSICA');
    }
    const answer = pick(others);
    return factQuestion(`Qual destes NÃO é um instrumento de ${type}?`, answer, members, `Família: ${type}`, 'MUSICA');
  },
  TECNOLOGIA() {
    const [thing, ext] = pick(TECH);
    if (flip()) {
      return factQuestion(`Qual é a extensão de ficheiro mais associada a ${thing}?`, ext, TECH_EXT.filter((e) => e !== ext), 'Informática', 'TECNOLOGIA');
    }
    return factQuestion(`Que tipo de ficheiro tem habitualmente a extensão ${ext}?`, thing, TECH_THINGS.filter((t) => t !== thing), 'Informática', 'TECNOLOGIA');
  },
  DESPORTO() {
    const [equip, sport] = pick(SPORT);
    if (flip()) {
      return factQuestion(`Em que desporto se utiliza principalmente ${equip}?`, sport, SPORT_NAMES.filter((s) => s !== sport), 'Desporto', 'DESPORTO');
    }
    return factQuestion(`Que material/equipamento se utiliza no desporto ${sport}?`, equip, SPORT_EQUIP.filter((e) => e !== equip), 'Desporto', 'DESPORTO');
  },
  ARTE() {
    const [work, artist] = pick(ART);
    if (flip()) {
      return factQuestion(`Quem pintou a obra "${work}"?`, artist, ART_ARTISTS.filter((a) => a !== artist), 'Pintura', 'ARTE');
    }
    return factQuestion(`Qual destas obras foi pintada por ${artist}?`, work, ART_WORKS.filter((w) => w !== work), 'Pintura', 'ARTE');
  },
  CINEMA() {
    const [film, director] = pick(FILM);
    if (flip()) {
      return factQuestion(`Quem realizou o filme "${film}"?`, director, FILM_DIRECTORS.filter((d) => d !== director), 'Cinema', 'CINEMA');
    }
    return factQuestion(`Qual destes filmes foi realizado por ${director}?`, film, FILM_TITLES.filter((f) => f !== film), 'Cinema', 'CINEMA');
  },
  POLITICA() {
    const [org, city] = pick(POLITICS);
    if (flip()) {
      return factQuestion(`Qual é a cidade sede de ${org}?`, city, POLITICS_CITIES.filter((c) => c !== city), 'Organização', 'POLITICA');
    }
    return factQuestion(`Que organização internacional tem sede em ${city}?`, org, POLITICS_ORGS.filter((o) => o !== org), 'Organização', 'POLITICA');
  },
  CULTURA_GERAL() {
    const item = pick(CULTURA_GERAL);
    return factQuestion(item.text, item.answer, item.pool.filter((p) => p !== item.answer), item.hint, 'CULTURA_GERAL');
  },
};
