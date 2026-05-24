import path from 'path';
import fs from 'fs';

export interface StorageAdapter {
  save(filename: string, buffer: Buffer, mimetype: string): Promise<string>;
  delete(url: string): Promise<void>;
  getUrl(filename: string): string;
}

// Local filesystem storage
export class LocalStorage implements StorageAdapter {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async save(filename: string, buffer: Buffer, _mimetype: string): Promise<string> {
    const filePath = path.join(this.uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  }

  async delete(url: string): Promise<void> {
    const filePath = path.join(process.cwd(), url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Also delete WebP and thumbnails
    const dir = path.dirname(filePath);
    const baseName = path.basename(url, path.extname(url));
    const patterns = [`${baseName}.webp`, `${baseName}-thumb*`, `${baseName}-med*`];
    for (const pattern of patterns) {
      const glob = path.join(dir, pattern);
      if (fs.existsSync(glob.replace('*', ''))) {
        try {
          const files = fs.readdirSync(dir).filter(f => f.startsWith(baseName));
          for (const f of files) {
            fs.unlinkSync(path.join(dir, f));
          }
        } catch { /* skip */ }
      }
    }
  }

  getUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}

// S3-compatible storage (lazy imports — only needed when STORAGE_DRIVER=s3)
export class S3Storage implements StorageAdapter {
  private bucket: string;
  private baseUrl: string;
  private clientInitialized = false;
  private client: any = null;

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'wealthholding-media';
    this.baseUrl = process.env.S3_BASE_URL || `https://${this.bucket}.s3.amazonaws.com`;
  }

  private async ensureClient() {
    if (this.clientInitialized) return;
    // @ts-ignore - optional dependency
    const { S3Client, PutObjectCommand, DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    this.client = { S3Client, PutObjectCommand, DeleteObjectCommand };
    this.clientInitialized = true;
  }

  private async getS3Client() {
    await this.ensureClient();
    const s3Client = new this.client.S3Client({
      region: process.env.S3_REGION || 'eu-west-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    });
    return s3Client;
  }

  async save(filename: string, buffer: Buffer, mimetype: string): Promise<string> {
    await this.ensureClient();
    const s3Client = await this.getS3Client();
    await s3Client.send(new this.client.PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
      CacheControl: 'public, max-age=31536000',
    }));
    return `${this.baseUrl}/${filename}`;
  }

  async delete(url: string): Promise<void> {
    await this.ensureClient();
    const key = url.replace(`${this.baseUrl}/`, '');
    try {
      const s3Client = await this.getS3Client();
      await s3Client.send(new this.client.DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
    } catch { /* skip */ }
  }

  getUrl(filename: string): string {
    return `${this.baseUrl}/${filename}`;
  }
}

// Factory: returns the configured storage adapter
export function getStorage(): StorageAdapter {
  const driver = process.env.STORAGE_DRIVER || 'local';
  if (driver === 's3') {
    return new S3Storage();
  }
  return new LocalStorage();
}
