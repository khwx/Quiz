-- Migration 012: Normalize category casing + safe dedupe of questions
--
-- CONTEXT: The app's category config previously used `dbName: "Bandeiras"` and
-- `dbName: "HISTORIA"`, but the question data uses `BANDEIRAS` and `HISTÓRIA`.
-- This mismatch made the "História" category return 0 questions and "Bandeiras"
-- return only a handful. The CATEGORIES config in useGameSetup.ts now uses the
-- canonical (uppercase / accented) values. This migration fixes the data that
-- was inserted with the wrong casing and removes true duplicates.
--
-- Apply manually (no Supabase CLI/service-role in this env):
--   paste this SQL into the Supabase SQL Editor and run it.

-- 1) Allow maintenance scripts to UPDATE/DELETE questions (currently only
--    INSERT + SELECT are permitted by migration 008).
DROP POLICY IF EXISTS "Public Update Questions" ON questions;
CREATE POLICY "Public Update Questions" ON questions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Questions" ON questions FOR DELETE USING (true);

-- 2) Normalize category casing so every row matches the canonical app value.
UPDATE questions SET category = 'BANDEIRAS' WHERE category = 'Bandeiras';
UPDATE questions SET category = 'HISTÓRIA'  WHERE category = 'HISTORIA';

-- 3) Remove EXACT duplicates only: same text (case-insensitive), same category,
--    same options array and same correct_option. Flag questions have distinct
--    options per country, so they are naturally excluded. We keep the lowest id.
DELETE FROM questions a
USING questions b
WHERE a.id > b.id
  AND lower(a.text) = lower(b.text)
  AND a.category = b.category
  AND a.options IS NOT DISTINCT FROM b.options
  AND a.correct_option = b.correct_option
  AND (a.image_url IS NULL OR a.image_url = b.image_url);
