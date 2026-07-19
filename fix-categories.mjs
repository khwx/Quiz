import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function fixCategories() {
  console.log('🔧 Corrigindo categorias erradas...\n');

  // Fix HISTORIA → HISTÓRIA
  console.log('📝 Corrigindo HISTORIA → HISTÓRIA...');
  let offset = 0;
  let totalFixed = 0;
  while (true) {
    const { data } = await supabase.from('questions').select('id').eq('category', 'HISTORIA').range(offset, offset + 999);
    if (!data || data.length === 0) break;
    const ids = data.map(r => r.id);
    const { error } = await supabase.from('questions').update({ category: 'HISTÓRIA' }).in('id', ids);
    if (error) {
      console.error('❌ Erro ao corrigir HISTORIA:', error.message);
      break;
    }
    totalFixed += ids.length;
    offset += 1000;
    console.log(`  ✅ ${totalFixed} corrigidos até agora...`);
  }
  console.log(`✅ Total HISTORIA → HISTÓRIA: ${totalFixed}\n`);

  // Fix Bandeiras → BANDEIRAS
  console.log('📝 Corrigindo Bandeiras → BANDEIRAS...');
  offset = 0;
  let totalBandeiras = 0;
  while (true) {
    const { data } = await supabase.from('questions').select('id').eq('category', 'Bandeiras').range(offset, offset + 999);
    if (!data || data.length === 0) break;
    const ids = data.map(r => r.id);
    const { error } = await supabase.from('questions').update({ category: 'BANDEIRAS' }).in('id', ids);
    if (error) {
      console.error('❌ Erro ao corrigir Bandeiras:', error.message);
      break;
    }
    totalBandeiras += ids.length;
    offset += 1000;
    console.log(`  ✅ ${totalBandeiras} corrigidos até agora...`);
  }
  console.log(`✅ Total Bandeiras → BANDEIRAS: ${totalBandeiras}\n`);

  console.log('🎉 Categorias corrigidas!');
}

fixCategories().catch(console.error);
