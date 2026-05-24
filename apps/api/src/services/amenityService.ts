import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export const amenityService = {
  async getAll() {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM amenities ORDER BY category ASC, name ASC'
    );
    return rows;
  },

  async getById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM amenities WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  toSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  async create(data: { slug?: string; name: string; icon?: string; category?: string; description?: string; isActive?: boolean }) {
    const slug = data.slug || this.toSlug(data.name);
    if (!slug) throw { status: 400, message: 'Amenity slug could not be generated' };
    const isActive = data.isActive === false ? 0 : 1;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO amenities (slug, name, icon, category, description, isActive) VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon), category = VALUES(category), description = VALUES(description), isActive = VALUES(isActive)`,
      [slug, data.name, data.icon || null, data.category || 'General', data.description || null, isActive]
    );
    if (result.insertId) return result.insertId;

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM amenities WHERE slug = ? LIMIT 1',
      [slug]
    );
    return rows[0]?.id;
  },

  async update(id: number, data: any) {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.name) { updates.push('name = ?'); params.push(data.name); }
    if (data.icon !== undefined) { updates.push('icon = ?'); params.push(data.icon); }
    if (data.category !== undefined) { updates.push('category = ?'); params.push(data.category); }
    if (data.description !== undefined) { updates.push('description = ?'); params.push(data.description); }
    if (data.isActive !== undefined) { updates.push('isActive = ?'); params.push(data.isActive); }

    if (updates.length === 0) throw { status: 400, message: 'No fields to update' };

    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE amenities SET ${updates.join(', ')} WHERE id = ?`, params
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Amenity not found' };
  },

  async delete(id: number) {
    await pool.query('DELETE FROM project_amenities WHERE amenityId = ?', [id]);
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM amenities WHERE id = ?', [id]
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Amenity not found' };
  },

  async getCategories() {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT DISTINCT category FROM amenities WHERE isActive = 1 ORDER BY category'
    );
    return rows.map((r: any) => r.category);
  },
};
