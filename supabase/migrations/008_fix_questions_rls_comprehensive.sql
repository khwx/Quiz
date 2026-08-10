-- Migration 008: Comprehensive fix for questions table RLS policies
-- Ensures INSERT works for authenticated and anon users (TV host generates questions)
-- Also ensures UPDATE works for games table (status changes, question transitions)

-- ============================================================
-- Questions table - ensure INSERT policy works
-- Migration 007 tried to DROP "Only admin can insert questions" but if that policy
-- never existed (because migration 002 wasn't applied), the INSERT still fails
-- because there's no INSERT policy at all in migration 001.
-- ============================================================

-- Drop any existing policies that might block inserts
DROP POLICY IF EXISTS "Only admin can insert questions" ON questions;
DROP POLICY IF EXISTS "Anyone can insert questions" ON questions;

-- Create permissive INSERT policy for questions
CREATE POLICY "Anyone can insert questions" ON questions FOR INSERT WITH CHECK (true);

-- Ensure SELECT policy exists (from migration 001 - recreate if missing)
DROP POLICY IF EXISTS "Public Read Questions" ON questions;
CREATE POLICY "Public Read Questions" ON questions FOR SELECT USING (true);

-- ============================================================
-- Games table - ensure UPDATE policy works for status changes
-- Migration 002 restricts UPDATE to created_by or admin, but migration 001
-- allows all updates. We need permissive UPDATE for real-time state changes.
-- ============================================================

-- Drop restrictive policies that might block game updates from any client
DROP POLICY IF EXISTS "Only game host or admin can update games" ON games;

-- Ensure permissive UPDATE policy exists
DROP POLICY IF EXISTS "Public Update Games" ON games;
CREATE POLICY "Public Update Games" ON games FOR UPDATE USING (true);

-- ============================================================
-- Realtime publication - ensure questions table is included
-- Migration 001 only adds games, players, answers to realtime
-- But we need questions for potential future features
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE questions;
