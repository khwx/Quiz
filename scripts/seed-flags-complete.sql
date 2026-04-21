-- SQL COMPLETO: TODAS AS BANDEIRAS DO MUNDO (~80 países) - FORMATO SVG
-- Executar no SQL Editor do Supabase Dashboard
-- SVG é melhor qualidade - não pixeliza!

INSERT INTO questions (text, options, correct_option, image_url, category, age_rating, country_code) VALUES

-- EUROPA (Europa Ocidental e Central)
('De que país é esta bandeira?', '["Portugal", "Espanha", "França", "Itália"]', 0, 'https://flagcdn.com/w320/pt.svg', 'Bandeiras', 18, 'PT'),
('De que país é esta bandeira?', '["Espanha", "Portugal", "México", "França"]', 0, 'https://flagcdn.com/w320/es.svg', 'Bandeiras', 18, 'ES'),
('De que país é esta bandeira?', '["França", "Reino Unido", "Alemanha", "Bélgica"]', 0, 'https://flagcdn.com/w320/fr.svg', 'Bandeiras', 18, 'FR'),
('De que país é esta bandeira?', '["Alemanha", "Bélgica", "Suíça", "Áustria"]', 0, 'https://flagcdn.com/w320/de.svg', 'Bandeiras', 18, 'DE'),
('De que país é esta bandeira?', '["Itália", "Espanha", "França", "Grécia"]', 0, 'https://flagcdn.com/w320/it.svg', 'Bandeiras', 18, 'IT'),
('De que país é esta bandeira?', '["Reino Unido", "Irlanda", "Austrália", "Nova Zelândia"]', 0, 'https://flagcdn.com/w320/gb.svg', 'Bandeiras', 18, 'GB'),
('De que país é esta bandeira?', '["Holanda", "Bélgica", "Luxemburgo", "Dinamarca"]', 0, 'https://flagcdn.com/w320/nl.svg', 'Bandeiras', 18, 'NL'),
('De que país é esta bandeira?', '["Bélgica", "Holanda", "Alemanha", "França"]', 0, 'https://flagcdn.com/w320/be.svg', 'Bandeiras', 18, 'BE'),
('De que país é esta bandeira?', '["Suíça", "Áustria", "Bélgica", "Liechtenstein"]', 0, 'https://flagcdn.com/w320/ch.svg', 'Bandeiras', 18, 'CH'),
('De que país é esta bandeira?', '["Áustria", "Suíça", "Alemanha", "Hungria"]', 0, 'https://flagcdn.com/w320/at.svg', 'Bandeiras', 18, 'AT'),
('De que país é esta bandeira?', '["Grécia", "Itália", "Chipre", "Albânia"]', 0, 'https://flagcdn.com/w320/gr.svg', 'Bandeiras', 18, 'GR'),

-- EUROPA NÓRDICA E BÁLTICA
('De que país é esta bandeira?', '["Suécia", "Noruega", "Finlândia", "Dinamarca"]', 0, 'https://flagcdn.com/w320/se.svg', 'Bandeiras', 18, 'SE'),
('De que país é esta bandeira?', '["Noruega", "Suécia", "Dinamarca", "Islândia"]', 0, 'https://flagcdn.com/w320/no.svg', 'Bandeiras', 18, 'NO'),
('De que país é esta bandeira?', '["Dinamarca", "Noruega", "Suécia", "Finlândia"]', 0, 'https://flagcdn.com/w320/dk.svg', 'Bandeiras', 18, 'DK'),
('De que país é esta bandeira?', '["Finlândia", "Suécia", "Noruega", "Estónia"]', 0, 'https://flagcdn.com/w320/fi.svg', 'Bandeiras', 18, 'FI'),
('De que país é esta bandeira?', '["Irlanda", "Reino Unido", "Escócia", "País de Gales"]', 0, 'https://flagcdn.com/w320/ie.svg', 'Bandeiras', 18, 'IE'),
('De que país é esta bandeira?', '["Escócia", "Irlanda", "Inglaterra", "País de Gales"]', 0, 'https://flagcdn.com/w320/iso.svg', 'Bandeiras', 18, 'ISO'),

