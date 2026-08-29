import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const PORTUGAL_QUESTIONS = [
  { text: "Qual é a freguesia mais populosa do concelho de Lisboa?", options: ["Benfica", "Marvila", "Lumiar", "Alvalade"], correct_option: 2, metadata: { hint: "Fica na zona norte de Lisboa" } },
  { text: "A famosa freguesia de Belém, em Lisboa, é mundialmente conhecida por qual doce tradicional?", options: ["Pastéis de Belém", "Travesseiros", "Ovos Moles", "Queijadas"], correct_option: 0, metadata: { hint: "Creme e massa folhada polvilhada com canela" } },
  { text: "Em que concelho se situa a histórica freguesia da Foz do Douro?", options: ["Vila Nova de Gaia", "Matosinhos", "Porto", "Maia"], correct_option: 2, metadata: { hint: "Onde o rio Douro encontra o Oceano Atlântico" } },
  { text: "A que concelho pertence a famosa freguesia de Fátima?", options: ["Leiria", "Ourém", "Tomar", "Batalha"], correct_option: 1, metadata: { hint: "Fica no distrito de Santarém" } },
  { text: "Em que concelho se localiza a freguesia de Cascais e Estoril?", options: ["Sintra", "Oeiras", "Cascais", "Mafra"], correct_option: 2, metadata: { hint: "Concelho da Riviera Portuguesa" } },
  { text: "A freguesia de Colares, famosa pelos seus vinhos em chão de areia, pertence a que concelho?", options: ["Sintra", "Cascais", "Mafra", "Torres Vedras"], correct_option: 0, metadata: { hint: "Concelho da serra e do Palácio da Pena" } },
  { text: "Quantos concelhos (municípios) existem em Portugal Continental e Ilhas?", options: ["278", "308", "320", "350"], correct_option: 1, metadata: { hint: "Mais de 300 concelhos" } },
  { text: "A freguesia de Caniço situa-se em que ilha portuguesa?", options: ["São Miguel", "Terceira", "Madeira", "Porto Santo"], correct_option: 2, metadata: { hint: "Pertence ao concelho de Santa Cruz na Madeira" } },
  { text: "Em que concelho se localiza a freguesia das Furnas, famosa pelas caldeiras e cozido?", options: ["Ponta Delgada", "Povoação", "Ribeira Grande", "Vila Franca do Campo"], correct_option: 1, metadata: { hint: "Ilha de São Miguel, Açores" } },
  { text: "A freguesia de Alfama, conhecida pelas casas de Fado, situa-se em que cidade?", options: ["Coimbra", "Porto", "Lisboa", "Évora"], correct_option: 2, metadata: { hint: "O bairro mais antigo da capital" } },
  { text: "O Parque Nacional da Peneda-Gerês abrange freguesias de quantos distritos?", options: ["1", "2", "3", "4"], correct_option: 2, metadata: { hint: "Viana do Castelo, Braga e Vila Real" } },
  { text: "A freguesia de Sagres, ponto mais a sudoeste da Europa continental, pertence a que concelho?", options: ["Lagos", "Vila do Bispo", "Portimão", "Aljezur"], correct_option: 1, metadata: { hint: "Concelho do barlavento algarvio" } },
  { text: "A freguesia de Guimarães onde se situa o Castelo é associada a qual momento histórico?", options: ["Restauração da Independência", "Fundação de Portugal", "Batalha de Aljubarrota", "Tratado de Tordesilhas"], correct_option: 1, metadata: { hint: "Aqui nasceu Portugal" } },
  { text: "Em que distrito português se situa o concelho de Évora?", options: ["Beja", "Portalegre", "Évora", "Setúbal"], correct_option: 2, metadata: { hint: "O distrito tem o mesmo nome da capital de distrito" } },
  { text: "A freguesia de Costa da Caparica, célebre pelas praias, pertence a que concelho?", options: ["Almada", "Seixal", "Sesimbra", "Setúbal"], correct_option: 0, metadata: { hint: "Concelho onde fica o Cristo Rei" } },
  { text: "A vila histórica de Monsaraz é uma freguesia pertencente a qual concelho alentejano?", options: ["Reguengos de Monsaraz", "Mourão", "Moura", "Redondo"], correct_option: 0, metadata: { hint: "Concelho famoso pelos vinhos do Alentejo" } },
  { text: "Em que concelho fica a freguesia de Ílhavo, sede da fábrica de porcelanas Vista Alegre?", options: ["Aveiro", "Ílhavo", "Águeda", "Vagos"], correct_option: 1, metadata: { hint: "Concelho conhecido pela forte tradição bacalhoeira" } },
  { text: "A freguesia de Pinhão, coração do Alto Douro Vinhateiro, pertence a qual concelho?", options: ["Peso da Régua", "Alijó", "Lamego", "Sabrosa"], correct_option: 1, metadata: { hint: "Distrito de Vila Real" } },
  { text: "Em que concelho se localiza a freguesia de Espinho, famosa pelo casino e praias?", options: ["Espinho", "Santa Maria da Feira", "Ovar", "Vila Nova de Gaia"], correct_option: 0, metadata: { hint: "Distrito de Aveiro" } },
  { text: "A que distrito pertence o concelho de Bragança?", options: ["Vila Real", "Viseu", "Bragança", "Guarda"], correct_option: 2, metadata: { hint: "Região de Trás-os-Montes" } },
  { text: "A freguesia de Batalha acolhe qual famoso monumento português?", options: ["Mosteiro de Alcobaça", "Mosteiro de Santa Maria da Vitória", "Convento de Cristo", "Palácio de Mafra"], correct_option: 1, metadata: { hint: "Construído em honra da Batalha de Aljubarrota" } },
  { text: "Em que concelho fica a freguesia de Nazaré, famosa pelas ondas gigantes da Praia do Norte?", options: ["Alcobaça", "Nazaré", "Caldas da Rainha", "Peniche"], correct_option: 1, metadata: { hint: "Concelho da região Oeste" } },
  { text: "A freguesia do Cabo da Roca, o ponto mais ocidental da Europa continental, fica em que concelho?", options: ["Cascais", "Sintra", "Mafra", "Oeiras"], correct_option: 1, metadata: { hint: "Onde a terra acaba e o mar começa" } },
  { text: "O concelho com maior área territorial em Portugal é:", options: ["Odemira", "Beja", "Alcácer do Sal", "Castelo Branco"], correct_option: 0, metadata: { hint: "Fica no litoral alentejano" } },
  { text: "O concelho com menor área territorial em Portugal Continental é:", options: ["São João da Madeira", "Entroncamento", "Corvo", "Amadora"], correct_option: 0, metadata: { hint: "Tem cerca de 8 km² no distrito de Aveiro" } },
  { text: "A ilha e concelho do Corvo, nos Açores, possui quantas freguesias?", options: ["1", "2", "3", "4"], correct_option: 0, metadata: { hint: "Vila do Corvo é a única freguesia" } },
  { text: "A freguesia de Buçaco (Luso), famosa pela sua mata secular e termas, pertence a que concelho?", options: ["Mealhada", "Anadia", "Cantanhede", "Mortágua"], correct_option: 0, metadata: { hint: "Concelho famoso pelo leitão assado" } },
  { text: "Em que concelho se situa a freguesia de Tróia / Carvalhal?", options: ["Grândola", "Alcácer do Sal", "Santiago do Cacém", "Setúbal"], correct_option: 0, metadata: { hint: "Concelho da canção 'Grândola, Vila Morena'" } },
  { text: "A histórica freguesia de Tomar é famosa por qual monumento templário?", options: ["Convento de Mafra", "Convento de Cristo", "Castelo de Almourol", "Sé de Braga"], correct_option: 1, metadata: { hint: "Sede dos Cavaleiros Templários em Portugal" } },
  { text: "A freguesia de Cedofeita, Santo Ildefonso, Sé e Miragaia fica no centro histórico de que cidade?", options: ["Braga", "Coimbra", "Porto", "Guimarães"], correct_option: 2, metadata: { hint: "União de freguesias da Invicta" } },
  { text: "Em que concelho se situa a freguesia de Sesimbra, com o Castelo e o Cabo Espichel?", options: ["Setúbal", "Palmela", "Sesimbra", "Almada"], correct_option: 2, metadata: { hint: "Concelho de forte tradição piscatória" } },
  { text: "A que concelho pertence a freguesia de Azeitão, famosa pelas tortas e queijos?", options: ["Setúbal", "Palmela", "Sesimbra", "Alcochete"], correct_option: 0, metadata: { hint: "Distrito de Setúbal, junto à Serra da Arrábida" } },
  { text: "A freguesia de Miranda do Douro é célebre pela preservação de qual língua oficial?", options: ["Galego", "Mirandês", "Barranquenho", "Asturiano"], correct_option: 1, metadata: { hint: "Segunda língua oficial de Portugal reconhecida em 1999" } },
  { text: "A freguesia de Barrancos, na raia alentejana, é conhecida pela tradição de:", options: ["Touros de morte", "Bailado clássico", "Canoagem", "Fabricação de gaitas"], correct_option: 0, metadata: { hint: "Tradição taurina secular de Freguesia raiana" } },
  { text: "Em que concelho açoriano se localiza a freguesia das Sete Cidades, com a sua lagoa dupla?", options: ["Lagoa", "Ponta Delgada", "Ribeira Grande", "Nordeste"], correct_option: 1, metadata: { hint: "Capital da ilha de São Miguel" } },
  { text: "A freguesia de Curral das Freiras situa-se no interior montanhoso de qual concelho da Madeira?", options: ["Funchal", "Câmara de Lobos", "Machico", "Santana"], correct_option: 1, metadata: { hint: "Concelho vizinho do Funchal" } },
  { text: "A freguesia de Santana, na ilha da Madeira, é famosa pelas suas:", options: ["Casas típicas triangulares", "Cavernas marinhas", "Plantações de chá", "Dunas de areia"], correct_option: 0, metadata: { hint: "Casinhas tradicionais com teto de colmo" } },
  { text: "A freguesia da Serra da Estrela (Loriga) é carinhosamente conhecida como:", options: ["A Suíça Portuguesa", "A Veneza do Norte", "A Capital do Fado", "O Jardim à Beira-Mar"], correct_option: 0, metadata: { hint: "Vila encravada nos vales glaciares da serra" } },
  { text: "Em que concelho se localiza a freguesia de Vilar Formoso, principal fronteira terrestre com Espanha?", options: ["Almeida", "Guarda", "Figueira de Castelo Rodrigo", "Sabugal"], correct_option: 0, metadata: { hint: "Concelho com praça-forte estrelada" } },
  { text: "A freguesia de Peniche é internacionalmente conhecida como a capital de qual desporto?", options: ["Vela", "Surf", "Remo", "Kitesurf"], correct_option: 1, metadata: { hint: "Praia dos Supertubos e etapa do circuito mundial WSL" } },
  { text: "O santuário do Bom Jesus do Monte fica localizado em que freguesia do concelho de Braga?", options: ["Nogueiró e Tenões", "Gualtar", "Maximinos", "Sé"], correct_option: 0, metadata: { hint: "Património Mundial da UNESCO com escadório monumental" } },
  { text: "Em que concelho se localiza a freguesia de Óbidos, vila medieval muralhada?", options: ["Caldas da Rainha", "Óbidos", "Peniche", "Bombarral"], correct_option: 1, metadata: { hint: "Famosa pela Ginjinha e castelo medieval" } },
  { text: "A freguesia de Marvão, situada a mais de 800 metros de altitude num rochedo, fica em qual distrito?", options: ["Castelo Branco", "Portalegre", "Évora", "Santarém"], correct_option: 1, metadata: { hint: "Alto Alentejo, junto à serra de São Mamede" } },
  { text: "A freguesia de Mértola, no Baixo Alentejo, é conhecida como 'Vila Museu' devido à herança:", options: ["Celta", "Romana e Islâmica", "Fenícia", "Normanda"], correct_option: 1, metadata: { hint: "Tem uma antiga mesquita transformada em igreja" } },
  { text: "O famoso Galo de Barcelos é um símbolo originário de qual concelho do Minho?", options: ["Braga", "Barcelos", "Guimarães", "Fafe"], correct_option: 1, metadata: { hint: "Concelho atravessado pelo rio Cávado" } },
  { text: "A freguesia de Amarante é banhada por qual rio emblemático do Norte?", options: ["Rio Tâmega", "Rio Lima", "Rio Cávado", "Rio Ave"], correct_option: 0, metadata: { hint: "Afluente do rio Douro, terra de São Gonçalo" } },
  { text: "Em que concelho alentejano se localiza a freguesia de Alqueva, que deu nome à maior barragem da Europa Ocidental?", options: ["Portel", "Moura", "Reguengos de Monsaraz", "Vidigueira"], correct_option: 0, metadata: { hint: "Distrito de Évora" } },
  { text: "A freguesia de Ponte de Lima ostenta o título de:", options: ["Vila mais antiga de Portugal", "Cidade mais alta de Portugal", "Capital do Vinho Verde", "Berço da Nação"], correct_option: 0, metadata: { hint: "Recebeu foral de D. Teresa em 1125" } },
  { text: "A cidade mais alta de Portugal Continental (1056m de altitude) é:", options: ["Bragança", "Guarda", "Covilhã", "Viseu"], correct_option: 1, metadata: { hint: "Cidade dos 5 F's: Forte, Farta, Fria, Fiel e Formosa" } },
  { text: "Em que concelho da Região Centro fica a freguesia de Costa Nova, com os seus palheiros listados?", options: ["Aveiro", "Ílhavo", "Ovar", "Estarreja"], correct_option: 1, metadata: { hint: "Concelho de Ílhavo, na Ria de Aveiro" } },
  { text: "A freguesia de Belmonte, na Beira Baixa, é célebre por ser a terra natal de:", options: ["Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães", "Infante D. Henrique"], correct_option: 0, metadata: { hint: "Navegador que comandou a frota que chegou ao Brasil em 1500" } },
  { text: "A freguesia de Vila Viçosa, com o Paço Ducal da Casa de Bragança, pertence a que distrito?", options: ["Évora", "Portalegre", "Beja", "Santarém"], correct_option: 0, metadata: { hint: "Terra dos mármores alentejanos" } },
  { text: "A freguesia de Castelo de Vide, rica em património judaico medieval, fica no distrito de:", options: ["Castelo Branco", "Portalegre", "Guarda", "Évora"], correct_option: 1, metadata: { hint: "Conhecida como a 'Sintra do Alentejo'" } },
  { text: "Em que concelho se localiza a freguesia de Silves, antiga capital do Reino Árabe do Algarve?", options: ["Portimão", "Silves", "Loulé", "Faro"], correct_option: 1, metadata: { hint: "Possui um imponente castelo de grés vermelho" } },
  { text: "A freguesia de Loulé é famosa no Algarve pelo seu mercado de estilo:", options: ["Neomanuelino", "Neoárabe", "Barroco", "Gótico"], correct_option: 1, metadata: { hint: "Mercado municipal com cúpulas avermelhadas" } }
];

async function seedPortugalQuestions() {
  console.log(`Seeding ${PORTUGAL_QUESTIONS.length} Portugal & Freguesias questions via REST...`);

  const payload = PORTUGAL_QUESTIONS.map(q => ({
    text: q.text,
    options: q.options,
    correct_option: q.correct_option,
    category: "PORTUGAL_FREGUESIAS",
    age_rating: 10,
    metadata: q.metadata,
  }));

  const res = await fetch(`${supabaseUrl}/rest/v1/questions`, {
    method: "POST",
    headers: {
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Failed to insert questions:", res.status, errText);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${payload.length} questions into PORTUGAL_FREGUESIAS!`);
}

seedPortugalQuestions();
