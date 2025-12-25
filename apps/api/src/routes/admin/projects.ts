import { Router } from 'express';
import { pool } from '../../config/database';
import { updateProjectSchema } from '../../schemas/validation';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// DELETE /api/admin/projects/:slug - Delete project
router.delete('/:slug', async (req: AuthRequest, res) => {
  const { slug } = req.params;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM projects WHERE slug = ?',
      [slug]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /api/admin/projects - Create new project
router.post('/', async (req: AuthRequest, res) => {
  try {
    // Validate input
    const validatedData = updateProjectSchema.parse(req.body);

    // Required fields for creation
    if (
      !validatedData.slug ||
      !validatedData.name ||
      !validatedData.tagline ||
      !validatedData.description
    ) {
      return res.status(400).json({
        error: 'Missing required fields: slug, name, tagline, description',
      });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO projects (
        slug, title, subtitle, description, heroImage, gallery, videoUrl, mapEmbedUrl, highlights, location, type, status, phone, whatsapp, email, facebook, instagram, youtube, linkedin, faqs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        validatedData.slug,
        validatedData.name,
        validatedData.tagline,
        validatedData.description,
        validatedData.heroImage || '',
        JSON.stringify(validatedData.gallery || []),
        validatedData.videoUrl || '',
        validatedData.mapEmbedUrl || '',
        JSON.stringify(validatedData.highlights || []),
        validatedData.locationText || '',
        validatedData.type || '',
        validatedData.status || '',
        validatedData.phone || '',
        validatedData.whatsapp || '',
        validatedData.email || '',
        validatedData.facebook || '',
        validatedData.instagram || '',
        validatedData.youtube || '',
        validatedData.linkedin || '',
        JSON.stringify(validatedData.faqs || []),
      ]
    );

    res
      .status(201)
      .json({ message: 'Project created successfully', id: result.insertId });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.name === 'ZodError') {
      console.error('Zod validation errors:', error.errors);
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
      return;
    }
    if (error.sqlMessage) {
      console.error('SQL error:', error.sqlMessage);
    }
    res.status(500).json({ error: 'Failed to create project', details: error });
  }
});

interface Project extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  gallery: string;
  videoUrl: string;
  mapEmbedUrl: string;
  highlights: string;
  location: string;
  type: string;
  status: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
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
      updates.push('title = ?');
      params.push(validatedData.name);
    }

    if (validatedData.tagline) {
      updates.push('subtitle = ?');
      params.push(validatedData.tagline);
    }

    if (validatedData.description) {
      updates.push('description = ?');
      params.push(validatedData.description);
    }

    if (validatedData.heroImage) {
      updates.push('heroImage = ?');
      params.push(validatedData.heroImage);
    }

    if (validatedData.gallery) {
      updates.push('gallery = ?');
      params.push(JSON.stringify(validatedData.gallery));
    }

    if (validatedData.videoUrl) {
      updates.push('videoUrl = ?');
      params.push(validatedData.videoUrl);
    }

    if (validatedData.mapEmbedUrl !== undefined) {
      updates.push('mapEmbedUrl = ?');
      params.push(validatedData.mapEmbedUrl);
    }

    if (validatedData.highlights) {
      updates.push('highlights = ?');
      params.push(JSON.stringify(validatedData.highlights));
    }

    if (validatedData.locationText) {
      updates.push('location = ?');
      params.push(validatedData.locationText);
    }

    if (validatedData.type) {
      updates.push('type = ?');
      params.push(validatedData.type);
    }

    if (validatedData.status) {
      updates.push('status = ?');
      params.push(validatedData.status);
    }

    if (validatedData.phone) {
      updates.push('phone = ?');
      params.push(validatedData.phone);
    }

    if (validatedData.whatsapp) {
      updates.push('whatsapp = ?');
      params.push(validatedData.whatsapp);
    }

    if (validatedData.email) {
      updates.push('email = ?');
      params.push(validatedData.email);
    }

    if (validatedData.facebook) {
      updates.push('facebook = ?');
      params.push(validatedData.facebook);
    }

    if (validatedData.instagram) {
      updates.push('instagram = ?');
      params.push(validatedData.instagram);
    }

    if (validatedData.youtube) {
      updates.push('youtube = ?');
      params.push(validatedData.youtube);
    }

    if (validatedData.linkedin) {
      updates.push('linkedin = ?');
      params.push(validatedData.linkedin);
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
