-- CORREÇÃO: Remover FK para players e usar user_id do auth.users

-- 1. Drop old tables
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS player_codes CASCADE;
DROP TABLE IF EXISTS tournament_teams CASCADE;
DROP TABLE IF EXISTS tournament_rounds CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- 2. Create teams (sem FK para players)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pin TEXT UNIQUE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  created_by UUID,
  max_members INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create team_members (user_id do auth.users)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 4. Create player_codes
CREATE TABLE player_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  uses INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create tournaments
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  pin TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'LOBBY',
  max_teams INTEGER DEFAULT 8,
  current_round INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"timer": 20, "questions": 10}'::jsonb,
  created_by UUID,
  starts_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create tournament_teams
CREATE TABLE tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- 7. Create tournament_rounds
CREATE TABLE tournament_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  question_index INTEGER DEFAULT 0,
  scores JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rounds ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Public Read Teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public Create Teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Teams" ON teams FOR UPDATE USING (true);

CREATE POLICY "Public Read Team Members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public Join Team Members" ON team_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Player Codes" ON player_codes FOR SELECT USING (true);
CREATE POLICY "Public Create Player Codes" ON player_codes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public Create Tournaments" ON tournaments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Tournament Teams" ON tournament_teams FOR SELECT USING (true);
CREATE POLICY "Public Join Tournament Teams" ON tournament_teams FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Tournament Rounds" ON tournament_rounds FOR SELECT USING (true);
CREATE POLICY "Public Create Tournament Rounds" ON tournament_rounds FOR INSERT WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE player_codes;
ALTER PUBLICATION supabase_realtime ADD TABLE tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE tournament_teams;
ALTER PUBLICATION supabase_realtime ADD TABLE tournament_rounds;