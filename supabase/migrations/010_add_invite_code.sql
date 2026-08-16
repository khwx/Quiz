-- ============================================================
-- QuizVerse — Unique Player Invite Code
-- Adds a unique, shareable invite code to each profile so
-- players can invite friends via a personal link.
-- ============================================================

-- 1. Add invite_code column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;

-- 2. Backfill existing profiles with a unique code derived from their id
UPDATE profiles
SET invite_code = upper(substring(replace(id::text, '-', ''), 1, 8))
WHERE invite_code IS NULL;

-- 3. Generate a unique code for new users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar, invite_code)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'avatar', '🎮'),
    upper(substring(replace(NEW.id::text, '-', ''), 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Index for fast lookups by code
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON profiles(invite_code);
