import sharp from 'sharp';
import path from 'path';

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'));

const THUMBNAIL_MAX = 400;
const MEDIUM_MAX = 1200;
const QUALITY = 82;

export interface OptimizedImages {
  original: string;
  webp?: string;
  thumbnail?: string;
  thumbnailWebp?: string;
  medium?: string;
  mediumWebp?: string;
  width?: number;
  height?: number;
}

export async function optimizeImage(filename: string): Promise<OptimizedImages> {
  const ext = path.extname(filename).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return { original: `/uploads/${filename}` };
  }

  const baseName = path.basename(filename, ext);
  const inputPath = path.join(UPLOADS_DIR, filename);
  const result: OptimizedImages = { original: `/uploads/${filename}` };

  try {
    const metadata = await sharp(inputPath).metadata();
    if (!metadata.width || !metadata.height) return result;
    result.width = metadata.width;
    result.height = metadata.height;

    const isGif = ext === '.gif';

    // Generate WebP
    if (!isGif) {
      const webpFilename = `${baseName}.webp`;
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(path.join(UPLOADS_DIR, webpFilename));
      result.webp = `/uploads/${webpFilename}`;
    }

    // Generate thumbnail (400px)
    if (metadata.width > THUMBNAIL_MAX) {
      const thumbFilename = `${baseName}-thumb${ext}`;
      await sharp(inputPath)
        .resize(THUMBNAIL_MAX, undefined, { fit: 'inside', withoutEnlargement: true })
        .toFile(path.join(UPLOADS_DIR, thumbFilename));
      result.thumbnail = `/uploads/${thumbFilename}`;

      if (!isGif) {
        const thumbWebp = `${baseName}-thumb.webp`;
        await sharp(inputPath)
          .resize(THUMBNAIL_MAX, undefined, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(path.join(UPLOADS_DIR, thumbWebp));
        result.thumbnailWebp = `/uploads/${thumbWebp}`;
      }
    }

    // Generate medium (1200px)
    if (metadata.width > MEDIUM_MAX) {
      const medFilename = `${baseName}-med${ext}`;
      await sharp(inputPath)
        .resize(MEDIUM_MAX, undefined, { fit: 'inside', withoutEnlargement: true })
        .toFile(path.join(UPLOADS_DIR, medFilename));
      result.medium = `/uploads/${medFilename}`;

      if (!isGif) {
        const medWebp = `${baseName}-med.webp`;
        await sharp(inputPath)
          .resize(MEDIUM_MAX, undefined, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(path.join(UPLOADS_DIR, medWebp));
        result.mediumWebp = `/uploads/${medWebp}`;
      }
    }
  } catch (err) {
    console.error('Image optimization failed:', err);
  }

  return result;
}
