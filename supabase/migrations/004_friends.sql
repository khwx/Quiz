-- Friends system

CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friends"
  ON friends FOR SELECT
  USING (user_id = auth.uid()::text OR friend_id = auth.uid()::text);

CREATE POLICY "Users can send friend requests"
  ON friends FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own friends"
  ON friends FOR UPDATE
  USING (user_id = auth.uid()::text OR friend_id = auth.uid()::text);

CREATE POLICY "Users can delete their own friends"
  ON friends FOR DELETE
  USING (user_id = auth.uid()::text OR friend_id = auth.uid()::text);

CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
