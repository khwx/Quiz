-- Criar apenas a tabela de torneios
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

-- Ativar RLS
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Políticas (ignora se existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Tournaments' AND tablename = 'tournaments') THEN
    CREATE POLICY "Public Read Tournaments" ON tournaments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Create Tournaments' AND tablename = 'tournaments') THEN
    CREATE POLICY "Public Create Tournaments" ON tournaments FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Verificar
SELECT * FROM tournaments LIMIT 1;