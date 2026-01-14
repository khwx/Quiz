-- Adicionar colunas em falta na tabela de jogadores
ALTER TABLE players ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '🎮';
ALTER TABLE players ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FF6B6B';

-- Opicional: Actualizar a publicação do Realtime para garantir que as novas colunas são incluídas
-- Se já existir, isto não tem efeito negativo
ALTER PUBLICATION supabase_realtime ADD TABLE players;
-- Nota: Se receberes um erro a dizer que a tabela já existe na publicação, ignora.

-- Verificar se a tabela de respostas está completa (já deve estar, mas por segurança)
ALTER TABLE answers ADD COLUMN IF NOT EXISTS time_taken FLOAT;
ALTER TABLE answers ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT false;
