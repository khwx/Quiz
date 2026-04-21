#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const flagsDir = path.join(__dirname, '../public/flags');

const codes = [
  "ad","ae","af","ag","ai","al","am","ao","aq","ar","as","at","au","aw","ax","az",
  "ba","bb","bd","be","bf","bg","bh","bi","bj","bl","bm","bn","bo","bq","br","bs",
  "bt","bv","bw","by","bz","ca","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn",
  "co","cr","cu","cv","cw","cx","cy","cz","de","dj","dk","dm","do","dz","ec","ee",
  "eg","eh","er","es","et","eu","fi","fj","fk","fm","fo","fr","ga","gb","gd","ge",
  "gf","gg","gh","gi","gl","gm","gn","gp","gq","gr","gs","gt","gu","gw","gy","hk",
  "hm","hn","hr","ht","hu","id","ie","il","im","in","io","iq","ir","is","it","je",
  "jm","jo","jp","ke","kg","kh","ki","km","kn","kp","kr","kw","ky","kz","la","lb",
  "lc","li","lk","lr","ls","lt","lu","lv","ly","ma","mc","md","me","mf","mg","mh",
  "mk","ml","mm","mn","mo","mp","mq","mr","ms","mt","mu","mv","mw","mx","my","mz",
  "na","nc","ne","nf","ng","ni","nl","no","np","nr","nu","nz","om","pa","pe","pf",
  "pg","ph","pk","pl","pm","pn","pr","ps","pt","pw","py","qa","re","ro","rs","ru",
  "rw","sa","sb","sc","sd","se","sg","sh","si","sj","sk","sl","sm","sn","so","sr",
  "ss","st","sv","sx","sy","sz","tc","td","tf","tg","th","tj","tk","tl","tm","tn",
  "to","tr","tt","tv","tw","tz","ua","ug","um","un","us","uy","uz","va","vc","ve",
  "vg","vi","vn","vu","wf","ws","xk","ye","yt","za","zm","zw"
];

if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

let downloaded = 0;
let failed = 0;
let total = codes.length;

function downloadFlag(code) {
  return new Promise((resolve) => {
    const url = `https://flagcdn.com/${code}.svg`;
    const filepath = path.join(flagsDir, `${code}.svg`);
    
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped: ${code}.svg (already exists)`);
      downloaded++;
      resolve(true);
      return;
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ ${downloaded + failed + 1}/${total}: ${code}.svg`);
          downloaded++;
          resolve(true);
        });
      } else {
        fs.unlinkSync(filepath);
        console.log(`❌ ${downloaded + failed + 1}/${total}: ${code}.svg (${response.statusCode})`);
        failed++;
        resolve(false);
      }
    }).on('error', (err) => {
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      console.log(`❌ ${downloaded + failed + 1}/${total}: ${code}.svg - ${err.message}`);
      failed++;
      resolve(false);
    });
    
    setTimeout(() => {
      file.close();
      if (!fs.existsSync(filepath) || fs.statSync(filepath).size === 0) {
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        console.log(`⏱️  Timeout: ${code}.svg`);
        failed++;
        resolve(false);
      }
    }, 15000);
  });
}

async function main() {
  console.log(`🚀 Downloading ${total} flags to ${flagsDir}...\n`);
  
  for (const code of codes) {
    await downloadFlag(code);
  }
  
  console.log(`\n📊 Done! Downloaded: ${downloaded}, Failed: ${failed}, Total: ${total}`);
  console.log(`📁 Flags saved to: ${flagsDir}`);
  
  const existing = fs.readdirSync(flagsDir).filter(f => f.endsWith('.svg'));
  console.log(`📊 Files in folder: ${existing.length}`);
}

main();
