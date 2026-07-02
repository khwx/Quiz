import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const newQuestions = [
  // ═══════════════════════════ ARTE ═══════════════════════════
  {
    text: "Quem pintou 'A Noite Estrelada'?",
    options: ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Salvador Dalí"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Pintor holandês com problemas mentais" }
  },
  {
    text: "Em que museu está exposta a Mona Lisa?",
    options: ["Museu do Louvre", "Galeria Uffizi", "British Museum", "Metropolitan Museum"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Museu em Paris" }
  },
  {
    text: "Qual é o nome da escultura de Michelangelo que representa Davi?",
    options: ["Davi", "Moisés", "Pietà", "O Escravo Rebelde"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Leva o nome do personagem bíblico" }
  },
  {
    text: "Que movimento artístico Salvador Dalí representava?",
    options: ["Surrealismo", "Cubismo", "Impressionismo", "Expressionismo"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Relacionado com sonhos e o subconsciente" }
  },
  {
    text: "Quem esculpiu a estátua da Liberdade (parte estrutural)?",
    options: ["Gustave Eiffel", "Frédéric Auguste Bartholdi", "António Gaudí", "Le Corbusier"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Engenheiro francês da Torre Eiffel" }
  },
  {
    text: "Qual é o nome da técnica de pintura a óleo sobre paredes secas?",
    options: ["Afresco", "Tempera", "Guache", "Aquarela"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Usada na Capela Sistina" }
  },
  {
    text: "Em que país nasceu o pintor Pablo Picasso?",
    options: ["Espanha", "França", "Itália", "Portugal"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "País ibérico" }
  },
  {
    text: "Qual artista é conhecido por cortar a sua própria orelha?",
    options: ["Vincent van Gogh", "Paul Gauguin", "Edvard Munch", "Paul Cézanne"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Pintor holandês do pós-impressionismo" }
  },
  {
    text: "Que material usou Alexander Calder para as suas esculturas cinéticas?",
    options: ["Chapa de metal", "Madeira", "Vidro", "Mármore"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Esculturas que se movem com o vento" }
  },
  {
    text: "Qual é o nome do famoso fresco de Michelangelo no teto da Capela Sistina?",
    options: ["A Criação de Adão", "O Juízo Final", "A Anunciação", "A Última Ceia"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Representa Deus a tocar em Adão" }
  },
  {
    text: "Quem pintou 'Guernica', um dos quadros mais famosos sobre a guerra?",
    options: ["Pablo Picasso", "Joan Miró", "Salvador Dalí", "Francis Bacon"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Artista espanhol cubista" }
  },
  {
    text: "Que tipo de arte é o 'street art' ou arte urbana?",
    options: ["Arte contemporânea", "Arte clássica", "Arte abstrata", "Arte renascentista"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Feita nas ruas com spray e tinta" }
  },
  {
    text: "Quem criou a instalação artística 'O Carneiro' com um animal preservado em formaldeído?",
    options: ["Damien Hirst", "Jeff Koons", "Banksy", "Andy Warhol"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Artista britânico conhecido por choque" }
  },
  {
    text: "Qual é a obra mais famosa de Leonardo da Vinci além da Mona Lisa?",
    options: ["A Última Ceia", "A Primavera", "O Nascimento de Vénus", "A Escola de Atenas"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Pintura mural num refectório em Milão" }
  },
  {
    text: "Em que museu está o quadro 'A Persistência da Memória' de Dalí?",
    options: ["MoMA", "Tate Modern", "Guggenheim", "Prado"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Museu de arte moderna em Nova Iorque" }
  },
  {
    text: "Que artista português é famoso pelas azulejarias do metropolitano de Lisboa?",
    options: ["Júlio Pomar", "Paula Rego", "Joana Vasconcelos", "Vieira da Silva"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Artista plástico lisboeta" }
  },
  {
    text: "Qual movimento artístico usava pontos de cor para criar imagens?",
    options: ["Pontilhismo", "Fauvismo", "Futurismo", "Dadaísmo"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Georges Seurat foi o seu maior expoente" }
  },
  {
    text: "Quem pintou 'O Grito', uma das obras mais icónicas da história?",
    options: ["Edvard Munch", "Wassily Kandinsky", "Gustav Klimt", "Egon Schiele"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Pintor norueguês expressionista" }
  },
  {
    text: "Que material é usado na escultura 'Balões' de Jeff Koons?",
    options: ["Aço inox polido", "Bronze", "Mármore", "Resina"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Superfície espelhada muito brilhante" }
  },
  {
    text: "Qual é a técnica de gravura que usa ácido para dissolver o metal?",
    options: ["Água-forte", "Xilogravura", "Litografia", "Calcografia"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "O nome descreve o processo químico" }
  },
  {
    text: "Quem pintou 'O Nascimento de Vénus'?",
    options: ["Sandro Botticelli", "Rafael", "Caravaggio", "Tiziano"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Pintor renascentista italiano" }
  },
  {
    text: "Que estilo artístico utilizava formas geométricas para retratar a realidade?",
    options: ["Cubismo", "Impressionismo", "Romantismo", "Realismo"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Picasso e Braque foram os fundadores" }
  },
  {
    text: "Em que cidade se encontra a Pinacoteca Ambrosiana?",
    options: ["Milão", "Roma", "Florencia", "Veneza"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Cidade do norte de Itália" }
  },
  {
    text: "Qual artista contemporâneo é famoso por recortes e colagens de celebridades?",
    options: ["Andy Warhol", "Jean-Michel Basquiat", "Keith Haring", "Roy Lichtenstein"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Ícone do Pop Art americano" }
  },
  {
    text: "Que arte milenar consiste em enrolar fios coloridos numa tábua?",
    options: ["Ojo de Dios", "Mosaico", "Tapeçaria", "Filigrana"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Arte tradicional indígena mexicana" }
  },
  {
    text: "Quem foi a pintora italiana que se tornou num ícone do Renascimento e era conhecida pela sua força?",
    options: ["Artemisia Gentileschi", "Sofonisba Anguissola", "Lavinia Fontana", "Elisabetta Sirani"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Pintora baroca que retratou Judith" }
  },
  {
    text: "Que tipo de arte é feita digitalmente usando software como Photoshop?",
    options: ["Arte digital", "Arte generativa", "Arte conceitual", "Arte performática"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Usa computadores e tablets" }
  },
  {
    text: "Qual é o nome da técnica japonesa de decorar madeira com ouro?",
    options: ["Laquê", "Origami", "Ikebana", "Ukiyo-e"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Arte tradicional japonesa com verniz" }
  },
  {
    text: "Quem pintou 'A Dama do Arminho'?",
    options: ["Leonardo da Vinci", "Rafael", "Michelangelo", "Botticelli"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "O mesmo da Mona Lisa" }
  },
  {
    text: "Que movimento artístico rejeitou a razão e valorizou as emoções?",
    options: ["Romantismo", "Iluminismo", "Neoclassicismo", "Realismo"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Séculos XVIII-XIX, oposto ao Iluminismo" }
  },
  {
    text: "Qual é a arte de criar figuras com papel dobrado?",
    options: ["Origami", "Decoupage", "Collage", "Découpage"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Arte tradicional japonesa" }
  },
  {
    text: "Quem criou a famosa instalação 'As Cadeiras' no pátio do Museu Serralves?",
    options: ["Joana Vasconcelos", "Paula Rego", "Julio Pomar", "Luis Dourdil"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Artista portuguesa contemporânea" }
  },
  {
    text: "Que técnica artística usa pequenos pedaços de cerâmica, vidro ou pedra?",
    options: ["Mosaico", "Afresco", "Grafitis", "Galeria"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 8,
    metadata: { hint: "Usada nos chãos e paredes de templos romanos" }
  },
  {
    text: "Em que cidade se encontra a Galleria dell'Accademia com o Davi de Michelangelo?",
    options: ["Florencia", "Roma", "Nápoles", "Veneza"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Cidade da Toscana, berço do Renascimento" }
  },
  {
    text: "Qual artista é conhecido pelas suas latas de sopa Campbell's?",
    options: ["Andy Warhol", "Roy Lichtenstein", "Jasper Johns", "Robert Rauschenberg"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Ícone do Pop Art dos anos 60" }
  },
  {
    text: "Que estilo de arquitetura é caracterizado por linhas curvas e formas orgânicas?",
    options: ["Art Nouveau", "Art Deco", "Brutalismo", "Minimalismo"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Gaudí é o seu maior expoente" }
  },
  {
    text: "Quem pintou 'O Beijo', uma das obras mais românticas da história?",
    options: ["Gustav Klimt", "Edvard Munch", "Pablo Picasso", "Amedeo Modigliani"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Pintor austríaco da Secessão de Viena" }
  },
  {
    text: "Que tipo de arte é feita com a manipulação de luz e sombras?",
    options: ["Instalação luminosa", "Pintura a óleo", "Escultura", "Gravura"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Dan Flavin usava neon, James Turrell usa luz natural" }
  },
  {
    text: "Qual é o nome do famoso festival de arte contemporânea que ocorre em Veneza?",
    options: ["Bienal de Veneza", "Documenta", "Frieze", "Art Basel"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Ocorre de dois em dois anos" }
  },
  {
    text: "Quem foi o arquiteto que desenhou a Ópera de Sydney?",
    options: ["Jørn Utzon", "Frank Gehry", "Zaha Hadid", "Le Corbusier"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Arquiteto dinamarquês" }
  },
  {
    text: "Que tipo de arte usa o corpo humano como meio de expressão?",
    options: ["Performance", "Instalação", "Pintura", "Escultura"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Yoko Ono e Marina Abramović são conhecidas por isto" }
  },
  {
    text: "Qual é a obra-prima de Rafael que se encontra nos Museus Vaticanos?",
    options: ["A Escola de Atenas", "A Criação de Adão", "A Anunciação", "A Transfiguração"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 16,
    metadata: { hint: "Frescos nos Palácios Vaticanos" }
  },
  {
    text: "Que arte portuguesa consiste em trabalhar metais preciosos com fios finos?",
    options: ["Filigrana", "Cerâmica", "Azulejo", "Tapeçaria"],
    correct_option: 0,
    category: "ARTE",
    age_rating: 12,
    metadata: { hint: "Tradição de Gondomar e Póvoa de Lanhoso" }
  },

  // ═══════════════════════════ CINEMA ═══════════════════════════
  {
    text: "Quem realizou 'A Lista de Schindler'?",
    options: ["Steven Spielberg", "Martin Scorsese", "James Cameron", "Christopher Nolan"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Realizador americano de blockbusters" }
  },
  {
    text: "Em que filme aparece a frase 'Eu sou teu pai'?",
    options: ["Star Wars", "O Senhor dos Anéis", "Matrix", "O Poderoso Chefinho"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Saga espacial dos anos 70" }
  },
  {
    text: "Qual é o nome do dinossauro robotico em Jurassic Park?",
    options: ["T-Rex", "Velociraptor", "Brontossauro", "Triceratops"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "O maior predador do filme" }
  },
  {
    text: "Quem interpretou Jack Dawson em 'Titanic'?",
    options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Matt Damon"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Ator americano, também em Inception" }
  },
  {
    text: "Qual filme ganhou o Oscar de Melhor Filme em 1994?",
    options: ["Forrest Gump", "Pulp Fiction", "O Shawshank Redemption", "Quatro Casamentos e um Funeral"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Tom Hanks interpreta o protagonista" }
  },
  {
    text: "Em que série de filmes Harry Potter estuda?",
    options: ["Hogwarts", "Narnia", "Wakanda", "Midgar"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Escola de magia britânica" }
  },
  {
    text: "Quem realizou 'Avatar' (2009)?",
    options: ["James Cameron", "Ridley Scott", "Steven Spielberg", "Peter Jackson"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Realizador de Titanic e Aliens" }
  },
  {
    text: "Qual é o nome do vilão em 'O Cavaleiro das Trevas'?",
    options: ["Coringa", "Duas Caras", "Pinguim", "Charada"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Interpretado por Heath Ledger" }
  },
  {
    text: "Em que filme os personagens entram dentro de sonhos para roubar segredos?",
    options: ["Inception", "Interstellar", "The Matrix", "Blade Runner"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Christopher Nolan, com Leonardo DiCaprio" }
  },
  {
    text: "Qual é a franquia de filmes com o personagem Indiana Jones?",
    options: ["Caçadores da Arca Perdida", "O Senhor dos Anéis", "Star Trek", "O Exorcista"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Aventuras arqueológicas de um professor" }
  },
  {
    text: "Quem interpretou Neo na trilogia The Matrix?",
    options: ["Keanu Reeves", "Tom Cruise", "Will Smith", "Brad Pitt"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Ator canadense também em John Wick" }
  },
  {
    text: "Qual é o filme de animação da Pixar sobre um robot num planeta deserto?",
    options: ["WALL-E", "Up", "Cars", "Finding Nemo"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Robot que recicla lixo no espaço" }
  },
  {
    text: "Em que filme aparece o personagem Darth Vader?",
    options: ["Star Wars", "Star Trek", "Guardiões da Galáxia", "Duna"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Saga de George Lucas" }
  },
  {
    text: "Quem realizou a trilogia 'O Senhor dos Anéis'?",
    options: ["Peter Jackson", "George Lucas", "Steven Spielberg", "James Cameron"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Realizador neozelandês" }
  },
  {
    text: "Qual filme tem a famosa cena do 'eu voou, Jack, eu voei'?",
    options: ["Titanic", "Avatar", "Gravity", "O Regresso"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Filme sobre o naufrágio de um transatlântico" }
  },
  {
    text: "Em que filme James Cameron explorou o Titanic no fundo do mar?",
    options: ["Titanic", "Abyss", "Avatar", "Aliens"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Filme de 1997 com Leonardo DiCaprio" }
  },
  {
    text: "Qual é o nome do actor que interpreta o Homem-Aranha no MCU?",
    options: ["Tom Holland", "Tobey Maguire", "Andrew Garfield", "Robert Downey Jr."],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Ator britânico mais jovem" }
  },
  {
    text: "Em que filme aparece a frase 'Há sempre um plano'?",
    options: ["Os Impossíveis", "Blow", "O Lobo de Wall Street", "Heat"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Filme de Steven Soderbergh com roubos" }
  },
  {
    text: "Quem interpretou o Coringa em 'O Cavaleiro das Trevas'?",
    options: ["Heath Ledger", "Joaquin Phoenix", "Jared Leto", "Jack Nicholson"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Ator australiano que faleceu em 2008" }
  },
  {
    text: "Qual é o filme de 2023 que se tornou no maior de todos os tempos em bilheteira?",
    options: ["Oppenheimer", "Barbie", "Avatar 2", "Super Mario Bros"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Filme de Christopher Nolan" }
  },
  {
    text: "Em que franquia aparece o personagem Gollum?",
    options: ["O Senhor dos Anéis", "Harry Potter", "As Crónicas de Narnia", "Star Wars"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "A criatura que quer o anel" }
  },
  {
    text: "Qual é o primeiro filme da franquia Jurassic Park?",
    options: ["Jurassic Park", "O Mundo Perdido", "Jurassic World", "Jurassic Park III"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Lançado em 1993" }
  },
  {
    text: "Quem realizou 'Clube da Luta'?",
    options: ["David Fincher", "Quentin Tarantino", "Martin Scorsese", "Stanley Kubrick"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 16,
    metadata: { hint: "Realizador americano de thrillers sombrios" }
  },
  {
    text: "Qual é o nome do robô em WALL-E que se apaixona?",
    options: ["EVE", "ALICE", "CORTANA", "ALEXA"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Robot feminina de exploração vegetal" }
  },
  {
    text: "Em que filme aparece o personagem Terminator?",
    options: ["O Exterminador do Futuro", "Robocop", "O Predador", "Blade Runner"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Arnold Schwarzenegger diz 'Até à vista, bebé'" }
  },
  {
    text: "Qual é o filme mais longo da saga O Senhor dos Anéis (versão estendida)?",
    options: ["O Retorno do Rei", "A Sociedade do Anel", "As Duas Torres", "O Hobbit"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "O terceiro filme, com mais de 4 horas" }
  },
  {
    text: "Quem interpreta Wolverine nos filmes dos X-Men?",
    options: ["Hugh Jackman", "Ryan Reynolds", "Chris Evans", "Chris Hemsworth"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 12,
    metadata: { hint: "Ator australiano e cantor" }
  },
  {
    text: "Em que filme uma IA chamada HAL 9000 se rebela contra a tripulação?",
    options: ["2001: Uma Odisseia no Espaço", "Blade Runner", "O Exterminador do Futuro", "Interstellar"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 16,
    metadata: { hint: "Clássico de Stanley Kubrick" }
  },
  {
    text: "Qual é o nome do vilão em O Rei Leão?",
    options: ["Scar", "Mufasa", "Timão", "Pumba"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "O tio traiçoeiro de Simba" }
  },
  {
    text: "Em que filme aparece a frase 'Que a Força esteja contigo'?",
    options: ["Star Wars", "Star Trek", "Duna", "Blade Runner"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Slogan da saga criada por George Lucas" }
  },
  {
    text: "Qual filme de animação da Disney tem a personagem Elsa?",
    options: ["Frozen", "Moana", "Rapunzel", "Cinderela"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "A rainha do gelo que diz 'Let it go'" }
  },
  {
    text: "Quem realizou 'O Padrinho'?",
    options: ["Francis Ford Coppola", "Martin Scorsese", "Steven Spielberg", "Brian De Palma"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 16,
    metadata: { hint: "Realizador ítalo-americano" }
  },
  {
    text: "Em que filme um grupo de super-heróis se une pela primeira vez no MCU?",
    options: ["Os Vingadores", "X-Men", "Os Guardiões da Galáxia", "A Justice League"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Lançado em 2012, com Iron Man, Capitão América, etc." }
  },
  {
    text: "Qual é o primeiro filme da saga Harry Potter?",
    options: ["A Pedra Filosofal", "A Câmara Secreta", "O Prisioneiro de Azkaban", "O Cálice de Fogo"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Harry descobre que é mago" }
  },
  {
    text: "Quem interpretou Jack Sparrow nos Piratas das Caraíbas?",
    options: ["Johnny Depp", "Orlando Bloom", "Brad Pitt", "George Clooney"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "Ator americano conhecido por Papai Noel" }
  },
  {
    text: "Em que filme o personagem Andy Dufresne foge da prisão por 19 anos?",
    options: ["O Shawshank Redemption", "Cidadão Kane", "Clube da Luta", "Pulp Fiction"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 16,
    metadata: { hint: "Adaptado de Stephen King, com Tim Robbins" }
  },
  {
    text: "Qual é o filme da Pixar que se passa dentro da mente de uma rapariga?",
    options: ["Divertida-mente", "Inside Out", "Coco", "Soul"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 8,
    metadata: { hint: "As emoções控制am a Riley" }
  },
  {
    text: "Quem realizou 'O Regresso' com Leonardo DiCaprio?",
    options: ["Alejandro González Iñárritu", "Alfonso Cuarón", "Guillermo del Toro", "Denis Villeneuve"],
    correct_option: 0,
    category: "CINEMA",
    age_rating: 16,
    metadata: { hint: "Realizador mexicano, ganhou 3 Oscars seguidos" }
  },

  // ═══════════════════════════ GASTRONOMIA ═══════════════════════════
  {
    text: "Qual é o ingrediente principal do guacamole?",
    options: ["Abacate", "Tomate", "Cebola", "Limão"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Fruta verde e cremosa do México" }
  },
  {
    text: "De que país é originária a pizza?",
    options: ["Itália", "Grécia", "Espanha", "Turquia"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "País da bota" }
  },
  {
    text: "Qual é a bebida fermentada feita de uva?",
    options: ["Vinho", "Cerveja", "Cidra", "Sake"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Bebida acompanhada com queijo" }
  },
  {
    text: "Que prato português é feito com arroz, marisco e colorau?",
    options: ["Arroz de marisco", "Bacalhau à Brás", "Arroz de pato", "Cataplana"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Prato típico da costa portuguesa" }
  },
  {
    text: "Qual é o nome do molho italiano feito com manjericão e pinhões?",
    options: ["Pesto", "Ragu", "Carbonara", "Bolognese"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Molho verde da Ligúria" }
  },
  {
    text: "De que país é originário o sushi?",
    options: ["Japão", "China", "Coreia", "Tailândia"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "País do sol nascente" }
  },
  {
    text: "Que ingrediente é essencial na feijoada portuguesa?",
    options: ["Feijão", "Arroz", "Batata", "Massa"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Legume que dá nome ao prato" }
  },
  {
    text: "Qual é a sobremesa francesa feita com ovos e açúcar caramelizado?",
    options: ["Crème brûlée", "Tiramisu", "Panna cotta", "Serradura"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Nome significa 'creme queimado'" }
  },
  {
    text: "Que espécie de peixe é o bacalhau em inglês?",
    options: ["Cod", "Tuna", "Salmon", "Haddock"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Os portugueses comem 365 receitas dele" }
  },
  {
    text: "Qual é o queijo italiano usado na pizza margherita?",
    options: ["Mozzarella", "Parmesão", "Ricotta", "Gorgonzola"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Queijo mole de leite de búfala" }
  },
  {
    text: "De que país é originária a lasanha?",
    options: ["Itália", "França", "Espanha", "Grécia"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Prato com camadas de massa e molho" }
  },
  {
    text: "Qual é o tempero que dá a cor amarela ao curry?",
    options: ["Açafrão", "Pimentão", "Cúrcuma", "Manjericão"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Especiaria mais cara do mundo" }
  },
  {
    text: "Que prato espanhol é feito com arroz, açafrão e frutos do mar?",
    options: ["Paella", "Tortilla", "Gazpacho", "Tapas"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Prato típico da região de Valência" }
  },
  {
    text: "Qual é a bebida fermentada feita de cevada e lúpulo?",
    options: ["Cerveja", "Vinho", "Sidra", "Champanhe"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Bebida mais consumida do mundo" }
  },
  {
    text: "Que doce português é feito com ovos e açúcar e tem forma de esfera?",
    options: ["Ovos moles", "Pastel de nata", "Pão de ló", "Toucinho do céu"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Doce típico de Aveiro" }
  },
  {
    text: "Qual é o nome do prato japonês com massa e caldo?",
    options: ["Ramen", "Sushi", "Tempura", "Sashimi"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Prato quente com noodles" }
  },
  {
    text: "De que fruta se faz a marmelada?",
    options: ["Marmelo", "Maçã", "Pêra", "Laranja"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "A fruta dá o nome ao doce" }
  },
  {
    text: "Qual é o prato italiano feito com massa recheada?",
    options: ["Ravioli", "Esparguete", "Pene", "Risoto"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Massa em forma de almofada" }
  },
  {
    text: "Que carne é usada no tradicional churrasco argentino?",
    options: ["Vaca", "Porco", "Frango", "Cordeiro"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "A Argentina é famosa pela sua carne" }
  },
  {
    text: "Qual é o nome do molho italiano feito com tomate e manjericão?",
    options: ["Marinara", "Pesto", "Alfredo", "Carbonara"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Molho de marinheiros" }
  },
  {
    text: "Que prato francês é uma sopa de cebola gratinada?",
    options: ["Soupe à l'oignon", "Ratatouille", "Bouillabaisse", "Crème brûlée"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Sopa com queijo derretido por cima" }
  },
  {
    text: "Qual é o ingrediente principal do hummus?",
    options: ["Grão-de-bico", "Feijão", "Lentilha", "Ricota"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Legume pequeno e redondo" }
  },
  {
    text: "De que país é originário o churrasco rodízio?",
    options: ["Brasil", "Argentina", "Portugal", "Espanha"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "País da América do Sul conhecido pelo futebol" }
  },
  {
    text: "Qual é o nome do queijo português curado da Serra da Estrela?",
    options: ["Queijo da Serra", "Queijo de Azeitão", "Queijo de São Jorge", "Queijo do Pico"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Queijo de ovelha com pasta mole" }
  },
  {
    text: "Que prato grego é feito com folhas de vinha d'olha recheadas?",
    options: ["Dolmas", "Moussaka", "Gyros", "Souvlaki"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Recheio de arroz e ervas" }
  },
  {
    text: "Qual é o nome da sobremesa italiana com café e mascarpone?",
    options: ["Tiramisu", "Panna cotta", "Gelato", "Cannoli"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Nome significa 'levanta-me'" }
  },
  {
    text: "Que fruta é usada na preparação do mole mexicano?",
    options: ["Chocolate", "Abacate", "Manga", "Limão"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Ingrediente principal do chocolate" }
  },
  {
    text: "Qual é o prato coreano fermentado feito de vegetais?",
    options: ["Kimchi", "Sushi", "Ramen", "Tempura"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Prato picante e fermentado" }
  },
  {
    text: "De que é feito o traditionally italiano risoto?",
    options: ["Arroz", "Massa", "Batata", "Quinoa"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Grão que é cozinhado lentamente" }
  },
  {
    text: "Qual é o nome do pão sírio/redondo achatado?",
    options: ["Pita", "Naan", "Focaccia", "Baguette"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Pão que pode ser recheado" }
  },
  {
    text: "Que prato português é feito com peixe frito e batatas?",
    options: ["Peixe grelhado", "Bacalhau à Brás", "Arroz de polvo", "Caldeirada"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Simples e saboroso" }
  },
  {
    text: "Qual é o nome do doce turco feito com nozes e mel?",
    options: ["Baklava", "Loukoumades", "Halva", "Turkish Delight"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Camadas de massa folhada" }
  },
  {
    text: "Que bebida é feita da fermentação da cana-de-açúcar?",
    options: ["Rum", "Vodka", "Gim", "Tequila"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 16,
    metadata: { hint: "Bebida típica do Caribe" }
  },
  {
    text: "Qual é o nome do prato indiano com iogurte e especiarias?",
    options: ["Tandoori", "Curry", "Biryani", "Samosa"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Cozinhado num forno de barro" }
  },
  {
    text: "Que fruta é o principal ingrediente da guacamole mexicana?",
    options: ["Abacate", "Tomate", "Laranja", "Manga"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Fruta verde com caroço grande" }
  },
  {
    text: "Qual é o nome do prato japonês de massa frita?",
    options: ["Tempura", "Sushi", "Ramen", "Udon"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "Legumes e marisco em massa crocante" }
  },
  {
    text: "De que país é originário o pad thai?",
    options: ["Tailândia", "Vietname", "China", "Japão"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 8,
    metadata: { hint: "País do sudeste asiático" }
  },
  {
    text: "Qual é o ingrediente secreto na cocacola (original)?",
    options: ["Extrato de noz de cola", "Canela", "Gengibre", "Licor de laranja"],
    correct_option: 0,
    category: "GASTRONOMIA",
    age_rating: 12,
    metadata: { hint: "Ingrediente que dá o nome à bebida" }
  },

  // ═══════════════════════════ MÚSICA ═══════════════════════════
  {
    text: "Quem é conhecido como o 'Rei do Pop'?",
    options: ["Michael Jackson", "Elvis Presley", "Prince", "Freddie Mercury"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Cantor americano com luva de lantejoula" }
  },
  {
    text: "De que banda era Freddie Mercury o vocalista?",
    options: ["Queen", "Beatles", "Rolling Stones", "Led Zeppelin"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Banda britânica de rock" }
  },
  {
    text: "Que instrumento tem 6 cordas e é mais associado ao rock?",
    options: ["Guitarra", "Piano", "Violino", "Bateria"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Instrumento elétrico solista" }
  },
  {
    text: "Qual é o nome do álbum mais vendido de todos os tempos?",
    options: ["Thriller", "Back in Black", "The Dark Side of the Moon", "Hotel California"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Álbum de Michael Jackson, 1982" }
  },
  {
    text: "Em que cidade nasceu The Beatles?",
    options: ["Liverpool", "Londres", "Manchester", "Edimburgo"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Cidade portuária do norte de Inglaterra" }
  },
  {
    text: "Que género musical nasceu em Nova Orleães nos EUA?",
    options: ["Jazz", "Rock", "Pop", "Hip-hop"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Género com improvisação e trompete" }
  },
  {
    text: "Quem compôs 'Quatro Estações'?",
    options: ["Antonio Vivaldi", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Johann Sebastian Bach"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Compositor barco italiano" }
  },
  {
    text: "Que banda portuguesa cantou 'Saudade, Saudade' no Festival da Eurovisão?",
    options: ["Ana Moura", "Mariza", "Miguel Araújo", "Capitão Fausto"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Fado contemporâneo" }
  },
  {
    text: "Qual é o nome do instrumento de teclas mais comum?",
    options: ["Piano", "Acordeão", "Harpa", "Órgão"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "88 teclas pretas e brancas" }
  },
  {
    text: "Quem cantou 'Bohemian Rhapsody'?",
    options: ["Queen", "Beatles", "Pink Floyd", "The Who"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Banda de Freddie Mercury" }
  },
  {
    text: "Que género musical é associado ao Bob Marley?",
    options: ["Reggae", "Ska", "Rocksteady", "Dancehall"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Género da Jamaica" }
  },
  {
    text: "Quantas sinfonias compôs Beethoven?",
    options: ["9", "7", "12", "15"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 16,
    metadata: { hint: "A última tem coro" }
  },
  {
    text: "Que instrumento de sopro é feito de metal e tem válvulas?",
    options: ["Trompete", "Flauta", "Clarinete", "Saxofone"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Instrumento de jazz e orquestra" }
  },
  {
    text: "Quem é o cantor português conhecido como 'O Rei do Fado'?",
    options: ["Amália Rodrigues", "Carlos do Carmo", "Mariza", "Mísia"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "A rainha do fado" }
  },
  {
    text: "Que banda britânica lançou 'Stairway to Heaven'?",
    options: ["Led Zeppelin", "Pink Floyd", "The Rolling Stones", "The Who"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Banda de hard rock dos anos 70" }
  },
  {
    text: "Quantas cordas tem um violino?",
    options: ["4", "6", "5", "3"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Menos que uma guitarra" }
  },
  {
    text: "Que género musical é o rap e o hip-hop?",
    options: ["Hip-hop", "Rock", "Pop", "Jazz"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Género urbano com rimas faladas" }
  },
  {
    text: "Quem compôs a 'Sonata para Piano n.º 14' (Clair de Lune)?",
    options: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Frédéric Chopin", "Claude Debussy"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 16,
    metadata: { hint: "Compositor alemão surdo" }
  },
  {
    text: "Que instrumento tem cordas e é tocado com um arco?",
    options: ["Violino", "Guitarra", "Harpa", "Banjo"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Instrumento de cordas mais agudo" }
  },
  {
    text: "Qual é o nome do festival de música mais famoso de Portugal?",
    options: ["NOS Alive", "Rock in Rio", "Super Bock Super Rock", "MEO Sudoeste"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Festival em Lisboa" }
  },
  {
    text: "Quem cantou 'Imagine'?",
    options: ["John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Membro dos Beatles" }
  },
  {
    text: "Que género musical é o Fado?",
    options: ["Música tradicional portuguesa", "Música popular brasileira", "Música espanhola", "Música italiana"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Género lisboeta com guitarra portuguesa" }
  },
  {
    text: "Quantos membros tinha a banda The Beatles?",
    options: ["4", "5", "3", "6"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "John, Paul, George e Ringo" }
  },
  {
    text: "Que instrumento de percussão é usado para marcar o ritmo?",
    options: ["Bateria", "Guitarra", "Piano", "Flauta"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Conjunto de tambores e pratos" }
  },
  {
    text: "Quem cantou 'A little song about a big man' (What's Up)?",
    options: ["4 Non Blondes", "No Doubt", "The Cranberries", "Alanis Morissette"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Banda feminina americana dos anos 90" }
  },
  {
    text: "Que piano tem apenas 88 teclas?",
    options: ["Piano de cauda", "Piano vertical", "Teclado digital", "Harpsicórdio"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Instrumento de concerto" }
  },
  {
    text: "Em que ano os Beatles se separaram?",
    options: ["1970", "1965", "1975", "1980"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 16,
    metadata: { hint: "Fim da década de 60" }
  },
  {
    text: "Que乐器 tem cordas e é tocado ao dedo, comum no fado?",
    options: ["Guitarra portuguesa", "Violão", "Bandolim", "Ukulele"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Instrumento de 12 cordas em forma de leque" }
  },
  {
    text: "Quem é conhecido como o 'Rei do Rock and Roll'?",
    options: ["Elvis Presley", "Chuck Berry", "Little Richard", "Buddy Holly"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Cantor com pentelho e quadril icónico" }
  },
  {
    text: "Que género musical é o EDM (Electronic Dance Music)?",
    options: ["Música eletrónica", "Rock alternativo", "Jazz fusion", "Blues"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Música feita com computadores e sintetizadores" }
  },
  {
    text: "Quantas cordas tem uma guitarra padrão?",
    options: ["6", "4", "8", "12"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "E, A, D, G, B, e" }
  },
  {
    text: "Quem compôs 'Para Elisa'?",
    options: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Franz Schubert"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Pequena peça para piano" }
  },
  {
    text: "Que banda cantou 'Smells Like Teen Spirit'?",
    options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Banda de grunge dos anos 90" }
  },
  {
    text: "De que país é originário o Tango?",
    options: ["Argentina", "Espanha", "Brasil", "Portugal"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "País do Rio da Prata" }
  },
  {
    text: "Quem cantou 'Purple Rain'?",
    options: ["Prince", "Michael Jackson", "David Bowie", "Stevie Wonder"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Artista multi-instrumentista Minneapolis" }
  },
  {
    text: "Que instrumento tem teclas e é soprado por tubos?",
    options: ["Órgão", "Piano", "Acordeão", "Sanfona"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Instrumento de igreja" }
  },
  {
    text: "Qual é o nome do primeiro álbum dos Beatles?",
    options: ["Please Please Me", "Help!", "Revolver", "Sgt. Pepper's"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 12,
    metadata: { hint: "Lançado em 1963" }
  },
  {
    text: "Que género musical é cantado em língua portuguesa do Brasil?",
    options: ["Samba", "Fado", "Flamenco", "Tango"],
    correct_option: 0,
    category: "MUSICA",
    age_rating: 8,
    metadata: { hint: "Género do carnaval" }
  },

  // ═══════════════════════════ POLÍTICA ═══════════════════════════
  {
    text: "Quem foi o primeiro presidente dos Estados Unidos?",
    options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Presidente da independência americana" }
  },
  {
    text: "Em que ano caiu o Muro de Berlim?",
    options: ["1989", "1991", "1979", "1961"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Fim da Guerra Fria" }
  },
  {
    text: "Qual é o órgão supremo de soberania em Portugal?",
    options: ["Assembleia da República", "Conselho de Ministros", "Tribunal Constitucional", "Presidência da República"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Parlamento português" }
  },
  {
    text: "Quem escreveu 'O Príncipe', um tratado sobre política?",
    options: ["Nicolau Maquiavel", "Tomás Hobbes", "John Locke", "Jean-Jacques Rousseau"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Pensador florentino do Renascimento" }
  },
  {
    text: "Em que ano foi a Revolução Francesa?",
    options: ["1789", "1776", "1804", "1815"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Queda da Bastilha" }
  },
  {
    text: "Qual é a forma de governo de Portugal?",
    options: ["República semi-presidencial", "Monarquia constitucional", "República presidencial", "República parlamentar"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Tem presidente e primeiro-ministro" }
  },
  {
    text: "Quem foi Nelson Mandela?",
    options: ["Presidente da África do Sul", "Presidente dos EUA", "Primeiro-ministro da Índia", "Líder da Rússia"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Lutou contra o apartheid" }
  },
  {
    text: "O que é a ONU?",
    options: ["Organização das Nações Unidas", "Organização Nacional Unida", "Ordem dos Novos Unidos", "Oficina Nacional Única"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Organização mundial de paz" }
  },
  {
    text: "Em que ano Portugal aderiu à CEE (atual UE)?",
    options: ["1986", "1974", "1992", "2000"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Juntamente com a Espanha" }
  },
  {
    text: "Quem foi Winston Churchill?",
    options: ["Primeiro-ministro britânico", "Rei de Inglaterra", "General americano", "Papa"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Líder durante a Segunda Guerra Mundial" }
  },
  {
    text: "O que é a Constituição?",
    options: ["Lei fundamental de um país", "Lei fiscal", "Lei eleitoral", "Lei penal"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Documento que define os direitos e deveres" }
  },
  {
    text: "Em que ano foi a Revolução dos Cravos em Portugal?",
    options: ["1974", "1964", "1984", "1976"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "25 de abril, fim do Estado Novo" }
  },
  {
    text: "Qual é a capital dos Estados Unidos?",
    options: ["Washington D.C.", "Nova Iorque", "Los Angeles", "Chicago"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 8,
    metadata: { hint: "Cidade com o nome do primeiro presidente" }
  },
  {
    text: "Quem foi Mahatma Gandhi?",
    options: ["Líder da independência da Índia", "Presidente da China", "Rei do Egipto", "General francês"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Lutou pela independência pacificamente" }
  },
  {
    text: "O que é o Parlamento?",
    options: ["Assembleia legislativa", "Tribunal superior", "Exército", "Igreja"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Órgão que faz as leis" }
  },
  {
    text: "Qual é o partido que está no poder em Portugal em 2024?",
    options: ["PSD", "PS", "Bloco de Esquerda", "CDS"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Partido Social-Democrata" }
  },
  {
    text: "Em que ano nasceu a Organização das Nações Unidas?",
    options: ["1945", "1939", "1950", "1918"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Fim da Segunda Guerra Mundial" }
  },
  {
    text: "Quem foi Abraham Lincoln?",
    options: ["Presidente dos EUA que aboliu a escravatura", "Primeiro presidente americano", "General da guerra civil", "Inventor"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "16.º presidente dos Estados Unidos" }
  },
  {
    text: "O que é o voto secreto?",
    options: ["Voto anónimo", "Voto público", "Voto online", "Voto obrigatório"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Ninguém sabe em quem votaste" }
  },
  {
    text: "Qual é a moeda da União Europeia?",
    options: ["Euro", "Libra", "Dólar", "Franco"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 8,
    metadata: { hint: "Moeda usada em 20 países da UE" }
  },
  {
    text: "Em que ano Portugal tornou-se república?",
    options: ["1910", "1926", "1974", "1890"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Fim da monarquia" }
  },
  {
    text: "Quem foi Karl Marx?",
    options: ["Filósofo e economista", "Rei da Prússia", "General napoleónico", "Papa"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Escreveu 'O Capital'" }
  },
  {
    text: "O que é a UE?",
    options: ["União Europeia", "União Eclesiástica", "União Escolar", "União Empresarial"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 8,
    metadata: { hint: "Organização de 27 países europeus" }
  },
  {
    text: "Qual é a função do Presidente da República em Portugal?",
    options: ["Representar o país", "Fazer leis", "Gerir o orçamento", "Comandar a polícia"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Chefe de Estado" }
  },
  {
    text: "Em que ano terminou a Primeira Guerra Mundial?",
    options: ["1918", "1914", "1939", "1945"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "4 anos de conflito" }
  },
  {
    text: "Quem foi Dalai Lama?",
    options: ["Líder espiritual do Tibete", "Imperador da China", "Rei do Nepal", "General mongol"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Líder budista no exílio" }
  },
  {
    text: "O que é o Direito?",
    options: ["Sistema de leis de um país", "Ciência política", "Economia", "Filosofia"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Conjunto de normas jurídicas" }
  },
  {
    text: "Qual é o nome da sede do governo português?",
    options: ["Palácio de São Bento", "Palácio de Belém", "Assembleia da República", "Supremo Tribunal"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Sede do governo e do parlamento" }
  },
  {
    text: "Quem foi José Sócrates?",
    options: ["Primeiro-ministro de Portugal", "Presidente da República", "Líder da oposição", "Governador do Banco de Portugal"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "PM entre 2005 e 2011" }
  },
  {
    text: "Em que ano começou a Segunda Guerra Mundial?",
    options: ["1939", "1914", "1945", "1950"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Alemanha invadiu a Polónia" }
  },
  {
    text: "O que é a NATO?",
    options: ["Organização do Tratado do Atlântico Norte", "Organização das Nações Unidas", "União Europeia", "Banco Europeu"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Aliança militar ocidental" }
  },
  {
    text: "Qual é a função do Primeiro-Ministro em Portugal?",
    options: ["Dirigir o governo", "Representar o país", "Fazer leis", "Presidir julgamentos"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 12,
    metadata: { hint: "Chefe do governo" }
  },
  {
    text: "Quem foi Fidel Castro?",
    options: ["Líder de Cuba", "Presidente dos EUA", "Rei de Espanha", "General argentino"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Revolução cubana de 1959" }
  },
  {
    text: "O que é o sufrágio universal?",
    options: ["Direito de voto de todos os cidadãos", "Voto apenas de homens", "Voto apenas de ricos", "Voto secreto"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Todos podem votar independentemente de género ou renda" }
  },
  {
    text: "Em que ano foi assinado o Tratado de Lisboa?",
    options: ["2007", "1992", "2001", "2010"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Reformou a União Europeia" }
  },
  {
    text: "Qual é o nome do tribunal supremo de Portugal?",
    options: ["Supremo Tribunal de Justiça", "Tribunal Constitucional", "Supremo Tribunal Administrativo", "Tribunal Penal Internacional"],
    correct_option: 0,
    category: "POLITICA",
    age_rating: 16,
    metadata: { hint: "Tribunal de último recurso" }
  },

  // ═══════════════════════════ TECNOLOGIA ═══════════════════════════
  {
    text: "Quem fundou a Apple?",
    options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Jeff Bezos"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Fundador que vestia preto sempre" }
  },
  {
    text: "O que é a Internet?",
    options: ["Rede mundial de computadores", "Um programa de computador", "Um tipo de telemóvel", "Um jogo"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Rede que liga computadores em todo o mundo" }
  },
  {
    text: "Qual é o nome do sistema operativo da Google para telemóveis?",
    options: ["Android", "iOS", "Windows", "Linux"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Sistema verde com robot" }
  },
  {
    text: "Quem inventou a World Wide Web?",
    options: ["Tim Berners-Lee", "Steve Jobs", "Bill Gates", "Vint Cerf"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Cientista britânico no CERN" }
  },
  {
    text: "O que é um smartphone?",
    options: ["Telemóvel inteligente", "Computador portátil", "Consola de jogos", "Televisão"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Telemóvel com ecrã tátil" }
  },
  {
    text: "Qual é a linguagem de programação mais usada para websites?",
    options: ["JavaScript", "Python", "C++", "Java"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Linguagem que torna websites interativos" }
  },
  {
    text: "Quem é o fundador da Microsoft?",
    options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Larry Page"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Empresário americano e filántropo" }
  },
  {
    text: "O que é a inteligência artificial?",
    options: ["Máquinas que aprendem e raciocinam", "Um tipo de robot", "Um programa de jogos", "Uma rede social"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Computadores que simulam inteligência humana" }
  },
  {
    text: "Qual é o nome da assistente virtual da Apple?",
    options: ["Siri", "Alexa", "Cortana", "Google Assistant"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Assistente no iPhone" }
  },
  {
    text: "O que é o Wi-Fi?",
    options: ["Rede sem fios", "Um tipo de cabo", "Um browser", "Um telemóvel"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Conexão à Internet sem cabos" }
  },
  {
    text: "Quem fundou o Facebook (agora Meta)?",
    options: ["Mark Zuckerberg", "Larry Page", "Jack Dorsey", "Elon Musk"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Fundador jovem de Harvard" }
  },
  {
    text: "O que é um algoritmo?",
    options: ["Conjunto de passos para resolver um problema", "Um tipo de virus", "Um computador", "Uma aplicação"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Receita passo-a-passo para computadores" }
  },
  {
    text: "Qual é a empresa de Elon Musk?",
    options: ["Tesla", "Apple", "Google", "Amazon"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Carros elétricos e foguetões" }
  },
  {
    text: "O que é o cloud computing?",
    options: ["Computação na nuvem", "Computador portátil", "Programa de nuvens", "Jogo de nuvens"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Armazenamento e processamento remoto" }
  },
  {
    text: "Qual é o nome da empresa que criou o YouTube?",
    options: ["Google", "Meta", "Amazon", "Microsoft"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Mesma empresa do Google" }
  },
  {
    text: "O que é um chip de computador?",
    options: ["Circuito integrado miniaturizado", "Uma peça de chocolate", "Um disco rígido", "Um ecrã"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Cérebro do computador" }
  },
  {
    text: "Qual é a empresa que criou o iPhone?",
    options: ["Apple", "Samsung", "Google", "Nokia"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Empresa da maçã" }
  },
  {
    text: "O que é o blockchain?",
    options: ["Cadeia de blocos digitais seguros", "Um tipo de cadeia", "Um programa de bloco", "Um site"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Tecnologia por trás das criptomoedas" }
  },
  {
    text: "Quem fundou a Amazon?",
    options: ["Jeff Bezos", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Maior loja online do mundo" }
  },
  {
    text: "O que é o Bluetooth?",
    options: ["Conexão sem fios de curta distância", "Um tipo de WiFi", "Um programa", "Uma rede social"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Usado para ligar auscultadores sem fios" }
  },
  {
    text: "Qual é a empresa que desenvolveu o ChatGPT?",
    options: ["OpenAI", "Google", "Meta", "Microsoft"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Empresa de IA fundada por Sam Altman" }
  },
  {
    text: "O que é um cookie na Internet?",
    options: ["Ficheiro de dados no browser", "Um bolo virtual", "Um vírus", "Um tipo de rede"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Guarda preferências do utilizador" }
  },
  {
    text: "Qual é a linguagem de programação mais usada em ciência de dados?",
    options: ["Python", "JavaScript", "C#", "PHP"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Linguagem com nome de serpente" }
  },
  {
    text: "O que é um drone?",
    options: ["Veículo aéreo não tripulado", "Um tipo de helicóptero", "Um robô terrestre", "Um submarino"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Aviãozinho controlado remotamente" }
  },
  {
    text: "Quem é o CEO da Tesla?",
    options: ["Elon Musk", "Jeff Bezos", "Mark Zuckerberg", "Tim Cook"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Também fundador da SpaceX" }
  },
  {
    text: "O que é a realidade virtual (VR)?",
    options: ["Ambiente digital imersivo", "Um jogo de realidade", "Uma televisão 3D", "Um cinema"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Usa óculos especiais" }
  },
  {
    text: "Qual é a empresa que criou o Instagram?",
    options: ["Meta", "Google", "Twitter", "Snapchat"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Agora pertence ao Facebook" }
  },
  {
    text: "O que é a hacking ética?",
    options: ["Invadir sistemas com autorização", "Criar vírus", "Roubar dados", "Destruir computadores"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Encontrar falhas de segurança legalmente" }
  },
  {
    text: "Qual é o nome do satélite artificial lançado pela URSS em 1957?",
    options: ["Sputnik", "Apollo", "Voyager", "Hubble"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Primeiro satélite no espaço" }
  },
  {
    text: "O que é o machine learning?",
    options: ["Aprendizagem automática por máquinas", "Um curso online", "Um tipo de computador", "Uma rede social"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Sub-ramo da inteligência artificial" }
  },
  {
    text: "Qual é a unidade de medida da velocidade de processamento?",
    options: ["Hertz (Hz)", "Bytes", "Pixels", "Metros"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Frequência de ciclos por segundo" }
  },
  {
    text: "O que é o 5G?",
    options: ["Quinta geração de rede móvel", "Um tipo de WiFi", "Um jogo", "Um programa"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Rede de telemóvel mais rápida" }
  },
  {
    text: "Quem inventou o telefone?",
    options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Inventor escocês-canadense" }
  },
  {
    text: "O que é um firewall?",
    options: ["Sistema de segurança de rede", "Um muro de proteção física", "Um tipo de vírus", "Um browser"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Protege a rede contra acessos não autorizados" }
  },
  {
    text: "Qual é a empresa que criou o Windows?",
    options: ["Microsoft", "Apple", "Google", "Samsung"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Sistema operativo mais usado em PCs" }
  },
  {
    text: "O que é um USB?",
    options: ["Porta de ligação universal", "Um disco rígido", "Uma rede sem fios", "Um processador"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 8,
    metadata: { hint: "Cabo para ligar dispositivos" }
  },
  {
    text: "Qual é a startup portuguesa de mobilidade elétrica?",
    options: ["EVA", "Via Verde", "Bolt", "Uber"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Car-sharing elétrico em Lisboa" }
  },
  {
    text: "O que é o open source?",
    options: ["Código aberto e acessível", "Um tipo de loja", "Um programa pago", "Uma rede fechada"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 16,
    metadata: { hint: "Software com código disponível para todos" }
  },
  {
    text: "Qual é o nome do processador fabricado pela Intel?",
    options: ["Core", "Ryzen", "Snapdragon", "M1"],
    correct_option: 0,
    category: "TECNOLOGIA",
    age_rating: 12,
    metadata: { hint: "Série Core i3, i5, i7, i9" }
  }
];

async function main() {
  console.log(`📝 Total de perguntas novas: ${newQuestions.length}`);
  
  const toInsert = newQuestions.map(q => ({
    ...q,
    text: q.text.trim().charAt(0).toUpperCase() + q.text.trim().slice(1),
    metadata: { ...q.metadata, hint: q.metadata.hint }
  }));

  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const { data, error } = await supabase.from('questions').insert(batch).select();
    
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
    } else {
      inserted += data.length;
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${data.length} perguntas inseridas`);
    }
  }

  console.log(`\n🎉 Total inserido: ${inserted}/${newQuestions.length}`);
  
  // Update backup
  const { data: allQuestions } = await supabase.from('questions').select('*').order('created_at');
  if (allQuestions) {
    writeFileSync('questions_backup.json', JSON.stringify(allQuestions, null, 2));
    console.log(`📦 Backup atualizado: ${allQuestions.length} perguntas totais`);
  }
  
  // Final distribution
  const { data: final } = await supabase.from('questions').select('category');
  if (final) {
    const cats = {};
    for (const q of final) { cats[q.category] = (cats[q.category] || 0) + 1; }
    console.log('\n📊 Distribuição final:');
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`  ${count.toString().padStart(3)} | ${cat}`);
    });
    console.log(`  ${final.length.toString().padStart(3)} | TOTAL`);
  }
}

main().catch(console.error);
