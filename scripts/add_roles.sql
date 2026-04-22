-- Adicionar roles aos utilizadores
-- Executa este SQL no Supabase para dar acesso admin ao teu email

-- 1. Adiciona a coluna role se não existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Dá role admin ao teu email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tiagopmartins@gmail.com';

-- Se o utilizador ainda não existir na tabela profiles, cria primeiro com o role
INSERT INTO profiles (id, email, role, username)
SELECT 
    id,
    email,
    'admin',
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
WHERE email = 'tiagopmartins@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';