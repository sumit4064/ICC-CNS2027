import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = 'd:/Agentic Ai/ICC/frontend/public/images';
const logoDir = 'd:/Agentic Ai/ICC/frontend/public/logos';

[outDir, logoDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const downloads = [
  { url: 'https://vignan.ac.in/newvignan/assets/images/Logo%20with%20Deemed.svg', dest: path.join(logoDir, 'vignan_official_logo.svg') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/mobile-logo.svg', dest: path.join(logoDir, 'vignan_mobile_logo.svg') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/logonew.png', dest: path.join(logoDir, 'vignan_logo_new.png') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/Ablock.webp', dest: path.join(outDir, 'vignan_ablock_campus.webp') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/whychooseus.webp', dest: path.join(outDir, 'vignan_campus_life.webp') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/home/image-11.webp', dest: path.join(outDir, 'vignan_campus_event_1.webp') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/home/image-12.webp', dest: path.join(outDir, 'vignan_campus_event_2.webp') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/home/image-13.webp', dest: path.join(outDir, 'vignan_campus_event_3.webp') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/departments.webp', dest: path.join(outDir, 'vignan_departments.webp') },
  { url: 'https://vignan.ac.in/newvignan/assets/images/programs.webp', dest: path.join(outDir, 'vignan_programs.webp') }
];

async function downloadFile(item) {
  return new Promise((resolve) => {
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(item.dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[SUCCESS] ${path.basename(item.dest)} (${res.headers['content-length'] || 'ok'} bytes)`);
          resolve(true);
        });
      } else {
        console.log(`[STATUS ${res.statusCode}] ${item.url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`[ERROR] ${item.url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function start() {
  for (const item of downloads) {
    await downloadFile(item);
  }
}

start();
