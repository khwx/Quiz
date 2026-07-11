-- Tabelas para Equipas e Torneios (CORRIGIDO)
-- Executar no Supabase SQL Editor

-- 1. Equipas
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pin TEXT UNIQUE NOT NULL,
  created_by UUID,
  max_members INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Membros de Equipa
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 3. Torneios
CREATE TABLE IF NOT EXISTS tournaments (
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

-- 4. Equipas num Torneio
CREATE TABLE IF NOT EXISTS tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;

-- Políticas (apenas criar se não existirem)
DO $$ 
BEGIN
  -- Teams
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Teams' AND tablename = 'teams') THEN
    CREATE POLICY "Public Read Teams" ON teams FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Create Teams' AND tablename = 'teams') THEN
    CREATE POLICY "Public Create Teams" ON teams FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Teams' AND tablename = 'teams') THEN
    CREATE POLICY "Public Update Teams" ON teams FOR UPDATE USING (true);
  END IF;
  
  -- Team Members
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Team Members' AND tablename = 'team_members') THEN
    CREATE POLICY "Public Read Team Members" ON team_members FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Join Team Members' AND tablename = 'team_members') THEN
    CREATE POLICY "Public Join Team Members" ON team_members FOR INSERT WITH CHECK (true);
  END IF;
  
  -- Tournaments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Tournaments' AND tablename = 'tournaments') THEN
    CREATE POLICY "Public Read Tournaments" ON tournaments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Create Tournaments' AND tablename = 'tournaments') THEN
    CREATE POLICY "Public Create Tournaments" ON tournaments FOR INSERT WITH CHECK (true);
  END IF;
  
  -- Tournament Teams
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Tournament Teams' AND tablename = 'tournament_teams') THEN
    CREATE POLICY "Public Read Tournament Teams" ON tournament_teams FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Join Tournament Teams' AND tablename = 'tournament_teams') THEN
    CREATE POLICY "Public Join Tournament Teams" ON tournament_teams FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS teams;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS tournament_teams;

-- Índices
CREATE INDEX IF NOT EXISTS idx_teams_pin ON teams(pin);
CREATE INDEX IF NOT EXISTS idx_tournaments_pin ON tournaments(pin);