import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function fixNullCategory() {
  console.log('🔧 Corrigindo categoria null...');

  // Buscar todas as perguntas com categoria null
  const { data: nullCategoryQuestions } = await supabase.from('questions').select('id').eq('category', 'null');
  
  if (!nullCategoryQuestions || nullCategoryQuestions.length === 0) {
    console.log('✅ Nenhuma pergunta com categoria null');
    return;
  }

  console.log(`⚠️ Encontradas ${nullCategoryQuestions.length} pergunta(s) com categoria null`);

  // Para cada pergunta, corrigir a categoria
  for (const question of nullCategoryQuestions) {
    const { error } = await supabase.from('questions').update({ category: 'CULTURA_GERAL' }).eq('id', question.id);
    
    if (error) {
      console.error(`❌ Erro ao corrigir pergunta ${question.id}:`, error.message);
    } else {
      console.log(`✅ Pergunta ${question.id} corrigida para CULTURA_GERAL`);
    }
  }

  console.log('🎉 Categoria null corrigida!');
}

fixNullCategory().catch(console.error);
