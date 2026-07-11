-- Adicionar coluna metadata para relatórios de perguntas
ALTER TABLE questions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Criar índice para consultas mais rápidas
CREATE INDEX IF NOT EXISTS idx_questions_metadata ON questions(metadata);

-- Verificar estrutura
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' AND column_name = 'metadata';