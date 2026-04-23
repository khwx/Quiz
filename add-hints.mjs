import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const allHints = JSON.parse(fs.readFileSync('./questions_backup.json', 'utf-8'));

// Criar mapa de hints por texto
const hintsMap = {};
for (let category of Object.keys(allHints)) {
  for (let q of allHints[category]) {
    hintsMap[q.text] = q.hint;
  }
}

async function addHints() {
  // Buscar todas as perguntas sem image_url (não são bandeiras)
  const { data: questions } = await supabase
    .from('questions')
    .select('id, text, metadata')
    .is('image_url', null);
  
  console.log('Perguntas para adicionar hints:', questions.length);
  
  let updated = 0;
  
  for (let q of questions) {
    if (hintsMap[q.text]) {
      const newMetadata = q.metadata || {};
      newMetadata.hint = hintsMap[q.text];
      
      const { error } = await supabase
        .from('questions')
        .update({ metadata: newMetadata })
        .eq('id', q.id);
      
      if (!error) updated++;
    }
  }
  
  console.log('Hints adicionados:', updated);
  
  // Verificar resultado
  const { data: check } = await supabase
    .from('questions')
    .select('id, metadata')
    .is('image_url', null)
    .not('metadata', 'is', null)
    .limit(3);
  
  console.log('\nVerificacao (3 primeiras):');
  check.forEach(q => {
    console.log('- ' + q.metadata?.hint || 'sem hint');
  });
}

addHints();