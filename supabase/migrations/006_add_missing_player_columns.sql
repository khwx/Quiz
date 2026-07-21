-- Fix: Add missing columns to players table
-- Run this if the players table exists but is missing columns

-- Add eliminated column if missing
DO $$ BEGIN
  ALTER TABLE players ADD COLUMN eliminated BOOLEAN DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add lives column if missing
DO $$ BEGIN
  ALTER TABLE players ADD COLUMN lives INTEGER DEFAULT 3;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add user_id column if missing
DO $$ BEGIN
  ALTER TABLE players ADD COLUMN user_id UUID;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;