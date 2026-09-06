import fs from 'fs';
import path from 'path';

function findImages(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf-8');
  const matches = text.match(/(?:src|href|content)=["']([^"']+\.(?:webp|jpg|jpeg|png|svg))["']/gi) || [];
  return [...new Set(matches.map(m => m.replace(/^(?:src|href|content)=["']/, '').replace(/["']$/, '')))];
}

const p1 = 'C:/Users/itzsu/.gemini/antigravity-ide/brain/a1745a23-3bac-4708-bcdc-014c6f5411cd/.system_generated/steps/203/content.md';
const p2 = 'C:/Users/itzsu/.gemini/antigravity-ide/brain/a1745a23-3bac-4708-bcdc-014c6f5411cd/.system_generated/steps/220/content.md';

const list = [...findImages(p1), ...findImages(p2)];
console.log('Found image URLs:', list.slice(0, 30));
