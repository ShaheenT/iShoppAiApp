import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = fs.readFileSync(path.resolve('./public/logo.svg'));

async function generateIcons() {
  console.log('Generating PWA icons from /public/logo.svg...');
  
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('./public/pwa-192x192.png'));
  console.log('Created public/pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('./public/pwa-512x512.png'));
  console.log('Created public/pwa-512x512.png');

  // Apple Touch Icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('./public/apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // Maskable 512x512 with safe area margin (10%)
  const iconPadded = await sharp(svgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 51, b: 102, alpha: 1 },
    },
  })
    .composite([{ input: iconPadded, gravity: 'center' }])
    .png()
    .toFile(path.resolve('./public/pwa-maskable-512x512.png'));
  console.log('Created public/pwa-maskable-512x512.png');
}

generateIcons().catch(console.error);