-- EUROPA DE LESTE
('De que país é esta bandeira?', '["Polónia", "Ucrânia", "República Checa", "Eslováquia"]', 0, 'https://flagcdn.com/w320/pl.svg', 'Bandeiras', 18, 'PL'),
('De que país é esta bandeira?', '["Ucrânia", "Rússia", "Bielorrússia", "Moldávia"]', 0, 'https://flagcdn.com/w320/ua.svg', 'Bandeiras', 18, 'UA'),
('De que país é esta bandeira?', '["República Checa", "Eslováquia", "Polónia", "Hungria"]', 0, 'https://flagcdn.com/w320/cz.svg', 'Bandeiras', 18, 'CZ'),
('De que país é esta bandeira?', '["Hungria", "Áustria", "Roménia", "Sérvia"]', 0, 'https://flagcdn.com/w320/hu.svg', 'Bandeiras', 18, 'HU'),
('De que país é esta bandeira?', '["Roménia", "Hungria", "Moldávia", "Bulgária"]', 0, 'https://flagcdn.com/w320/ro.svg', 'Bandeiras', 18, 'RO'),
('De que país é esta bandeira?', '["Bulgária", "Roménia", "Grécia", "Sérvia"]', 0, 'https://flagcdn.com/w320/bg.svg', 'Bandeiras', 18, 'BG'),
('De que país é esta bandeira?', '["Sérvia", "Croácia", "Eslovénia", "Bósnia"]', 0, 'https://flagcdn.com/w320/rs.svg', 'Bandeiras', 18, 'RS'),
('De que país é esta bandeira?', '["Croácia", "Sérvia", "Eslovénia", "Bósnia"]', 0, 'https://flagcdn.com/w320/hr.svg', 'Bandeiras', 18, 'HR'),
('De que país é esta bandeira?', '["Eslovénia", "Croácia", "Sérvia", "Eslováquia"]', 0, 'https://flagcdn.com/w320/si.svg', 'Bandeiras', 18, 'SI'),
('De que país é esta bandeira?', '["Eslováquia", "República Checa", "Eslovénia", "Polónia"]', 0, 'https://flagcdn.com/w320/sk.svg', 'Bandeiras', 18, 'SK'),

-- AMÉRICA DO SUL
('De que país é esta bandeira?', '["Brasil", "Portugal", "Argentina", "Espanha"]', 0, 'https://flagcdn.com/w320/br.svg', 'Bandeiras', 18, 'BR'),
('De que país é esta bandeira?', '["Argentina", "Uruguai", "Paraguai", "Brasil"]', 0, 'https://flagcdn.com/w320/ar.svg', 'Bandeiras', 18, 'AR'),
('De que país é esta bandeira?', '["Chile", "Peru", "Equador", "Colômbia"]', 0, 'https://flagcdn.com/w320/cl.svg', 'Bandeiras', 18, 'CL'),
('De que país é esta bandeira?', '["Colômbia", "Venezuela", "Equador", "Peru"]', 0, 'https://flagcdn.com/w320/co.svg', 'Bandeiras', 18, 'CO'),
('De que país é esta bandeira?', '["Peru", "Chile", "Bolívia", "Equador"]', 0, 'https://flagcdn.com/w320/pe.svg', 'Bandeiras', 18, 'PE'),
('De que país é esta bandeira?', '["Venezuela", "Colômbia", "Brasil", "Peru"]', 0, 'https://flagcdn.com/w320/ve.svg', 'Bandeiras', 18, 'VE'),
('De que país é esta bandeira?', '["Equador", "Peru", "Colômbia", "Venezuela"]', 0, 'https://flagcdn.com/w320/ec.svg', 'Bandeiras', 18, 'EC'),
('De que país é esta bandeira?', '["Bolívia", "Peru", "Chile", "Paraguai"]', 0, 'https://flagcdn.com/w320/bo.svg', 'Bandeiras', 18, 'BO'),
('De que país é esta bandeira?', '["Uruguai", "Argentina", "Paraguai", "Brasil"]', 0, 'https://flagcdn.com/w320/uy.svg', 'Bandeiras', 18, 'UY'),
('De que país é esta bandeira?', '["Paraguai", "Uruguai", "Argentina", "Bolívia"]', 0, 'https://flagcdn.com/w320/py.svg', 'Bandeiras', 18, 'PY'),

-- AMÉRICA DO NORTE E CENTRAL
('De que país é esta bandeira?', '["Estados Unidos", "México", "Canadá", "Austrália"]', 0, 'https://flagcdn.com/w320/us.svg', 'Bandeiras', 18, 'US'),
('De que país é esta bandeira?', '["México", "Espanha", "Itália", "França"]', 0, 'https://flagcdn.com/w320/mx.svg', 'Bandeiras', 18, 'MX'),
('De que país é esta bandeira?', '["Canadá", "Estados Unidos", "Reino Unido", "França"]', 0, 'https://flagcdn.com/w320/ca.svg', 'Bandeiras', 18, 'CA'),
('De que país é esta bandeira?', '["Cuba", "Jamaica", "Haiti", "República Dominicana"]', 0, 'https://flagcdn.com/w320/cu.svg', 'Bandeiras', 18, 'CU'),
('De que país é esta bandeira?', '["Jamaica", "Cuba", "Haiti", "Trinidad"]', 0, 'https://flagcdn.com/w320/jm.svg', 'Bandeiras', 18, 'JM'),
('De que país é esta bandeira?', '["Costa Rica", "Panamá", "Nicarágua", "Honduras"]', 0, 'https://flagcdn.com/w320/cr.svg', 'Bandeiras', 18, 'CR'),
('De que país é esta bandeira?', '["Panamá", "Costa Rica", "Nicarágua", "Honduras"]', 0, 'https://flagcdn.com/w320/pa.svg', 'Bandeiras', 18, 'PA'),
('De que país é esta bandeira?', '["Guatemala", "Honduras", "El Salvador", "Nicarágua"]', 0, 'https://flagcdn.com/w320/gt.svg', 'Bandeiras', 18, 'GT'),

