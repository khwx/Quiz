-- Adicionar roles aos utilizadores
-- Executa este SQL no Supabase para dar acesso admin

-- 1. Adiciona a coluna role se não existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Se souberes o teu user ID, usa este:
-- Substitui 'TEU-USER-ID-AQUI' pelo teu ID do Supabase
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = 'teu-user-id-aqui';

-- 3. Ou cria um novo profile com role admin para o teu email:
-- Primeiro insere se não existir
INSERT INTO profiles (id, email, role, username)
SELECT 
    id,
    email,
    'admin',
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
WHERE email = 'tiagopmartins@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verificar: Mostra todos os profiles com roles
SELECT id, email, role FROM profiles WHERE role IS NOT NULL;