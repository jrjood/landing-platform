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
  heroImageMobile: string | null;
  aboutImage: string | null;
  masterplanImage: string | null;
  caption1: string | null;
  caption2: string | null;
  caption3: string | null;
  gallery: string;
  brochureUrl: string | null;
  mapEmbedUrl: string | null;
  location: string;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  videos?: ProjectVideo[];
}

interface ProjectVideo extends RowDataPacket {
  id: number;
  projectId: number;
  title: string;
  category: string | null;
  thumbnailUrl: string;
  videoUrl: string;
  description: string | null;
  aspectRatio: string | null;
  sortOrder: number | null;
}

function parseProjectJson(project: Project) {
  return {
    ...project,
    gallery: JSON.parse(project.gallery || '[]'),
    brochureUrl: project.brochureUrl,
    videos: [] as ProjectVideo[],
  };
}

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<Project[]>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );

    const projects = rows.map(parseProjectJson);

    const projectIds = projects.map((p) => p.id);
    if (projectIds.length) {
      const [videoRows] = await pool.query<ProjectVideo[]>(
        'SELECT * FROM project_videos WHERE projectId IN (?) ORDER BY sortOrder ASC, id ASC',
        [projectIds]
      );

      const videosByProject = new Map<number, ProjectVideo[]>();
      videoRows.forEach((video) => {
        const list = videosByProject.get(video.projectId) || [];
        list.push(video);
        videosByProject.set(video.projectId, list);
      });

      projects.forEach((project) => {
        project.videos = videosByProject.get(project.id) || [];
      });
    }

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

    const [videoRows] = await pool.query<ProjectVideo[]>(
      'SELECT * FROM project_videos WHERE projectId = ? ORDER BY sortOrder ASC, id ASC',
      [project.id]
    );

    project.videos = videoRows;

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;
