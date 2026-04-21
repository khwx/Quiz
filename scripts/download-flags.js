#!/usr/bin/env node
// Script para fazer download de todas as bandeiras do mundo
// Executar: node scripts/download-flags.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const flagsDir = path.join(__dirname, '../public/flags');

// Lista de códigos de países
const countries = [
  // Europa
  'pt', 'es', 'fr', 'de', 'it', 'gb', 'nl', 'be', 'ch', 'at', 'gr', 'se', 'no', 'dk', 'fi', 'ie',
  'pl', 'ua', 'cz', 'hu', 'ro', 'bg', 'rs', 'hr', 'si', 'sk', 'ee', 'lv', 'lt', 'mt', 'cy', 'is',
  // América
  'br', 'ar', 'cl', 'co', 'pe', 've', 'ec', 'bo', 'uy', 'py', 'us', 'mx', 'ca', 'cu', 'jm', 'cr', 'pa', 'gt',
  // Ásia
  'jp', 'cn', 'kr', 'in', 'au', 'th', 'vn', 'id', 'ph', 'sg', 'my', 'mm', 'bd', 'pk', 'af',
  'ru', 'tr', 'ae', 'sa', 'il', 'ir', 'iq', 'tw', 'kz', 'by',
  // África
  'eg', 'za', 'ma', 'ng', 'ke', 'gh', 'tz', 'tn', 'dz', 'et',
  // Oceania
  'nz', 'fj', 'pg'
];

// Criar diretório se não existir
if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
  console.log(`📁 Created directory: ${flagsDir}`);
}

let downloaded = 0;
let failed = 0;

function downloadFlag(code) {
  return new Promise((resolve) => {
    const url = `https://flagcdn.com/${code}.svg`;
    const filepath = path.join(flagsDir, `${code}.svg`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${code}.svg`);
          downloaded++;
          resolve(true);
        });
      } else {
        console.log(`❌ Failed: ${code}.svg (${response.statusCode})`);
        failed++;
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ Error: ${code}.svg - ${err.message}`);
      failed++;
      resolve(false);
    });
    
    // Timeout de 10 segundos
    setTimeout(() => {
      file.close();
      if (!downloaded && !failed) {
        console.log(`⏱️ Timeout: ${code}.svg`);
        failed++;
      }
      resolve(false);
    }, 10000);
  });
}

async function main() {
  console.log(`🚀 Starting download of ${countries.length} flags...\n`);
  
  for (const code of countries) {
    await downloadFlag(code);
  }
  
  console.log(`\n📊 Done! Downloaded: ${downloaded}, Failed: ${failed}`);
  console.log(`📁 Flags saved to: ${flagsDir}`);
}

main();
