import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const newQuestions = [
  // ═══════════════════════════ HISTORIA (64→100, need ~36) ═══════════════════════════
  { text: "Quem foi o primeiro homem a pisar a Lua?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Ameriano, 1969" } },
  { text: "Em que ano começou a Primeira Guerra Mundial?", options: ["1914", "1916", "1918", "1912"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Início do século XX" } },
  { text: "Quem era o líder da Alemanha Nazi durante a Segunda Guerra Mundial?", options: ["Adolf Hitler", "Benito Mussolini", "Joseph Stalin", "Winston Churchill"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Ditador alemão" } },
  { text: "Em que ano caiu o Muro de Berlim?", options: ["1989", "1991", "1985", "1987"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Fim da Guerra Fria" } },
  { text: "Quem pintou a Mona Lisa?", options: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Sandro Botticelli"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Polímata italiano do Renascimento" } },
  { text: "Qual civilização construiu as pirâmides de Gizé?", options: ["Egípcios", "Romanos", "Gregos", "Persas"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Civilização do Norte de África" } },
  { text: "Em que ano foi assinado o Tratado de Versalhes?", options: ["1919", "1918", "1920", "1917"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Fim oficial da Primeira Guerra Mundial" } },
  { text: "Quem foi o primeiro imperador romano?", options: ["Augusto", "Júlio César", "Nero", "Tibério"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Sobrinho-neto de Júlio César" } },
  { text: "Em que ano começou a Revolução Francesa?", options: ["1789", "1776", "1804", "1799"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Queda da Bastilha" } },
  { text: "Quem descobriu a América em 1492?", options: ["Cristóvão Colombo", "Vasco da Gama", "Pedro Álvares Cabral", "Fernão de Magalhães"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Navegador genovês" } },
  { text: "Qual foi o maior império da história?", options: ["Império Britânico", "Império Romano", "Império Mongol", "Império Otomano"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "O império onde o sol nunca se punha" } },
  { text: "Em que ano foi abolido a escravatura no Brasil?", options: ["1888", "1889", "1850", "1900"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Lei Áurea" } },
  { text: "Quem foi Cleópatra?", options: ["Rainha do Egito", "Imperatriz romana", "Deusa grega", "Rainha da Pérsia"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Última faraó do Egito" } },
  { text: "Em que ano começou a Segunda Guerra Mundial?", options: ["1939", "1941", "1937", "1940"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Invasão da Polónia" } },
  { text: "Quem foi Albert Einstein?", options: ["Físico teórico", "Biólogo", "Matemático", "Químico"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Teoria da Relatividade" } },
  { text: "Qual cidade foi destruída por um vulcão em 79 d.C.?", options: ["Pompeia", "Roma", "Atenas", "Cartago"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Cidade romana soterrada" } },
  { text: "Em que ano foi fundada a ONU?", options: ["1945", "1950", "1939", "1948"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Após a Segunda Guerra Mundial" } },
  { text: "Quem foi Napoleão Bonaparte?", options: ["Imperador francês", "Rei espanhol", "Papa", "General britânico"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Conquistou quase toda a Europa" } },
  { text: "Em que ano o homem pisou na Lua pela primeira vez?", options: ["1969", "1965", "1972", "1960"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Missão Apollo 11" } },
  { text: "Qual foi o motivo da Guerra Fria?", options: ["Rivalidade EUA-URSS", "Disputa territorial", "Religião", "Comércio"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Dois blocos ideológicos" } },
  { text: "Quem inventou a prensa de tipos móveis?", options: ["Johannes Gutenberg", "Thomas Edison", "Alexander Graham Bell", "Galileu"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Alemanha, século XV" } },
  { text: "Em que ano começou a Revolução Industrial?", options: ["1760", "1800", "1700", "1850"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Inglaterra, século XVIII" } },
  { text: "Qual país foi o primeiro a conceder o voto às mulheres?", options: ["Nova Zelândia", "Reino Unido", "Estados Unidos", "França"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "1893" } },
  { text: "Quem foi Jesus Cristo para a história ocidental?", options: ["Fundador do Cristianismo", "Rei romano", "Filósofo grego", "Imperador bizantino"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Religião com mais fiéis no mundo" } },
  { text: "Em que ano foi abolido o sistema feudal no Japão?", options: ["1868", "1900", "1800", "1945"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Restauração Meiji" } },
  { text: "Qual batalha marcou o fim do poderio napoleónico?", options: ["Batalha de Waterloo", "Batalha de Austerlitz", "Batalha de Borodino", "Batalha de Trafalgar"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "1815, Bélgica" } },
  { text: "Quem foi Aristóteles?", options: ["Filósofo grego", "Imperador romano", "Pintor renascentista", "Explorador"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Mentor de Alexandre, o Grande" } },
  { text: "Em que ano foi descoberto o Brasil?", options: ["1500", "1492", "1520", "1488"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Pedro Álvares Cabral" } },
  { text: "Qual foi a capital do Império Bizantino?", options: ["Constantinopla", "Roma", "Atenas", "Alexandria"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Hoje chamada Istambul" } },
  { text: "Quem foi o faraó mais famoso do Egito antigo?", options: ["Queops", "Ramesses II", "Tutancâmon", "Cleópatra"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Construiu a Grande Pirâmide" } },
  { text: "Em que ano caiu o Império Romano do Ocidente?", options: ["476", "1453", "800", "395"], correct_option: 0, category: "HISTORIA", age_rating: 16, metadata: { hint: "Fim da Antiguidade Clássica" } },
  { text: "Qual evento marcou o início da Idade Média?", options: ["Queda de Roma", "Descoberta da América", "Revolução Francesa", "Primeira Cruzada"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "476 d.C." } },
  { text: "Quem foi Marco Polo?", options: ["Explorador veneziano", "Pintor italiano", "Papa", "General romano"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Viajou para a China" } },
  { text: "Em que ano terminou a Segunda Guerra Mundial?", options: ["1945", "1944", "1946", "1943"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Bombardeamento de Hiroshima" } },
  { text: "Qual foi o primeiro país a usar a pólvora em guerras?", options: ["China", "Japão", "Índia", "Mongólia"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Dinastia Tang" } },
  { text: "Quem foi Sócrates?", options: ["Filósofo grego", "Imperador romano", "Pintor", "General"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Mentor de Platão" } },
  { text: "Em que ano foi proclamada a República Portuguesa?", options: ["1910", "1926", "1890", "1974"], correct_option: 0, category: "HISTORIA", age_rating: 12, metadata: { hint: "Fim da monarquia" } },
  { text: "Qual é a data do 25 de Abril em Portugal?", options: ["Dia da Liberdade", "Dia da República", "Dia de Portugal", "Dia da Bandeira"], correct_option: 0, category: "HISTORIA", age_rating: 8, metadata: { hint: "Revolução dos Cravos" } },

  // ═══════════════════════════ GEOGRAFIA (70→100, need ~30) ═══════════════════════════
  { text: "Qual é o maior oceano do mundo?", options: ["Pacífico", "Atlântico", "Índico", "Ártico"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Coberta mais de 30% da Terra" } },
  { text: "Em que continente está o Deserto do Saara?", options: ["África", "Ásia", "América do Sul", "Oceania"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Maior deserto quente do mundo" } },
  { text: "Qual é a capital do Brasil?", options: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Construída para ser capital" } },
  { text: "Qual é o rio mais longo do mundo?", options: ["Nilo", "Amazonas", "Mississípi", "Yangtze"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Passa pelo Egito" } },
  { text: "Em que país fica Machu Picchu?", options: ["Peru", "Bolívia", "Colômbia", "Equador"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Cidade inca nas montanhas" } },
  { text: "Qual é o maior país do mundo em área?", options: ["Rússia", "Canadá", "China", "Estados Unidos"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Estendida pela Europa e Ásia" } },
  { text: "Qual é o ponto mais alto do mundo?", options: ["Monte Everest", "K2", "Kangchenjunga", "Monte Kilimanjaro"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "8.849 metros" } },
  { text: "Em que continente está a Austrália?", options: ["Oceania", "Ásia", "Europa", "América"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Menor continente" } },
  { text: "Qual é a capital da França?", options: ["Paris", "Lyon", "Marselha", "Toulouse"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Cidade da Torre Eiffel" } },
  { text: "Qual é o menor país do mundo?", options: ["Vaticano", "Mônaco", "San Marino", "Liechtenstein"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Dentro de Roma" } },
  { text: "Qual oceano banha a costa leste do Brasil?", options: ["Atlântico", "Pacífico", "Índico", "Ártico"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Oceano que separa América de África" } },
  { text: "Em que país fica a Torre Eiffel?", options: ["França", "Espanha", "Itália", "Alemanha"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "País da baguette" } },
  { text: "Qual é o maior deserto do mundo?", options: ["Saara", "Gobi", "Kalahari", "Atacama"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Norte de África" } },
  { text: "Em que continente fica a China?", options: ["Ásia", "Europa", "África", "Oceania"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Maior população do mundo" } },
  { text: "Qual é a capital de Portugal?", options: ["Lisboa", "Porto", "Coimbra", "Braga"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Cidade das sete colinas" } },
  { text: "Qual é a montanha mais alta de África?", options: ["Kilimanjaro", "Monte Branco", "Atlas", "Rwenzori"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "5.895 metros, Tanzânia" } },
  { text: "Em que país fica o Taj Mahal?", options: ["Índia", "Paquistão", "Nepal", "Bangladesh"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Monumento de mármore branco" } },
  { text: "Qual é o maior lago do mundo?", options: ["Caspial", "Superior", "Victoria", "Baikal"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Entre Europa e Ásia" } },
  { text: "Qual país tem formato de bota?", options: ["Itália", "Grécia", "Chile", "Tailândia"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Península no Mediterrâneo" } },
  { text: "Em que continente fica o Amazonas?", options: ["América do Sul", "África", "Ásia", "América do Norte"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Maior floresta tropical" } },
  { text: "Qual é a capital da Espanha?", options: ["Madrid", "Barcelona", "Sevilha", "Valência"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Cidade do Real Madrid" } },
  { text: "Qual rio atravessa Londres?", options: ["Tamisa", "Sena", "Danúbio", "Reno"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Passa pelo Big Ben" } },
  { text: "Em que país fica a Grande Muralha?", options: ["China", "Japão", "Mongólia", "Coreia do Norte"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Visível do espaço (quase)" } },
  { text: "Qual é o menor oceano do mundo?", options: ["Ártico", "Índico", "Atlântico", "Pacífico"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Ao redor do Polo Norte" } },
  { text: "Em que continente fica o Canadá?", options: ["América do Norte", "Europa", "Ásia", "Oceania"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Acima dos Estados Unidos" } },
  { text: "Qual é a capital do Japão?", options: ["Tóquio", "Osaka", "Kyoto", "Yokohama"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Maior área metropolitana do mundo" } },
  { text: "Qual é o maior arquipélago do mundo?", options: ["Indonésia", "Filipinas", "Japão", "Malásia"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Mais de 17.000 ilhas" } },
  { text: "Em que país fica a Estátua da Liberdade?", options: ["Estados Unidos", "França", "Reino Unido", "Itália"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Nova Iorque" } },
  { text: "Qual é o maior país da África?", options: ["Argélia", "Nigéria", "Sudão", "República Democrática do Congo"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Norte de África" } },
  { text: "Em que continente fica a Islândia?", options: ["Europa", "América do Norte", "Ásia", "Oceania"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Ilha no Atlântico Norte" } },

  // ═══════════════════════════ MATEMATICA (69→100, need ~31) ═══════════════════════════
  { text: "Quanto é 12 × 12?", options: ["144", "124", "132", "148"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Dúzia de dúzias" } },
  { text: "Qual é a raiz quadrada de 81?", options: ["9", "8", "7", "10"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "9 × 9" } },
  { text: "Quanto é 15% de 200?", options: ["30", "25", "35", "20"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "10% + 5%" } },
  { text: "Qual é o valor de π (pi) arredondado a 2 casas decimais?", options: ["3,14", "3,41", "3,12", "3,16"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Razão entre circunferência e diâmetro" } },
  { text: "Quanto é 7³?", options: ["343", "49", "21", "243"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "7 × 7 × 7" } },
  { text: "Qual é o próximo número: 2, 6, 12, 20, 30, ...?", options: ["42", "36", "40", "44"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Diferenças crescentes" } },
  { text: "Quanto é √144?", options: ["12", "14", "11", "13"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "12 × 12 = 144" } },
  { text: "Qual é o dobro de 25?", options: ["50", "45", "55", "60"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "25 + 25" } },
  { text: "Quanto é 100 ÷ 4?", options: ["25", "30", "20", "15"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Metade de metade de 100" } },
  { text: "Qual é a área de um quadrado com lado 8 cm?", options: ["64 cm²", "32 cm²", "16 cm²", "72 cm²"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Lado × Lado" } },
  { text: "Quanto é 3 × 4 + 5 × 2?", options: ["22", "20", "24", "18"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Ordem das operações" } },
  { text: "Qual é o dobro de 17?", options: ["34", "32", "36", "27"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "17 + 17" } },
  { text: "Quanto é 25²?", options: ["625", "525", "600", "650"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "25 × 25" } },
  { text: "Qual é o perímetro de um retângulo com lados 5 e 3?", options: ["16", "15", "8", "30"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "2 × (comprimento + largura)" } },
  { text: "Quanto é 1000 ÷ 8?", options: ["125", "100", "150", "120"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Metade de metade de metade de 1000" } },
  { text: "Qual é o fatorial de 5?", options: ["120", "60", "24", "720"], correct_option: 0, category: "MATEMATICA", age_rating: 16, metadata: { hint: "5! = 5 × 4 × 3 × 2 × 1" } },
  { text: "Quanto é 2³ + 3²?", options: ["17", "15", "12", "20"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "8 + 9" } },
  { text: "Qual é a área de um triângulo com base 10 e altura 6?", options: ["30", "60", "16", "36"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "(base × altura) ÷ 2" } },
  { text: "Quanto é 1/2 + 1/3?", options: ["5/6", "2/5", "1/6", "2/6"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: " MMC de 2 e 3 é 6" } },
  { text: "Qual é o MDC de 12 e 18?", options: ["6", "3", "12", "9"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Maior divisor comum" } },
  { text: "Quanto é 10² - 5²?", options: ["75", "50", "100", "25"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "100 - 25" } },
  { text: "Qual é o MMC de 4 e 6?", options: ["12", "24", "8", "18"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Mínimo múltiplo comum" } },
  { text: "Quanto é 0,75 × 8?", options: ["6", "5,5", "6,5", "7"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "3/4 de 8" } },
  { text: "Qual é o triplo de 14?", options: ["42", "36", "48", "28"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "14 × 3" } },
  { text: "Quanto é 2⁵?", options: ["32", "64", "16", "25"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "2 × 2 × 2 × 2 × 2" } },
  { text: "Qual é a hipotenusa de um triângulo retângulo com catetos 3 e 4?", options: ["5", "7", "6", "4"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Teorema de Pitágoras" } },
  { text: "Quanto é 3/4 de 100?", options: ["75", "80", "70", "60"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "75% de 100" } },
  { text: "Qual é o próximo número primo após 7?", options: ["11", "9", "13", "10"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Não é par" } },
  { text: "Quanto é 9 × 9 + 1?", options: ["82", "81", "83", "80"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "81 + 1" } },
  { text: "Qual é o diâmetro de um círculo com raio 5 cm?", options: ["10 cm", "5 cm", "15 cm", "25 cm"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Dobro do raio" } },
  { text: "Quanto é 144 ÷ 12?", options: ["12", "14", "11", "13"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Inverso de 12 × 12" } },

  // ═══════════════════════════ DESPORTO (67→100, need ~33) ═══════════════════════════
  { text: "Quantos jogadores tem uma equipa de futebol em campo?", options: ["11", "10", "12", "9"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "包括Guarda-redes" } },
  { text: "Em que país se realiza a Fórmula 1 do Grande Prémio de Mônaco?", options: ["Mônaco", "França", "Itália", "Espanha"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Cidade-estado no Mediterrâneo" } },
  { text: "Quantos sets são necessários para ganhar no vôleibol masculino?", options: ["3", "2", "4", "5"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Melhor de 5" } },
  { text: "Em que desporto se usa um taco e uma bola pequena branca?", options: ["Golfe", "Polo", "Críquete", "Hóquei"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "18 buracos" } },
  { text: "Qual é a distância de uma maratona?", options: ["42,195 km", "40 km", "45 km", "50 km"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "De Atenas a Maratona (original)" } },
  { text: "Em que país se inventou o judo?", options: ["Japão", "Coreia do Sul", "China", "Rússia"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Arte marcial oriental" } },
  { text: "Quantos jogadores tem uma equipa de basquetebol em campo?", options: ["5", "6", "4", "7"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "5 por equipa" } },
  { text: "Em que país se realiza o Torneio de Roland Garros?", options: ["França", "Inglaterra", "Espanha", "Itália"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Torneio de ténis em terra batida" } },
  { text: "Quantos pontos vale um touchdown no futebol americano?", options: ["6", "7", "3", "5"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Mais a conversão" } },
  { text: "Em que desporto se compete com espada?", options: ["Esgrima", "Karatê", "Boxe", "Judo"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Desporto olímpico desde 1896" } },
  { text: "Qual é o recorde do mundo dos 100 metros rasos (homem)?", options: ["9,58s", "9,69s", "9,72s", "9,80s"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Usain Bolt, 2009" } },
  { text: "Em que desporto se usa um pucks?", options: ["Hóquei no gelo", "Pólo", "Críquete", "Rugby"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Gelo e stick" } },
  { text: "Quantos jogadores tem uma equipa de handebol em campo?", options: ["7", "6", "8", "5"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "6 jogadores + guarda-redes" } },
  { text: "Em que país se realiza o Open da Austrália de ténis?", options: ["Austrália", "Nova Zelândia", "Índia", "Japão"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Melbourne" } },
  { text: "Qual é o tamanho de um campo de futebol (comprimento)?", options: ["90-120 metros", "80-100 metros", "100-130 metros", "70-90 metros"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Varia conforme o estádio" } },
  { text: "Em que desporto se compete nadando?", options: ["Natação", "Polo aquático", "Saltos ornamentais", "Surf"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "4 estilos principais" } },
  { text: "Quantos rounds tem uma luta de boxe profissional?", options: ["12", "10", "15", "8"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Campeonatos do mundo" } },
  { text: "Em que país se originou o cricket?", options: ["Inglaterra", "Índia", "Austrália", "África do Sul"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Desporto nacional britânico" } },
  { text: "Qual é o nome do troféu da Copa do Mundo de Futebol?", options: ["Troféu FIFA", "Troféu Jules Rimet", "Troféumundial", "Copa Ouro"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Em ouro maciço" } },
  { text: "Em que desporto se usa um arco e flecha?", options: ["Tiro com arco", "Pentatlo", "Hóquei", "Pólo"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Desporto olímpico" } },
  { text: "Quantos jogadores tem uma equipa de rugby em campo?", options: ["15", "11", "13", "14"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Rugby union" } },
  { text: "Em que país se realiza o Tour de France?", options: ["França", "Bélgica", "Itália", "Espanha"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Corrida ciclista parisiense" } },
  { text: "Qual é o deporte mais popular do mundo?", options: ["Futebol", "Críquete", "Basquetebol", "Ténis"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Mais de 4 bilhões de fãs" } },
  { text: "Em que desporto se compete com uma raquete e uma peteca?", options: ["Badmínton", "Squash", "Ténis", "Pádel"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "O bicho voa" } },
  { text: "Quantos jogadores tem uma equipa de vôlei de praia?", options: ["2", "3", "4", "6"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Metade do vôleibol de quadra" } },
  { text: "Em que país se originou o karatê?", options: ["Japão", "Coreia do Sul", "China", "Tailândia"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Okinawa" } },
  { text: "Qual é o tempo mínimo para uma prova de 100 metros rasos ser considerada de elite (homem)?", options: ["Menos de 10 segundos", "Menos de 9,5 segundos", "Menos de 11 segundos", "Menos de 10,5 segundos"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Barreira dos 10 segundos" } },
  { text: "Em que desporto se usa um tabuleiro com 64 casas?", options: ["Xadrez", "Damas", "Monopoly", "Ludo"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Rei, rainha, bispo, cavalo" } },
  { text: "Quantos jogadores tem uma equipa de hóquei em campo?", options: ["11", "10", "12", "9"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Como o futebol" } },
  { text: "Em que país se realiza o Grand Slam de ténis de Wimbledon?", options: ["Inglaterra", "França", "Espanha", "Itália"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Londres" } },
  { text: "Qual é o peso de uma bola de basquetebol?", options: ["600-650g", "500-550g", "700-750g", "450-500g"], correct_option: 0, category: "DESPORTO", age_rating: 16, metadata: { hint: "Tamanho 7 (masculino)" } },
  { text: "Em que desporto se compete em duplas com raquetes?", options: ["Ténis de mesa", "Squash", "Badmínton", "Todos anteriores"], correct_option: 0, category: "DESPORTO", age_rating: 8, metadata: { hint: "Pode ser individual ou duplas" } },
  { text: "Quantos jogadores tem uma equipa de polo em campo?", options: ["4", "5", "6", "3"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Cavalo e taco" } },
  { text: "Em que país se realizou a primeira Copa do Mundo de Futebol?", options: ["Uruguai", "Brasil", "Itália", "França"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "1930" } },

  // ═══════════════════════════ CAPITAIS_DO_MUNDO (66→100, need ~34) ═══════════════════════════
  { text: "Qual é a capital da Alemanha?", options: ["Berlim", "Munique", "Hamburgo", "Frankfurt"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Muro de Berlim" } },
  { text: "Qual é a capital da Itália?", options: ["Roma", "Milão", "Nápoles", "Turim"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Coliseu" } },
  { text: "Qual é a capital da Rússia?", options: ["Moscovo", "São Petersburgo", "Kiev", "Varsóvia"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Maior país do mundo" } },
  { text: "Qual é a capital do Egito?", options: ["Cairo", "Alexandria", "Luxor", "Assuão"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Pirâmides de Gizé" } },
  { text: "Qual é a capital do Canadá?", options: ["Ottawa", "Toronto", "Vancouver", "Montreal"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Não é Toronto" } },
  { text: "Qual é a capital da Austrália?", options: ["Camberra", "Sydney", "Melbourne", "Brisbane"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Não é Sydney" } },
  { text: "Qual é a capital da Índia?", options: ["Nova Deli", "Bombaim", "Calcutá", "Bangalore"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Taj Mahal fica na Índia" } },
  { text: "Qual é a capital do México?", options: ["Cidade do México", "Cancún", "Guadalajara", "Monterrey"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Maior cidade da América Latina" } },
  { text: "Qual é a capital da Argentina?", options: ["Buenos Aires", "Córdoba", "Rosário", "Mendoza"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Tango" } },
  { text: "Qual é a capital da Turquia?", options: ["Ancara", "Istambul", "Izmir", "Antália"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Não é Istambul" } },
  { text: "Qual é a capital do Japão?", options: ["Tóquio", "Osaka", "Kyoto", "Yokohama"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Vulcão Fuji" } },
  { text: "Qual é a capital da Coreia do Sul?", options: ["Seul", "Busan", "Incheon", "Daegu"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "K-pop" } },
  { text: "Qual é a capital da Grécia?", options: ["Atenas", "Salónica", "Sparta", "Rodes"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Partenão" } },
  { text: "Qual é a capital da Tailândia?", options: ["Bangkok", "Chiang Mai", "Pattaya", "Phuket"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Templos dourados" } },
  { text: "Qual é a capital de Marrocos?", options: ["Rabat", "Casablanca", "Marrakech", "Fez"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Não é Casablanca" } },
  { text: "Qual é a capital da Colômbia?", options: ["Bogotá", "Medellín", "Cali", "Barranquilla"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "América do Sul" } },
  { text: "Qual é a capital do Chile?", options: ["Santiago", "Valparaíso", "Concepción", "Antofagasta"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Estreito de Magalhães" } },
  { text: "Qual é a capital da Noruega?", options: ["Oslo", "Bergen", "Trondheim", "Stavanger"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Fiorde" } },
  { text: "Qual é a capital da Suécia?", options: ["Estocolmo", "Gotemburgo", "Malmö", "Uppsala"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "IKEA" } },
  { text: "Qual é a capital da Finlândia?", options: ["Helsínquia", "Tampere", "Turku", "Oulu"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Terra do Pai Natal" } },
  { text: "Qual é a capital da Dinamarca?", options: ["Copenhaga", "Aarhus", "Odense", "Elsinore"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Pequena Sereia" } },
  { text: "Qual é a capital da Polónia?", options: ["Varsóvia", "Cracóvia", "Gdansk", "Wroclaw"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Europa Central" } },
  { text: "Qual é a capital da Áustria?", options: ["Viena", "Salzburgo", "Innsbruck", "Graz"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Valsa" } },
  { text: "Qual é a capital da Bélgica?", options: ["Bruxelas", "Bruges", "Gante", "Antuérpia"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Sede da UE" } },
  { text: "Qual é a capital dos Países Baixos?", options: ["Amsterdã", "Rotão Haia", "Utrecht", "Eindhoven"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Tulipas e moinhos" } },
  { text: "Qual é a capital de Portugal?", options: ["Lisboa", "Porto", "Coimbra", "Faro"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Sete colinas" } },
  { text: "Qual é a capital da Suíça?", options: ["Berna", "Zurique", "Genebra", "Basileia"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Neutro e neutro" } },
  { text: "Qual é a capital da Hungria?", options: ["Budapeste", "Debrecen", "Szeged", "Pécs"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Danúbio" } },
  { text: "Qual é a capital da Irlanda?", options: ["Dublin", "Cork", "Galway", "Limerick"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Cerveja e shamrocks" } },
  { text: "Qual é a capital de Moçambique?", options: ["Maputo", "Beira", "Nampula", "Quelimane"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "País lusófono em África" } },
  { text: "Qual é a capital de Angola?", options: ["Luanda", "Benguela", "Huambo", "Lobito"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "País lusófono em África" } },
  { text: "Qual é a capital do Brasil?", options: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Construída para ser capital" } },
  { text: "Qual é a capital da Venezuela?", options: ["Caracas", "Valência", "Maracaibo", "Barquisimeto"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "América do Sul" } },
  { text: "Qual é a capital do Peru?", options: ["Lima", "Cusco", "Arequipa", "Trujillo"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Machu Picchu" } },
  { text: "Qual é a capital do Equador?", options: ["Quito", "Guayaquil", "Cuenca", "Ambato"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Linha do Equador" } },

  // ═══════════════════════════ POLITICA (94→100, need ~6) ═══════════════════════════
  { text: "Qual é o órgão supremo de poder em Portugal?", options: ["Assembleia da República", "Conselho de Estado", "Tribunal Constitucional", "Presidência da República"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "Parlamento português" } },
  { text: "Quantos deputados tem a Assembleia da República?", options: ["230", "200", "250", "260"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "226 + 4 da Madeira e Açores" } },
  { text: "Qual é a função do Presidente da República em Portugal?", options: ["Representar a República e fiscalizar o Governo", "Governar o país diretamente", "Aprovar leis sem revisão", "Escolher o Primeiro-Ministro sozinho"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "Funções de soberania" } },
  { text: "Qual partido político foi fundado por António de Oliveira Salazar?", options: ["União Nacional", "PSD", "PS", "CDS-PP"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "Estado Novo" } },
  { text: "Em que ano foi restaurada a democracia em Portugal?", options: ["1974", "1976", "1982", "1975"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "25 de Abril" } },
  { text: "Qual é o partido político mais antigo de Portugal?", options: ["PSD", "PCP", "PS", "CDS-PP"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "Fundado em 1974" } },

  // ═══════════════════════════ CINEMA (95→100, need ~5) ═══════════════════════════
  { text: "Qual filme ganhou o Oscar de Melhor Filme em 1994?", options: ["Forrest Gump", "Pulp Fiction", "O Cliente", "Quatro Casamentos e um Funeral"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "\"A vida é como uma caixa de chocolates\"" } },
  { text: "Quem dirigiu 'A Lista de Schindler'?", options: ["Steven Spielberg", "Martin Scorsese", "James Cameron", "Quentin Tarantino"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Diretor de E.T. e Jurassic Park" } },
  { text: "Qual é o filme com maior bilheteria de sempre (ajustado à inflação)?", options: ["Avatar", "Titanic", "Guerra das Estrelas", "Avengers: Endgame"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "James Cameron, 2009" } },
  { text: "Em que filme aparece a frase 'Eu sou teu pai'?", options: ["Guerra das Estrelas", "O Senhor dos Anéis", "Matrix", "Star Trek"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "Darth Vader" } },
  { text: "Qual ator interpretou Jack Sparrow em 'Piratas do Caribe'?", options: ["Johnny Depp", "Orlando Bloom", "Brad Pitt", "Tom Cruise"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "Capitão excêntrico" } },

  // ═══════════════════════════ GASTRONOMIA (95→100, need ~5) ═══════════════════════════
  { text: "Qual é o ingrediente principal do guacamole?", options: ["Abacate", "Tomate", "Cebola", "Limão"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Fruta verde" } },
  { text: "De que país é originário o sushi?", options: ["Japão", "China", "Coreia", "Tailândia"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Peixe cru com arroz" } },
  { text: "Qual é o molho mais usado na cozinha italiana?", options: ["Molho de tomate", "Molho branco", "Molho de soja", "Molho bechamel"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Vermelho" } },
  { text: "De que país é originário o croissant?", options: ["França", "Áustria", "Bélgica", "Suíça"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Pastelaria francesa" } },
  { text: "Qual fruta é usada para fazer o chimichanga?", options: ["Nenhuma - é um prato de carne", "Banana", "Manga", "Abacaxi"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Torta frita mexicana" } },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// INSERT INTO SUPABASE
// ═══════════════════════════════════════════════════════════════════════════════════
async function insertBatch() {
  // Check for duplicates
  const { data: existing } = await supabase.from('questions').select('text, category');
  const existingSet = new Set((existing || []).map(q => `${q.text}|${q.category}`));
  const unique = newQuestions.filter(q => !existingSet.has(`${q.text}|${q.category}`));

  console.log(`📝 Total: ${newQuestions.length} | Novas: ${unique.length} | Duplicadas: ${newQuestions.length - unique.length}`);

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let totalInserted = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE).map(q => ({
      text: q.text,
      image_url: q.image_url || null,
      options: q.options,
      correct_option: q.correct_option,
      category: q.category,
      age_rating: q.age_rating,
      metadata: q.metadata
    }));

    const { error } = await supabase.from('questions').insert(batch);
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} perguntas inseridas`);
      totalInserted += batch.length;
    }
  }

  console.log(`🎉 Total inserido: ${totalInserted}/${unique.length}`);

  // Get final distribution
  const { data: all } = await supabase.from('questions').select('category').range(0, 9999);
  const cats = {};
  for (const q of all || []) cats[q.category] = (cats[q.category] || 0) + 1;

  console.log('\n📊 Distribuição final:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(count.toString().padStart(3) + ' | ' + bar + ' ' + cat);
  });
}

insertBatch().catch(console.error);
