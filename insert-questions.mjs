import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://lmfexrtxrxmeajxtuoof.supabase.co',
  'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve'
);

const allQuestions = JSON.parse(fs.readFileSync('./questions_backup.json', 'utf-8'));

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

async function insert() {
  let total = 0;
  
  for (let category of Object.keys(allQuestions)) {
    let questions = allQuestions[category];
    let categoryQuestions = [];
    
    for (let q of questions) {
      let options = shuffle([...q.options]);
      let correct_option = options.indexOf(q.options[q.correct_option]);
      
      categoryQuestions.push({
        text: q.text,
        options: options,
        correct_option: correct_option,
        category: category,
        age_rating: 8
      });
    }
    
    const { error } = await supabase.from('questions').insert(categoryQuestions);
    if (error) {
      console.log('Erro em ' + category + ':', error.message);
    } else {
      console.log(category + ': ' + categoryQuestions.length);
      total += categoryQuestions.length;
    }
  }
  
  const { count } = await supabase.from('questions').select('id', { count: 'exact' });
  console.log('\nTOTAL: ' + count + ' perguntas');
}

insert();