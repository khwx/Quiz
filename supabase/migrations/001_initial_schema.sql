-- ============================================================
-- QuizVerse — Complete Database Schema
-- Consolidated from 26 scattered SQL scripts
-- Run this ONCE on a fresh Supabase project
-- ============================================================

-- ============================================================
-- 1. CORE GAME TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'LOBBY',
  current_question_index INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"language":"pt","mode":"adults","timer":20}'::jsonb,
  tournament_id UUID,
  team_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  avatar TEXT DEFAULT '🎮',
  color TEXT DEFAULT '#FF6B6B',
  is_host BOOLEAN DEFAULT false,
  user_id UUID,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  category TEXT,
  age_rating INTEGER DEFAULT 18,
  country_code TEXT DEFAULT 'PT',
  metadata JSONB DEFAULT '{}'::jsonb,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  chosen_option INTEGER NOT NULL,
  time_taken FLOAT,
  is_correct BOOLEAN,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. AUTH / PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar TEXT DEFAULT '🎮',
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin','moderator','host','user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', COALESCE(NEW.raw_user_meta_data->>'avatar', '🎮'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. TEAMS
-- ============================================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pin TEXT UNIQUE NOT NULL,
  created_by UUID,
  max_members INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- ============================================================
-- 4. TOURNAMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  pin TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'LOBBY',
  max_teams INTEGER DEFAULT 8,
  current_round INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"timer":20,"questions":10}'::jsonb,
  created_by UUID,
  starts_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  eliminated BOOLEAN DEFAULT false,
  qualified BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

CREATE TABLE IF NOT EXISTS tournament_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  question_index INTEGER DEFAULT 0,
  scores JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. GAME HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  user_id UUID,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  finished_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_players_game ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_answers_game ON answers(game_id);
CREATE INDEX IF NOT EXISTS idx_answers_player ON answers(player_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_teams_pin ON teams(pin);
CREATE INDEX IF NOT EXISTS idx_tournaments_pin ON tournaments(pin);
CREATE INDEX IF NOT EXISTS idx_game_history_player ON game_history(player_id);
CREATE INDEX IF NOT EXISTS idx_game_history_user ON game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_game_history_tournament ON game_history(tournament_id);

-- ============================================================
-- 7. REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

-- Games
CREATE POLICY "Public Read Games" ON games FOR SELECT USING (true);
CREATE POLICY "Public Create Games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Games" ON games FOR UPDATE USING (true);

-- Players
CREATE POLICY "Public Read Players" ON players FOR SELECT USING (true);
CREATE POLICY "Public Join Players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Players" ON players FOR UPDATE USING (true);

-- Questions (read-only for game)
CREATE POLICY "Public Read Questions" ON questions FOR SELECT USING (true);

-- Answers
CREATE POLICY "Public Read Answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Public Give Answers" ON answers FOR INSERT WITH CHECK (true);

-- Profiles
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Create Profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON profiles FOR UPDATE USING (true);

-- Teams
CREATE POLICY "Public Read Teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public Create Teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Teams" ON teams FOR UPDATE USING (true);

-- Team Members
CREATE POLICY "Public Read TeamMembers" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public Join TeamMembers" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete TeamMembers" ON team_members FOR DELETE USING (true);

-- Tournaments
CREATE POLICY "Public Read Tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public Create Tournaments" ON tournaments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tournaments" ON tournaments FOR UPDATE USING (true);

-- Tournament Teams
CREATE POLICY "Public Read TournamentTeams" ON tournament_teams FOR SELECT USING (true);
CREATE POLICY "Public Join TournamentTeams" ON tournament_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update TournamentTeams" ON tournament_teams FOR UPDATE USING (true);
CREATE POLICY "Public Delete TournamentTeams" ON tournament_teams FOR DELETE USING (true);

-- Tournament Rounds
CREATE POLICY "Public Read TournamentRounds" ON tournament_rounds FOR SELECT USING (true);
CREATE POLICY "Public Create TournamentRounds" ON tournament_rounds FOR INSERT WITH CHECK (true);

-- Game History
CREATE POLICY "Public Read GameHistory" ON game_history FOR SELECT USING (true);
CREATE POLICY "Public Insert GameHistory" ON game_history FOR INSERT WITH CHECK (true);
