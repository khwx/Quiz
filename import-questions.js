// Script para importar perguntas de exemplo para o Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.error('❌ Erro: Configura o Supabase no .env.local primeiro!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importQuestions() {
    try {
        console.log('📥 A importar perguntas de exemplo...\n');

        // Ler ficheiro JSON
        const questions = JSON.parse(fs.readFileSync('sample-questions.json', 'utf-8'));

        // Inserir na base de dados
        const { data, error } = await supabase
            .from('questions')
            .insert(questions);

        if (error) {
            console.error('❌ Erro ao inserir:', error.message);
        } else {
            console.log(`✅ ${questions.length} perguntas importadas com sucesso!`);
            console.log('🎮 Já podes começar a jogar!');
        }
    } catch (err) {
        console.error('❌ Erro:', err.message);
    }
}

importQuestions();
