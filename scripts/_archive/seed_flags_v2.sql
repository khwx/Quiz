-- Bandeiras com respostas em posições aléatórias
-- Executar no Supabase SQL Editor

INSERT INTO questions (text, options, correct_option, image_url, category, age_rating, country_code) VALUES

-- Bandeiras Europeias (resposta em posições diferentes)
('De que país é esta bandeira?', '["Espanha", "Portugal", "França", "Itália"]', 1, 'https://flagcdn.com/w320/pt.png', 'Bandeiras', 18, 'PT'),
('De que país é esta bandeira?', '["México", "Espanha", "Brasil", "França"]', 1, 'https://flagcdn.com/w320/es.png', 'Bandeiras', 18, 'ES'),
('De que país é esta bandeira?', '["Alemanha", "França", "Reino Unido", "Itália"]', 1, 'https://flagcdn.com/w320/fr.png', 'Bandeiras', 18, 'FR'),
('De que país é esta bandeira?', '["Suíça", "Alemanha", "Áustria", "Bélgica"]', 1, 'https://flagcdn.com/w320/de.png', 'Bandeiras', 18, 'DE'),
('De que país é esta bandeira?', '["França", "Itália", "Espanha", "Portugal"]', 1, 'https://flagcdn.com/w320/it.png', 'Bandeiras', 18, 'IT'),
('De que país é esta bandeira?', '["Austrália", "Reino Unido", "Irlanda", "Canadá"]', 1, 'https://flagcdn.com/w320/gb.png', 'Bandeiras', 18, 'GB'),
('De que país é esta bandeira?', '["Luxemburgo", "Holanda", "Bélgica", "Dinamarca"]', 1, 'https://flagcdn.com/w320/nl.png', 'Bandeiras', 18, 'NL'),
('De que país é esta bandeira?', '["Alemanha", "Bélgica", "Holanda", "França"]', 1, 'https://flagcdn.com/w320/be.png', 'Bandeiras', 18, 'BE'),
('De que país é esta bandeira?', '["Liechtenstein", "Suíça", "Áustria", "Eslovénia"]', 1, 'https://flagcdn.com/w320/ch.png', 'Bandeiras', 18, 'CH'),
('De que país é esta bandeira?', '["Alemanha", "Áustria", "Suíça", "Hungria"]', 1, 'https://flagcdn.com/w320/at.png', 'Bandeiras', 18, 'AT'),

-- Bandeiras Americanas (resposta em posições diferentes)
('De que país é esta bandeira?', '["Argentina", "Brasil", "Uruguai", "Chile"]', 1, 'https://flagcdn.com/w320/br.png', 'Bandeiras', 18, 'BR'),
('De que país é esta bandeira?', '["Canadá", "Estados Unidos", "México", "Brasil"]', 1, 'https://flagcdn.com/w320/us.png', 'Bandeiras', 18, 'US'),
('De que país é esta bandeira?', '["Espanha", "México", "Itália", "França"]', 1, 'https://flagcdn.com/w320/mx.png', 'Bandeiras', 18, 'MX'),
('De que país é esta bandeira?', '["Reino Unido", "Canadá", "Austrália", "França"]', 1, 'https://flagcdn.com/w320/ca.png', 'Bandeiras', 18, 'CA'),
('De que país é esta bandeira?', '["Uruguai", "Argentina", "Paraguai", "Brasil"]', 1, 'https://flagcdn.com/w320/ar.png', 'Bandeiras', 18, 'AR'),

-- Bandeiras Asiáticas
('De que país é esta bandeira?', '["China", "Japão", "Coreia do Sul", "Vietname"]', 1, 'https://flagcdn.com/w320/jp.png', 'Bandeiras', 18, 'JP'),
('De que país é esta bandeira?', '["Índia", "China", "Japão", "Tailândia"]', 1, 'https://flagcdn.com/w320/cn.png', 'Bandeiras', 18, 'CN'),
('De que país é esta bandeira?', '["Japão", "Coreia do Sul", "China", "Taiwan"]', 1, 'https://flagcdn.com/w320/kr.png', 'Bandeiras', 18, 'KR'),
('De que país é esta bandeira?', '["Sri Lanka", "Índia", "Paquistão", "Bangladesh"]', 1, 'https://flagcdn.com/w320/in.png', 'Bandeiras', 18, 'IN'),
('De que país é esta bandeira?', '["Nova Zelândia", "Austrália", "Fiji", "Reino Unido"]', 1, 'https://flagcdn.com/w320/au.png', 'Bandeiras', 18, 'AU'),

-- Outras
('De que país é esta bandeira?', '["Ucrânia", "Rússia", "Bielorrússia", "Cazaquistão"]', 1, 'https://flagcdn.com/w320/ru.png', 'Bandeiras', 18, 'RU'),
('De que país é esta bandeira?', '["Egito", "Iraque", "Síria", "Jordânia"]', 1, 'https://flagcdn.com/w320/eg.png', 'Bandeiras', 18, 'EG'),
('De que país é esta bandeira?', '["África do Sul", "Quénia", "Nigéria", "Gana"]', 1, 'https://flagcdn.com/w320/za.png', 'Bandeiras', 18, 'ZA')
ON CONFLICT DO NOTHING;