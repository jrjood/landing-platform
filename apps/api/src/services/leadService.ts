import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

interface LeadRow extends RowDataPacket {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  job_title: string | null;
  preferred_contact_way: string | null;
  unit_type: string | null;
  message: string | null;
  projectId: number | null;
  projectTitle: string | null;
  campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  source_url: string | null;
  landing_host: string | null;
  status: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

interface LeadFilters {
  status?: string;
  projectId?: number;
  campaign?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const leadService = {
  async create(data: any) {
    const [projects] = await pool.query<any[]>(
      'SELECT id FROM projects WHERE slug = ? OR subdomain = ? LIMIT 1',
      [data.projectSlug, data.projectSlug]
    );
    if (projects.length === 0) throw { status: 404, message: 'Project not found' };

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO leads (
        name, phone, email, job_title, preferred_contact_way, unit_type, message, projectId,
        campaign, utm_source, utm_medium, utm_campaign, utm_content, utm_term, source_url, landing_host, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        data.name, data.phone, data.email || null, data.jobTitle || null,
        data.preferredContactWay || 'whatsapp', data.unitType || null, null,
        projects[0].id, data.campaign || data.utm?.campaign || null,
        data.utm?.source || null, data.utm?.medium || null,
        data.utm?.campaign || null, data.utm?.content || null,
        data.utm?.term || null, data.sourceUrl || null, data.landingHost || null,
      ]
    );
    return result.insertId;
  },

  async getAll(filters: LeadFilters = {}) {
    let whereClause = 'WHERE 1=1';
    const countParams: any[] = [];

    if (filters.status) { whereClause += ' AND leads.status = ?'; countParams.push(filters.status); }
    if (filters.projectId) { whereClause += ' AND leads.projectId = ?'; countParams.push(filters.projectId); }
    if (filters.campaign) { whereClause += ' AND (leads.campaign LIKE ? OR leads.utm_campaign LIKE ?)'; countParams.push(`%${filters.campaign}%`, `%${filters.campaign}%`); }
    if (filters.search) {
      whereClause += ' AND (leads.name LIKE ? OR leads.phone LIKE ? OR leads.email LIKE ?)';
      countParams.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters.dateFrom) { whereClause += ' AND leads.created_at >= ?'; countParams.push(filters.dateFrom); }
    if (filters.dateTo) { whereClause += ' AND leads.created_at <= ?'; countParams.push(filters.dateTo); }

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM leads ${whereClause}`, countParams
    );
    const total = Number(countRows[0].total);

    const sortCol = filters.sortBy || 'leads.created_at';
    const sortDir = filters.sortOrder || 'DESC';
    const allowedSortCols = ['leads.created_at', 'leads.name', 'leads.status', 'leads.phone'];
    const safeSort = allowedSortCols.includes(sortCol) ? sortCol : 'leads.created_at';
    const safeDir = sortDir === 'ASC' ? 'ASC' : 'DESC';

    const dataParams = [...countParams];
    let dataSql = `SELECT leads.*, projects.title as projectTitle FROM leads LEFT JOIN projects ON leads.projectId = projects.id ${whereClause} ORDER BY ${safeSort} ${safeDir}`;

    if (filters.limit) {
      const offset = ((filters.page || 1) - 1) * filters.limit;
      dataSql += ' LIMIT ? OFFSET ?';
      dataParams.push(filters.limit, offset);
    }

    const [rows] = await pool.query<LeadRow[]>(dataSql, dataParams);
    return { rows, total };
  },

  async getById(id: number) {
    const [rows] = await pool.query<LeadRow[]>(
      `SELECT leads.*, projects.title as projectTitle FROM leads LEFT JOIN projects ON leads.projectId = projects.id WHERE leads.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async update(id: number, data: { status?: string; notes?: string }) {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.status) { updates.push('status = ?'); params.push(data.status); }
    if (data.notes !== undefined) { updates.push('notes = ?'); params.push(data.notes); }

    if (updates.length === 0) throw { status: 400, message: 'No fields to update' };

    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`, params
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Lead not found' };
  },

  async delete(id: number) {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM leads WHERE id = ?', [id]
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Lead not found' };
  },

  async exportCsv(filters: LeadFilters = {}) {
    const result = await this.getAll({
      ...filters,
      page: undefined,
      limit: undefined,
    });
    return result.rows;
  },

  async getStats() {
    const [total] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM leads"
    );
    const [byStatus] = await pool.query<RowDataPacket[]>(
      "SELECT status, COUNT(*) as count FROM leads GROUP BY status"
    );
    const [todayCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM leads WHERE DATE(created_at) = CURDATE()"
    );
    const [byProject] = await pool.query<RowDataPacket[]>(
      `SELECT projects.title, COUNT(leads.id) as count FROM leads INNER JOIN projects ON leads.projectId = projects.id GROUP BY leads.projectId ORDER BY count DESC LIMIT 10`
    );
    const [byCampaign] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(NULLIF(leads.campaign, ''), NULLIF(leads.utm_campaign, ''), 'Unattributed') as campaign, COUNT(*) as count
       FROM leads GROUP BY campaign ORDER BY count DESC LIMIT 10`
    );
    const [bySource] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(NULLIF(leads.utm_source, ''), 'Direct') as source, COUNT(*) as count
       FROM leads GROUP BY source ORDER BY count DESC LIMIT 10`
    );

    return {
      total: total[0].total,
      today: todayCount[0].count,
      byStatus: byStatus.reduce((acc: any, row: any) => ({ ...acc, [row.status]: row.count }), {}),
      topProjects: byProject,
      byCampaign,
      bySource,
    };
  },
};
