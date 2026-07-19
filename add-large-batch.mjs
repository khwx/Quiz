import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function getAllRows() {
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

const newQuestions = [
  { text: "Qual é o país cuja bandeira tem um dragão vermelho?", options: ["China", "Vietname", "Butão", "México"], correct_option: 2, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "Dragão simboliza poder e sabedoria" } },
  { text: "Qual é o país cuja bandeira tem um sol com 32 raios?", options: ["Argentina", "Filipinas", "Uruguai", "Equador"], correct_option: 0, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "Sol de Mayo" } },
  { text: "Qual é o país cujo brasão tem uma águia bicéfala?", options: ["Sérvia", "Albânia", "Moldávia", "Romênia"], correct_option: 3, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "País dos Bálcãs" } },
  { text: "Qual é o país cuja bandeira tem um sol radiante com 8 raios?", options: ["Equador", "Colômbia", "Venezuela", "Bolívia"], correct_option: 1, category: "BANDEIRAS", age_rating: 12, metadata: { hint: "País andino" } },

  { text: "Qual é o animal mais rápido do mundo?", options: ["Guepardo", "Falcão-peregrino", "Peixe-vela", "Andorinha"], correct_option: 1, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Ataque em mergulho" } },
  { text: "Qual é o maior primata do mundo?", options: ["Gorila", "Orangotango", "Chimpanzé", "Gibão"], correct_option: 0, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Vive nas montanhas da África Central" } },
  { text: "Qual é o único mamífero capaz de voar verdadeiramente?", options: ["Morcego", "Esquilo voador", "Colugo", "Morcego voador"], correct_option: 0, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Mamífero voador" } },
  { text: "Qual é o animal que tem três corações?", options: ["Polvo", "Lula", "Chocó", "Nautilus"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Molusco cefalópode" } },
  { text: "Qual é o animal que tem o sangue azul?", options: ["Caranguejo-herradura", "Lula", "Polvo", "Estrela-do-mar"], correct_option: 0, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Artrópode marinho" } },
  { text: "Qual é o animal que pode ficar meses sem beber água?", options: ["Camelo", "Gato do deserto", "Rato canguru", "Todos os anteriores"], correct_option: 3, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Animais do deserto" } },
  { text: "Qual é o animal que tem a língua mais longa proporcionalmente ao seu corpo?", options: ["Camaleão", "Girafa", "Formiga-leão", "Pangolim"], correct_option: 2, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Inseto que captura formigas" } },
  { text: "Qual é o animal que pode mudar de sexo durante a vida?", options: ["Peixe-palhaço", "Enguia", "Ostra", "Todos os anteriores"], correct_option: 3, category: "ANIMAIS", age_rating: 12, metadata: { hint: "Hermafrodita sequencial" } },

  { text: "Qual é a unidade de medida da frequência?", options: ["Hertz", "Watt", "Joule", "Newton"], correct_option: 0, category: "CIENCIA", age_rating: 8, metadata: { hint: "Ciclos por segundo" } },
  { text: "Qual é a partícula subatômica com carga negativa?", options: ["Próton", "Nêutron", "Elétron", "Pósitron"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Orbita o núcleo atômico" } },
  { text: "Qual é o gás mais abundante na atmosfera terrestre?", options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Argônio"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "78% da atmosfera" } },
  { text: "Qual é a lei que descreve a relação entre pressão e volume de um gás?", options: ["Lei de Charles", "Lei de Boyle-Mariotte", "Lei de Gay-Lussac", "Lei de Avogadro"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "P × V = constante" } },
  { text: "Qual é o processo pelo qual as plantas fazem seu próprio alimento?", options: ["Respiração", "Fotossíntese", "Transpiração", "Germinação"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Usa luz solar, água e CO2" } },
  { text: "Qual é a camada mais externa da Terra?", options: ["Núcleo", "Manto", "Crósta", "Litosfera"], correct_option: 2, category: "CIENCIA", age_rating: 8, metadata: { hint: "Onde vivemos" } },
  { text: "Qual é o tipo de rocha formada pelo resfriamento do magma?", options: ["Sedimentar", "Metamórfica", "Ígnea", "Calcária"], correct_option: 2, category: "CIENCIA", age_rating: 12, metadata: { hint: "Rocha vulcânica" } },
  { text: "Qual é o instrumento usado para medir a pressão atmosférica?", options: ["Termômetro", "Barômetro", "Higrômetro", "Anemômetro"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "Prevê mudanças do tempo" } },
  { text: "Qual é a lei que afirma que a razão entre o volume e a temperatura de um gás é constante?", options: ["Lei de Boyle", "Lei de Charles", "Lei de Gay-Lussac", "Lei de Dalton"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "V/T = constante" } },
  { text: "Qual é o elemento mais abundante no universo?", options: ["Oxigênio", "Carbono", "Hélio", "Hidrogênio"], correct_option: 3, category: "CIENCIA", age_rating: 12, metadata: { hint: "Estrelas são feitas principalmente dele" } },

  { text: "Quem escreveu 'Os Lusíadas'?", options: ["Fernando Pessoa", "Luís de Camões", "José Saramago", "Eça de Queirós"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Epopeia portuguesa do século XVI" } },
  { text: "Qual é a data oficial do Dia de Portugal?", options: ["10 de junho", "5 de outubro", "1 de dezembro", "25 de abril"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Morte de Camões" } },
  { text: "Qual é o rio mais longo de Portugal?", options: ["Tejo", "Douro", "Guadiana", "Sado"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Passa por Lisboa" } },
  { text: "Qual é a montanha mais alta de Portugal continental?", options: ["Serra da Estrela", "Pico", "Serra do Gerês", "Marão"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "1993 metros de altitude" } },
  { text: "Qual é o prato típico português feito com bacalhau, cebola e batatas?", options: ["Feijoada", "Bacalhau à Brás", "Caldo verde", "Francesinha"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Ovos e batatas fritas em palha" } },
  { text: "Qual é o doce típico português feito com ovos e açúcar?", options: ["Pastel de nata", "Toucinho do céu", "Queijada", "Bolo de arroz"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Doce de conventos" } },
  { text: "Qual é a língua oficial de Angola?", options: ["Português", "Umbundo", "Quicongo", "Francês"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "País lusófono africano" } },
  { text: "Qual é o rio que corta a cidade de Lisboa?", options: ["Tejo", "Douro", "Guadiana", "Sado"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "O maior rio da Península Ibérica" } },
  { text: "Qual é a cidade conhecida como 'Cidade Invicta'?", options: ["Lisboa", "Porto", "Coimbra", "Braga"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Não se rendeu durante as invasões francesas" } },
  { text: "Qual é o livro mais vendido de todos os tempos?", options: ["Dom Quixote", "Bíblia", "O Senhor dos Anéis", "Harry Potter"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Livro sagrado do cristianismo" } },

  { text: "Quem pintou 'O Grito'?", options: ["Edvard Munch", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Expressionista norueguês" } },
  { text: "Qual é o movimento artístico de Picasso e Braque no início do século XX?", options: ["Impressionismo", "Cubismo", "Surrealismo", "Expressionismo"], correct_option: 1, category: "ARTE", age_rating: 12, metadata: { hint: "Figuras geométricas fragmentadas" } },
  { text: "Quem é considerado o pai do impressionismo?", options: ["Claude Monet", "Edgar Degas", "Pierre-Auguste Renoir", "Camille Pissarro"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Pintou 'Impressão, nascer do sol'" } },
  { text: "Qual é o material usado para fazer esculturas em mármore?", options: ["Bronze", "Madeira", "Mármore", "Terracota"], correct_option: 2, category: "ARTE", age_rating: 8, metadata: { hint: "Rocha metamórfica" } },
  { text: "Qual é a técnica de pintura que usa pigmentos misturados com água?", options: ["Óleo", "Acrílico", "Aquarela", "Tempera"], correct_option: 2, category: "ARTE", age_rating: 8, metadata: { hint: "Pintura transparente" } },
  { text: "Quem projetou a Torre Eiffel?", options: ["Gustave Eiffel", "Émile Nouguier", "Maurice Koechlin", "Stephen Sauvestre"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "Engenheiro francês" } },
  { text: "Qual é o estilo arquitetônico da Sé de Lisboa?", options: ["Românico", "Gótico", "Mistura de românico e gótico", "Renascimento"], correct_option: 2, category: "ARTE", age_rating: 12, metadata: { hint: "Mistura de românico e gótico" } },
  { text: "Qual é o movimento artístico que valoriza o subconsciente e os sonhos?", options: ["Surrealismo", "Cubismo", "Futurismo", "Dadaísmo"], correct_option: 0, category: "ARTE", age_rating: 12, metadata: { hint: "André Breton" } },
  { text: "Qual é o instrumento de cordas puxadas mais usado na orquestra?", options: ["Violino", "Viola", "Violoncelo", "Contrabaixo"], correct_option: 0, category: "ARTE", age_rating: 8, metadata: { hint: "Menor e mais agudo das cordas" } },

  { text: "Qual é o deserto mais frio do mundo?", options: ["Atacama", "Gobi", "Antártida", "Saara"], correct_option: 2, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Deserto polar" } },
  { text: "Qual é o maior arquipélago do mundo?", options: ["Indonésia", "Filipinas", "Japão", "Reino Unido"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Mais de 17.000 ilhas" } },
  { text: "Qual é o lago salgado mais profundo do mundo?", options: ["Mar Morto", "Lago Baikal", "Lago Titicaca", "Lago Cáspio"], correct_option: 3, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Entre Europa e Ásia" } },
  { text: "Qual é o único país que atravessa a linha do equador e o trópico de Capricórnio?", options: ["Brasil", "Colômbia", "Indonésia", "Quênia"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "País tropical" } },
  { text: "Qual é o oceano que banha a costa oeste de Portugal?", options: ["Atlântico", "Mediterrâneo", "Mar do Norte", "Nenhum"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Oceano que separa Europa e América" } },
  { text: "Qual é o rio que nasce em Espanha e desagua em Portugal?", options: ["Tejo", "Douro", "Guadiana", "Sado"], correct_option: 1, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "O terceiro maior da Península Ibérica" } },
  { text: "Qual é a maior ilha do Mediterrâneo?", options: ["Sicília", "Sardenha", "Córsega", "Creta"], correct_option: 3, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Parte da Grécia" } },
  { text: "Qual é o país que tem o formato de uma bota?", options: ["Itália", "Grécia", "Portugal", "Nenhum"], correct_option: 0, category: "GEOGRAFIA", age_rating: 8, metadata: { hint: "Península no Mediterrâneo" } },
  { text: "Qual é o maior país da África por população?", options: ["Egito", "Nigéria", "Etiópia", "República Democrática do Congo"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Mais de 200 milhões de habitantes" } },
  { text: "Qual é o fenômeno que causa as marés?", options: ["Vento", "Lua", "Sol", "Terra"], correct_option: 1, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Atração gravitacional" } },

  { text: "Quem foi o primeiro presidente dos Estados Unidos?", options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"], correct_option: 1, category: "HISTÓRIA", age_rating: 8, metadata: { hint: "Padre da Pátria" } },
  { text: "Em que ano começou a Guerra de Independência dos Estados Unidos?", options: ["1775", "1776", "1781", "1783"], correct_option: 0, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Batalha de Lexington e Concord" } },
  { text: "Qual foi o império que durou mais tempo na história?", options: ["Império Romano", "Império Bizantino", "Império Otomano", "Império Britânico"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "1123 anos" } },
  { text: "Quem foi o líder da Revolução Russa de 1917?", options: ["Lenin", "Stalin", "Trotsky", "Nicolau II"], correct_option: 0, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Fundador da União Soviética" } },
  { text: "Qual foi a pandemia que matou quase um terço da população europeia no século XIV?", options: ["Gripe Espanhola", "Peste Negra", "Cólera", "Malária"], correct_option: 1, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Yersinia pestis" } },
  { text: "Qual foi o tratado que acabou com a Primeira Guerra Mundial?", options: ["Tratado de Versalhes", "Tratado de Trianon", "Tratado de Saint-Germain", "Tratado de Lisboa"], correct_option: 0, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Assinado em 1919" } },
  { text: "Quem foi a primeira mulher a voar sozinha sobre o Atlântico?", options: ["Amélia Earhart", "Bessie Coleman", "Harriet Quimby", "Jacqueline Cochran"], correct_option: 0, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Desapareceu em 1937" } },
  { text: "Qual foi a primeira capital do Brasil?", options: ["Salvador", "Rio de Janeiro", "Brasília", "São Paulo"], correct_option: 0, category: "HISTÓRIA", age_rating: 8, metadata: { hint: "Primeira capital do Brasil colonial" } },
  { text: "Qual é a data da Revolução de 1974 em Portugal?", options: ["25 de abril", "1 de maio", "5 de outubro", "1 de dezembro"], correct_option: 0, category: "HISTÓRIA", age_rating: 8, metadata: { hint: "Dia da Liberdade" } },
  { text: "Qual foi o império que construiu a Grande Muralha da China?", options: ["Império Han", "Império Tang", "Império Ming", "Dinastia Qin"], correct_option: 3, category: "HISTÓRIA", age_rating: 12, metadata: { hint: "Primeiro império unificado da China" } },

  { text: "Se um desconto é de 25%, quanto se paga por um produto de 80 euros?", options: ["60", "55", "50", "45"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "80 - (80 × 0,25) = 60" } },
  { text: "Qual é a fórmula do perímetro de um retângulo?", options: ["2 × (l + L)", "l × L", "l + L", "(l + L)²"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Soma de todos os lados" } },
  { text: "Se um triângulo tem lados 3, 4 e 5, que tipo de triângulo é?", options: ["Escaleno", "Isósceles", "Equilátero", "Retângulo"], correct_option: 3, category: "MATEMATICA", age_rating: 8, metadata: { hint: "3² + 4² = 5²" } },
  { text: "Qual é o resultado de 0! (fatorial de zero)?", options: ["0", "1", "2", "Indefinido"], correct_option: 1, category: "MATEMATICA", age_rating: 12, metadata: { hint: "Por definição, 0! = 1" } },
  { text: "Se 3x + 5 = 20, quanto vale x?", options: ["3", "4", "5", "6"], correct_option: 1, category: "MATEMATICA", age_rating: 12, metadata: { hint: "3x = 15, logo x = 5" } },
  { text: "Qual é a fórmula da área de um círculo?", options: ["π × r", "2 × π × r", "π × r²", "2 × π × r²"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Pi vezes o raio ao quadrado" } },
  { text: "Se um produto custa 120 euros e tem um desconto de 15%, qual é o preço final?", options: ["102", "108", "114", "120"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "120 × 0,85 = 102" } },
  { text: "Qual é o resultado de 7²?", options: ["49", "14", "21", "28"], correct_option: 0, category: "MATEMATICA", age_rating: 8, metadata: { hint: "7 × 7 = 49" } },
  { text: "Se um ângulo mede 30°, qual é o seu suplemento?", options: ["150°", "120°", "90°", "60°"], correct_option: 0, category: "MATEMATICA", age_rating: 12, metadata: { hint: "180° - 30° = 150°" } },
  { text: "Qual é o menor número primo?", options: ["0", "1", "2", "3"], correct_option: 2, category: "MATEMATICA", age_rating: 8, metadata: { hint: "Divisível apenas por 1 e por si mesmo" } },

  { text: "Qual é a nota que vem depois de Si na escala musical?", options: ["Dó", "Ré", "Mi", "Fa"], correct_option: 0, category: "MUSICA", age_rating: 8, metadata: { hint: "A escala se repete" } },
  { text: "Qual é o instrumento de cordas que se toca com um arco?", options: ["Guitarra", "Banjo", "Violino", "Ukulele"], correct_option: 2, category: "MUSICA", age_rating: 8, metadata: { hint: "Instrumento de arco" } },
  { text: "Qual é o gênero musical que surgiu na Jamaica nos anos 1960?", options: ["Salsa", "Reggae", "Samba", "Tango"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Bob Marley" } },
  { text: "Qual é o instrumento usado para medir a altura das notas musicais?", options: ["Cronômetro", "Afinador", "Metrônomo", "Partitura"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Ajusta instrumentos" } },
  { text: "Qual é a dança típica de Portugal?", options: ["Fado", "Vira", "Chula", "Corridinho"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Dança regional portuguesa" } },
  { text: "Qual é o instrumento que produz som pela vibração de lâminas metálicas?", options: ["Gaita", "Acordeão", "Harpa", "Xilofone"], correct_option: 3, category: "MUSICA", age_rating: 8, metadata: { hint: "Percussão de lâminas" } },
  { text: "Qual é o musical da Disney que apresenta o Rei Leão?", options: ["A Bela e a Fera", "O Rei Leão", "Aladdin", "Toy Story"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Baseado no filme homônimo" } },
  { text: "Qual é o termo para uma nota que dura dois tempos?", options: ["Semínima", "Mínima", "Colcheia", "Semicolcheia"], correct_option: 1, category: "MUSICA", age_rating: 8, metadata: { hint: "Vale 2 tempos" } },
  { text: "Qual é o gênero musical que combina jazz com ritmos latinos?", options: ["Bossa nova", "Samba", "Afro-Cuban jazz", "Tango"], correct_option: 2, category: "MUSICA", age_rating: 12, metadata: { hint: "Dizzy Gillespie, Chano Pozo" } },
  { text: "Qual é o instrumento de sopro que usa uma haste dupla?", options: ["Clarinete", "Oboé", "Flauta", "Fagote"], correct_option: 1, category: "MUSICA", age_rating: 12, metadata: { hint: "Instrumento de madeira" } },

  { text: "Qual é a linguagem de programação usada para criar aplicativos Android nativos?", options: ["Java", "Kotlin", "Swift", "Python"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Desenvolvida pela JetBrains" } },
  { text: "O que significa SSD em computadores?", options: ["Solid State Drive", "Super Speed Drive", "Secure Storage Device", "System Storage Drive"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Armazenamento sem partes móveis" } },
  { text: "Qual é a versão mais recente do HTML?", options: ["HTML4", "HTML5", "HTML6", "XHTML"], correct_option: 1, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Lançado em 2014" } },
  { text: "Qual é a empresa que criou o sistema operacional iOS?", options: ["Google", "Microsoft", "Apple", "Samsung"], correct_option: 2, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "Criadora do iPhone" } },
  { text: "Qual é a unidade de medida da capacidade de armazenamento?", options: ["Bit", "Byte", "Kilobyte", "Megabyte"], correct_option: 1, category: "TECNOLOGIA", age_rating: 8, metadata: { hint: "8 bits = 1 byte" } },
  { text: "Qual é o protocolo usado para enviar e-mails?", options: ["HTTP", "FTP", "SMTP", "DNS"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Simple Mail Transfer Protocol" } },
  { text: "Qual é o dispositivo que converte sinais analógicos em digitais?", options: ["Modem", "Router", "Conversor A/D", "Switch"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Analog-to-Digital Converter" } },
  { text: "Qual é o nome do primeiro vírus de computador conhecido?", options: ["Brain", "Melissa", "ILOVEYOU", "Stuxnet"], correct_option: 0, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "1986, disquete infectado" } },
  { text: "Qual é a linguagem de consulta usada em bancos de dados relacionais?", options: ["HTML", "CSS", "SQL", "Python"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Structured Query Language" } },
  { text: "Qual é o processo de dividir um programa em pequenas partes que podem ser executadas simultaneamente?", options: ["Compilação", "Interpretação", "Multithreading", "Depuração"], correct_option: 2, category: "TECNOLOGIA", age_rating: 12, metadata: { hint: "Execução paralela" } },

  { text: "Qual é a capital da Nova Zelândia?", options: ["Auckland", "Wellington", "Christchurch", "Hamilton"], correct_option: 1, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "Na extremidade sul da Ilha do Norte" } },
  { text: "Qual é a capital do Kuwait?", options: ["Kuwait City", "Riade", "Doha", "Manama"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "País produtor de petróleo" } },
  { text: "Qual é a capital das Ilhas Bahamas?", options: ["Nassau", "Freeport", "Marsh Harbour", "George Town"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 8, metadata: { hint: "No arquipélago das Bahamas" } },
  { text: "Qual é a capital do Sri Lanka?", options: ["Colombo", "Kandy", "Galle", "Jaffna"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Antiga capital: Colombo" } },
  { text: "Qual é a capital do Uganda?", options: ["Kampala", "Entebbe", "Jinja", "Mbarara"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Na margem norte do lago Vitória" } },
  { text: "Qual é a capital do Senegal?", options: ["Dakar", "Bamako", "Abidjan", "Conacri"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Na península do Cap-Vert" } },
  { text: "Qual é a capital do Qatar?", options: ["Doha", "Dubai", "Riade", "Manama"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Sede da Copa do Mundo de 2022" } },
  { text: "Qual é a capital do Líbano?", options: ["Beirute", "Trípoli", "Sidon", "Tiro"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Na costa mediterrânea" } },
  { text: "Qual é a capital da Eritreia?", options: ["Asmara", "Keren", "Tessenei", "Massawa"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "Capital mais alta de África" } },
  { text: "Qual é a capital do Djibouti?", options: ["Djibouti", "Hargeisa", "Berbera", "Bosaso"], correct_option: 0, category: "CAPITAIS_DO_MUNDO", age_rating: 12, metadata: { hint: "País da África do Norte" } },

  { text: "Qual é o poder que tem a competência para declarar guerra em Portugal?", options: ["Presidente da República", "Assembleia da República", "Governo", "Tribunal Constitucional"], correct_option: 1, category: "POLITICA", age_rating: 16, metadata: { hint: "Parlamento português" } },
  { text: "Qual é a idade mínima para ser presidente da República em Portugal?", options: ["18", "25", "35", "40"], correct_option: 2, category: "POLITICA", age_rating: 16, metadata: { hint: "Maioridade civil mais 5 anos" } },
  { text: "Qual é o partido que atualmente governa Portugal (2024)?", options: ["PS", "PSD", "CHEGA", "IL"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "Partido Socialista" } },
  { text: "Quantos membros tem o Conselho de Estado em Portugal?", options: ["12", "14", "16", "18"], correct_option: 1, category: "POLITICA", age_rating: 16, metadata: { hint: "Órgão consultivo do Presidente da República" } },
  { text: "Qual é a função do Tribunal Constitucional em Portugal?", options: ["Julgar crimes", "Fiscalizar a constitucionalidade das leis", "Eleger o Presidente", "Governar o país"], correct_option: 1, category: "POLITICA", age_rating: 16, metadata: { hint: "Tribunal especializado" } },
  { text: "Qual é o sistema eleitoral usado para eleger a Assembleia da República em Portugal?", options: ["Uninominal", "Proporcional", "Misto", "Majoritário"], correct_option: 1, category: "POLITICA", age_rating: 16, metadata: { hint: "Método de D'Hondt" } },
  { text: "Qual é a organização que reúne os países de língua portuguesa?", options: ["Comunidade Hispânica", "Organização dos Estados Americanos", "Comunidade dos Países de Língua Portuguesa", "União Africana"], correct_option: 2, category: "POLITICA", age_rating: 12, metadata: { hint: "CPLP" } },
  { text: "Qual é o direito que permite ao Presidente da República recusar promulgar uma lei?", options: ["Direito de veto", "Direito de reclamação", "Direito de emenda", "Direito de iniciativa"], correct_option: 0, category: "POLITICA", age_rating: 16, metadata: { hint: "Poder de veto" } },
  { text: "Qual é a diferença entre uma república presidencial e uma parlamentar?", options: ["Na presidencial, o presidente é chefe de governo", "Na presidencial, há duas voltas", "Na parlamentar, o primeiro-ministro é chefe de governo", "Nenhuma"], correct_option: 2, category: "POLITICA", age_rating: 16, metadata: { hint: "No parlamentar, o governo depende do parlamento" } },
  { text: "Qual é o órgão responsável pelas eleições em Portugal?", options: ["Presidente da República", "Assembleia da República", "Tribunal Constitucional", "Comissão Nacional de Eleições"], correct_option: 3, category: "POLITICA", age_rating: 16, metadata: { hint: "CNE" } },

  { text: "Qual é o molho típico brasileiro usado em carnes grelhadas?", options: ["Chimichurri", "Molho à campanha", "Barbecue", "Pesto"], correct_option: 1, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Molho verde com alho e salsa" } },
  { text: "Qual é o doce típico português feito com amêndoas e açúcar?", options: ["Marzipã", "Toucinho do céu", "Bolo de arroz", "Pão-de-ló"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Doce de frutas secas" } },
  { text: "Qual é a bebida nacional da Argentina?", options: ["Mate", "Coca-cola", "Vinho", "Cerveja"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Infusão de erva-mate" } },
  { text: "Qual é o fruto típico da região do Algarve?", options: ["Laranja", "Figo", "Amêndoa", "Morango"], correct_option: 1, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Seco ao sol" } },
  { text: "Qual é o queijo típico da região da Serra da Estrela?", options: ["Queijo da Serra", "Queijo flamengo", "Queijo tipo", "Requeijão"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Queijo de ovelha curado" } },
  { text: "Qual é a bebida tradicional japonesa feita de arroz fermentado?", options: ["Saquê", "Shochu", "Uísque", "Chá"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "Bebida alcoólica" } },
  { text: "Qual é o país que consome mais chocolate per capita?", options: ["Suíça", "Alemanha", "Bélgica", "Estados Unidos"], correct_option: 0, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "País alpino" } },
  { text: "Qual é o tempero essencial na cozinha portuguesa?", options: ["Coentros", "Salsa", "Alecrim", "Louro"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Erva aromática muito usada" } },
  { text: "Qual é o prato típico da Madeira feito com espada e banana?", options: ["Espada com banana", "Peixe espada", "Bolo do caco", "Milho frito"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Peixe preto da Madeira" } },
  { text: "Qual é o molho italiano feito com manjericão, alho, pinoli, queijo e azeite?", options: ["Pesto", "Bolognese", "Carbonara", "Matriciana"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Molho genovês" } },

  { text: "Qual é o número de jogadores de uma equipe de handebol em campo?", options: ["5", "6", "7", "8"], correct_option: 2, category: "DESPORTO", age_rating: 8, metadata: { hint: "6 jogadores de linha + 1 goleiro" } },
  { text: "Qual é o esporte que usa uma bola laranja e um cesto elevado?", options: ["Futebol", "Vôlei", "Basquete", "Tênis"], correct_option: 2, category: "DESPORTO", age_rating: 8, metadata: { hint: "Cesto a 3,05 metros do chão" } },
  { text: "Qual é o número de buracos em um campo padrão de golfe?", options: ["9", "12", "18", "24"], correct_option: 2, category: "DESPORTO", age_rating: 12, metadata: { hint: "Jogo de 18 buracos" } },
  { text: "Qual é o tempo de uma partida oficial de futebol profissional?", options: ["60 minutos", "80 minutos", "90 minutos", "120 minutos"], correct_option: 2, category: "DESPORTO", age_rating: 8, metadata: { hint: "Dois tempos de 45 minutos" } },
  { text: "Qual é o esporte que usa uma raquete e uma pena voadora?", options: ["Tênis", "Squash", "Badminton", "Pingue-pongue"], correct_option: 2, category: "DESPORTO", age_rating: 8, metadata: { hint: "Objeto cônico de plumas" } },
  { text: "Qual é o número de jogadores de uma equipe de rugby em campo?", options: ["11", "13", "15", "17"], correct_option: 2, category: "DESPORTO", age_rating: 12, metadata: { hint: "Rugby union" } },
  { text: "Qual é o esporte que acontece em um velódromo?", options: ["Ciclismo", "Corrida", "Natação", "Boxe"], correct_option: 0, category: "DESPORTO", age_rating: 12, metadata: { hint: "Pista ciclística oval" } },
  { text: "Qual é o número de sets necessários para vencer no vôlei de praia?", options: ["1", "2", "3", "4"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "Melhor de 3 sets" } },
  { text: "Qual é o esporte que usa um taco e uma bola branca em uma mesa verde?", options: ["Snooker", "Sinuca", "Bilhar", "Polo"], correct_option: 2, category: "DESPORTO", age_rating: 12, metadata: { hint: "Jogo de bilhar" } },
  { text: "Qual é o esporte que usa um bastão e uma bola dura em um campo de grama?", options: ["Hóquei no gelo", "Beisebol", "Críquete", "Ténis"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Jogo com bola e bastão" } },

  { text: "Quem dirigiu 'Parasita', o primeiro filme não de língua inglesa a ganhar o Oscar de Melhor Filme?", options: ["Bong Joon-ho", "Park Chan-wook", "Lee Chang-dong", "Quentin Tarantino"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Diretor sul-coreano" } },
  { text: "Qual foi o primeiro filme da Pixar Animation Studios?", options: ["Toy Story", "Procurando Nemo", "Os Incríveis", "Cars"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "Lançado em 1995" } },
  { text: "Qual é o filme que tem a famosa linha de diálogo 'Hasta la vista, baby'?", options: ["Terminator 2", "Terminator", "True Lies", "Judgment Day"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "Arnold Schwarzenegger" } },
  { text: "Quem interpretou o Coringa em 'O Cavaleiro das Trevas'?", options: ["Heath Ledger", "Joker", "Jack Nicholson", "Mark Hamill"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Póstumamente ganhou Oscar" } },
  { text: "Qual foi o primeiro filme a usar tecnologia de captura de movimento facial em larga escala?", options: ["O Senhor dos Anéis", "Avatar", "Planeta dos Macacos", "Avengers"], correct_option: 1, category: "CINEMA", age_rating: 12, metadata: { hint: "James Cameron, 2009" } },
  { text: "Qual é o filme que iniciou a série 'Star Wars'?", options: ["O Império Contra-ataca", "Uma Nova Esperança", "O Retorno de Jedi", "A Ameaça Fantasma"], correct_option: 1, category: "CINEMA", age_rating: 8, metadata: { hint: "Episódio IV" } },
  { text: "Qual é o filme que ganhou o Oscar de Melhor Filme em 2020?", options: ["Parasita", "Nomadland", "Mank", "Minari"], correct_option: 1, category: "CINEMA", age_rating: 12, metadata: { hint: "Diretor sul-coreano" } },
  { text: "Quem escreveu a trilha sonora de 'Missão Impossível'?", options: ["Hans Zimmer", "John Williams", "Ennio Morricone", "Lalo Schifrin"], correct_option: 3, category: "CINEMA", age_rating: 12, metadata: { hint: "Tema icônico de 5 notas" } },
  { text: "Qual é o filme de animação da Disney que apresenta um rena chamado Sven?", options: ["Frozen", "Frozen II", "Tangled", "Moana"], correct_option: 0, category: "CINEMA", age_rating: 8, metadata: { hint: "Princesa Elsa e Anna" } },
  { text: "Qual é o filme que apresenta um tubarão branco gigante assediando uma cidade costeira?", options: ["Tubarão", "Tubarão 2", "Tubarão 3", "Tubarão 4"], correct_option: 0, category: "CINEMA", age_rating: 12, metadata: { hint: "Steven Spielberg, 1975" } },

  { text: "Qual é a língua mais estudada no mundo como língua estrangeira?", options: ["Espanhol", "Francês", "Alemão", "Inglês"], correct_option: 3, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Língua franca global" } },
  { text: "Qual é o país que tem o maior número de fusos horários?", options: ["França", "Estados Unidos", "Rússia", "Austrália"], correct_option: 0, category: "GEOGRAFIA", age_rating: 12, metadata: { hint: "Territórios ultramarinos" } },
  { text: "Qual é o animal que tem as unhas mais longas do mundo?", options: ["Girafa", "Elefante", "Urso-preguiça", "Nenhum"], correct_option: 2, category: "ANIMAIS", age_rating: 8, metadata: { hint: "Unhas usadas para ficar de cabeça para baixo" } },
  { text: "Qual é o inventor da lâmpada incandescente prática?", options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Benjamin Franklin"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Menlo Park, Nova Jersey" } },
  { text: "Qual é o esporte que foi inventado por James Naismith em 1891?", options: ["Vôlei", "Basquete", "Futebol americano", "Rugby"], correct_option: 1, category: "DESPORTO", age_rating: 8, metadata: { hint: "YMCA, Springfield, Massachusetts" } },
  { text: "Qual é o autor de 'Dom Casmurro'?", options: ["José de Alencar", "Machado de Assis", "Graciliano Ramos", "Euclides da Cunha"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Romancista realista brasileiro" } },
  { text: "Qual é o instrumento que se sopra e tem um bocal de palha?", options: ["Flauta de pan", "Ocarina", "Flauta transversal", "Pífaro"], correct_option: 0, category: "MUSICA", age_rating: 8, metadata: { hint: "Instrumento andino" } },
  { text: "Qual é o esporte que envolve correr, nadar e pedalar em sequência?", options: ["Decathlon", "Triatlo", "Pentatlo", "Heptathlon"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Três modalidades" } },
  { text: "Qual é o metal mais precioso usado em joalheria?", options: ["Ouro", "Prata", "Platina", "Paládio"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Mais denso que a prata" } },
  { text: "Qual é o tipo de nuvem que indica tempo bom imediato?", options: ["Cumulonimbus", "Cirrus", "Stratus", "Cumulus"], correct_option: 3, category: "CIENCIA", age_rating: 8, metadata: { hint: "Nuvem baixa e esponjosa" } },
  { text: "Qual é o país que produz mais vinho no mundo?", options: ["França", "Itália", "Espanha", "Estados Unidos"], correct_option: 1, category: "GASTRONOMIA", age_rating: 12, metadata: { hint: "País mediterrâneo" } },
  { text: "Qual é a fruta que tem sementes do lado de fora?", options: ["Morango", "Amora", "Framboesa", "Nenhuma"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Falso fruto" } },
  { text: "Qual é o equivalente em Fahrenheit de 0°C?", options: ["32°F", "0°F", "-32°F", "16°F"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Ponto de congelamento da água" } },
  { text: "Qual é o poema nacional de Portugal?", options: ["Os Lusíadas", "Mensagem", "Camões", "Nenhum"], correct_option: 0, category: "CULTURA_GERAL", age_rating: 12, metadata: { hint: "Autor: Luís de Camões" } },
  { text: "Qual é o processo de divisão celular que produz quatro células haploides?", options: ["Mitose", "Meiose", "Binária", "Endocitose"], correct_option: 1, category: "CIENCIA", age_rating: 12, metadata: { hint: "Divisão reduzida em metade" } },
  { text: "Qual é o jogo de tabuleiro que envolve comprar ruas e construir hotéis?", options: ["Xadrez", "Damás", "Monopólio", "Risk"], correct_option: 2, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Inventado por Charles Darrow" } },
  { text: "Qual é o idioma oficial do Brasil?", options: ["Espanhol", "Português", "Inglês", "Francês"], correct_option: 1, category: "CULTURA_GERAL", age_rating: 8, metadata: { hint: "Língua lusófona" } },
  { text: "Qual é o número atômico do carbono?", options: ["4", "6", "8", "10"], correct_option: 1, category: "CIENCIA", age_rating: 8, metadata: { hint: "6 prótons no núcleo" } },
  { text: "Qual é o conteúdo de um ovo de galinha em termos de proteína?", options: ["6g", "3g", "9g", "12g"], correct_option: 0, category: "GASTRONOMIA", age_rating: 8, metadata: { hint: "Aproximadamente 6 gramas" } },
  { text: "Qual é a distância de uma maratona em quilômetros?", options: ["30km", "42,195km", "50km", "60km"], correct_option: 1, category: "DESPORTO", age_rating: 12, metadata: { hint: "Distância oficial" } },
  { text: "Qual é o inventor da máquina a vapor prática?", options: ["James Watt", "Thomas Newcomen", "Richard Trevithick", "George Stephenson"], correct_option: 0, category: "CIENCIA", age_rating: 12, metadata: { hint: "Melhorou a eficiência" } }
];

async function main() {
  try {
    console.log('🔍 Checking for existing questions...');
    const existingPairs = await getExistingTextCategoryPairs();

  console.log('📝 Checking new questions for duplicates...');
  const unique = newQuestions.filter(q => !existingPairs.has(`${q.text}|${q.category}`));

  console.log(`📊 Total: ${newQuestions.length} | Novas: ${unique.length} | Duplicadas: ${newQuestions.length - unique.length}`);

  if (unique.length === 0) {
    console.log('✅ No new questions to insert');
    return;
  }

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

main().catch(console.error);
