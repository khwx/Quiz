-- Schema completo do Quiz
-- Executar no Supabase SQL Editor

-- 1. Tabela de Jogos
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'LOBBY',
  current_question_index INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"language": "pt", "mode": "adults", "timer": 20}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Jogadores
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  avatar TEXT DEFAULT '🎮',
  color TEXT DEFAULT '#FF6B6B',
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Perguntas
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Respostas
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  chosen_option INTEGER NOT NULL,
  time_taken FLOAT,
  is_correct BOOLEAN,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela profiles (para users autenticados)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar TEXT DEFAULT '🎮',
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'host', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Função para incrementar score
CREATE OR REPLACE FUNCTION increment_score(row_id UUID, score_inc INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE players SET score = score + score_inc WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "games_policy" ON games;
CREATE POLICY "Public Read Games" ON games FOR SELECT USING (true);
CREATE POLICY "Public Create Games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Games" ON games FOR UPDATE USING (true);

DROP POLICY IF EXISTS "players_policy" ON players;
CREATE POLICY "Public Read Players" ON players FOR SELECT USING (true);
CREATE POLICY "Public Join Players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Players" ON players FOR UPDATE USING (true);

DROP POLICY IF EXISTS "questions_policy" ON questions;
CREATE POLICY "Public Read Questions" ON questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "answers_policy" ON answers;
CREATE POLICY "Public Read Answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Public Give Answers" ON answers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_policy" ON profiles;
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Create Profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON profiles FOR UPDATE USING (true);

-- Trigger para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();