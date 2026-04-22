-- =============================================================================
-- FAMILY QUIZ - SISTEMA DE LOGIN E COMPETIÇÕES
-- Executar no SQL Editor do Supabase Dashboard
-- =============================================================================

-- 1. CRIAR TABELA DE UTILIZADORES (ligada ao Supabase Auth)
-- Esta tabela vais-auto-popular quando usuáriologa via Supabase Auth

-- 2. PERFIS DOS UTILIZADORES (extende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar TEXT DEFAULT '🎮',
    bio TEXT,
    total_games INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HISTÓRICO DE JOGOS (guarda sessões completas)
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_user_id UUID REFERENCES profiles(id),
    player_ids UUID[] DEFAULT '{}',
    player_scores JSONB DEFAULT '{}', -- {"uuid1": 100, "uuid2": 50}
    topic TEXT NOT NULL,
    question_count INTEGER DEFAULT 5,
    status TEXT DEFAULT 'completed', -- 'abandoned', 'completed'
    winner_id UUID REFERENCES profiles(id),
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RANKING GLOBAL
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    period TEXT DEFAULT 'all', -- 'weekly', 'monthly', 'all'
    rank INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, period)
);

-- 5. CONQUISTAS/ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL, -- 'first_win', 'streak_5', 'perfect_game', etc.
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- =============================================================================
-- FUNÇÕES ÚTEIS
-- =============================================================================

-- Função para atualizar ranking
CREATE OR REPLACE FUNCTION update_leaderboard(user_uuid UUID, points_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO leaderboard (user_id, period, points, games_played, updated_at)
    VALUES (user_uuid, 'all', points_to_add, 1, NOW())
    ON CONFLICT (user_id, period) DO UPDATE SET
        points = leaderboard.points + points_to_add,
        games_played = leaderboard.games_played + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para criar perfil automaticamente (trigger após signup)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, avatar)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username', '🎮');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando utilizador faz signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- CONFIGURAÇÕES DE SEGURANÇA (RLS)
-- =============================================================================

-- Ativar RLS nas novas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso

-- Profiles: público para leitura, apenas Dono pode editar
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Game sessions: apenas participantes
CREATE POLICY "Own game sessions" ON game_sessions
    FOR ALL USING (
        host_user_id = auth.uid() OR 
        auth.uid() = ANY(player_ids)
    );

-- Leaderboard: público para leitura
CREATE POLICY "Leaderboard is public" ON leaderboard
    FOR SELECT USING (true);

-- Achievements: apenas Dono
CREATE POLICY "Own achievements" ON achievements
    FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard(period, points DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_host ON game_sessions(host_user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created ON game_sessions(created_at DESC);

-- =============================================================================
-- ACHIEVEMENTS PRÉ-DEFINIDOS
-- =============================================================================

-- Lista de achievements disponíveis
CREATE TABLE IF NOT EXISTS achievement_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement INTEGER DEFAULT 1
);

INSERT INTO achievement_definitions (id, name, description, icon, requirement) VALUES
    ('first_win', 'Primeira Vitória', 'Ganha o teu primeiro jogo', '🏆', 1),
    ('streak_3', '3 Vitórias Seguidas', 'Ganha 3 jogos consecutivos', '🔥', 3),
    ('streak_5', '5 Vitórias Seguidas', 'Ganha 5 jogos consecutivos', '💎', 5),
    ('perfect_game', 'Jogo Perfeito', 'Responde todas corretas', '🌟', 1),
    ('speed_demon', 'Rédeas Curtas', 'Responde em média < 5 segundos', '⚡', 1),
    ('quiz_master', 'Mestre do Quiz', 'Joga 50 jogos', '🎓', 50),
    ('flag_expert', 'Expert em Bandeiras', 'Acerta 100 bandeiras', '🚩', 100),
    ('capital_master', 'Mestre das Capitais', 'Acerta 50 capitais', '🏛️', 50);

-- =============================================================================
-- NOTAS
-- =============================================================================

-- Para ativar Supabase Auth:
-- 1. Vai ao Supabase Dashboard → Authentication → Providers
-- 2. Ativa "Email" (ou Google)
-- 3. Configura as definições de signup

-- Para permitir signup público:
-- Authentication → Providers → Email → Enable Signup = ON