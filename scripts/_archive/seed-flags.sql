-- Script SQL para inserir perguntas de bandeiras no Supabase
-- Executar no SQL Editor do Supabase

INSERT INTO questions (text, options, correct_option, image_url, category, age_rating, country_code) VALUES
-- Bandeiras Europeias
('De que país é esta bandeira?', '["Portugal", "Espanha", "França", "Itália"]', 0, 'https://flagcdn.com/w320/pt.png', 'Bandeiras', 18, 'PT'),
('De que país é esta bandeira?', '["Espanha", "Portugal", "México", "França"]', 0, 'https://flagcdn.com/w320/es.png', 'Bandeiras', 18, 'ES'),
('De que país é esta bandeira?', '["França", "Reino Unido", "Alemanha", "Bélgica"]', 0, 'https://flagcdn.com/w320/fr.png', 'Bandeiras', 18, 'FR'),
('De que país é esta bandeira?', '["Alemanha", "Bélgica", "Suíça", "Áustria"]', 0, 'https://flagcdn.com/w320/de.png', 'Bandeiras', 18, 'DE'),
('De que país é esta bandeira?', '["Itália", "Espanha", "França", "Roménia"]', 0, 'https://flagcdn.com/w320/it.png', 'Bandeiras', 18, 'IT'),
('De que país é esta bandeira?', '["Reino Unido", "Irlanda", "Austrália", "Nova Zelândia"]', 0, 'https://flagcdn.com/w320/gb.png', 'Bandeiras', 18, 'GB'),
('De que país é esta bandeira?', '["Holanda", "Bélgica", "Luxemburgo", "Dinamarca"]', 0, 'https://flagcdn.com/w320/nl.png', 'Bandeiras', 18, 'NL'),
('De que país é esta bandeira?', '["Bélgica", "Holanda", "Alemanha", "França"]', 0, 'https://flagcdn.com/w320/be.png', 'Bandeiras', 18, 'BE'),
('De que país é esta bandeira?', '["Suíça", "Áustria", "Bélgica", "Liechtenstein"]', 0, 'https://flagcdn.com/w320/ch.png', 'Bandeiras', 18, 'CH'),
('De que país é esta bandeira?', '["Áustria", "Suíça", "Alemanha", "Hungria"]', 0, 'https://flagcdn.com/w320/at.png', 'Bandeiras', 18, 'AT'),
-- Bandeiras Americanas
('De que país é esta bandeira?', '["Brasil", "Portugal", "Argentina", "Espanha"]', 0, 'https://flagcdn.com/w320/br.png', 'Bandeiras', 18, 'BR'),
('De que país é esta bandeira?', '["Estados Unidos", "México", "Canadá", "Austrália"]', 0, 'https://flagcdn.com/w320/us.png', 'Bandeiras', 18, 'US'),
('De que país é esta bandeira?', '["México", "Espanha", "Itália", "França"]', 0, 'https://flagcdn.com/w320/mx.png', 'Bandeiras', 18, 'MX'),
('De que país é esta bandeira?', '["Canadá", "Estados Unidos", "Reino Unido", "França"]', 0, 'https://flagcdn.com/w320/ca.png', 'Bandeiras', 18, 'CA'),
('De que país é esta bandeira?', '["Argentina", "Uruguai", "Paraguai", "Brasil"]', 0, 'https://flagcdn.com/w320/ar.png', 'Bandeiras', 18, 'AR'),
-- Outras Bandeiras
('De que país é esta bandeira?', '["Japão", "China", "Coreia do Sul", "Vietname"]', 0, 'https://flagcdn.com/w320/jp.png', 'Bandeiras', 18, 'JP'),
('De que país é esta bandeira?', '["China", "Japão", "Índia", "Indonésia"]', 0, 'https://flagcdn.com/w320/cn.png', 'Bandeiras', 18, 'CN'),
('De que país é esta bandeira?', '["Coreia do Sul", "Japão", "China", "Singapura"]', 0, 'https://flagcdn.com/w320/kr.png', 'Bandeiras', 18, 'KR'),
('De que país é esta bandeira?', '["Índia", "Paquistão", "Bangladesh", "Sri Lanka"]', 0, 'https://flagcdn.com/w320/in.png', 'Bandeiras', 18, 'IN'),
('De que país é esta bandeira?', '["Austrália", "Nova Zelândia", "Reino Unido", "Fiji"]', 0, 'https://flagcdn.com/w320/au.png', 'Bandeiras', 18, 'AU'),
('De que país é esta bandeira?', '["Rússia", "Ucrânia", "Bielorrússia", "Cazaquistão"]', 0, 'https://flagcdn.com/w320/ru.png', 'Bandeiras', 18, 'RU')
ON CONFLICT DO NOTHING;