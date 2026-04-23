-- SQL para adicionar coluna hint à tabela questions
-- Execute isto no Supabase SQL Editor

ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;

-- Agora atualizar as perguntas com hints usando o metadata
UPDATE questions 
SET metadata = jsonb_set(metadata, '{hint}', to_jsonb('Dica: Esta e a explicacao!'::text))
WHERE metadata IS NULL;