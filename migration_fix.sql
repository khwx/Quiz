-- Adicionar colunas em falta na tabela de jogadores
ALTER TABLE players ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '🎮';
ALTER TABLE players ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FF6B6B';

-- Nota: O Realtime já estava activo, por isso não é necessário o comando ALTER PUBLICATION

-- Verificar se a tabela de respostas está completa (já deve estar, mas por segurança)
ALTER TABLE answers ADD COLUMN IF NOT EXISTS time_taken FLOAT;
ALTER TABLE answers ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT false;
