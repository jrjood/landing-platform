import { Router } from 'express';
import { pool } from '../../config/database';
import { updateLeadSchema } from '../../schemas/validation';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

interface Lead extends RowDataPacket {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  job_title: string | null;
  preferred_contact_way: 'whatsapp' | 'call' | null;
  unit_type: string | null;
  message: string | null;
  projectId: number | null;
  projectTitle: string | null;
  status: 'new' | 'qualified' | 'spam';
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

// GET /api/admin/leads - Get all leads
router.get('/', async (req: AuthRequest, res) => {
  try {
    const [rows] = await pool.query<Lead[]>(
      `SELECT leads.*, projects.title as projectTitle 
       FROM leads 
       LEFT JOIN projects ON leads.projectId = projects.id 
       ORDER BY leads.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// PATCH /api/admin/leads/:id/status - Quick status update (MUST BE BEFORE /:id routes)
router.patch('/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || !['new', 'qualified', 'spam'].includes(status)) {
      res
        .status(400)
        .json({ error: 'Invalid status. Must be: new, qualified, or spam' });
      return;
    }

    const updates = ['status = ?'];
    const params = [status];

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    params.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    // Return updated lead
    const [rows] = await pool.query<Lead[]>(
      `SELECT leads.*, projects.title as projectTitle 
       FROM leads 
       LEFT JOIN projects ON leads.projectId = projects.id 
       WHERE leads.id = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

// DELETE /api/admin/leads/:id - Delete lead
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM leads WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// GET /api/admin/leads/:id - Get single lead
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query<Lead[]>(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// PATCH /api/admin/leads/:id - Update lead
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateLeadSchema.parse(req.body);

    const updates: string[] = [];
    const params: any[] = [];

    if (validatedData.status !== undefined) {
      updates.push('status = ?');
      params.push(validatedData.status);
    }

    if (validatedData.notes !== undefined) {
      updates.push('notes = ?');
      params.push(validatedData.notes);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json({ message: 'Lead updated successfully' });
  } catch (error: any) {
    console.error('Error updating lead:', error);

    if (error.name === 'ZodError') {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// GET /api/admin/leads/export - Export leads to CSV
router.get('/export/csv', async (req: AuthRequest, res) => {
  try {
    const [rows] = await pool.query<Lead[]>(
      'SELECT * FROM leads ORDER BY created_at DESC'
    );

    // Create CSV
    const headers = [
      'ID',
      'Project',
      'Name',
      'Phone',
      'Email',
      'Job Title',
      'Preferred Contact',
      'Unit Type',
      'Status',
      'Notes',
      'Source URL',
      'Created At',
      'Updated At',
    ];

    const csvRows = [headers.join(',')];

    rows.forEach((lead) => {
      const row = [
        lead.id,
        lead.project_slug,
        `"${lead.name}"`,
        lead.phone,
        lead.email || '',
        lead.job_title ? `"${lead.job_title}"` : '',
        lead.preferred_contact_way,
        `"${lead.unit_type}"`,
        lead.status,
        lead.notes ? `"${lead.notes.replace(/"/g, '""')}"` : '',
        lead.source_url || '',
        new Date(lead.created_at).toISOString(),
        new Date(lead.updated_at).toISOString(),
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=leads-${Date.now()}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({ error: 'Failed to export leads' });
  }
});

export default router;
