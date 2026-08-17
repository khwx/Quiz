-- Migration 011: Create the achievements table
-- Fixes bug 8.8: api/answer/route.ts inserts unlocked achievements into a
-- table that did not exist, so unlocks silently failed. This table persists
-- achievement unlocks per player/game and is now read by /achievements.

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  user_id UUID,
  achievement_id TEXT NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE achievements;

-- Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Players are anonymous (joined via PIN), so writes must stay permissive for
-- the realtime game flow. Reads are public so any client can fetch unlocks.
CREATE POLICY "Public Read Achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public Insert Achievements" ON achievements FOR INSERT WITH CHECK (true);
