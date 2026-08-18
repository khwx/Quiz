-- Migration 012: Add explanation and hint columns to questions table if not present
-- This ensures full backward compatibility with any future questions schema queries.

ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;
