-- Migration 013: Fix GEGRAFIA -> GEOGRAFIA category typo
--
-- CONTEXT: Some questions were inserted with the category "GEGRAFIA" (missing 'O').
-- The app's category config uses the canonical "GEOGRAFIA", so these 1 row was
-- orphaned and not selectable in gameplay. This migration fixes it (same pattern
-- as migration 012's Bandeiras/HISTORIA normalization).
--
-- Applied directly via SQL Editor (no Supabase CLI/service-role in this env).

UPDATE questions SET category = 'GEOGRAFIA' WHERE category = 'GEGRAFIA';