-- ÁSIA
('De que país é esta bandeira?', '["Japão", "China", "Coreia do Sul", "Vietnã"]', 0, 'https://flagcdn.com/w320/jp.svg', 'Bandeiras', 18, 'JP'),
('De que país é esta bandeira?', '["China", "Japão", "Índia", "Indonésia"]', 0, 'https://flagcdn.com/w320/cn.svg', 'Bandeiras', 18, 'CN'),
('De que país é esta bandeira?', '["Coreia do Sul", "Japão", "China", "Singapura"]', 0, 'https://flagcdn.com/w320/kr.svg', 'Bandeiras', 18, 'KR'),
('De que país é esta bandeira?', '["Índia", "Paquistão", "Bangladesh", "Sri Lanka"]', 0, 'https://flagcdn.com/w320/in.svg', 'Bandeiras', 18, 'IN'),
('De que país é esta bandeira?', '["Austrália", "Nova Zelândia", "Reino Unido", "Fiji"]', 0, 'https://flagcdn.com/w320/au.svg', 'Bandeiras', 18, 'AU'),
('De que país é esta bandeira?', '["Tailândia", "Vietnã", "Laos", "Camboja"]', 0, 'https://flagcdn.com/w320/th.svg', 'Bandeiras', 18, 'TH'),
('De que país é esta bandeira?', '["Vietnã", "Tailândia", "Laos", "Camboja"]', 0, 'https://flagcdn.com/w320/vn.svg', 'Bandeiras', 18, 'VN'),
('De que país é esta bandeira?', '["Indonésia", "Malásia", "Singapura", "Brunei"]', 0, 'https://flagcdn.com/w320/id.svg', 'Bandeiras', 18, 'ID'),
('De que país é esta bandeira?', '["Filipinas", "Indonésia", "Malásia", "Singapura"]', 0, 'https://flagcdn.com/w320/ph.svg', 'Bandeiras', 18, 'PH'),
('De que país é esta bandeira?', '["Singapura", "Malásia", "Indonésia", "Brunei"]', 0, 'https://flagcdn.com/w320/sg.svg', 'Bandeiras', 18, 'SG'),
('De que país é esta bandeira?', '["Malásia", "Indonésia", "Singapura", "Brunei"]', 0, 'https://flagcdn.com/w320/my.svg', 'Bandeiras', 18, 'MY'),
('De que país é esta bandeira?', '["Mianmar", "Tailândia", "Laos", "Camboja"]', 0, 'https://flagcdn.com/w320/mm.svg', 'Bandeiras', 18, 'MM'),
('De que país é esta bandeira?', '["Bangladesh", "Índia", "Mianmar", "Sri Lanka"]', 0, 'https://flagcdn.com/w320/bd.svg', 'Bandeiras', 18, 'BD'),
('De que país é esta bandeira?', '["Pakistão", "Índia", "Afeganistão", "Bangladesh"]', 0, 'https://flagcdn.com/w320/pk.svg', 'Bandeiras', 18, 'PK'),
('De que país é esta bandeira?', '["Afeganistão", "Paquistão", "Irã", "Turcomenistão"]', 0, 'https://flagcdn.com/w320/af.svg', 'Bandeiras', 18, 'AF'),

