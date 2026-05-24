import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { pool } from '../config/database';
import { ResultSetHeader } from 'mysql2';
import { optimizeImage } from './imageOptimizer';

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'));

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not supported`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const mediaService = {
  async uploadFile(file: Express.Multer.File, projectId?: number, developerId?: number, category?: string) {
    const url = `/uploads/${file.filename}`;
    const type = file.mimetype.startsWith('image/') ? 'image'
      : file.mimetype === 'application/pdf' ? 'brochure'
      : file.mimetype.startsWith('video/') ? 'video' : 'other';

    // Run image optimization in background (don't block response)
    const optimized = file.mimetype.startsWith('image/')
      ? await optimizeImage(file.filename)
      : null;

    const publicUrl = optimized?.webp || url;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO media_assets (
        projectId, developerId, url, originalUrl, webpUrl, thumbnailUrl, mediumUrl,
        altText, title, type, category, mimeType, width, height, size, sortOrder, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        projectId || null,
        developerId || null,
        publicUrl,
        url,
        optimized?.webp || null,
        optimized?.thumbnailWebp || optimized?.thumbnail || null,
        optimized?.mediumWebp || optimized?.medium || null,
        '',
        file.originalname,
        type,
        category || 'gallery',
        file.mimetype,
        optimized?.width || null,
        optimized?.height || null,
        file.size,
        Date.now(),
      ]
    );

    return {
      id: result.insertId,
      url: publicUrl,
      originalUrl: url,
      webpUrl: optimized?.webp,
      thumbnailUrl: optimized?.thumbnailWebp || optimized?.thumbnail,
      mediumUrl: optimized?.mediumWebp || optimized?.medium,
      type,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  },

  async deleteMedia(id: number) {
    const [rows] = await pool.query<any[]>(
      'SELECT url, originalUrl, webpUrl, thumbnailUrl, mediumUrl FROM media_assets WHERE id = ?', [id]
    );
    if (rows.length === 0) throw { status: 404, message: 'Media not found' };

    const urls = [
      rows[0].url,
      rows[0].originalUrl,
      rows[0].webpUrl,
      rows[0].thumbnailUrl,
      rows[0].mediumUrl,
    ].filter(Boolean);

    for (const url of [...new Set(urls)]) {
      this.deleteUploadFile(url);
    }

    await pool.query('DELETE FROM media_assets WHERE id = ?', [id]);
  },

  deleteUploadFile(url: string) {
    if (!url.startsWith('/uploads/')) return;
    const filename = path.basename(url);
    const filePath = path.resolve(UPLOADS_DIR, filename);
    if (!filePath.startsWith(UPLOADS_DIR)) return;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },

  async getMedia(projectId?: number, type?: string) {
    let sql = 'SELECT * FROM media_assets WHERE 1=1';
    const params: any[] = [];

    if (projectId) { sql += ' AND projectId = ?'; params.push(projectId); }
    if (type) { sql += ' AND type = ?'; params.push(type); }

    sql += ' ORDER BY sortOrder ASC, id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async updateMedia(id: number, data: any) {
    const allowedFields = [
      'projectId',
      'developerId',
      'altText',
      'title',
      'type',
      'category',
      'sortOrder',
      'isActive',
    ];
    const updates: string[] = [];
    const params: any[] = [];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field] === '' ? null : data[field]);
      }
    }

    if (!updates.length) throw { status: 400, message: 'No fields to update' };

    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE media_assets SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Media not found' };

    const [rows] = await pool.query<any[]>('SELECT * FROM media_assets WHERE id = ?', [id]);
    return rows[0];
  },

  async updateSortOrder(items: { id: number; sortOrder: number }[]) {
    for (const item of items) {
      await pool.query('UPDATE media_assets SET sortOrder = ? WHERE id = ?', [
        item.sortOrder,
        item.id,
      ]);
    }
  },
};
