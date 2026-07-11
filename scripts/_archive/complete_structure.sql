-- Estrutura Completa Quizverse: Equipas + Torneios + Histórico
-- Executar no Supabase SQL Editor

-- 1. Tabela de Jogos (atualizar)
ALTER TABLE games ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL;
ALTER TABLE games ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- 2. Tabela de Histórico de Jogos (NOVA)
CREATE TABLE IF NOT EXISTS game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  user_id UUID, -- Referência direta ao utilizador
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  finished_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Atualizar tabela team_members para incluir team_id na query
-- (já existe, só garantir)

-- 4. Tabela tournament_teams (melhorar)
ALTER TABLE tournament_teams ADD COLUMN IF NOT EXISTS eliminated BOOLEAN DEFAULT false;
ALTER TABLE tournament_teams ADD COLUMN IF NOT EXISTS qualified BOOLEAN DEFAULT false;

-- 5. Função para registar fim de jogo no histórico
CREATE OR REPLACE FUNCTION register_game_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando um jogo termina (status = 'FINISHED' ou 'PODIUM')
  IF NEW.status IN ('FINISHED', 'PODIUM') AND OLD.status != NEW.status THEN
    -- Inserir histórico para cada jogador
    INSERT INTO game_history (game_id, player_id, user_id, team_id, tournament_id, score, correct_answers, total_questions)
    SELECT 
      NEW.id,
      p.id,
      p.user_id, -- Se tivermos este campo na tabela players
      NULL, -- team_id (precisa ser adicionado à players ou obtido via team_members)
      NEW.tournament_id,
      p.score,
      (SELECT COUNT(*) FROM answers WHERE game_id = NEW.id AND player_id = p.id AND is_correct = true),
      (SELECT COUNT(*) FROM answers WHERE game_id = NEW.id AND player_id = p.id)
    FROM players p
    WHERE p.game_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para registar histórico automaticamente
DROP TRIGGER IF EXISTS on_game_finished ON games;
CREATE TRIGGER on_game_finished
  AFTER UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION register_game_history();

-- 7. Adicionar user_id à tabela players (se não existir)
ALTER TABLE players ADD COLUMN IF NOT EXISTS user_id UUID;

-- 8. Atualizar players.user_id baseado em profiles (se possível)
-- (Isto requer que o jogador tenha feito login)

-- 9. Políticas RLS para game_history
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Game History" ON game_history;
CREATE POLICY "Public Read Game History" ON game_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Game History" ON game_history;
CREATE POLICY "Public Insert Game History" ON game_history FOR INSERT WITH CHECK (true);

-- 10. Índices para performance
CREATE INDEX IF NOT EXISTS idx_game_history_player ON game_history(player_id);
CREATE INDEX IF NOT EXISTS idx_game_history_user ON game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_game_history_tournament ON game_history(tournament_id);

-- 11. Verificar estrutura
SELECT 'game_history' as table_name, count(*) as rows FROM game_history
UNION ALL
SELECT 'games', count(*) FROM games
UNION ALL
SELECT 'players', count(*) FROM players
UNION ALL
SELECT 'teams', count(*) FROM teams
UNION ALL
SELECT 'tournament_teams', count(*) FROM tournament_teams;

-- 12. Limpar dados de teste (opcional)
-- TRUNCATE game_history, tournament_teams, tournaments, teams CASCADE;
