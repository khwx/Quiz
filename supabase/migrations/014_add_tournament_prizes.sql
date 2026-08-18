-- ============================================================
-- 014: Tournament prizes / loot for top 3
-- ============================================================

ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS prizes JSONB DEFAULT '{"first":"","second":"","third":""}'::jsonb;
