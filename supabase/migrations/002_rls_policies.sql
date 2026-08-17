-- ============================================================
-- RLS Policies — Migration 002
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin (profiles.role = 'admin')
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- GAMES
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read games" ON games;
CREATE POLICY "Anyone can read games" ON games FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can create games" ON games;
CREATE POLICY "Anyone can create games" ON games FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only game host or admin can update games" ON games;
CREATE POLICY "Only game host or admin can update games" ON games FOR UPDATE USING (auth.uid() = created_by OR is_admin());
DROP POLICY IF EXISTS "Only admin can delete games" ON games;
CREATE POLICY "Only admin can delete games" ON games FOR DELETE USING (is_admin());

-- ============================================================
-- PLAYERS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read players in a game" ON players;
CREATE POLICY "Anyone can read players in a game" ON players FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can join a game as player" ON players;
CREATE POLICY "Anyone can join a game as player" ON players FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Players can update own data" ON players;
CREATE POLICY "Players can update own data" ON players FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);
DROP POLICY IF EXISTS "Only admin can delete players" ON players;
CREATE POLICY "Only admin can delete players" ON players FOR DELETE USING (is_admin());

-- ============================================================
-- ANSWERS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read answers in a game" ON answers;
CREATE POLICY "Anyone can read answers in a game" ON answers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can submit answers" ON answers;
CREATE POLICY "Anyone can submit answers" ON answers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only admin can update answers" ON answers;
CREATE POLICY "Only admin can update answers" ON answers FOR UPDATE USING (is_admin());
DROP POLICY IF EXISTS "Only admin can delete answers" ON answers;
CREATE POLICY "Only admin can delete answers" ON answers FOR DELETE USING (is_admin());

-- ============================================================
-- QUESTIONS (read-only for gameplay)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admin can insert questions" ON questions;
CREATE POLICY "Only admin can insert questions" ON questions FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Only admin can update questions" ON questions;
CREATE POLICY "Only admin can update questions" ON questions FOR UPDATE USING (is_admin());
DROP POLICY IF EXISTS "Only admin can delete questions" ON questions;
CREATE POLICY "Only admin can delete questions" ON questions FOR DELETE USING (is_admin());

-- ============================================================
-- PROFILES
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
CREATE POLICY "Users can create own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Only admin can delete profiles" ON profiles;
CREATE POLICY "Only admin can delete profiles" ON profiles FOR DELETE USING (is_admin());

-- ============================================================
-- TEAMS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read teams" ON teams;
CREATE POLICY "Anyone can read teams" ON teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams" ON teams FOR INSERT WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Team creator can update team" ON teams;
CREATE POLICY "Team creator can update team" ON teams FOR UPDATE USING (auth.uid() = created_by OR is_admin());
DROP POLICY IF EXISTS "Team creator can delete team" ON teams;
CREATE POLICY "Team creator can delete team" ON teams FOR DELETE USING (auth.uid() = created_by OR is_admin());

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read team members" ON team_members;
CREATE POLICY "Anyone can read team members" ON team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join teams" ON team_members;
CREATE POLICY "Users can join teams" ON team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can leave teams" ON team_members;
CREATE POLICY "Users can leave teams" ON team_members FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- TOURNAMENTS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read tournaments" ON tournaments;
CREATE POLICY "Anyone can read tournaments" ON tournaments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create tournaments" ON tournaments;
CREATE POLICY "Users can create tournaments" ON tournaments FOR INSERT WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Tournament creator can update" ON tournaments;
CREATE POLICY "Tournament creator can update" ON tournaments FOR UPDATE USING (auth.uid() = created_by OR is_admin());
DROP POLICY IF EXISTS "Tournament creator can delete" ON tournaments;
CREATE POLICY "Tournament creator can delete" ON tournaments FOR DELETE USING (is_admin() OR auth.uid() = created_by);

-- ============================================================
-- TOURNAMENT TEAMS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read tournament teams" ON tournament_teams;
CREATE POLICY "Anyone can read tournament teams" ON tournament_teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Team members can join tournament" ON tournament_teams;
CREATE POLICY "Team members can join tournament" ON tournament_teams FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members WHERE team_id = tournament_teams.team_id AND user_id = auth.uid()
  ) OR is_admin()
);
DROP POLICY IF EXISTS "Tournament creator can update results" ON tournament_teams;
CREATE POLICY "Tournament creator can update results" ON tournament_teams FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM tournaments WHERE id = tournament_teams.tournament_id AND created_by = auth.uid()
  ) OR is_admin()
);
DROP POLICY IF EXISTS "Tournament creator can remove teams" ON tournament_teams;
CREATE POLICY "Tournament creator can remove teams" ON tournament_teams FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM tournaments WHERE id = tournament_teams.tournament_id AND created_by = auth.uid()
  ) OR is_admin()
);

-- ============================================================
-- TOURNAMENT ROUNDS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read tournament rounds" ON tournament_rounds;
CREATE POLICY "Anyone can read tournament rounds" ON tournament_rounds FOR SELECT USING (true);
DROP POLICY IF EXISTS "Tournament creator can manage rounds" ON tournament_rounds;
CREATE POLICY "Tournament creator can manage rounds" ON tournament_rounds FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM tournaments WHERE id = tournament_rounds.tournament_id AND created_by = auth.uid()
  ) OR is_admin()
);
DROP POLICY IF EXISTS "Tournament creator can update rounds" ON tournament_rounds;
CREATE POLICY "Tournament creator can update rounds" ON tournament_rounds FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM tournaments WHERE id = tournament_rounds.tournament_id AND created_by = auth.uid()
  ) OR is_admin()
);
DROP POLICY IF EXISTS "Tournament creator can delete rounds" ON tournament_rounds;
CREATE POLICY "Tournament creator can delete rounds" ON tournament_rounds FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM tournaments WHERE id = tournament_rounds.tournament_id AND created_by = auth.uid()
  ) OR is_admin()
);

-- ============================================================
-- GAME HISTORY
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read game history" ON game_history;
CREATE POLICY "Anyone can read game history" ON game_history FOR SELECT USING (true);
DROP POLICY IF EXISTS "System can insert game history" ON game_history;
CREATE POLICY "System can insert game history" ON game_history FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only admin can update game history" ON game_history;
CREATE POLICY "Only admin can update game history" ON game_history FOR UPDATE USING (is_admin());
DROP POLICY IF EXISTS "Only admin can delete game history" ON game_history;
CREATE POLICY "Only admin can delete game history" ON game_history FOR DELETE USING (is_admin());
