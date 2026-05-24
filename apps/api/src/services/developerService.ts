import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export const developerService = {
  async getAll() {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM developers ORDER BY name ASC'
    );
    return rows.map((d: any) => ({
      ...d,
      socialLinks: d.socialLinks ? JSON.parse(d.socialLinks) : {},
    }));
  },

  async getById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM developers WHERE id = ?', [id]
    );
    if (!rows[0]) return null;
    return {
      ...rows[0],
      socialLinks: rows[0].socialLinks ? JSON.parse(rows[0].socialLinks) : {},
    };
  },

  async getBySlug(slug: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM developers WHERE slug = ?', [slug]
    );
    if (!rows[0]) return null;
    return {
      ...rows[0],
      socialLinks: rows[0].socialLinks ? JSON.parse(rows[0].socialLinks) : {},
    };
  },

  async create(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO developers (
        slug, name, description, headline, logoUrl, showcaseImageUrl,
        yearsOfExperience, projectsDelivered, happyFamilies, brandColor,
        contactEmail, contactPhone, websiteUrl, socialLinks, seoTitle, seoDescription
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, data.name, data.description || null, data.headline || null,
        data.logoUrl || null, data.showcaseImageUrl || null,
        data.yearsOfExperience || null, data.projectsDelivered || null,
        data.happyFamilies || null, data.brandColor || null,
        data.contactEmail || null, data.contactPhone || null,
        data.websiteUrl || null, JSON.stringify(data.socialLinks || {}),
        data.seoTitle || null, data.seoDescription || null,
      ]
    );
    return result.insertId;
  },

  async update(slug: string, data: any) {
    const updates: string[] = [];
    const params: any[] = [];

    const fieldMap: Record<string, string> = {
      name: 'name', description: 'description', headline: 'headline',
      logoUrl: 'logoUrl', showcaseImageUrl: 'showcaseImageUrl',
      yearsOfExperience: 'yearsOfExperience',
      projectsDelivered: 'projectsDelivered',
      happyFamilies: 'happyFamilies',
      brandColor: 'brandColor', contactEmail: 'contactEmail',
      contactPhone: 'contactPhone', websiteUrl: 'websiteUrl',
      seoTitle: 'seoTitle', seoDescription: 'seoDescription',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        updates.push(`${col} = ?`);
        params.push(data[key] === '' ? null : data[key]);
      }
    }

    if (data.socialLinks !== undefined) {
      updates.push('socialLinks = ?');
      params.push(JSON.stringify(data.socialLinks));
    }

    if (updates.length === 0) throw { status: 400, message: 'No fields to update' };

    params.push(slug);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE developers SET ${updates.join(', ')} WHERE slug = ?`, params
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Developer not found' };
  },

  async delete(slug: string) {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM developers WHERE slug = ?', [slug]
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Developer not found' };
  },
};
