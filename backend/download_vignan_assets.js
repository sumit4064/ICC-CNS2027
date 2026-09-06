import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = 'd:/Agentic Ai/ICC/frontend/public/images';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const assets = [
  { url: 'https://vignan.ac.in/newvignan/assets/images/Ablock.webp', name: 'vignan_ablock_campus.webp' },
  { url: 'https://vignan.ac.in/newvignan/images/favicon.svg', name: 'vignan_favicon.svg' },
  { url: 'https://vignan.ac.in/newvignan/departments/dep_images/CSE.webp', name: 'vignan_cse_dept.webp' },
  { url: 'https://vignan.ac.in/newvignan/assets/images/vignan-logo.png', name: 'vignan_logo.png' },
  { url: 'https://vignan.ac.in/newvignan/images/logo.png', name: 'vignan_header_logo.png' },
  { url: 'https://vignan.ac.in/newvignan/assets/images/banner1.webp', name: 'vignan_campus_banner.webp' }
];

async function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[DOWNLOADED] ${url} -> ${dest}`);
          resolve(true);
        });
      } else {
        console.log(`[STATUS ${res.statusCode}] ${url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`[ERROR] ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const item of assets) {
    const dest = path.join(outDir, item.name);
    await download(item.url, dest);
  }
}

run();
