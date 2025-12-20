import { Router } from 'express';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

const router = Router();

interface Project extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  gallery: string;
  videoUrl: string | null;
  mapEmbedUrl: string | null;
  highlights: string;
  location: string;
  type: string;
  status: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  faqs: string;
  created_at: Date;
  updated_at: Date;
}

function parseProjectJson(project: Project) {
  return {
    ...project,
    gallery: JSON.parse(project.gallery || '[]'),
    highlights: JSON.parse(project.highlights || '[]'),
    faqs: JSON.parse(project.faqs || '[]'),
  };
}

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
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

// GET /api/projects/:slug - Get project by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query<Project[]>(
      'SELECT * FROM projects WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = parseProjectJson(rows[0]);
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;
