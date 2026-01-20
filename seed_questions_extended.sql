-- EXTENDED SEED DATA FOR QUIZ GAME (CORRIGIDO v2)
-- Run this in Supabase SQL Editor to "feed" the database with more questions.
-- NOTE: Correct Option is now an INDEX (0, 1, 2, 3) not the text name.

-- =============================================
-- AGE: 7-9 (Idade: 8)
-- =============================================

-- TEMA: ANIMAIS
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é o animal mais alto do mundo?', '["Elefante", "Girafa", "Zebra", "Urso"]', 1, 'animais', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Quantas pernas tem uma aranha?', '["4", "6", "8", "10"]', 2, 'animais', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('O que é que as abelhas produzem?', '["Leite", "Mel", "Sumo", "Água"]', 1, 'animais', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual destes animais vive na água e na terra?', '["Sapo", "Peixe", "Gato", "Pássaro"]', 0, 'animais', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('O Nemo é que tipo de peixe?', '["Tubarão", "Peixe-Palhaço", "Baleia", "Salmão"]', 1, 'animais', 8) ON CONFLICT (text, category) DO NOTHING;

-- TEMA: CULTURA GERAL
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é a cor da bata do Pai Natal?', '["Azul", "Verde", "Vermelho", "Amarelo"]', 2, 'cultura geral', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Quantos dias tem uma semana?', '["5", "6", "7", "10"]', 2, 'cultura geral', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Em que estação do ano vamos à praia?', '["Inverno", "Verão", "Outono", "Primavera"]', 1, 'cultura geral', 8) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é a cor do céu num dia de sol?', '["Verde", "Azul", "Roxo", "Laranja"]', 1, 'cultura geral', 8) ON CONFLICT (text, category) DO NOTHING;

-- =============================================
-- AGE: 10-14 (Idade: 12)
-- =============================================

-- TEMA: CIÊNCIA
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é o planeta mais próximo do Sol?', '["Vénus", "Marte", "Mercúrio", "Terra"]', 2, 'ciência', 12) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('O que as plantas precisam para fazer fotossíntese?', '["Luz Solar", "Hambúrguer", "Sombra", "Vento"]', 0, 'ciência', 12) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é o símbolo da água?', '["CO2", "H2O", "O2", "NaCl"]', 1, 'ciência', 12) ON CONFLICT (text, category) DO NOTHING;

-- TEMA: DESPORTO
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Quantos jogadores tem uma equipa de futebol em campo?', '["9", "10", "11", "12"]', 2, 'desporto', 12) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Em que desporto se usa uma raquete e um volante?', '["Ténis", "Badminton", "Padel", "Ping Pong"]', 1, 'desporto', 12) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Cristiano Ronaldo é conhecido por que número?', '["5", "7", "9", "10"]', 1, 'desporto', 12) ON CONFLICT (text, category) DO NOTHING;

-- =============================================
-- AGE: 15-17 (Idade: 16)
-- =============================================

-- TEMA: CINEMA
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Quem realizou o filme "Titanic"?', '["Steven Spielberg", "James Cameron", "Christopher Nolan", "George Lucas"]', 1, 'cinema', 16) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual ator interpreta o Homem de Ferro?', '["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"]', 2, 'cinema', 16) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Em "Harry Potter", qual é a casa de Harry?', '["Slytherin", "Hufflepuff", "Ravenclaw", "Gryffindor"]', 3, 'cinema', 16) ON CONFLICT (text, category) DO NOTHING;

-- TEMA: CULTURA GERAL
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é a capital da Austrália?', '["Sydney", "Melbourne", "Canberra", "Perth"]', 2, 'cultura geral', 16) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Quem pintou a Mona Lisa?', '["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"]', 2, 'cultura geral', 16) ON CONFLICT (text, category) DO NOTHING;

-- =============================================
-- AGE: ADULTS (Idade: 18)
-- =============================================

INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Em que ano terminou a II Guerra Mundial?', '["1940", "1945", "1950", "1939"]', 1, 'cultura geral', 18) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é o elemento químico com o símbolo Au?', '["Prata", "Cobre", "Ouro", "Alumínio"]', 2, 'ciência', 18) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Quem escreveu "Os Maias"?', '["Fernando Pessoa", "José Saramago", "Eça de Queirós", "Camilo Castelo Branco"]', 2, 'cultura geral', 18) ON CONFLICT (text, category) DO NOTHING;
INSERT INTO questions (text, options, correct_option, category, age_rating) VALUES
('Qual é o maior país do mundo em área?', '["China", "EUA", "Rússia", "Canadá"]', 2, 'cultura geral', 18) ON CONFLICT (text, category) DO NOTHING;
