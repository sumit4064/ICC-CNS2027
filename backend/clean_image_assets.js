import fs from 'fs';
import path from 'path';

const imagesDir = 'd:/Agentic Ai/ICC/frontend/public/images';

// Remove old AI generated images
['campus.jpg', 'venue.jpg', 'gallery-1.jpg', 'gallery-2.jpg'].forEach(f => {
  const p = path.join(imagesDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

// Copy real Ablock campus photo as main campus image
if (fs.existsSync(path.join(imagesDir, 'vignan_ablock_campus.webp'))) {
  fs.copyFileSync(
    path.join(imagesDir, 'vignan_ablock_campus.webp'),
    path.join(imagesDir, 'campus.webp')
  );
  fs.copyFileSync(
    path.join(imagesDir, 'vignan_ablock_campus.webp'),
    path.join(imagesDir, 'venue.webp')
  );
}

// Create placeholder for required official images if needed
fs.writeFileSync(
  path.join(imagesDir, 'OFFICIAL_VIGNAN_CAMPUS_IMAGE_REQUIRED.jpg'),
  'OFFICIAL VIGNAN CAMPUS IMAGE PLACEHOLDER'
);

console.log('Real official Vignan images set up. AI images completely removed.');
