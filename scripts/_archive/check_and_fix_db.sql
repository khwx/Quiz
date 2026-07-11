-- Verificar e Reparar BD do Quiz
-- Executa no Supabase SQL Editor

-- 1. Verificar se as tabelas existem
SELECT 'games' as table_name, count(*) as rows FROM games
UNION ALL SELECT 'players', count(*) FROM players
UNION ALL SELECT 'questions', count(*) FROM questions
UNION ALL SELECT 'answers', count(*) FROM answers;

-- 2. Verificar se a função increment_score existe
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'increment_score';

-- 3. Criar/Recriar a função se não existir
CREATE OR REPLACE FUNCTION increment_score(row_id UUID, score_inc INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE players SET score = score + score_inc WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Verificar políticas RLS nas tabelas principais
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('games', 'players', 'questions', 'answers');

-- 5. Recriar políticas se necessário
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "games_read" ON games;
DROP POLICY IF EXISTS "games_insert" ON games;
DROP POLICY IF EXISTS "games_update" ON games;
DROP POLICY IF EXISTS "players_read" ON players;
DROP POLICY IF EXISTS "players_insert" ON players;
DROP POLICY IF EXISTS "players_update" ON players;
DROP POLICY IF EXISTS "questions_read" ON questions;
DROP POLICY IF EXISTS "answers_read" ON answers;
DROP POLICY IF EXISTS "answers_insert" ON answers;

CREATE POLICY "games_read" ON games FOR SELECT USING (true);
CREATE POLICY "games_insert" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "games_update" ON games FOR UPDATE USING (true);

CREATE POLICY "players_read" ON players FOR SELECT USING (true);
CREATE POLICY "players_insert" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "players_update" ON players FOR UPDATE USING (true);

CREATE POLICY "questions_read" ON questions FOR SELECT USING (true);

CREATE POLICY "answers_read" ON answers FOR SELECT USING (true);
CREATE POLICY "answers_insert" ON answers FOR INSERT WITH CHECK (true);

-- 6. Verificar se há perguntas na base de dados
SELECT category, count(*) as total FROM questions GROUP BY category ORDER BY total DESC;

-- 7. Testar criação de jogo manualmente
-- INSERT INTO games (pin, status) VALUES ('999999', 'LOBBY') RETURNING *;

-- 8. Ver erros recentes
-- SELECT * FROM storage.buckets LIMIT 0;  -- só para testar conexão