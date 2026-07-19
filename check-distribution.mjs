import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

async function checkDistribution() {
  const allRows = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const { data } = await supabase.from('questions').select('*').range(offset, offset + limit - 1);
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < limit) break;
    offset += limit;
  }

  const cats = {};
  for (const q of allRows) {
    const cat = q.category;
    cats[cat] = (cats[cat] || 0) + 1;
  }

  console.log('📊 Distribuição final:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(count.toString().padStart(3) + ' | ' + bar + ' ' + cat);
  });

  const lowCats = Object.entries(cats).filter(([_, count]) => count < 100);
  if (lowCats.length > 0) {
    console.log('\n⚠️ Categorias com menos de 100 perguntas:');
    lowCats.forEach(([cat, count]) => console.log(`  - ${cat}: ${count}`));
  } else {
    console.log('\n✅ Todas as categorias têm 100+ perguntas!');
  }
}

checkDistribution().catch(console.error);
