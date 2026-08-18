-- ============================================================
-- 015: Public vs Private tournaments
-- ============================================================

ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

COMMENT ON COLUMN tournaments.is_public IS
  'When true the tournament is listed in the public discovery feed and can be joined without a PIN. When false it is private (PIN required).';
