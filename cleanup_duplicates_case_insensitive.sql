-- SQL Cleanup for Case-Insensitive Duplicates
-- This script removes questions that have the same text and category regardless of casing.

-- 1. Identify and delete duplicates (keeping the oldest one)
DELETE FROM questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY LOWER(TRIM(text)), LOWER(TRIM(category)) 
             ORDER BY created_at ASC
           ) as rnum
    FROM questions
  ) t
  WHERE t.rnum > 1
);

-- Note: To truly prevent this in the future, you could add a case-insensitive unique index:
-- CREATE UNIQUE INDEX unique_question_text_category_ci ON questions (LOWER(text), LOWER(category));
