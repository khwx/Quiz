-- Enable RLS (Good practice, even if we allow all)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all access for all users" ON games;
DROP POLICY IF EXISTS "Enable all access for all users" ON players;
DROP POLICY IF EXISTS "Enable all access for all users" ON answers;
DROP POLICY IF EXISTS "Enable all access for all users" ON questions;

-- CREATE "Allow All" policies for Anon key
CREATE POLICY "Enable all access for all users" ON games FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON questions FOR ALL USING (true) WITH CHECK (true);

-- Ensure Publication includes all tables for Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- Replica Identity (Important for Realtime Updates/Deletes)
ALTER TABLE games REPLICA IDENTITY FULL;
ALTER TABLE players REPLICA IDENTITY FULL;
ALTER TABLE answers REPLICA IDENTITY FULL;
