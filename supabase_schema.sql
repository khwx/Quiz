-- Tabelas principais para o Quiz Gaming

-- 1. Tabela de Jogos
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'LOBBY', -- LOBBY, STARTING, QUESTION, REVEAL, LEADERBOARD, FINAL
  current_question_index INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{"language": "pt", "mode": "adults", "timer": 20}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Jogadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Perguntas
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL, -- ["Opção A", "Opção B", ...]
  correct_option INTEGER NOT NULL,
  category TEXT,
  age_rating INTEGER DEFAULT 18, -- 1-9 para crianças, 18+ para adultos
  country_code TEXT DEFAULT 'PT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Respostas (para estatísticas em tempo real)
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  chosen_option INTEGER NOT NULL,
  time_taken FLOAT, -- Segundos gastos a responder
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Realtime para estas tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- Políticas de Segurança (Simples para MVP)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Melhoradas)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- 1. Games: Qualquer pessoa cria e lê. NINGUÉM apaga (via API pública).
DROP POLICY IF EXISTS "games_policy" ON games;
CREATE POLICY "Public Read Games" ON games FOR SELECT USING (true);
CREATE POLICY "Public Create Games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Games" ON games FOR UPDATE USING (true);

-- 2. Players: Qualquer pessoa entra.
DROP POLICY IF EXISTS "players_policy" ON players;
CREATE POLICY "Public Read Players" ON players FOR SELECT USING (true);
CREATE POLICY "Public Join Players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Players" ON players FOR UPDATE USING (true);

-- 3. Questions: LEITURA APENAS. Ninguém altera perguntas pelo jogo.
DROP POLICY IF EXISTS "questions_policy" ON questions;
CREATE POLICY "Public Read Questions" ON questions FOR SELECT USING (true);

-- 4. Answers: Jogadores respondem, Host lê.
DROP POLICY IF EXISTS "answers_policy" ON answers;
CREATE POLICY "Public Read Answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Public Give Answers" ON answers FOR INSERT WITH CHECK (true);
