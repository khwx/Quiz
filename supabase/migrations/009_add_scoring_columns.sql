-- Add scoring/analytics columns to players table
-- Required for enhanced scoring system

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN current_streak INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN max_streak INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN category_stats JSONB DEFAULT '{}'::jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN buzzer_wins INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN buzzer_attempts INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN buzzer_losses INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players ADD COLUMN total_questions INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add scoring columns to answers table
DO $$ BEGIN
  ALTER TABLE answers ADD COLUMN streak_at_answer INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE answers ADD COLUMN category_bonus INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE answers ADD COLUMN time_bonus INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE answers ADD COLUMN streak_bonus INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE answers ADD COLUMN difficulty_multiplier REAL DEFAULT 1.0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE answers ADD COLUMN buzzer_bonus INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;