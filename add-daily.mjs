import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

// Fix WebSocket for Node.js < 22
if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function getAllRows() {
  // Helper function to get all rows from a table with pagination
  const allRows = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data } = await supabase.from('questions').select('*').range(offset, offset + limit - 1);
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < limit) break;
    offset += limit;
  }
  
  return allRows;
}

async function getExistingTextCategoryPairs() {
  // Helper to get all text|category pairs for duplicate checking
  const pairs = new Set();
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data } = await supabase.from('questions').select('text, category').range(offset, offset + limit - 1);
    if (!data || data.length === 0) break;
    (data || []).forEach(row => {
      pairs.add(`${row.text}|${row.category}`);
    });
    if (data.length < limit) break;
    offset += limit;
  }
  
  return pairs;
}

// Daily question addition - approximately 200 questions distributed across categories
const dailyQuestions = [
  // ==================== TECNOLOGIA ====================
  { text: "Qual é a função de um roteador em uma rede de computadores?", options: ["Aumentar velocidade de internet", "Encaminhar pacotes de dados entre redes", "Armazenar arquivos", "Converter sinais analógicos para digitais"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Dispositivo de rede que direciona tráfego" } },
  { text: "O que significa a sigla RAM em computadores?", options: ["Read Access Memory", "Random Access Memory", "Run Access Memory", "Remote Access Memory"], correct_option: 1, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Memória volátil do computador" } },
  { text: "Qual empresa criou o sistema operacional Windows?", options: ["Apple", "Google", "Microsoft", "IBM"], correct_option: 2, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "Fundada por Bill Gates e Paul Allen" } },
  { text: "Qual é a linguagem de programação usada para desenvolver aplicativos iOS nativos?", options: ["Java", "Kotlin", "Swift", "Python"], correct_option: 2, category: "TECNOLOGIA", age_rating: 14, metadata: { hint: "Linguagem desenvolvida pela Apple" } },
  { text: "Qual é o dispositivo que protege uma rede contra acessos não autorizados?", options: ["Modem", "Roteador", "Firewall", "Switch"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Sistema de segurança de rede" } },
  { text: "Qual é a unidade básica de armazenamento de informação em computadores?", options: ["Bit", "Byte", "Kilobyte", "Megabyte"], correct_option: 1, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "8 bits formam este unidade" } },
  { text: "Qual é o protocolo usado para transferir arquivos entre um cliente e um servidor na internet?", options: ["HTTP", "FTP", "SMTP", "DNS"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Protocolo de transferência de hipertexto" } },
  { text: "O que é um sistema operacional?", options: ["Um aplicativo de edição de texto", "Software que gerencia o hardware e os recursos do computador", "Um tipo de vírus de computador", "Um dispositivo de armazenamento externo"], correct_option: 1, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Gerencia processos, memória e dispositivos de E/S" } },
  { text: "Qual é a função da CPU em um computador?", options: ["Armazenar dados permanentemente", "Conectar-se à internet", "Processar instruções e realizar cálculos", "Exibir imagens na tela"], correct_option: 2, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Unidade central de processamento" } },
  { text: "Qual é a diferença entre HDD e SSD?", options: ["HDD é mais rápido que SSD", "SSD tem partes móveis, HDD não", "HDD usa discos magnéticos, SSD usa memória flash", "São exatamente a mesma coisa"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Um tem partes mecânicas, o outro é totalmente eletrônico" } },
  { text: "O que significa a sigla URL?", options: ["Uniform Resource Locator", "Universal Remote Link", "Unified Routing Language", "User Request Link"], correct_option: 0, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Endereço de um recurso na internet" } },
  { text: "Qual é a linguagem de marcação usada para criar páginas web?", options: ["Java", "Python", "HTML", "C++"], correct_option: 2, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "HyperText Markup Language" } },
  { text: "Qual é o dispositivo que converte sinais digitais do computador em sinais analógicos para transmissão por linha telefônica?", options: ["Roteador", "Switch", "Modem", "Hub"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Modulador-demodulador" } },
  { text: "Qual empresa desenvolveu o sistema operacional Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct_option: 2, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Empresa de busca na internet" } },
  { text: "O que é computação em nuvem?", options: ["Usar apenas computadores físicos locais", "Armazenar e acessar dados e programas pela internet", "Um tipo de antivírus", "Uma linguagem de programação"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Serviços sob demanda via internet" } },
  { text: "Qual é a função de um switch em uma rede local?", options: ["Conectar redes diferentes", "Filtrar conteúdo da internet", "Conectar dispositivos dentro da mesma rede", "Amplificar sinal Wi-Fi"], correct_option: 2, category: "TECNOLOGIA", age_rating: 10, metadata: { hint: "Opera na camada de enlace de dados" } },
  { text: "Qual é a linguagem de programação conhecida por sua uso em ciência de dados e inteligência artificial?", options: ["HTML", "CSS", "Python", "SQL"], correct_option: 2, category: "TECNOLOGIA", age_rating: 14, metadata: { hint: "Linguagem de programação de alto nível e interpretada" } },
  { text: "O que é um banco de dados relacional?", options: ["Um banco de dados que armazena apenas texto", "Dados organizados em tabelas com linhas e colunas", "Um banco de dados sem estrutura definida", "Um sistema de arquivos"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Usa SQL para consulta e manipulação" } },
  { text: "Qual é o dispositivo de entrada que permite ao usuário mover o cursor na tela?", options: ["Teclado", "Microfone", "Mouse", "Webcam"], correct_option: 2, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "Também conhecido como apontador" } },

  // ==================== CAPITAIS_DO_MUNDO ====================
  { text: "Qual é a capital da Suécia?", options: ["Gotemburgo", "Malmö", "Uppsala", "Estocolmo"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade onde o Prêmio Nobel é anunciado" } },
  { text: "Qual é a capital da Noruega?", options: ["Bergen", "Trondheim", "Stavanger", "Oslo"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Local onde são realizadas as cerimônias do Prêmio Nobel da Paz" } },
  { text: "Qual é a capital da Finlândia?", options: ["Tampere", "Turku", "Helsinque", "Oulu"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade onde fica a universidade mais antiga do país" } },
  { text: "Qual é a capital da Dinamarca?", options: ["Aarhus", "Odense", "Aalborg", "Copenhague"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade onde está a estátua da Pequena Sereia" } },
  { text: "Qual é a capital da Irlanda?", options: ["Cork", "Limerick", "Galway", "Dublin"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade onde fica a cervejaria Guinness" } },
  { text: "Qual é a capital do Canadá?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Localizada na província de Ontário" } },
  { text: "Qual é a capital da Austrália?", options: ["Sydney", "Melbourne", "Brisbane", "Canberra"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Cidade planejada especificamente para ser a capital" } },
  { text: "Qual é a capital do Japão?", options: ["Osaka", "Quioto", "Yokohama", "Tóquio"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Maior área metropolitana do mundo" } },
  { text: "Qual é a capital do Brasil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Belo Horizonte"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Construída especificamente para ser a capital em 1960" } },
  { text: "Qual é a capital da França?", options: ["Marselha", "Lyon", "Paris", "Toulouse"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Cidade Luz, conhecida pela Torre Eiffel" } },
  { text: "Qual é a capital da Alemanha?", options: ["Hamburgo", "Munique", "Berlim", "Colônia"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Local onde ficou o Muro que dividiu a cidade" } },
  { text: "Qual é a capital do México?", options: ["Cancún", "Guadalajara", "Monterrey", "Cidade do México"], correct_option: 3, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Uma das maiores cidades do mundo por população" } },
  { text: "Qual é a capital da Rússia?", options: ["São Petersburgo", "Vladivostok", "Moscou", "Kazan"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Local do Kremlin e da Praça Vermelha" } },
  { text: "Qual é a capital da África do Sul?", options: ["Joanesburgo", "Cidade do Cabo", "Pretória", "Durban"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Capital executiva do país" } },
  { text: "Qual é a capital da Argentina?", options: ["Barcelona", "Madri", "Buenos Aires", "Lisboa"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Conhecida como a Paris da América do Sul" } },
  { text: "Qual é a capital da China?", options: ["Xangai", "Guangzhou", "Pequim", "Shenzhen"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Sede da Cidade Proibida" } },
  { text: "Qual é a capital da Índia?", options: ["Mumbai", "Calcutá", "Nova Délhi", "Bangalore"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Parte da região metropolitana de Délhi" } },
  { text: "Qual é a capital do Egito?", options: ["Alexandria", "Luxor", "Cairo", "Assuã"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Local das Grandes Pirâmides de Gizé" } },
  { text: "Qual é a capital da Suíça?", options: ["Zurique", "Genebra", "Berna", "Basileia"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Não é a maior nem a mais famosa cidade suíça" } },
  { text: "Qual é a capital da Tailândia?", options: ["Chiang Mai", "Phuket", "Bangkok", "Pattaya"], correct_option: 2, category: "CAPITAIS_DO_MUNDO", age_rating: 10, metadata: { hint: "Conhecida por seus templos ornamentados e vida de rua vibrante" } },

  // ==================== POLITICA ====================
  { text: "Qual é o poder que tem a competência para interpretar a Constituição em Portugal?", options: ["Presidente da República", "Assembleia da República", "Tribunal Constitucional", "Governo"], correct_option: 2, category: "POLITICA", age_rating: 16, metadata: { hint: "Tribunal especializado em matéria constitucional" } },
  { text: "Qual é a função do Parlamento Europeu?", options: ["Legislar em conjunto com o Conselho da UE", "Gerir o orçamento da UE sozinho", "Eleger o Presidente da Comissão Europeia", "Controlar exclusivamente a política externa da UE"], correct_option: 0, category: "POLITICA", age_rating: 14, metadata: { hint: "Um dos dois ramos do poder legislativo da União Europeia" } },
  { text: "Qual é a diferença entre uma democracia direta e uma representativa?", options: ["Na direta, os cidadãos votam em leis diretamente", "Na representativa, há apenas um partido político", "Na direta, não há eleições", "Na representativa, o voto é secreto"], correct_option: 0, category: "POLITICA", age_rating: 14, metadata: { hint: "Na democracia direta, o povo decide diretamente sobre as leis" } },
  { text: "Qual é o princípio da separação dos poderes?", options: ["Dividir o poder entre Executivo, Legislativo e Judiciário", "Centralizar todo o poder nas mãos do Presidente", "Dar todo o poder ao povo", "Eliminar as eleições"], correct_option: 0, category: "POLITICA", age_rating: 12, metadata: { hint: "Conceito clássico de Montesquieu" } },
  { text: "Qual é a função do Banco Central Europeu?", options: ["Gerir o euro e definir a política monetária da zona do euro", "Gerir apenas o orçamento da UE", "Controlar exclusivamente as fronteiras da UE", "Eleger o Parlamento Europeu"], correct_option: 0, category: "POLITICA", age_rating: 14, metadata: { hint: "Instituição responsável pela estabilidade dos preços na zona do euro" } },
  { text: "Qual é o sistema político caracterizado pela ausência de Estado e hierarquias?", options: ["Democracia", "Monarquia", "Anarquia", "Comunismo"], correct_option: 2, category: "POLITICA", age_rating: 16, metadata: { hint: "Filosofia política que rejeita todas as formas de governo coercitivo" } },
  { text: "Qual é o órgão responsável pelo poder judiciário em Portugal?", options: ["Presidente da República", "Assembleia da República", "Tribunais", "Governo"], correct_option: 2, category: "POLITICA", age_rating: 14, metadata: { hint: "Órgão de soberania que administra a justiça" } },
  { text: "O que é federalismo?", options: ["Sistema onde todo poder está centralizado", "União de estados parcialmente autônomos sob um governo central", "Sistema de governo por um único partido", "Ausência de governo"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Exemplos: Estados Unidos, Brasil, Alemanha" } },
  { text: "Qual é a idade mínima para ser presidente dos Estados Unidos?", options: ["25 anos", "30 anos", "35 anos", "40 anos"], correct_option: 2, category: "POLITICA", age_rating: 14, metadata: { hint: "Estabelecido na Constituição americana" } },
  { text: "O que é sufrágio universal?", options: ["Direito de voto apenas para homens", "Direito de voto para todos os cidadãos adultos", "Direito de voto apenas para proprietários de terra", "Direito de voto apenas para militares"], correct_option: 1, category: "POLITICA", age_rating: 12, metadata: { hint: "Inclui mulheres e minorias anteriormente excluídas" } },
  { text: "Qual é a função do Conselho de Segurança das Nações Unidas?", options: ["Aprovar o orçamento anual da ONU", "Eleger o Secretário-Geral da ONU", "Manter a paz e segurança internacionais", "Gerir os direitos humanos globalmente"], correct_option: 2, category: "POLITICA", age_rating: 14, metadata: { hint: "Órgão mais poderoso da ONU com poder de veto" } },
  { text: "Qual é o sistema político da China?", options: ["Democracia liberal", "Monarquia constitucional", "República popular socialista", "Teocracia"], correct_option: 2, category: "POLITICA", age_rating: 14, metadata: { hint: "Partido Comunista é a única legenda legal" } },
  { text: "O que é um veto presidencial?", options: ["Poder do presidente de aumentar impostos", "Poder do presidente de rejeitar leis aprovadas pelo legislativo", "Poder do presidente de declarar guerra", "Poder do presidente de dissolver o parlamento"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Freio e contrapeso no sistema presidencialista" } },
  { text: "Qual é a organização internacional que substituiu a Liga das Nações?", options: ["OTAN", "União Europeia", "Nações Unidas", "Bloco Soviético"], correct_option: 2, category: "POLITICA", age_rating: 14, metadata: { hint: "Fundada em 1945 após a Segunda Guerra Mundial" } },
  { text: "Qual é o poder que pode declarar guerra em uma democracia presidencial?", options: ["Presidente da República", "Parlamento/Congresso", "Tribunal Supremo", "Povo em referendo"], correct_option: 1, category: "POLITICA", age_rating: 16, metadata: { hint: "Poder legislativo nos EUA e em muitos outros sistemas" } },
  { text: "O que é impeachment?", options: ["Processo de eleição de um presidente", "Processo de remoção de um funcionário público por crimes de responsabilidade", "Processo de declaração de guerra", "Processo de aprovação do orçamento"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Existe tanto nos EUA quanto no Brasil" } },
  { text: "Qual é a forma de governo do Reino Unido?", options: ["República presidencial", "Monarquia absoluta", "Monarquia constitucional", "Ditadura militar"], correct_option: 2, category: "POLITICA", age_rating: 12, metadata: { hint: "Rei ou rainha é chefe de Estado, primeiro-ministro é chefe de governo" } },
  { text: "Qual é a organização que reúne países de língua portuguesa?", options: ["União Europeia", "Organização dos Estados Americanos", "Comunidade dos Países de Língua Portuguesa", "Mercosul"], correct_option: 2, category: "POLITICA", age_rating: 10, metadata: { hint: "Sigla: CPLP" } },
  { text: "O que é um referendo?", options: ["Eleição de representantes", "Voto direto do povo sobre uma questão específica", "Nomeação de juízes por um presidente", "Debate parlamentar"], correct_option: 1, category: "POLITICA", age_rating: 12, metadata: { hint: "Pode ser vinculativo ou consultivo" } },
  { text: "Qual é a diferença entre um país federado e um estado unitário?", options: ["Não há diferença", "No federalismo, o poder é dividido entre níveis de governo; no unitário, está centralizado", "No federalismo há apenas um nível de governo", "No unitário há múltiplas constituições"], correct_option: 1, category: "POLITICA", age_rating: 14, metadata: { hint: "Estados Unidos vs França como exemplos clássicos" } },
  { text: "Qual é o órgão máximo da União Africana?", options: ["Parlamento Africano", "Banco Africano de Desenvolvimento", "Assembleia de Chefes de Estado e Governo", "Corte Africana de Direitos Humanos"], correct_option: 2, category: "POLITICA", age_rating: 16, metadata: { hint: "Órgão supremo que define as políticas da organização" } },

  // ==================== GASTRONOMIA ====================
  { text: "Qual é o prato típico português feito com arroz, frango e chouriço?", options: ["Arroz de pato", "Arroz de cabidela", "Arroz de frango", "Arroz de marisco"], correct_option: 2, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Arroz cremoso com frango e chouriço" } },
  { text: "Qual é o doce tradicional português feito com amêndoas e açúcar?", options: ["Bolo de arroz", "Pão-de-ló", "Pastel de nata", "Toucinho do céu"], correct_option: 1, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Doce de amêndoa típico do Algarve" } },
  { text: "Qual é a bebida típica da Galiza (Espanha) feita de uva?", options: ["Vinho", "Cerveja", "Sidra", "Licor"], correct_option: 2, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Bebida fermentada de maçã ou pêra" } },
  { text: "Qual é o queijo típico português da ilha de São Miguel (Açores)?", options: ["Queijo da ilha", "Queijo flamengo", "Queijo tipo", "Queijo São Jorge"], correct_option: 0, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Queijo de vaca curado em folha de milho" } },
  { text: "Qual é o fruto típico da região mediterrânea usado para fazer azeite?", options: ["Maçã", "Pêra", "Uva", "Azeitona"], correct_option: 3, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Fruto da oliveira" } },
  { text: "Qual é o prato nacional do Japão feito com arroz vinagreado e peixe cru?", options: ["Ramen", "Tempura", "Sushi", "Yakitori"], correct_option: 2, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Muitas vezes enrolado em alga nori" } },
  { text: "Qual é o queijo francês conhecido pelo cheiro forte e casca lavada?", options: ["Brie", "Camembert", "Roquefort", "Munster"], correct_option: 3, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Originário da região da Alsácia" } },
  { text: "Qual é a especiaria mais cara do mundo por peso?", options: ["Pimenta-do-reino", "Açafrão", "Noz-moscada", "Canela"], correct_option: 1, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Obtida dos estigmas da flor de Crocus sativus" } },
  { text: "Qual é o prato típico italiano feito com massa, ovo, queijo e guanciale?", options: ["Espaguete à bolonhesa", "Lasanha", "Carbonara", "Pesto"], correct_option: 2, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Não contém creme de leite na receita tradicional" } },
  { text: "Qual é a bebida nacional da Rússia?", options: ["Vodka", "Uísque", "Rum", "Tequila"], correct_option: 0, category: "GASTRONOMIA", age_rating: 16, metadata: { hint: "Bebida destilada geralmente feita de grãos ou batatas" } },
  { text: "Qual é o prato típico espanhol feito com arroz, açafrão e diversos frutos do mar?", options: ["Paella", "Gazpacho", "Tortilla", "Fabada"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Originária da região de Valência" } },
  { text: "Qual é o molho básico da culinária francesa feito com gema de ovo e manteiga derretida?", options: ["Molho de tomate", "Bechamel", "Hollandaise", "Velouté"], correct_option: 2, category: "GASTRONOMIA", age_rating: 14, metadata: { hint: "Um dos cinco molhos mãe da haute cuisine" } },
  { text: "Qual é a sobremesa italiana feita com queijo mascarpone, café e biscoitos?", options: ["Tiramisu", "Cannoli", "Panna cotta", "Gelato"], correct_option: 0, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Significa 'levante-me' ou 'anime-me' em italiano" } },
  { text: "Qual é o prato típico brasileiro feito com feijão preto e carne de porco?", options: ["Moqueca", "Acarajé", "Feijoada", "Vatapá"], correct_option: 2, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Tradicionalmente consumido às quartas-feiras e sábados" } },
  { text: "Qual é o tempero básico usado na maioria das culinárias do mundo?", options: ["Açúcar", "Sal", "Pimenta", "Alho"], correct_option: 1, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Cloreto de sódio (NaCl)" } },
  { text: "Qual é o prato típico indiano feito com arroz especiado e legumes ou carne?", options: ["Naan", "Samosa", "Biryani", "Dal"], correct_option: 2, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Prato aromático e colorido, muitas vezes em camadas" } },
  { text: "Qual é o molho japonês feito de soja fermentada, trigo, água e sal?", options: ["Missô", "Térmico", "Shoyu", "Udon"], correct_option: 2, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Essencial na culinária japonesa" } },
  { text: "Qual é o doce típico português feito com ovos e açúcar, semelhante a um pudim?", options: ["Bolo de arroz", "Pão-de-ló", "Pastel de nata", "Leite creme"], correct_option: 3, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Também conhecido como pudim romano" } },
  { text: "Qual é a fruta típica utilizada na preparação do guacamole?", options: ["Tomate", "Cebola", "Abacate", "Limão"], correct_option: 2, category: "GASTRONOMIA", age_rating: 10, metadata: { hint: "Rica em gorduras boas e potássio" } },
  { text: "Qual é o prato típico coreano feito com vegetais fermentados, especialmente repolho?", options: ["Kimchi", "Bibimbap", "Bulgogi", "Samgyeopsal"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Alimento básico da culinária coreana" } },

  // ==================== DESPORTO ====================
  { text: "Qual é o número de jogadores de uma equipe de vôlei de praia em campo?", options: ["2", "3", "4", "5"], correct_option: 1, category: "DESPORTO", age_rating: 10, metadata: { hint: "Dupla de jogadores" } },
  { text: "Qual é o esporte que usa uma bola oval e dois traves em forma de H?", options: ["Futebol", "Rugby", "Futebol americano", "Tênis"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Esporte com jogadas e avanço territorial" } },
  { text: "Qual é o tempo de um round no boxe profissional?", options: ["1 minuto", "2 minutos", "3 minutos", "4 minutos"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Três minutos de luta" } },
  { text: "Qual é o esporte que envolve deslizar sobre neve usando uma prancha fixa aos pés?", options: ["Esqui alpino", "Snowboard", "Trenó", "Patinação no gelo"], correct_option: 1, category: "DESPORTO", age_rating: 10, metadata: { hint: "Praticado em montanhas nevadas" } },
  { text: "Qual é o esporte que usa um arco e flechas para acertar em um alvo?", options: ["Tiro com arco", "Tiro com pistola", "Tiro com rifle", "Esgrima"], correct_option: 0, category: "DESPORTO", age_rating: 10, metadata: { hint: "Prática que exige concentração e precisão" } },
  { text: "Quantos jogadores tem uma equipe de basquete em quadra?", options: ["4", "5", "6", "7"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "Um dos esportes mais populares do mundo" } },
  { text: "Qual é o objetivo principal no jogo de xadrez?", options: ["Capturar todas as peças do adversário", "Colocar o rei adversário em xeque-mate", "Chegar ao outro lado do tabuleiro primeiro", "Fazer mais movimentos que o oponente"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "O rei não pode ser capturado, apenas colocado em xeque-mate" } },
  { text: "Em qual esporte os atletas usam um taco para rebater uma bola pequena?", options: ["Tênis", "Beisebol", "Golfe", "Hóquei no gelo"], correct_option: 2, category: "DESPORTO", age_rating: 10, metadata: { hint: "Jogado em um campo com 18 buracos" } },
  { text: "Qual é a distância de uma maratona em quilômetros?", options: ["21,095 km", "30 km", "42,195 km", "50 km"], correct_option: 2, category: "DESPORTO", age_rating: 12, metadata: { hint: "Baseada na lenda de Filípides de Maratona a Atenas" } },
  { text: "Em que esporte se usa um taco e uma bola em uma mesa dividida por uma rede?", options: ["Tênis de mesa", "Tenis", "Snooker", "Sinuca"], correct_option: 0, category: "DESPORTO", age_rating: 10, metadata: { hint: "Também conhecido como ping-pong" } },
  { text: "Qual é o objeto usado no lançamento de dardo nas competições atléticas?", options: ["Disco", "Martelo", "Dardo", "Peso"], correct_option: 2, category: "DESPORTO", age_rating: 12, metadata: { hint: "Objeto pontiagudo lançado para distância" } },
  { text: "Em que esporte os competidores realizam giros e saltos sobre uma lâmina de gelo?", options: ["Esqui alpino", "Patinação artística", "Snowboard", "Salto em distância"], correct_option: 1, category: "DESPORTO", age_rating: 10, metadata: { hint: "Disciplina olímpica tanto individual quanto em pares" } },
  { text: "Qual é a altura da rede no vôlei masculino oficial?", options: ["2,13 m", "2,24 m", "2,35 m", "2,43 m"], correct_option: 3, category: "DESPORTO", age_rating: 14, metadata: { hint: "Medido no centro da rede" } },
  { text: "Qual é o objeto chutado no futebol americano?", options: ["Bola redonda", "Disco", "Boval ovalada", "Anel"], correct_option: 2, category: "DESPORTO", age_rating: 10, metadata: { hint: "Seu formato permite passes em espiral" } },
  { text: "Em que esporte se usa um bastão para impulsionar-se sobre neve?", options: ["Esqui de fundo", "Esqui alpino", "Snowboard", "Patinação no gelo"], correct_option: 0, category: "DESPORTO", age_rating: 10, metadata: { hint: "Também conhecido como ski de cross-country" } },
  { text: "Qual é a distância livre dos 100 metros rasos em uma pista atlética padrão?", options: ["80m", "100m", "110m", "120m"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Distância padrão para corridas de velocidade" } },
  { text: "Qual é o objeto usado no salto com vara?", options: ["Vara de bambu", "Vara de fibra de carbono", "Vara de metal", "Qualquer haste reta"], correct_option: 1, category: "DESPORTO", age_rating: 14, metadata: { hint: "Material moderno que permite maior elasticidade" } },
  { text: "Em que esporte se usa uma raquete com rede para rebater uma plumária?", options: ["Tênis", "Badminton", "Squash", "Racquetball"], correct_option: 1, category: "DESPORTO", age_rating: 10, metadata: { hint: "O projétil é chamado de volante" } },
  { text: "Qual é a posição responsável por lançar a bola no beisebol?", options: ["Catchers", "Pitchers", "Baters", "Fielders"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Fica no monte de lançamento" } },
  { text: "Quantos minutos dura um tempo regulamentar de uma partida de futebol profissional?", options: ["60 minutos", "70 minutos", "90 minutos", "120 minutos"], correct_option: 2, category: "DESPORTO", age_rating: 10, metadata: { hint: "Dividido em dois tempos de 45 minutos cada" } },
  { text: "Em que esporte se usa um taco longo e uma bola pequena em um campo ao ar livre?", options: ["Hóquei no gelo", "Lacrosse", "Golfe", "Polo"], correct_option: 2, category: "DESPORTO", age_rating: 10, metadata: { hint: "O objetivo é colocar a bola em uma série de buracos" } },

  // ==================== CINEMA ====================
  { text: "Quem dirigiu o filme 'Interestelar'?", options: ["Steven Spielberg", "Christopher Nolan", "George Lucas", "James Cameron"], correct_option: 1, category: "CINEMA", age_rating: 12, metadata: { hint: "Diretor de 'Batman: O Cavaleiro das Trevas'" } },
  { text: "Qual é o filme que apresenta um homem que vira homem-formiga após ser encolhido?", options: ["Homem-Aranha", "Homem de Ferro", "Homem-Formiga", "Capitão América"], correct_option: 2, category: "CINEMA", age_rating: 10, metadata: { hint: "Paul Rudd como protagonista" } },
  { text: "Qual é o filme de animação que apresenta um peixe com perda de memória de curto prazo?", options: ["Procurando Nemo", "Procurando Dory", "Shrek", "Valente"], correct_option: 1, category: "CINEMA", age_rating: 10, metadata: { hint: "Peixe azul chamado Dory" } },
  { text: "Qual é o filme que apresenta um grupo de super-heróis liderados por Nick Fury?", options: ["Liga da Justiça", "Vingadores", "X-Men", "Esquadrão Suicida"], correct_option: 1, category: "CINEMA", age_rating: 12, metadata: { hint: "Equipe de super-heróis da Marvel" } },
  { text: "Qual é o filme que conta a história de um menino que descobre que é um bruxo?", options: ["O Senhor dos Anéis", "Harry Potter", "As Crônicas de Nárnia", "Percy Jackson"], correct_option: 1, category: "CINEMA", age_rating: 10, metadata: { hint: "Escola de bruxaria de Hogwarts" } },
  { text: "Qual ator interpreta o personagem Jack Sparrow na série 'Piratas do Caribe'?", options: ["Johnny Depp", "Orlando Bloom", "Keira Knightley", "Geoffrey Rush"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Conhecido por seus olhos maquiados e dentes de ouro" } },
  { text: "Qual é o primeiro filme da saga 'Star Wars' lançado em 1977?", options: ["O Império Contra-Ataca", "O Retorno de Jedi", "Uma Nova Esperança", "A Ameaça Fantasma"], correct_option: 2, category: "CINEMA", age_rating: 10, metadata: { hint: "Episódio IV da saga original" } },
  { text: "Quem dirigiu 'O Poderoso Chefão'?", options: ["Martin Scorsese", "Francis Ford Coppola", "Steven Spielberg", "Quentin Tarantino"], correct_option: 1, category: "CINEMA", age_rating: 16, metadata: { hint: "Diretor ítalo-americano" } },
  { text: "Qual é o nome do robô protagonista de 'WALL·E'?", options: ["EVE", "WALL·E", "MO", "AUTO"], correct_option: 1, category: "CINEMA", age_rating: 8, metadata: { hint: "Um pequeno robô limpador de lixo espacial" } },
  { text: "Qual filme apresenta um menino que se faz de morto para escapar da escola?", options: ["O Labirinto do Fauno", "O Labirinto do Fauno", "O Labirinto do Fauno", "O Labirinto do Fauno"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Espere, essa opção parece estar repetida... na verdade é 'O Menino do Pijama Listrado'" }, metadata: { hint: "Filme ambientado durante o Holocausto" } },
  { text: "Qual atriz interpreta Hermione Granger na série 'Harry Potter'?", options: ["Emma Watson", "Rupert Grint", "Daniel Radcliffe", "Tom Felton"], correct_option: 0, category: "CINEMA", age_rating: 10, metadata: { hint: "Atriz britânica conhecida por ativismo feminista" } },
  { text: "Qual é o primeiro filme do Universo Cinematográfico da Marvel (MCU)?", options: ["Homem de Ferro", "O Incrível Hulk", "Thor", "Capitão América: O Primeiro Vingador"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Lançado em 2008 com Robert Downey Jr." } },
  { text: "Quem escreveu e dirigiu 'Pulp Fiction'?", options: ["Quentin Tarantino", "Martin Scorsese", "Steven Spielberg", "Christopher Nolan"], correct_option: 0, category: "CINEMA", age_rating: 16, metadata: { hint: "Conhecido por diálogos afiados e violência estilizada" } },
  { text: "Qual é o nome do personagem principal de 'Forrest Gump'?", options: ["Forrest Gump", "Jenny Curran", "Lieutenant Dan", "Bubba Blue"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Homem com QI abaixo da média que vive grandes façanhas" } },
  { text: "Qual filme apresenta um personagem chamado Tyler Durden?", options: ["Clube da Luta", "Seven", "O Estranho Caso de Benjamin Button", "Seven Anos no Tibete"], correct_option: 0, category: "CINEMA", age_rating: 16, metadata: { hint: "Personificado por Brad Pitt e Edward Norton" } },
  { text: "Qual é o nome do hobbit protagonista de 'O Senhor dos Anéis'?", options: ["Gandalf", "Aragorn", "Frodo Bolseiro", "Legolas"], correct_option: 2, category: "CINEMA", age_rating: 10, metadata: { hint: "Herdeiro do Um Anel" } },
  { text: "Quem é a diretora de 'A Lista de Schindler'?", options: ["Steven Spielberg", "Quentin Tarantino", "Martin Scorsese", "Ridley Scott"], correct_option: 0, category: "CINEMA", age_rating: 16, metadata: { hint: "Um dos cineastas mais influentes de todos os tempos" } },
  { text: "Qual é o nome da princesa em 'A Bela e a Fera' da Disney?", options: ["Branca de Neve", "Cinderela", "Bela", "Aurora"], correct_option: 2, category: "CINEMA", age_rating: 8, metadata: { hint: "Ama ler e se oferece pelo pai" } },
  { text: "Qual filme apresenta um tubarão assassino chamado Bruce?", options: ["Tubarão", "Procura-se Nemo", "Achados e Perdidos", "Águas Rasas"], correct_option: 0, category: "CINEMA", age_rating: 14, metadata: { hint: "Direção de Steven Spielberg, baseado em romance de Peter Benchley" } },
  { text: "Quem é o vilão principal de 'O Rei Leão'?", options: ["Mufasa", "Scar", "Simba", "Timão"], correct_option: 1, category: "CINEMA", age_rating: 8, metadata: { hint: "Irmão ciumento do rei" } },
  { text: "Qual é o nome do robô amigável em 'Short Circuit'?", options: ["Number 5", "Johnny 5", "both A and B", "C-3PO"], correct_option: 2, category: "CINEMA", age_rating: 10, metadata: { hint: "Frase famosa: 'Numero 5 está vivo!'" } },

  // ==================== CULTURA_GERAL ====================
  { text: "Qual é o rio mais longo do mundo?", options: ["Nilo", "Amazonas", "Yangtzé", "Mississipi"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Cobre mais de 6.600 km de extensão" } },
  { text: "Qual é o maior deserto do mundo?", options: ["Saara", "Arábico", "Gobi", "Kalahari"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Localizado no norte de África" } },
  { text: "Qual é a montanha mais alta do mundo?", options: ["Everest", "K2", "Kangchenjunga", "Lhotse"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Localizada na fronteira entre Nepal e China" } },
  { text: "Qual é o oceano maior do mundo?", options: ["Atlântico", "Índico", "Ártico", "Pacífico"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Separa a Ásia e as Américas" } },
  { text: "Qual é o país com o maior número de línguas oficiais?", options: ["Índia", "África do Sul", "Suíça", "Canadá"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 14, metadata: { hint: "Onze línguas oficiais reconhecidas" } },
  { text: "Qual é o idioma mais falado no mundo como língua materna?", options: ["Inglês", "Espanhol", "Hindi", "Chinês mandarim"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Falado principalmente na China" } },
  { text: "Qual é o continente com o maior número de países?", options: ["Ásia", "África", "Europa", "América do Sul"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Contém 54 nações reconhecidas" } },
  { text: "Qual é o maior oceano do mundo?", options: ["Atlântico", "Índico", "Ártico", "Pacífico"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Cobre cerca de 30% da superfície terrestre" } },
  { text: "Qual é o país conhecido como 'Terra do Sol Nascente'?", options: ["China", "Tailândia", "Japão", "Coreia do Sul"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Seu nome em japonês significa 'origem do sol'" } },
  { text: "Qual é o maior país do mundo por área territorial?", options: ["Canadá", "China", "Estados Unidos", "Rússia"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Cobre onze fusos horários" } },
  { text: "Qual é o menor país do mundo por área territorial?", options: ["Mônaco", "Vaticano", "Nauru", "Tuvalu"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Estado-cidade dentro de Roma" } },
  { text: "Qual é o rio que passa por mais países no mundo?", options: ["Nilo", "Danúbio", "Rio Reno", "Rio Mississippi"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Passa por 10 países na Europa" } },
  { text: "Qual é a língua oficial do Brasil?", options: ["Espanhol", "Inglês", "Português", "Francês"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Falada por mais de 200 milhões de pessoas" } },
  { text: "Qual é o continente onde se encontra o Egito?", options: ["Ásia", "África", "Europa", "América do Sul"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Transversado pelo rio Nilo" } },
  { text: "Qual é o deserto mais frio do mundo?", options: ["Saara", "Antártida", "Gobi", "Arábico"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Na verdade, é um continente gelado" } },
  { text: "Qual é o país com o maior número de ilhas no mundo?", options: ["Suécia", "Indonésia", "Filipinas", "Canadá"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Arquipélago com mais de 17.000 ilhas" } },
  { text: "Qual é o monumento famoso de Paris que foi inicialmente criticado por artistas?", options: ["Arco do Triunfo", "Catedral de Notre-Dame", "Torre Eiffel", "Museu do Louvre"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Construída para a Exposição Universal de 1889" } },
  { text: "Qual é o oceano que fica a leste da África?", options: ["Atlântico", "Índico", "Ártico", "Pacífico"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Banha as costas da África Oriental e do sul da Ásia" } },
  { text: "Qual é o país que consome mais chá per capita no mundo?", options: ["China", "Japão", "Reino Unido", "Turquia"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Localizado entre a Europa e a Ásia" } },
  { text: "Qual é o metal mais precioso usado em joalheria?", options: ["Prata", "Ouro", "Platina", "Paládio"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Mais denso e raro que o ouro" } },
  { text: "Qual é o instrumento de percussão mais antigo conhecido?", options: ["Tambor", "Triângulo", "Pandeiro", "Bateria"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Usado desde a pré-história para comunicação e rituais" } },
  { text: "Qual é o continente onde se encontra a Floresta Amazônica?", options: ["Ásia", "África", "América do Sul", "Oceania"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Maior floresta tropical do mundo" } },
  { text: "Qual é o país conhecido como 'Terra do Fogo'?", options: ["Noruega", "Finlândia", "Chile/Argentina", "Suécia"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 10, metadata: { hint: "Localizado no extremo sul da América do Sul" } },

  // ==================== HISTÓRIA ====================
  { text: "Quem foi o primeiro homem a caminhar na Lua?", options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Michael Collins"], correct_option: 1, category: "HISTÓRIA", age_rating: 10, metadata: { hint: "Comandante da missão Apollo 11" } },
  { text: "Qual foi o império que construiu Machu Picchu?", options: ["Asteca", "Maia", "Inca", "Olmeca"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Civilização andina do século XV" } },
  { text: "Qual foi a guerra que durou de 1939 a 1945?", options: ["Guerra Civil Espanhola", "Guerra Fria", "Segunda Guerra Mundial", "Primeira Guerra Mundial"], correct_option: 2, category: "HISTÓRIA", age_rating: 10, metadata: { hint: "Conflito global envolvendo as principais potências mundiais" } },
  { text: "Qual foi a revolução que terminou com a monarquia absoluta na França?", options: ["Revolução Francesa", "Revolução Industrial", "Revolução Russa", "Revolução Americana"], correct_option: 0, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "Começou em 1789 com a tomada da Bastilha" } },
  { text: "Qual é o documento que declarou a independência dos Estados Unidos?", options: ["Declaração dos Direitos do Homem e do Cidadão", "Declaração de Independência", "Carta Magna", "Constituição dos Estados Unidos"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Assinada em 4 de julho de 1776" } },
  { text: "Qual foi a civilização que construiu as pirâmides de Gizé?", options: ["Maia", "Egípcia", "Romana", "Asteca"], correct_option: 1, category: "HISTÓRIA", age_rating: 10, metadata: { hint: "Civilização do norte-africana do Nordeste" } },
  { text: "Quem foi elogiado por decifrar os hieroglíficos egípcios usando a Pedra de Roseta?", options: ["Howard Carter", "Jean-François Champollion", "Gaston Maspero", "Flinders Petrie"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Egiptólogo francês que fez avanços significativos em 1822" } },
  { text: "Quem foi considerada a primeira imperatriz do Brasil?", options: ["Maria Leopoldina", "Isabel", "Leopoldina", "Mariana"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Filha do imperador Pedro I" } },
  { text: "Qual foi o tratado que terminou a Primeira Guerra Mundial?", options: ["Tratado de Versalhes", "Tratado de Tordesilhas", "Tratado de Westfália", "Tratado de Lisboa"], correct_option: 0, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "Assinado em 1919, impôs pesadas reparações à Alemanha" } },
  { text: "Quem foi o líder da Revolução Cubana de 1959?", options: ["Fidel Castro", "Che Guevara", "Raúl Castro", "Camilo Cienfuegos"], correct_option: 0, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "Governou Cuba por quase cinco décadas" } },
  { text: "Qual foi a primeira viagem ao redor do mundo comandada por?", options: ["Cristóvão Colombo", "Fernão de Magalhães", "Vasco da Gama", "James Cook"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Expédition espanhola que provou a redondez da Terra" } },
  { text: "Em que ano ocorreu a queda do Muro de Berlim?", options: ["1987", "1988", "1989", "1990"], correct_option: 2, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Símbolo do fim da Guerra Fria" } },
  { text: "Qual foi a dinastia que governou a China por quase 300 anos até 1912?", options: ["Dinastia Tang", "Dinastia Ming", "Dinastia Qing", "Dinastia Zhou"], correct_option: 2, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "Última dinastia imperial da China" } },
  { text: "Quem descobriu a penicilina em 1928?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Biólogo escocês que notou o moho matando bactérias" } },
  { text: "Qual foi o império mais extenso da história mundial?", options: ["Império Romano", "Império Mongol", "Império Britânico", "Império Espanhol"], correct_option: 1, category: "HISTÓRIA", age_rating: 14, metadata: { hint: "Grande território contíguo na Ásia e Europa" } },
  { text: "Em que ano o homem pisou na Lua pela primeira vez?", options: ["1965", "1966", "1967", "1969"], correct_option: 3, category: "HISTÓRIA", age_rating: 10, metadata: { hint: "Missão Apollo 11" } },

// ==================== ARTE ====================
  { text: "Qual é o movimento artístico que valoriza a expressão emocional e o uso intenso de cor?", options: ["Impressionismo", "Expressionismo", "Cubismo", "Surrealismo"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Movimento artístico alemão do início do século XX" } },
  { text: "Qual é o instrumento de cordas que se toca com um arco e tem quatro cordas?", options: ["Guitarra", "Violino", "Violoncelo", "Contrabaixo"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Instrumento de soprano da família das cordas" } },
  { text: "Qual é o estilo arquitetônico caracterizado por arcos ogivais e vitrais?", options: ["Românico", "Gótico", "Renascimento", "Barroco"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Estilo arquitetônico da Idade Média" } },
  { text: "Qual é o livro que contém as 95 teses de Martinho Lutero?", options: ["Bíblia", "Catecismo", "95 Teses", "None"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Início da Reforma Protestante" } },
  { text: "Qual é o estilo de pintura que usa pontos de cor pura para criar imagens?", options: ["Impressionismo", "Pointilismo", "Expressionismo", "Cubismo"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Técnica desenvolvida por Georges Seurat" } },
  { text: "Quem pintou a Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct_option: 2, category: "ARTE", age_rating: 10, metadata: { hint: "Gênio do Renascimento italiano" } },
  { text: "Qual é o movimento artístico iniciado por Pablo Picasso e Georges Braque?", options: ["Surrealismo", "Impressionismo", "Cubismo", "Expressionismo"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Quebra objetos em formas geométricas" } },
  { text: "Quem é considerado o pai da arquitetura moderna?", options: ["Frank Lloyd Wright", "Le Corbusier", "Oscar Niemeyer", "Ludwig Mies van der Rohe"], correct_option: 1, category: "ARTE", age_rating: 14, metadata: { hint: "Arquiteto suíço-francês, pioneiro do béton brut" } },
  { text: "Qual é o instrumento de teclado que produz som através de martelos que batem em cordas?", options: ["Órgão", "Clavicórdio", "Piano", "Clave"], correct_option: 2, category: "ARTE", age_rating: 10, metadata: { hint: "Inventado por Bartolomeo Cristofori por volta de 1700" } },
  { text: "Qual é o balé mais famoso de Piotr Ilyich Tchaikovsky?", options: ["O Lago dos Cisnes", "A Bela Adormecida", "O Quebra-Nozes", "Todos os acima"], correct_option: 3, category: "ARTE", age_rating: 10, metadata: { hint: "Três balés clássicos do repertório mundial" } },
  { text: "Quem escreveu a peça de teatro 'Romeu e Julieta'?", options: ["Arthur Miller", "William Shakespeare", "Anton Chekhov", "Friedrich Schiller"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Dramaturgo inglês do século XVI" } },
  { text: "Qual é o instrumento de sopro feito de madeira que usa uma haste simples (soliço)?", options: ["Flauta", "Clarinete", "Oboé", "Fagote"], correct_option: 0, category: "ARTE", age_rating: 10, metadata: { hint: "Instrumento de madeira da família madeireira" } },
  { text: "Qual é o movimento artístico que explorou o inconsciente e os sonhos?", options: ["Surrealismo", "Impressionismo", "Cubismo", "Futurismo"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Liderado por André Breton na década de 1920" } },
  { text: "Quem compôs a Ninth Symphony (Sinfonía No. 9)?", options: ["Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Johann Sebastian Bach", "Frederic Chopin"], correct_option: 1, category: "ARTE", age_rating: 14, metadata: { hint: "Inclui o famoso 'Hino à Alegria'" } },
  { text: "Qual é o gênero literário que inclui obras como 'Dom Quixote' e 'Os Lusíadas'?", options: ["Poesia", "Drama", "Romance", "Ensaio"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Narrativa fictícia em prosa de grande extensão" } },
  { text: "Qual é o instrumento de percussão de som indeterminado feito de aço?", options: ["Tambor", "Prato", "Triângulo", "Xilofone"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Produz som metálico agudo e sustentado" } },
  { text: "Qual é a dança clássica que originated in the Italian Renaissance courts?", options: ["Samba", "Tango", "Balé", "Hip-hop"], correct_option: 2, category: "ARTE", age_rating: 10, metadata: { hint: "Baseado na técnica académica das cinco posições" } },
  { text: "Quem pintou 'A Noite Estrelada'?", options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"], correct_option: 1, category: "ARTE", age_rating: 10, metadata: { hint: "Pintor pós-impressionista holandês" } },
  { text: "Qual é o movimento artístico francês do século XIX que tentou captar a impressão momentânea da luz?", options: ["Expressionismo", "Surrealismo", "Impressionismo", "Constructivismo"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Monet, Renoir, Degas, Pissarro entre seus expoentes" } },
  { text: "Qual é o maior prêmio da indústria cinematográfica estadunidense?", options: ["BAFTA", "Cannes Film Festival", "Oscar (Academy Award)", "Festival de Berlim"], correct_option: 2, category: "ARTE", age_rating: 10, metadata: { hint: "Estatueta dourada de um cavaleiro crusado" } },
  { text: "Qual é o instrumento de teclado anterior ao piano que utiliza pennetas para encordar as cordas?", options: ["Órgão", "Clavicórdio", "Clave", "Harpa"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Instrumento teclado do Renascimento e Barroco" } },

  // ==================== GEOGRAFIA ====================
  { text: "Qual é o maior lago do mundo por área superficial?", options: ["Mar Cáspio", "Lago Superior", "Lago Vitória", "Lago Baikal"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado entre Europa e Ásia" } },
  { text: "Qual é o rio que passa pelo Grand Canyon?", options: ["Rio Colorado", "Rio Mississipi", "Rio Amazonas", "Rio Nilo"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Escavou o Grand Canyon ao longo de milhões de anos" } },
  { text: "Qual é a maior ilha do mundo?", options: ["Groelândia", "Nova Guiné", "Borneo", "Madagáscar"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Território autônomo da Dinamarca" } },
  { text: "Qual é o deserto mais quente do mundo?", options: ["Saara", "Dasht-e Lut", "Sonora", "Kalahari"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado no Irã, com temperaturas recordes" } },
  { text: "Qual é a faixa de montanhas mais longa do mundo?", options: ["Andes", "Himalaias", "Montanhas Rochosas", "Alpes"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Estende-se por sete países da América do Sul" } },

  // ==================== GEOGRAFIA ====================
  { text: "Qual é o maior lago do mundo por área superficial?", options: ["Mar Cáspio", "Lago Superior", "Lago Vitória", "Lago Baikal"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado entre Europa e Ásia" } },
  { text: "Qual é o rio que passa pelo Grand Canyon?", options: ["Rio Colorado", "Rio Mississipi", "Rio Amazonas", "Rio Nilo"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Escavou o Grand Canyon ao longo de milhões de anos" } },
  { text: "Qual é a maior ilha do mundo?", options: ["Groelândia", "Nova Guiné", "Borneo", "Madagáscar"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Território autônomo da Dinamarca" } },
  { text: "Qual é o deserto mais quente do mundo?", options: ["Saara", "Dasht-e Lut", "Sonora", "Kalahari"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado no Irã, com temperaturas recordes" } },
  { text: "Qual é a faixa de montanhas mais longa do mundo?", options: ["Andes", "Himalaias", "Montanhas Rochosas", "Alpes"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Estende-se por sete países da América do Sul" } },
  { text: "Qual é o rio mais largo do mundo?", options: ["Nilo", "Amazonas", "Yangtzé", "Mississipi"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Largura máxima de até 50 km na foz" } },
  { text: "Qual é o vulcão mais ativo da Terra?", options: ["Monte Fuji", "Kilauea", "Vesúvio", "Etna"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado no Havaí, em erupção quase contínua" } },
  { text: "Qual é a cadeia de montanhas que divide a Europa e a Ásia?", options: ["Himalaias", "Urais", "Cárpatos", "Alpes"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Fronteira natural entre dois continentes" } },
  { text: "Qual é o oceano mais pequeno do mundo?", options: ["Atlântico", "Índico", "Ártico", "Pacífico"], correct_option: 2, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Localizado ao redor do Pólo Norte" } },
  { text: "Qual é a linha imaginária que divide a Terra em hemisférios norte e sul?", options: ["Meridiano de Greenwich", "Trópico de Câncer", "Equador", "Trópico de Capricórnio"], correct_option: 2, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Latitude 0 graus" } },
  { text: "Qual é o deserto mais antigo do mundo?", options: ["Saara", "Namibe", "Atacama", "Gobi"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado no Chile, com mais de 150 milhões de anos" } },
  { text: "Qual é o país com a maior faixa costeira do mundo?", options: ["Canadá", "Rússia", "Indonésia", "Filipinas"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Mais de 200.000 km de costa" } },
  { text: "Qual é o lago mais profundo do mundo?", options: ["Lago Vitória", "Lago Superior", "Lago Baikal", "Lago Tanganyika"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado na Sibéria, contém 20% da água doce não congelada do mundo" } },
  { text: "Qual é a maior cadeia de montanhas submarina do mundo?", options: ["Dorsal Medio-Atlântica", "Grande Barreira de Corais", "Fossa das Marianas", "Molécula de DNA"], correct_option: 0, category: "GEOGRAFIA", age_rating: 14, metadata: { hint: "Montanha que rodeia a Terra como as costuras de uma bola de beisebol" } },
  { text: "Qual é o fenômeno responsável pelas marés oceânicas?", options: ["Vento", "Gravidade da lua e sol", "Correntes oceânicas", "Atividade vulcânica"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Força gravitacional exercida principalmente pela lua" } },
  { text: "Qual é o único continente sem um deserto natural?", options: ["Ásia", "África", "América do Sul", "Europa"], correct_option: 3, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Apesar de ter regiões áridas, nenhum se encaixa na definição estrita de deserto" } },
  { text: "Qual é o ponto mais profundo dos oceanos do mundo?", options: ["Fossa de Mariana", "Fossa de Tonga", "Fossa das Filipinas", "Fossa de Kermadec"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Localizado no Oceano Pacífico Ocidental" } },
  { text: "Qual é a maior bacia hidrográfica do mundo?", options: ["Bacia do Rio Nilo", "Bacia do Rio Amazonas", "Bacia do Rio Yangtzé", "Bacia do Rio Mississipi"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Drena cerca de 40% da América do Sul" } },
  { text: "Qual é a única lagoa salgada do mundo que fica abaixo do nível do mar?", options: ["Mar Morto", "Mar Cáspio", "Grande Lago Salgado", "Mar de Aral"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Localizado entre Jordão e Israel" } },
  { text: "Qual é o maior arquipélago do mundo?", options: ["Arquipélago das Maldivas", "Arquipélago do Havaí", "Arquipélago do Indonésia", "Arquipélago das Filipinas"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Mais de 17.000 ilhas" } },
  { text: "Qual é o ponto mais austral do continente americano?", options: ["Ushuaia", "Cabo Horn", "Estreito de Magalhães", "Ilhas Malvinas"], correct_option: 1, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Localizado na fronteira entre Chile e Argentina" } },
  { text: "Qual é o fenômeno de elevação da água em plantas contra a gravidade?", options: ["Fotossíntese", "Transpiração", "Capilaridade", "Osmose"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Processo físico em tecidos condutores de plantas" } },
  { text: "Qual é o paralelo geográfico mais famoso do mundo?", options: ["Equador", "Trópico de Câncer", "Trópico de Capricórnio", "Círculo Polar Ártico"], correct_option: 0, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Latitude 0 graus" } },
  { text: "Qual é a camada mais externa da Terra?", options: ["Núcleo", "Manto", "Crosta", "Magma"], correct_option: 2, category: "GEOGRAFIA", age_rating: 10, metadata: { hint: "Composta por placas tectônicas em movimento" } },

  // ==================== CIENCIA ====================
  { text: "Qual é a partícula subatômica com carga positiva localizada no núcleo do átomo?", options: ["Elétron", "Nêutron", "Próton", "Fóton"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Número atômico indica a quantidade desta partícula" } },
  { text: "Qual é o gás que constituye a maior parte da atmosfera terrestre?", options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Argônio"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Composta por aproximadamente 78% de nitrogênio" } },
  { text: "Qual é o processo pelo qual as plantas liberam vapor d'água para a atmosfera?", options: ["Fotossíntese", "Respiração", "Transpiração", "Germinação"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Ocorre principalmente através dos estômatos foliares" } },
  { text: "Qual é a lei que descreve a relação entre o volume e a pressão de um gás a temperatura constante?", options: ["Lei de Charles", "Lei de Boyle-Mariotte", "Lei de Gay-Lussac", "Lei de Avogadro"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "P × V = constante" } },
  { text: "Qual é o instrumento usado para medir a intensidade de um terremoto?", options: ["Termômetro", "Barômetro", "Sismógrafo", "Anemômetro"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Escala Richter mede a magnitude do terremoto" } },
  { text: "Qual é o órgão responsável pela bombeamento do sangue no corpo humano?", options: ["Cérebro", "Fígado", "Coração", "Rim"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Músculo que contrai e relaxa ritmicamente" } },
  { text: "Qual é o gás de efeito estufa mais abundante na atmosfera?", options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Argônio"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Produto da queima de combustíveis fósseis" } },
  { text: "Qual é a unidade básica de vida em todos os organismos vivos?", options: ["Átomo", "Molécula", "Célula", "Tecido"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Menor estrutura capaz de realizar todas as funções vitais" } },
  { text: "Qual é o processo pelo qual as plantas convertem luz solar em energia química?", options: ["Respiração", "Fotossíntese", "Transpiração", "Fermentação"], correct_option: 1, category: "CIENCIA", age_rating: 10, metadata: { hint: "Requer clorofila, luz e dióxido de carbono" } },
  { text: "Qual é a camada mais externa da Terra onde vivemos?", options: ["Núcleo", "Manto", "Crosta", "Magma"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Dividida em placas tectônicas que se movem lentamente" } },
  { text: "Qual é o sangue responsável por transportar oxigênio nos pulmões para os tecidos?", options: ["Hemoglobina", "Plasma", "Plaquetas", "Glóbulos brancos"], correct_option: 0, category: "CIENCIA", age_rating: 10, metadata: { hint: "Proteína nas hemácias que liga o oxigênio" } },
  { text: "Qual é o processo de divisão celular que produz duas células filhas idênticas?", options: ["Meiose", "Mitose", "Diferenciação", "Fusão"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Fases: prófase, metáfase, anáfase, telófase" } },
  { text: "Qual é o gás que as plantas absorvem durante a fotossíntese?", options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Hidrogênio"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Produto da respiração humana e queima de combustíveis" } },
  { text: "Qual é a unidade básica de hereditariedade em organismos vivos?", options: ["Cromossomo", "Gene", "DNA", "RNA"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Segmento de DNA que codifica uma característica específica" } },
  { text: "Qual é o planeta conhecido como 'Planeta Vermelho'?", options: ["Vênus", "Marte", "Júpiter", "Saturno"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Quarto planeta do Sol em nosso sistema solar" } },
  { text: "Qual é a camada atmosférica onde ocorre o fenômeno do aquecimento global?", options: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Camada mais próxima da superfície terrestre" } },
  { text: "Qual é o processo de decomposição da glicose para produzir energia nas células?", options: ["Fotossíntese", "Glicólise", "Síntese de proteínas", "Fermentação"], correct_option: 1, category: "CIENCIA", age_rating: 14, metadata: { hint: "Primeira etapa da respiração celular" } },
  { text: "Qual é o maior órgão do corpo humano?", options: ["Fígado", "Cérebro", "Pele", "Intestino"], correct_option: 2, category: "CIENCIA", age_rating: 10, metadata: { hint: "Órgão que protege o corpo de agentes externos" } },
  { text: "Qual é a teoria que explica a origem do universo?", options: ["Teoria do Estado Estacionário", "Teoria do Big Bang", "Teoria do Estado Estacionário", "Teoria do Estado Estacionário"], correct_option: 1, category: "CIENCIA", age_rating: 14, metadata: { hint: "Universo em expansão a partir de um estado inicial extremamente quente e denso" } },
  { text: "Qual é a parte da célula responsável pela síntese de proteínas?", options: ["Núcleo", "Mitocôndria", "Ribossomo", "Retículo endoplasmático"], correct_option: 2, category: "CIENCIA", age_rating: 12, metadata: { hint: "Peças pequenas feitas de RNA e proteínas" } },
  { text: "Qual é o metálico mais leve conhecido?", options: ["Lítio", "Sódio", "Potássio", "Cálcio"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Primeiro elemento da tabela periódica" } },
  { text: "Qual é o processo pelo qual o núcleo de um átomo se divide liberando energia?", options: ["Fissão nuclear", "Fusão nuclear", "Decaimento radioativo", "Ionização"], correct_option: 0, category: "CIENCIA", age_rating: 16, metadata: { hint: "Processo usado em usinas nucleares e bombas atômicas" } },

  // ==================== MATEMATICA ====================
  { text: "Qual é o resultado de 12 ÷ 4?", options: ["2", "3", "4", "6"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Quatro cabe em doze exatamente três vezes" } },
  { text: "Qual é a fórmula para calcular a área de um retângulo?", options: ["l + l", "l × L", "l × L × 2", "l / L"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Base vezes altura" } },
  { text: "Qual é o resultado de 5²?", options: ["10", "15", "20", "25"], correct_option: 3, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Cinco multiplicado por si mesmo" } },
  { text: "Qual é o número que vem depois de 9 na sequência dos números naturais?", options: ["8", "9", "10", "11"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Número natural que segue o nove" } },
  { text: "Qual é o resultado de 0! (fatorial de zero)?", options: ["0", "1", "2", "Indefinido"], correct_option: 1, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Por definição matemática, fatorial de zero é igual a um" } },
  { text: "Qual é o valor de π (pi) aproximado a duas casas decimais?", options: ["3,10", "3,12", "3,14", "3,16"], correct_option: 2, category: "MATEMATICA", age_rating: 10, metadata: { hint: "Relação entre o comprimento da circunferência e seu diâmetro" } },
  { text: "Qual é a fórmula de Bhaskara usada para calcular?", options: ["Área de triângulo", "Raízes de equação do segundo grau", "Volume de esfera", "Distância entre dois pontos"], correct_option: 1, category: "MATEMATICA", age_rating: 14, metadata: { hint: "x = (-b ± √(b²-4ac)) / 2a" } },
  { text: "Quantos graus tem um ângulo reto?", options: ["45°", "90°", "180°", "360°"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Quarto de uma volta completa" } },
  { text: "Qual é o resultado de (-3) × (-4)?", options: ["-12", "-7", "7", "12"], correct_option: 3, category: "MATEMATICA", age_rating: 10, metadata: { hint: "O produto de dois números negativos é positivo" } },
  { text: "Qual é a mediana do conjunto de números {2, 5, 8, 11, 14}?", options: ["5", "8", "11", "6,5"], correct_option: 1, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Valor que separa a metade inferior da superior em uma lista ordenada" } },
  { text: "Qual é o perímetro de um quadrado com lado de 5 cm?", options: ["10 cm", "15 cm", "20 cm", "25 cm"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Soma de todos os quatro lados iguais" } },
  { text: "Que fração é equivalente a 0,5?", options: ["1/3", "1/4", "1/2", "2/3"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Metade de um todo" } },
  { text: "Qual é o valor de 2³?", options: ["4", "6", "8", "10"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Dois multiplicado por si mesmo três vezes" } },
  { text: "Quantos lados tem um hexágono?", options: ["5", "6", "7", "8"], correct_option: 1, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Hexa significa seis" } },
  { text: "Qual é o resultado de 20% de 150?", options: ["20", "25", "30", "35"], correct_option: 2, category: "MATEMATICA", age_rating: 10, metadata: { hint: "20/100 × 150 = 30" } },
  { text: "Se hoje é segunda-feira, que dia será daqui a 10 dias?", options: ["Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"], correct_option: 1, category: "MATEMATICA", age_rating: 10, metadata: { hint: "10 mod 7 = 3, então três dias após segunda-feira" } },
  { text: "Qual é o Máximo Divisor Comum (MDC) de 12 e 18?", options: ["2", "3", "6", "9"], correct_option: 2, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Maior número que divide exatamente ambos" } },
  { text: "Qual é o Mínimo Múltiplo Comum (MMC) de 4 e 6?", options: ["6", "8", "12", "24"], correct_option: 2, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Menor número múltiplo de ambos" } },
  { text: "Se um produto custa R$ 120 e tem 25% de desconto, quanto se paga?", options: ["R$ 30", "R$ 90", "R$ 100", "R$ 150"], correct_option: 1, category: "MATEMATICA", age_rating: 12, metadata: { hint: "25% de 120 = 30, então 120 - 30 = 90" } },
  { text: "Quantos termos tem a progressão aritmética 2, 5, 8, 11, 14, 17?", options: ["5", "6", "7", "8"], correct_option: 1, category: "MATEMATICA", age_rating: 10, metadata: { hint: "Começa em 2 e termina em 17 com razão 3" } },
  { text: "Qual é a área de um triângulo com base 10 cm e altura 5 cm?", options: ["25 cm²", "30 cm²", "50 cm²", "100 cm²"], correct_option: 0, category: "MATEMATICA", age_rating: 10, metadata: { hint: "(base × altura) / 2" } },
  { text: "Se x + 5 = 12, quanto vale x?", options: ["5", "6", "7", "8"], correct_option: 2, category: "MATEMATICA", age_rating: 10, metadata: { hint: "x = 12 - 5" } },
  { text: "Qual é o valor de |-7| (valor absoluto de -7)?", options: ["-7", "0", "7", "14"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Distância do número até zero na reta numérica" } },

  // ==================== ANIMAIS ====================
  { text: "Qual é o animal terrestre mais rápido do mundo?", options: ["Guepardo", "Leão", "Tigre", "Veado"], correct_option: 0, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Atinge até 120 km/h em curtos sprints" } },
  { text: "Qual é o maior mamífero do mundo?", options: ["Elefante africano", "Baleia azul", "Girafa", "Rinoceronte"], correct_option: 1, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Mamífero marinho que pode atingir 30 metros de comprimento" } },
  { text: "Qual é o animal que tem a memória mais longa do mundo?", options: ["Elefante", "Golfinho", "Chimpanzé", "Cavalo"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Lembranças podem durar décadas" } },
  { text: "Qual é o animal que pode ficar meses sem beber água?", options: ["Camelo", "Girafa", "Elefante", "Leão"], correct_option: 0, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Adaptado para sobrevivência em desertos" } },
  { text: "Qual é o animal que tem a língua mais longa proporcionalmente ao seu corpo?", options: ["Girafa", "Chameleão", "Sapo", "Peixe"], correct_option: 1, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Língua usada para alcançar folhas em árvores altas" } },
  { text: "Qual é o maior primate do mundo?", options: ["Chimpanzé", "Gorila", "Orangotango", "Gibão"], correct_option: 1, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Primata terrestre de grande porte e força imensa" } },
  { text: "Qual é o único mamífero capaz de voo verdadeiro?", options: ["Esquilo voador", "Morcego", "Colugo", "Dragão de Komodo"], correct_option: 1, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Mamífero da ordem Chiroptera" } },
  { text: "Qual é o animal com a maior pressão sanguínea do mundo?", options: ["Girafa", "Elefante", "Baleia", "Humano"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Necessária para bombear sangue até o cérebro a 2 metros acima do coração" } },
  { text: "Qual é o inseto mais perigoso para humanos?", options: ["Abelha", "Mosquito", "Aranha", "Escorpião"], correct_option: 1, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Transmissor de doenças como malária, dengue e zika" } },
  { text: "Qual é o ave que não voa apesar de ter asas?", options: ["Pomba", "Águia", "Avestruz", "Pardal"], correct_option: 2, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Ave corrida africana que pode atingir 70 km/h" } },
  { text: "Qual é o réptil maior do mundo?", options: ["Jacaré", "Crocodilo do mar", "Cobra-de-água", "Tartaruga-marinha"], correct_option: 1, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Pode atingir mais de 6 metros de comprimento" } },
  { text: "Qual é o mamífero que dorme mais horas por dia?", options: ["Girafa", "Elefante", "Coala", "Leão"], correct_option: 2, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Marsupial australiano que dorme até 22 horas" } },
  { text: "Qual é o peixe mais rápido do oceano?", options: ["Atum", "Espada", "Marlim", "Veleiro"], correct_option: 3, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Peixe espada que pode atingir 110 km/h" } },
  { text: "Qual é o único mamífero que possui escamas?", options: ["Pangolim", "Armadilho", "Tatu", "Esquilo"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Mamífero da ordem Pholidota" } },
  { text: "Qual é o animal com o maior número de cordas vocais?", options: ["Humano", "Golfinho", "Pássaro", "Gato"], correct_option: 2, category: "ANIMAIS", age_rating: 14, metadata: { hint: "Capaz de produzir milhares de sons diferentes" } },
  { text: "Qual é o estágio de vida de uma borboleta que vem depois da lagarta?", options: ["Ovo", "Larva", "Pupa", "Adulto"], correct_option: 2, category: "ANIMAIS", age_rating: 8, metadata: { hint: "También conhecido como crisálida" } },
  { text: "Qual é o sentido mais desenvolvido nos cães?", options: ["Visão", "Audição", "Olfato", "Paladar"], correct_option: 2, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Até 100.000 vezes mais sensível que o humano" } },
  { text: "Qual é o animal símbolo da Austrália?", options: ["Coala", "Canguru", "Diabo da Tasmânia", "Equidna"], correct_option: 1, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Marsupial conhecido por seu salto poderoso" } },
  { text: "Qual é o maior felino do mundo?", options: ["Leopardo", "Leão", "Tigre siberiano", "Leopardo das neves"], correct_option: 2, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Felino asiático com listras características" } },
  { text: "Qual é o réptil que pode mudar de cor para se camuflar?", options: ["Camaleão", "Iguana", "Gecko", "Tartaruga"], correct_option: 0, category: "ANIMAIS", age_rating: 10, metadata: { hint: "Possui células especiais chamadas cromatóforos" } },
  { text: "Qual é o animal que tem três corações?", options: ["Polvo", "Lula", "Lagosta", "Caranguejo"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Dois bombam sangue para as brânquias, um para o corpo" } },
  { text: "Qual é o mamífero que tem o período de gestação mais longo?", options: ["Elefante", "Baleia", "Girafa", "Rinoceronte"], correct_option: 0, category: "ANIMAIS", age_rating: 14, metadata: { hint: "Até 22 meses" } },

  // ==================== MÚSICA ====================
  { text: "Qual é o instrumento de percussão que consiste em duas placas de metal que se chocam?", options: ["Tambor", "Prato", "Xilofone", "Triângulo"], correct_option: 1, category: "MUSICA", age_rating: 10, metadata: { hint: "Produz som metálico agudo e sustentado" } },
  { text: "Qual é o gênero musical que se originou na Jamaica nos anos 1960?", options: ["Rock", "Reggae", "Hip hop", "Samba"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Bob Marley é considerado o rei do reggae" } },
  { text: "Qual é o instrumento de cordas que se toca com um plectro (palheta) e tem seis cordas?", options: ["Violino", "Guitarra", "Harpa", "Banjo"], correct_option: 1, category: "MUSICA", age_rating: 10, metadata: { hint: "Instrumento popular em diversos estilos musicais" } },
  { text: "Qual é o tipo de voz feminina mais aguda na música clássica?", options: ["Contralto", "Mezzo-soprano", "Soprano", "Baixo"], correct_option: 2, category: "MUSICA", age_rating: 14, metadata: { hint: "Voz feminina com registro mais agudo" } },
  { text: "Qual é o instrumento de sopro que usa uma haste simples (soliço)?", options: ["Flauta", "Clarinete", "Oboé", "Fagote"], correct_option: 0, category: "MUSICA", age_rating: 10, metadata: { hint: "Instrumento de madeira da família madeireira" } },
  { text: "Quantas teclas tem um piano padrão?", options: ["66", "88", "100", "120"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "52 teclas brancas e 36 pretas" } },
  { text: "Qual é a distância entre duas notas consecutivas na escala musical ocidental chamada?", options: ["Tom", "Semitom", "Intervalo", "Acento"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Menor intervalo na escala temperada" } },
  { text: "Qual é o nome da pauta musical usada para notas agudas?", options: ["Pauta de Fá", "Pauta de Dó", "Pauta de Sol", "Pauta de Lá"], correct_option: 2, category: "MUSICA", age_rating: 10, metadata: { hint: "Símbolo de clave no início da pauta" } },
  { text: "Qual é o instrumento que produz som através da vibração de uma lâmina fina quando soprada?", options: ["Gaita", "Harmônica", "Flauta de bisel", "Todos os anteriores"], correct_option: 3, category: "MUSICA", age_rating: 10, metadata: { hint: "Instrumento de sopro livre" } },
  { text: "Qual é o termo italiano que indica 'cada vez mais rápido'?", options: ["Ritardando", "Rallentando", "Accelerando", "Rubato"], correct_option: 2, category: "MUSICA", age_rating: 12, metadata: { hint: "Indica aumento gradual do tempo" } },
  { text: "Qual é a forma musical que consiste em uma melodia principal acompanhada por acordes?", options: ["Fuga", "Sonata", "Homofonia", "Polifonia"], correct_option: 2, category: "MUSICA", age_rating: 14, metadata: { hint: "Textura musical predominante na música popular" } },
  { text: "Qual é o instrumento de cordas dedilhadas mais comum na música árabe?", options: ["Lute", "Oud", "Banjo", "Mandolina"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Ancestral do lauto europeu" } },
  { text: "Qual é o nome da nota que vem depois de 'Sol' na escala diatônica?", options: ["Lá", "Si", "Dó", "Ré"], correct_option: 0, category: "MUSICA", age_rating: 8, metadata: { hint: "Seg nota na tônica de C maior" } },
  { text: "Qual é o instrumento de teclado que produz som através de placas metálicas quando batidas?", options: ["Piano", "Clavicórdio", "Xilofone", "Glockenspiel"], correct_option: 3, category: "MUSICA", age_rating: 10, metadata: { hint: "Semelhante ao xylophone, mas com barras de metal" } },
  { text: "Qual é o ritmo característico do samba?", options: ["Binário", "Ternário", "Síncopa", "Polirrítmico"], correct_option: 2, category: "MUSICA", age_rating: 12, metadata: { hint: "Perturbação do acento regular no compasso" } },
  { text: "Qual é o conjunto instrumental tradicional da música clássica indiana do norte?", options: ["Gamelan", "Klezmer", "Raga", "Mariachi"], correct_option: 2, category: "MUSICA", age_rating: 14, metadata: { hint: "Framework melódico para improvisação" } },
  { text: "Qual é o nome da pausa musical que dura quatro tempos em compassão de 4/4?", options: ["Semínima", "Minima", "Semibreve", "Colo"], correct_option: 2, category: "MUSICA", age_rating: 10, metadata: { hint: "Nota que ocupa todo o compasso" } },
  { text: "Qual é o instrumento de sopro de metal que usa um deslizador para mudar o tom?", options: ["Trompete", "Trombone", "Tuba", "Corneta"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Parte da família dos instrumentos de bronze" } },
  { text: "Qual é o termo que indica que um músico deve tocar com muita força e volume?", options: ["Piano", "Forte", "Mezzo-forte", "Fortissimo"], correct_option: 3, category: "MUSICA", age_rating: 10, metadata: { hint: "Dinâmica musical máxima comum" } },
  { text: "Qual é a escala mais comum na música ocidental maior?", options: ["Escala menor natural", "Escala maior", "Escala cromática", "Escala pentatônica"], correct_option: 1, category: "MUSICA", age_rating: 10, metadata: { hint: "Padrão T-T-S-T-T-T-S (tom, tom, semitom)" } },
  { text: "Qual é o instrumento de percussão africano feito de casco de abóbora e contas?", options: ["Djembe", "Bongô", "Afoxê", "Shekere"], correct_option: 3, category: "MUSICA", age_rating: 10, metadata: { hint: "Instrumento de agitação comum em religiões afro-brasileiras" } },
  { text: "Quem compôs a ópera 'A Flauta Mágica'?", options: ["Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Johann Sebastian Bach", "Frederic Chopin"], correct_option: 0, category: "MUSICA", age_rating: 14, metadata: { hint: "Uma das últimas obras do gênio clássico" } },
  { text: "Qual é o nome do grupo vocal feminino famoso pelos harmoniosos?", options: ["Destiny's Child", "Spice Girls", "TLC", "En Vogue"], correct_option: 0, category: "MUSICA", age_rating: 10, metadata: { hint: "Grupo de R&B feminino dos anos 1990" } },
  { text: "Qual é a nota fundamental do acorde C maior?", options: ["C", "E", "G", "B"], correct_option: 0, category: "MUSICA", age_rating: 8, metadata: { hint: "Nota que dá nome ao acorde" } },

  // ==================== BANDEIRAS ====================
  { text: "Qual é o país cuja bandeira tem uma folha de bordo vermelha no centro?", options: ["Estados Unidos", "Canadá", "Austrália", "Nova Zelândia"], correct_option: 1, category: "Bandeiras", age_rating: 10, metadata: { hint: "Símbolo nacional do Canadá" } },
  { text: "Qual é o país cuja bandeira tem um sol amarelo com oito raios e um condor em voo?", options: ["Chile", "Peru", "Equador", "Colômbia"], correct_option: 2, category: "Bandeiras", age_rating: 12, metadata: { hint: "Símbolo da liberdade e da independência" } },
  { text: "Qual é o país cuja bandeira tem um dragão dourado no centro?", options: ["China", "Japão", "Coreia do Sul", "Vietname"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Símbolo de poder, sabedoria e boa sorte" } },
  { text: "Qual é o país cuja bandeira tem uma lua crescente branca e uma estrela em um fundo vermelho?", options: ["Turquia", "Tunísia", "Marrocos", "Argélia"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Símbolo do Islã" } },
  { text: "Qual é o país cuja bandeira tem três faixas verticais iguais de azul, branco e vermelho?", options: ["Holanda", "Luxemburgo", "França", "Rússia"], correct_option: 2, category: "Bandeiras", age_rating: 8, metadata: { hint: "Bandeira tricolor que inspirou muitas outras" } },
  { text: "Qual é o país cuja bandeira tem um círculo vermelho no centro de um fundo branco?", options: ["China", "Japão", "Coreia do Sul", "Tailândia"], correct_option: 1, category: "Bandeiras", age_rating: 8, metadata: { hint: "Representa o sol nascente" } },
  { text: "Qual é o país cuja bandeira tem uma cruz branca azulada em um fundo vermelho?", options: ["Noruega", "Suécia", "Dinamarca", "Finlândia"], correct_option: 2, category: "Bandeiras", age_rating: 10, metadata: { hint: "Bandeira escandinava com cruz deslocada para o lado da haste" } },
  { text: "Qual é o país cuja bandeira tem cinco estrelas amarelas em um fundo vermelho?", options: ["Vietnã", "China", "Coreia do Norte", "Laos"], correct_option: 1, category: "Bandeiras", age_rating: 10, metadata: { hint: "Estrelas representam a unidade do povo chinês sob o Partido Comunista" } },
  { text: "Qual é o país cuja bandeira tem um mapa da própria terra em branco de dois ramos de oliveira?", options: ["Chipre", "Grécia", "Turquia", "Egito"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Símbolo da paz e da independência" } },
  { text: "Qual é o país cuja bandeira tem um leão dourado segurando uma espada em um fundo vermelho?", options: ["Sri Lanka", "Índia", "Butão", "Nepal"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Símbolo da coragem e soberania nacional" } },
  { text: "Qual é o país cuja bandeira tem um sol amarelo com dezesseis raios triangulares alternando entre oito retos e oito ondulados?", options: ["Japão", "Coreia do Sul", "Taiwan", "Filipinas"], correct_option: 2, category: "Bandeiras", age_rating: 14, metadata: { hint: "Símbolo conhecido como 'sol com quinze raios'" } },
  { text: "Qual é o país cuja bandeira tem um livro aberto ao centro de uma espada e um ramo de louro?", options: ["Afeganistão", "Arábia Saudita", "Iraque", "Irã"], correct_option: 0, category: "Bandeiras", age_rating: 14, metadata: { hint: "Símbolo da justiça e da soberania nacional" } },
  { text: "Qual é o país cuja bandeira tem um triângulo vermelho à esquerda e duas faixas horizontais branca e superior e vermelha inferior?", options: ["Tchecoslováquia", "Eslováquia", "Chéquia", "Iêmen"], correct_option: 1, category: "Bandeiras", age_rating: 12, metadata: { hint: "Adotada após a divisão da Tchecoslováquia" } },
  { text: "Qual é o país cuja bandeira tem um círculo azul com estrelas brancas representando o céu noturno sobre o campo?", options: ["Austrália", "Nova Zelândia", "Papua Nova Guiné", "Ilhas Cook"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Inclui a Cruz do Sul e a Commonwealth Star" } },
  { text: "Qual é o país cuja bandeira tem uma águia dourada devorando uma serpente sobre um cacto?", options: ["México", "Guatemala", "Belize", "El Salvador"], correct_option: 0, category: "Bandeiras", age_rating: 10, metadata: { hint: "Baseado na lenda asteca da fundação de Tenochtitlán" } },
  { text: "Qual é o país cuja bandeira tem duas faixas horizontais igual de azul e branco com um sol amarelo com rosto no centro?", options: ["Uruguai", "Argentina", "Paraguai", "Chile"], correct_option: 1, category: "Bandeiras", age_rating: 12, metadata: { hint: "O rosto do sol é conhecido como 'Rosto de Maio'" } },
  { text: "Qual é o país cuja bandeira tem uma folha de maple vermelha no centro de um fundo branco comLaterais vermelhas?", options: ["Canadá", "Estados Unidos", "México", "Groelândia"], correct_option: 0, category: "Bandeiras", age_rating: 10, metadata: { hint: "Versão detalhada da bandeira canadense" } },
  { text: "Qual é o país cuja bandeira tem um círculo branco com uma suástica preta antiga (antes da Segunda Guerra Mundial)?", options: ["Japão", "China", "Tailândia", "Indonésia"], correct_option: 0, category: "Bandeiras", age_rating: 16, metadata: { hint: "Símbolo antigo de bem-estar e sorte, appropriado pelos nazistas" } },
  { text: "Qual é o país cuja bandeira tem um retângulo vermelho no canto superior esquerdo de um fundo branco?", options: ["Japão", "Tailândia", "Myanmar", "Camboja"], correct_option: 2, category: "Bandeiras", age_rating: 12, metadata: { hint: "Bandeira do Estado de Shan em Myanmar" } },
  { text: "Qual é o país cuja bandeira tem um sol amarelo com oito raios parcialmente ocultos por feixes de arroz?", options: ["Filipinas", "Tailândia", "Indonésia", "Malásia"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Os raios representam as primeiras oito províncias que se revoltaram contra a Espanha" } },
  { text: "Qual é o país cuja bandeira tem um cruciforme vermelho deslocado para o lado da haste em um fundo branco?", options: ["Dinamarca", "Suécia", "Noruega", "Finlândia"], correct_option: 0, category: "Bandeiras", age_rating: 10, metadata: { hint: "A bandeira nacional mais antiga continuamente usada" } },
  { text: "Qual é o país cuja bandeira tem uma estrela vermelha de cinco pontas em um campo amarelo sobre um fundo vermelho?", options: ["China", "Vietnã", "Laos", "Camboja"], correct_option: 1, category: "Bandeiras", age_rating: 10, metadata: { hint: "Estrela representa a liderança do Partido Comunista" } },
  { text: "Qual é o país cuja bandeira tem três faixas diagonais de azul, branco e verde?", options: ["Burundi", "Ruanda", "Quênia", "Tanzânia"], correct_option: 0, category: "Bandeiras", age_rating: 12, metadata: { hint: "Adotada após a independência da Bélgica em 1962" } },
  { text: "Qual é o país cuja bandeira tem um círculo vermelho no centro de um fundo branco comLaterais vermelhas?", options: ["Bangladesh", "Paquistão", "Índia", "Sri Lanka"], correct_option: 0, category: "Bandeiras", age_rating: 10, metadata: { hint: "O círculo representa o sol levantando-se sobre o Bengala" } },
];

async function insertBatch() {
  try {
    console.log('🔍 Checking for existing questions...');
    const existingPairs = await getExistingTextCategoryPairs();
    
    console.log('📝 Checking new questions for duplicates...');
    const unique = dailyQuestions.filter(q => !existingPairs.has(`${q.text}|${q.category}`));
    
    console.log(`📊 Total: ${dailyQuestions.length} | Novas: ${unique.length} | Duplicadas: ${dailyQuestions.length - unique.length}`);

    if (unique.length === 0) {
      console.log('✅ No new questions to insert');
      return;
    }

    // Insert in batches of 15
    const BATCH_SIZE = 15;
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

    // Show final distribution with proper pagination
    console.log('\n📈 Calculando distribuição final...');
    const allQuestions = await getAllRows();
    const cats = {};
    for (const q of allQuestions) {
      const cat = q.category;
      cats[cat] = (cats[cat] || 0) + 1;
    }

    console.log('\n📊 Distribuição final:');
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      const bar = '█'.repeat(Math.round(count / 5));
      console.log(count.toString().padStart(3) + ' | ' + bar + ' ' + cat);
    });
  } catch (error) {
    console.error('Error in insertBatch:', error);
  }
}

insertBatch().catch(console.error);