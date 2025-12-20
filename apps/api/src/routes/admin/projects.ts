import { Router } from 'express';
import { pool } from '../../config/database';
import { updateProjectSchema } from '../../schemas/validation';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

interface Project extends RowDataPacket {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  location_text: string;
  map_embed_url: string;
  delivery_date: string;
  payment_plan: string;
  starting_price: string;
  highlights: string;
  gallery: string;
  faqs: string;
  created_at: Date;
  updated_at: Date;
}

function parseProjectJson(project: Project) {
  return {
    ...project,
    highlights: JSON.parse(project.highlights || '[]'),
    gallery: JSON.parse(project.gallery || '[]'),
    faqs: JSON.parse(project.faqs || '[]'),
  };
}

// GET /api/admin/projects - Get all projects
router.get('/', async (req: AuthRequest, res) => {
  try {
    const [rows] = await pool.query<Project[]>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );

    const projects = rows.map(parseProjectJson);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// PUT /api/admin/projects/:slug - Update project
router.put('/:slug', async (req: AuthRequest, res) => {
  try {
    const { slug } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);

    const updates: string[] = [];
    const params: any[] = [];

    if (validatedData.name) {
      updates.push('name = ?');
      params.push(validatedData.name);
    }

    if (validatedData.tagline) {
      updates.push('tagline = ?');
      params.push(validatedData.tagline);
    }

    if (validatedData.description) {
      updates.push('description = ?');
      params.push(validatedData.description);
    }

    if (validatedData.locationText) {
      updates.push('location_text = ?');
      params.push(validatedData.locationText);
    }

    if (validatedData.mapEmbedUrl !== undefined) {
      updates.push('map_embed_url = ?');
      params.push(validatedData.mapEmbedUrl);
    }

    if (validatedData.deliveryDate) {
      updates.push('delivery_date = ?');
      params.push(validatedData.deliveryDate);
    }

    if (validatedData.paymentPlan) {
      updates.push('payment_plan = ?');
      params.push(validatedData.paymentPlan);
    }

    if (validatedData.startingPrice) {
      updates.push('starting_price = ?');
      params.push(validatedData.startingPrice);
    }

    if (validatedData.highlights) {
      updates.push('highlights = ?');
      params.push(JSON.stringify(validatedData.highlights));
    }

    if (validatedData.gallery) {
      updates.push('gallery = ?');
      params.push(JSON.stringify(validatedData.gallery));
    }

    if (validatedData.faqs) {
      updates.push('faqs = ?');
      params.push(JSON.stringify(validatedData.faqs));
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(slug);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE projects SET ${updates.join(', ')} WHERE slug = ?`,
      params
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error: any) {
    console.error('Error updating project:', error);

    if (error.name === 'ZodError') {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({ error: 'Failed to update project' });
  }
});

export default router;
