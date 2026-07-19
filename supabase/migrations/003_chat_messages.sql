-- Chat messages table for in-game chat

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages for their game"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Players can insert their own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Players can update their own chat messages"
  ON chat_messages FOR UPDATE
  USING (true);

CREATE POLICY "Players can delete their own chat messages"
  ON chat_messages FOR DELETE
  USING (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_id ON chat_messages(game_id, created_at);
