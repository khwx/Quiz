// Script para testar e configurar o Supabase automaticamente
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 A testar Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Key (parcial):', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'NÃO ENCONTRADA');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.error('\n❌ Erro: Configura as chaves do Supabase no .env.local primeiro!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    try {
        // Testar conexão básica
        const { data, error } = await supabase.from('questions').select('count').limit(1);

        if (error) {
            if (error.message.includes('not find the table')) {
                console.log('⚠️  Tabela "questions" não existe ainda.');
                console.log('📋 Precisas de correr o SQL do ficheiro supabase_schema.sql no Supabase SQL Editor.');
                return false;
            } else {
                console.error('❌ Erro ao conectar:', error.message);
                return false;
            }
        }

        console.log('✅ Conexão ao Supabase OK!');
        console.log('✅ Tabela "questions" existe!');
        return true;
    } catch (err) {
        console.error('❌ Erro inesperado:', err.message);
        return false;
    }
}

testSupabase();
