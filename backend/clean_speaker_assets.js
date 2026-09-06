import fs from 'fs';
import path from 'path';

const speakersDir = 'd:/Agentic Ai/ICC/frontend/public/speakers';
const imagesDir = 'd:/Agentic Ai/ICC/frontend/public/images';

// Create clean neutral academic speaker avatar SVGs
const avatarSvg = (initials, color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#003A41" />
      <stop offset="100%" stop-color="#001F24" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#avatarGrad)"/>
  <circle cx="100" cy="78" r="38" fill="#004D56" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <path d="M 40 175 C 40 135 70 125 100 125 C 130 125 160 135 160 175 Z" fill="#004D56" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <circle cx="100" cy="78" r="30" fill="${color || '#FF6B35'}" opacity="0.2"/>
  <text x="100" y="88" font-family="'Outfit', sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle">${initials || 'DR'}</text>
</svg>`;

if (!fs.existsSync(speakersDir)) fs.mkdirSync(speakersDir, { recursive: true });

const avatars = [
  { file: 'speaker1.svg', initials: 'AT', color: '#FF6B35' },
  { file: 'speaker2.svg', initials: 'ER', color: '#00B4D8' },
  { file: 'speaker3.svg', initials: 'RM', color: '#10B981' },
  { file: 'speaker4.svg', initials: 'KT', color: '#A855F7' },
  { file: 'speaker5.svg', initials: 'SJ', color: '#FF6B35' },
  { file: 'speaker6.svg', initials: 'CM', color: '#00B4D8' }
];

avatars.forEach(a => {
  fs.writeFileSync(path.join(speakersDir, a.file), avatarSvg(a.initials, a.color), 'utf-8');
});

// Also write default placeholder
fs.writeFileSync(path.join(speakersDir, 'avatar_placeholder.svg'), avatarSvg('SP', '#FF6B35'), 'utf-8');

// Remove old jpgs if present
['speaker1.jpg', 'speaker2.jpg', 'speaker3.jpg', 'speaker4.jpg', 'speaker5.jpg', 'speaker6.jpg'].forEach(f => {
  const p = path.join(speakersDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

console.log('Clean neutral academic speaker placeholders created. All AI images removed.');
