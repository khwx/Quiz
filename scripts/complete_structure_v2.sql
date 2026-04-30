-- Estrutura Completa Quizverse: Equipas + Torneios + Histórico
-- Executar no Supabase SQL Editor

-- 1. Atualizar tabela games (adicionar tournament_id, team_id)
ALTER TABLE games ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL;
ALTER TABLE games ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- 2. Tabela de Histórico de Jogos (NOVA)
CREATE TABLE IF NOT EXISTS game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  user_id UUID, -- Para facilitar queries no perfil
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  finished_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Adicionar user_id a players (se não existir)
ALTER TABLE players ADD COLUMN IF NOT EXISTS user_id UUID;

-- 4. Garantir que teams/tournaments têm as colunas necessárias
ALTER TABLE teams ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL;

-- 5. Políticas RLS para game_history
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Game History" ON game_history;
CREATE POLICY "Public Read Game History" ON game_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Game History" ON game_history;
CREATE POLICY "Public Insert Game History" ON game_history FOR INSERT WITH CHECK (true);

-- 6. Índices para performance
CREATE INDEX IF NOT EXISTS idx_game_history_player ON game_history(player_id);
CREATE INDEX IF NOT EXISTS idx_game_history_user ON game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_game_history_tournament ON game_history(tournament_id);

-- 7. Função para registrar histórico (simplificada)
CREATE OR REPLACE FUNCTION register_game_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando o jogo termina
  IF NEW.status IN ('FINISHED', 'PODIUM') AND OLD.status != NEW.status THEN
    -- Inserir histórico para cada jogador
    INSERT INTO game_history (
      game_id, player_id, user_id, team_id, tournament_id, 
      score, correct_answers, total_questions
    )
    SELECT 
      NEW.id,
      p.id,
      p.user_id,
      p.team_id,
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

-- 8. Trigger (recriar se existir)
DROP TRIGGER IF EXISTS on_game_finished ON games;

CREATE TRIGGER on_game_finished
  AFTER UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION register_game_history();

-- 9. Verificar estrutura final
SELECT 'games' as tabela, count(*) as registros FROM games
UNION ALL
SELECT 'players', count(*) FROM players
UNION ALL
SELECT 'teams', count(*) FROM teams
UNION ALL
SELECT 'tournaments', count(*) FROM tournaments
UNION ALL
SELECT 'game_history', count(*) FROM game_history;

-- 10. Limpar dados de teste (CUIDADO! Descomente se necessário)
-- TRUNCATE game_history, tournament_teams, tournaments, teams CASCADE;