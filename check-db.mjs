import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const existingTexts = new Set();

async function getExisting() {
  const { data } = await supabase.from('questions').select('text');
  data.forEach(q => existingTexts.add(q.text));
}

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeHint(text, answer) {
  return 'A resposta correta é: ' + answer;
}

function hasHint(q) {
  return q.metadata && q.metadata.hint && q.metadata.hint.length > 5;
}

async function ensureHints() {
  const { data } = await supabase.from('questions').select('id, text, metadata');
  const toUpdate = [];
  
  data.forEach(q => {
    if (!hasHint(q)) {
      toUpdate.push({ id: q.id, metadata: { hint: 'Consulta a resposta correcta.' } });
    }
  });
  
  if (toUpdate.length > 0) {
    for (const u of toUpdate) {
      await supabase.from('questions').update({ metadata: u.metadata }).eq('id', u.id);
    }
    console.log('Hints added: ' + toUpdate.length);
  } else {
    console.log('All questions already have hints.');
  }
}

async function getCounts() {
  const { data } = await supabase.from('questions').select('category, age_rating');
  const counts = {};
  data.forEach(q => {
    const key = q.category + '|' + q.age_rating;
    counts[key] = (counts[key] || 0) + 1;
  });
  
  const cats = [...new Set(data.map(q=>q.category))].sort();
  console.log('Category | L8  L12 L16');
  console.log('---------+------------');
  cats.forEach(cat => {
    const l8 = counts[cat + '|8'] || 0;
    const l12 = counts[cat + '|12'] || 0;
    const l16 = counts[cat + '|16'] || 0;
    console.log(cat.padEnd(18) + ' |' + l8.toString().padStart(3) + ' ' + l12.toString().padStart(3) + ' ' + l16.toString().padStart(3));
  });
  console.log('\nTotal: ' + data.length);
}

async function main() {
  await getExisting();
  await getCounts();
  await ensureHints();
}

main();