-- Fix: Allow authenticated users and anon to insert questions
-- The TV host generates questions via AI and needs to save them to the DB
-- Previously "Only admin can insert questions" blocked this entirely

DROP POLICY IF EXISTS "Only admin can insert questions" ON questions;
CREATE POLICY "Anyone can insert questions" ON questions FOR INSERT WITH CHECK (true);
