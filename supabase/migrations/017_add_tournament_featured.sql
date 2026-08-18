-- ============================================================
-- 017: Featured tournaments for public discovery
-- ============================================================

ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

COMMENT ON COLUMN tournaments.is_featured IS
  'When true the tournament is highlighted in the public discovery feed and notifications are sent to users.';

-- Index for featured public tournaments
CREATE INDEX IF NOT EXISTS idx_tournaments_featured_public ON tournaments(is_public, is_featured, status) WHERE is_public = true AND is_featured = true;