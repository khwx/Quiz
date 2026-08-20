import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { config as loadDotenv } from 'dotenv';
import { readFileSync } from 'fs';

loadDotenv();

if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const pool = JSON.parse(readFileSync('scripts/curated-pool.json', 'utf8'));
  let updated = 0;
  for (const q of pool) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, metadata')
      .eq('text', q.text)
      .eq('category', q.category)
      .limit(5);
    if (error) { console.warn(`⚠️ ${q.category}: ${error.message}`); continue; }
    if (!data || data.length === 0) continue;
    for (const row of data) {
      const meta = { ...(row.metadata || {}), hint: q.metadata.hint, explanation: q.metadata.explanation };
      const { error: upErr } = await supabase.from('questions').update({ metadata: meta }).eq('id', row.id);
      if (upErr) console.warn(`⚠️ update ${row.id}: ${upErr.message}`);
      else updated++;
    }
  }
  console.log(`💡 Explicações/curiosidades preenchidas em ${updated} pergunta(s) da BD.`);
}

main().catch(console.error);
