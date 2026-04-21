-- =============================================================================
-- RANDOMIZAR RESPOSTAS CORRETAS DAS BANDEIRAS
-- Executar no SQL Editor do Supabase Dashboard
-- =============================================================================

-- Ver quantas perguntas de bandeiras existem
SELECT 'Total perguntas de bandeiras:', COUNT(*) FROM questions WHERE category = 'Bandeiras';

-- Criar tabela temporária para randomizar
CREATE TEMP TABLE flag_questions AS
SELECT id, text, options, correct_option, image_url, category, age_rating, country_code
FROM questions 
WHERE category = 'Bandeiras';

-- Limpar perguntas existentes de bandeiras
DELETE FROM questions WHERE category = 'Bandeiras';

-- Inserir novamente com respostas randomizadas
INSERT INTO questions (text, options, correct_option, image_url, category, age_rating, country_code)
SELECT 
    text,
    -- Embaralhar opções e obter novo índice correto
    CASE 
        WHEN random() < 0.25 THEN jsonb_build_array(
            jsonb_array_elements(options)->>0,
            jsonb_array_elements(options)->>1,
            jsonb_array_elements(options)->>2,
            jsonb_array_elements(options)->>3
        )
        WHEN random() < 0.5 THEN jsonb_build_array(
            jsonb_array_elements(options)->>1,
            jsonb_array_elements(options)->>0,
            jsonb_array_elements(options)->>2,
            jsonb_array_elements(options)->>3
        )
        WHEN random() < 0.75 THEN jsonb_build_array(
            jsonb_array_elements(options)->>2,
            jsonb_array_elements(options)->>0,
            jsonb_array_elements(options)->>1,
            jsonb_array_elements(options)->>3
        )
        ELSE jsonb_build_array(
            jsonb_array_elements(options)->>3,
            jsonb_array_elements(options)->>0,
            jsonb_array_elements(options)->>1,
            jsonb_array_elements(options)->>2
        )
    END AS new_options,
    -- Selecionar índice aleatório (0, 1, 2, ou 3)
    floor(random() * 4)::int AS new_correct,
    image_url,
    category,
    age_rating,
    country_code
FROM flag_questions;

-- Verificar distribuição das respostas corretas
SELECT 'Respostas corretas após randomização:', 
    correct_option, COUNT(*) 
FROM questions 
WHERE category = 'Bandeiras' 
GROUP BY correct_option;

DROP TABLE flag_questions;
