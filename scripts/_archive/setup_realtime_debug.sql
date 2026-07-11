-- FORCE ENABLE REALTIME FOR ANSWERS
-- Run this in Supabase SQL Editor to guarantee the table is published

BEGIN;

-- 1. Ensure the publication exists (supabase_realtime is default, but ensuring doesn't hurt)
-- (Usually handled by extensions, but let's focus on the table)

-- 2. Add table to publication if not already present
-- This command is idempotent in Postgres 15+ usually, or just safe to run
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- 3. Verify Replication Identity (Important for Update/Delete events, less for Insert but good practice)
ALTER TABLE answers REPLICA IDENTITY FULL;

COMMIT;

-- 4. Check status (Run this separately if you want to see output)
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
