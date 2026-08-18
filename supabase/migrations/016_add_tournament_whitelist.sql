-- ============================================================
-- 016: Whitelist / invite-only teams per private tournament
-- ============================================================

ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS whitelisted_team_ids UUID[] DEFAULT '{}'::uuid[];

COMMENT ON COLUMN tournaments.whitelisted_team_ids IS
  'Array of team_ids permitted to join this (private) tournament. When non-empty, only the listed teams can join even with the correct PIN. Empty = any team with the PIN may join (backwards compatible).';

-- Index for fast membership checks
CREATE INDEX IF NOT EXISTS idx_tournaments_whitelist
  ON tournaments USING GIN (whitelisted_team_ids);
