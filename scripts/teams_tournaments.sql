-- Sistema de Equipas, Códigos de Jogador e Torneios

-- 1. Tabela de Equipas
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pin TEXT UNIQUE NOT NULL, -- Código para juntar à equipa
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  created_by UUID REFERENCES players(id),
  max_members INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Membros de Equipa
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- host, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, player_id)
);

-- 3. Tabela de Códigos Únicos por Jogador
CREATE TABLE IF NOT EXISTS player_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- Código único curto (ex: "ABC123")
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  uses INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Torneios
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  pin TEXT UNIQUE NOT NULL, -- Código para entrar no torneo
  status TEXT DEFAULT 'LOBBY', -- LOBBY, QUALIFYING, FINAL, FINISHED
  max_teams INTEGER DEFAULT 8,
  current_round INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"timer": 20, "questions": 10}'::jsonb,
  created_by UUID REFERENCES players(id),
  starts_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Inscrições em Torneios
CREATE TABLE IF NOT EXISTS tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- 6. Resultados de Ronda em Torneios
CREATE TABLE IF NOT EXISTS tournament_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  question_index INTEGER DEFAULT 0,
  scores JSONB DEFAULT '{}'::jsonb, -- {team_id: score}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE player_codes;
ALTER PUBLICATION supabase_realtime ADD TABLE tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE tournament_teams;
ALTER PUBLICATION supabase_realtime ADD TABLE tournament_rounds;

-- Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rounds ENABLE ROW LEVEL SECURITY;

-- Políticas para Teams
DROP POLICY IF EXISTS "teams_policy" ON teams;
CREATE POLICY "Public Read Teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public Create Teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Teams" ON teams FOR UPDATE USING (true);

-- Políticas para Team Members
DROP POLICY IF EXISTS "team_members_policy" ON team_members;
CREATE POLICY "Public Read Team Members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public Join Team Members" ON team_members FOR INSERT WITH CHECK (true);

-- Políticas para Player Codes
DROP POLICY IF EXISTS "player_codes_policy" ON player_codes;
CREATE POLICY "Public Read Player Codes" ON player_codes FOR SELECT USING (true);
CREATE POLICY "Public Create Player Codes" ON player_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Player Codes" ON player_codes FOR UPDATE USING (true);

-- Políticas para Tournaments
DROP POLICY IF EXISTS "tournaments_policy" ON tournaments;
CREATE POLICY "Public Read Tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public Create Tournaments" ON tournaments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tournaments" ON tournaments FOR UPDATE USING (true);

-- Políticas para Tournament Teams
DROP POLICY IF EXISTS "tournament_teams_policy" ON tournament_teams;
CREATE POLICY "Public Read Tournament Teams" ON tournament_teams FOR SELECT USING (true);
CREATE POLICY "Public Join Tournament Teams" ON tournament_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tournament Teams" ON tournament_teams FOR UPDATE USING (true);

-- Políticas para Tournament Rounds
DROP POLICY IF EXISTS "tournament_rounds_policy" ON tournament_rounds;
CREATE POLICY "Public Read Tournament Rounds" ON tournament_rounds FOR SELECT USING (true);
CREATE POLICY "Public Create Tournament Rounds" ON tournament_rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tournament Rounds" ON tournament_rounds FOR UPDATE USING (true);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_teams_pin ON teams(pin);
CREATE INDEX IF NOT EXISTS idx_player_codes_code ON player_codes(code);
CREATE INDEX IF NOT EXISTS idx_tournaments_pin ON tournaments(pin);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament ON tournament_teams(tournament_id);