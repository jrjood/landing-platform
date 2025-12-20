import { Router } from 'express';
import { pool } from '../config/database';
import { createLeadSchema } from '../schemas/validation';
import { ResultSetHeader } from 'mysql2';

const router = Router();

// POST /api/leads - Create a new lead
router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      job_title,
      preferred_contact_way,
      unit_type,
      message,
      projectId,
      projectSlug,
    } = req.body;

    if (!name || !phone) {
      res.status(400).json({ error: 'Name and phone are required' });
      return;
    }

    // If projectSlug is provided, look up the projectId
    let finalProjectId = projectId || null;
    if (projectSlug) {
      const [projects] = await pool.query<any[]>(
        'SELECT id FROM projects WHERE slug = ?',
        [projectSlug]
      );
      if (projects.length > 0) {
        finalProjectId = projects[0].id;
      }
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO leads (name, phone, email, job_title, preferred_contact_way, unit_type, message, projectId, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        name,
        phone,
        email || null,
        job_title || null,
        preferred_contact_way || 'whatsapp',
        unit_type || null,
        message || null,
        finalProjectId,
      ]
    );

    res.status(201).json({
      message: 'Lead submitted successfully',
      leadId: result.insertId,
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);

    if (error.name === 'ZodError') {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({ error: 'Failed to submit lead' });
  }
});

export default router;
