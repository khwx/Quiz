
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const data = JSON.parse(fs.readFileSync('questions_backup.json', 'utf8'));
const backupQ = [];
for (const cat in data) {
  for (const q of data[cat]) {
    backupQ.push({ ...q, category: cat });
  }
}

console.log('Total backup:', backupQ.length);

// Get existing
const { data: existing, error: fetchErr } = await supabase
  .from('questions')
  .select('id, text, category, options, correct_option');

if (fetchErr) {
  console.error('Fetch error:', fetchErr);
  process.exit(1);
}

const existingMap = new Map();
for (const q of existing || []) {
  existingMap.set((q.text || '').toLowerCase().trim() + '|' + (q.category || '').toLowerCase().trim(), q);
}

let updated = 0, inserted = 0, skipped = 0, errors = 0;

for (let i = 0; i < backupQ.length; i++) {
  const q = backupQ[i];
  const key = (q.text || '').toLowerCase().trim() + '|' + (q.category || '').toLowerCase().trim();
  const ex = existingMap.get(key);
  
  const row = {
    text: q.text.trim(),
    options: q.options,
    correct_option: q.correct_option,
    age_rating: q.age_rating || 8,
    category: q.category,
    image_url: q.image_url || null,
    country_code: q.country_code || null,
    metadata: q.metadata || { hint: 'A resposta correta e: ' + q.options[q.correct_option] }
  };
  
  if (ex) {
    const needsUpdate = JSON.stringify(ex.options) !== JSON.stringify(q.options) ||
                        ex.correct_option !== q.correct_option;
    if (needsUpdate) {
      const { error } = await supabase.from('questions').update(row).eq('id', ex.id);
      if (error) { console.error('Update error', q.text.substring(0, 30)); errors++; }
      else { updated++; }
    } else { skipped++; }
  } else {
    const { error } = await supabase.from('questions').insert([row]);
    if (error) { console.error('Insert error', q.text.substring(0, 30)); errors++; }
    else { inserted++; }
  }
  
  if (i % 50 === 0) {
    console.log('Progress: ' + i + '/' + backupQ.length + ' (updated: ' + updated + ', inserted: ' + inserted + ', skipped: ' + skipped + ')');
  }
}

console.log('Sync complete!');
console.log('Updated: ' + updated + ', Inserted: ' + inserted + ', Skipped: ' + skipped + ', Errors: ' + errors);
console.log('Total DB before: ' + existing.length + ', Total after: ' + (existing.length - updated + inserted));
