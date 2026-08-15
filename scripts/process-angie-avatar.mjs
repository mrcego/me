import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath =
  'C:\\Users\\cesar\\.gemini\\antigravity-ide\\brain\\79e6bd67-3269-42b6-bf8e-a46f2f341da1\\.user_uploaded\\media_1786827264895.jpg';
const outputDir = 'd:\\Dev\\Projects\\me\\public\\img';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processAvatar() {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Extract raw RGBA buffer
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();

  // Flood fill from outer borders to remove the outer background AND the white sticker border
  // Angie's outer hair lines and shirt have dark brown/black outlines (R < 170, G < 140, B < 120).
  // The sticker outline and background are all light (R > 185, G > 185, B > 185) or grey drop shadows (R > 170, G > 170, B > 170).
  const isBackgroundOrSticker = (r, g, b) => {
    // Check if pixel is part of background, drop shadow, or white sticker border
    // Dark hair outline is typically R < 120, G < 90, B < 80.
    // Let's check brightness / luminance
    const isLightOrShadow =
      (r > 175 && g > 175 && b > 175) ||
      (r > 165 && g > 165 && b > 165 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) ||
      (r > 200 && g > 190 && b > 190);
    return isLightOrShadow;
  };

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed queue with all perimeter pixels
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
  }

  while (queue.length > 0) {
    const y = queue.pop();
    const x = queue.pop();
    const idx = y * width + x;

    if (visited[idx]) continue;
    visited[idx] = 1;

    const pIdx = idx * 4;
    const r = rawBuffer[pIdx];
    const g = rawBuffer[pIdx + 1];
    const b = rawBuffer[pIdx + 2];

    if (isBackgroundOrSticker(r, g, b)) {
      rawBuffer[pIdx + 3] = 0; // Make transparent

      // Expand to 4 neighbors
      if (x > 0 && !visited[idx - 1]) queue.push(x - 1, y);
      if (x < width - 1 && !visited[idx + 1]) queue.push(x + 1, y);
      if (y > 0 && !visited[idx - width]) queue.push(x, y - 1);
      if (y < height - 1 && !visited[idx + width]) queue.push(x, y + 1);
    }
  }

  // Optional: smooth alpha edges (simple anti-aliasing / defringing)
  // For pixels adjacent to transparent pixels that are very light, soften alpha
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;
      if (rawBuffer[pIdx + 3] > 0) {
        // Check if any neighbor is transparent
        const hasTransNeighbor =
          rawBuffer[(idx - 1) * 4 + 3] === 0 ||
          rawBuffer[(idx + 1) * 4 + 3] === 0 ||
          rawBuffer[(idx - width) * 4 + 3] === 0 ||
          rawBuffer[(idx + width) * 4 + 3] === 0;

        if (hasTransNeighbor) {
          const r = rawBuffer[pIdx];
          const g = rawBuffer[pIdx + 1];
          const b = rawBuffer[pIdx + 2];
          // If light edge pixel, blend alpha
          if (r > 150 && g > 150 && b > 150) {
            rawBuffer[pIdx + 3] = Math.max(0, 255 - Math.round(((r + g + b) / 3 - 150) * 2.5));
          }
        }
      }
    }
  }

  // Create PNG from raw RGBA buffer
  const processedPngBuffer = await sharp(rawBuffer, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();

  // Trim transparent padding
  const trimmed = sharp(processedPngBuffer).trim();
  const trimmedBuffer = await trimmed.toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();

  console.log('Trimmed size:', trimmedMeta.width, trimmedMeta.height);

  // Save standard full transparent avatar
  await sharp(trimmedBuffer).png({ quality: 95 }).toFile(path.join(outputDir, 'angie-avatar.png'));

  await sharp(trimmedBuffer)
    .webp({ quality: 95, effort: 6 })
    .toFile(path.join(outputDir, 'angie-avatar.webp'));

  // Create high-res circular / square avatar
  await sharp(trimmedBuffer)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ quality: 95 })
    .toFile(path.join(outputDir, 'angie-headshot.png'));

  await sharp(trimmedBuffer)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 95, effort: 6 })
    .toFile(path.join(outputDir, 'angie-headshot.webp'));

  // Also create a circular cropped face badge (close-up of face and glasses for small buttons/chat headers)
  // Let's calculate close up crop:
  // Face center in the trimmed image is roughly in the upper-middle area (x ~ 50%, y ~ 45%)
  const faceCropWidth = Math.round(trimmedMeta.width * 0.85);
  const faceCropHeight = Math.round(trimmedMeta.width * 0.85);
  const faceCropLeft = Math.round((trimmedMeta.width - faceCropWidth) / 2);
  const faceCropTop = Math.round(trimmedMeta.height * 0.05);

  const faceCloseUp = sharp(trimmedBuffer)
    .extract({
      left: Math.max(0, faceCropLeft),
      top: Math.max(0, faceCropTop),
      width: Math.min(faceCropWidth, trimmedMeta.width),
      height: Math.min(faceCropHeight, trimmedMeta.height),
    })
    .resize(256, 256, { fit: 'cover' });

  await faceCloseUp.clone().png({ quality: 95 }).toFile(path.join(outputDir, 'angie-face.png'));

  await faceCloseUp
    .clone()
    .webp({ quality: 95, effort: 6 })
    .toFile(path.join(outputDir, 'angie-face.webp'));

  console.log('Avatar processing complete!');
}

processAvatar().catch(console.error);