-- ÁSIA (Médio Oriente)
('De que país é esta bandeira?', '["Rússia", "Ucrânia", "Bielorrússia", "Cazaquistão"]', 0, 'https://flagcdn.com/w320/ru.svg', 'Bandeiras', 18, 'RU'),
('De que país é esta bandeira?', '["Turquia", "Grécia", "Chipre", "Síria"]', 0, 'https://flagcdn.com/w320/tr.svg', 'Bandeiras', 18, 'TR'),
('De que país é esta bandeira?', '["Emirados Árabes Unidos", "Arábia Saudita", "Qatar", "Koweit"]', 0, 'https://flagcdn.com/w320/ae.svg', 'Bandeiras', 18, 'AE'),
('De que país é esta bandeira?', '["Arábia Saudita", "Emirados Árabes Unidos", "Qatar", "Omã"]', 0, 'https://flagcdn.com/w320/sa.svg', 'Bandeiras', 18, 'SA'),
('De que país é esta bandeira?', '["Israel", "Palestina", "Líbano", "Jordânia"]', 0, 'https://flagcdn.com/w320/il.svg', 'Bandeiras', 18, 'IL'),
('De que país é esta bandeira?', '["Irã", "Iraque", "Paquistão", "Afeganistão"]', 0, 'https://flagcdn.com/w320/ir.svg', 'Bandeiras', 18, 'IR'),
('De que país é esta bandeira?', '["Iraque", "Irã", "Arábia Saudita", "Koweit"]', 0, 'https://flagcdn.com/w320/iq.svg', 'Bandeiras', 18, 'IQ'),

-- ÁFRICA
('De que país é esta bandeira?', '["Egito", "Marrocos", "Argélia", "Tunísia"]', 0, 'https://flagcdn.com/w320/eg.svg', 'Bandeiras', 18, 'EG'),
('De que país é esta bandeira?', '["África do Sul", "Nigéria", "Quénia", "Gana"]', 0, 'https://flagcdn.com/w320/za.svg', 'Bandeiras', 18, 'ZA'),
('De que país é esta bandeira?', '["Marrocos", "Egito", "Argélia", "Tunísia"]', 0, 'https://flagcdn.com/w320/ma.svg', 'Bandeiras', 18, 'MA'),
('De que país é esta bandeira?', '["Nigéria", "Gana", "Quénia", "Camarões"]', 0, 'https://flagcdn.com/w320/ng.svg', 'Bandeiras', 18, 'NG'),
('De que país é esta bandeira?', '["Quénia", "Tanzânia", "Uganda", "Etiópia"]', 0, 'https://flagcdn.com/w320/ke.svg', 'Bandeiras', 18, 'KE'),
('De que país é esta bandeira?', '["Gana", "Nigéria", "Costa do Marfim", "Senegal"]', 0, 'https://flagcdn.com/w320/gh.svg', 'Bandeiras', 18, 'GH'),
('De que país é esta bandeira?', '["Tanzânia", "Quénia", "Uganda", "Ruanda"]', 0, 'https://flagcdn.com/w320/tz.svg', 'Bandeiras', 18, 'TZ'),
('De que país é esta bandeira?', '["Tunísia", "Argélia", "Marrocos", "Líbia"]', 0, 'https://flagcdn.com/w320/tn.svg', 'Bandeiras', 18, 'TN'),
('De que país é esta bandeira?', '["Argélia", "Tunísia", "Marrocos", "Líbia"]', 0, 'https://flagcdn.com/w320/dz.svg', 'Bandeiras', 18, 'DZ'),
('De que país é esta bandeira?', '["Etiópia", "Quénia", "Somália", "Eritreia"]', 0, 'https://flagcdn.com/w320/et.svg', 'Bandeiras', 18, 'ET'),

-- OCEANIA
('De que país é esta bandeira?', '["Nova Zelândia", "Austrália", "Fiji", "Reino Unido"]', 0, 'https://flagcdn.com/w320/nz.svg', 'Bandeiras', 18, 'NZ'),
('De que país é esta bandeira?', '["Fiji", "Samoa", "Tonga", "Papua Nova Guiné"]', 0, 'https://flagcdn.com/w320/fj.svg', 'Bandeiras', 18, 'FJ'),
('De que país é esta bandeira?', '["Papua Nova Guiné", "Austrália", "Fiji", "Indonésia"]', 0, 'https://flagcdn.com/w320/pg.svg', 'Bandeiras', 18, 'PG'),

-- OUTROS PAÍSES
('De que país é esta bandeira?', '["Taiwan", "China", "Japão", "Coreia do Sul"]', 0, 'https://flagcdn.com/w320/tw.svg', 'Bandeiras', 18, 'TW'),
('De que país é esta bandeira?', '["Cazaquistão", "Uzbequistão", "Turquemenistão", "Quirguistão"]', 0, 'https://flagcdn.com/w320/kz.svg', 'Bandeiras', 18, 'KZ'),
('De que país é esta bandeira?', '["Bielorrússia", "Ucrânia", "Rússia", "Moldávia"]', 0, 'https://flagcdn.com/w320/by.svg', 'Bandeiras', 18, 'BY'),
('De que país é esta bandeira?', '["Sérvia", "Albânia", "Macedónia", "Montenegro"]', 0, 'https://flagcdn.com/w320/rs.svg', 'Bandeiras', 18, 'RS')

ON CONFLICT DO NOTHING;