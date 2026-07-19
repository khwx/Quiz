-- XP Rewards Shop

CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'cosmetic',
  icon TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  reward_id UUID NOT NULL REFERENCES rewards(id),
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rewards"
  ON rewards FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own rewards"
  ON user_rewards FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can purchase rewards"
  ON user_rewards FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);
