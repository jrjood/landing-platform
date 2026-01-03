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
        slug, title, subtitle, description, heroImage, heroImageMobile, aboutImage, masterplanImage, caption1, caption2, caption3, gallery, brochureUrl, mapEmbedUrl, location, type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        validatedData.slug,
        validatedData.name,
        validatedData.tagline,
        validatedData.description,
        validatedData.heroImage || '',
        validatedData.heroImageMobile || '',
        validatedData.aboutImage || '',
        validatedData.masterplanImage || '',
        validatedData.caption1 || '',
        validatedData.caption2 || '',
        validatedData.caption3 || '',
        JSON.stringify(validatedData.gallery || []),
        validatedData.brochureUrl || '',
        validatedData.mapEmbedUrl || '',
        validatedData.locationText || '',
        validatedData.type || '',
        validatedData.status || '',
      ]
    );

    const projectId = result.insertId;

    if (validatedData.videos && validatedData.videos.length) {
      const videoValues = validatedData.videos.map((video, idx) => [
        projectId,
        video.title,
        video.category || '',
        video.thumbnailUrl,
        video.videoUrl,
        video.description || '',
        video.aspectRatio || null,
        video.sortOrder ?? idx,
      ]);

      await pool.query(
        `INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder)
         VALUES ?`,
        [videoValues]
      );
    }

    res
      .status(201)
      .json({ message: 'Project created successfully', id: projectId });
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
  heroImageMobile: string | null;
  aboutImage: string | null;
  masterplanImage: string | null;
  caption1: string | null;
  caption2: string | null;
  caption3: string | null;
  gallery: string;
  brochureUrl: string;
  mapEmbedUrl: string;
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

// GET /api/admin/projects - Get all projects
router.get('/', async (req: AuthRequest, res) => {
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

// PUT /api/admin/projects/:slug - Update project
router.put('/:slug', async (req: AuthRequest, res) => {
  try {
    const { slug } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);

    const [projectRows] = await pool.query<Project[]>(
      'SELECT id FROM projects WHERE slug = ?',
      [slug]
    );

    if (projectRows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const projectId = projectRows[0].id;

    const updates: string[] = [];
    const params: any[] = [];

    if (validatedData.slug) {
      updates.push('slug = ?');
      params.push(validatedData.slug);
    }

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

    if (validatedData.heroImageMobile) {
      updates.push('heroImageMobile = ?');
      params.push(validatedData.heroImageMobile);
    }

    if (validatedData.aboutImage) {
      updates.push('aboutImage = ?');
      params.push(validatedData.aboutImage);
    }

    if (validatedData.masterplanImage) {
      updates.push('masterplanImage = ?');
      params.push(validatedData.masterplanImage);
    }

    if (validatedData.caption1 !== undefined) {
      updates.push('caption1 = ?');
      params.push(validatedData.caption1 || '');
    }

    if (validatedData.caption2 !== undefined) {
      updates.push('caption2 = ?');
      params.push(validatedData.caption2 || '');
    }

    if (validatedData.caption3 !== undefined) {
      updates.push('caption3 = ?');
      params.push(validatedData.caption3 || '');
    }

    if (validatedData.gallery) {
      updates.push('gallery = ?');
      params.push(JSON.stringify(validatedData.gallery));
    }

    if (validatedData.brochureUrl !== undefined) {
      updates.push('brochureUrl = ?');
      params.push(validatedData.brochureUrl || '');
    }

    if (validatedData.mapEmbedUrl !== undefined) {
      updates.push('mapEmbedUrl = ?');
      params.push(validatedData.mapEmbedUrl);
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

    const hasVideoUpdate = validatedData.videos !== undefined;

    if (updates.length === 0 && !hasVideoUpdate) {
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

    if (validatedData.videos) {
      await pool.query('DELETE FROM project_videos WHERE projectId = ?', [
        projectId,
      ]);

      if (validatedData.videos.length) {
        const videoValues = validatedData.videos.map((video, idx) => [
          projectId,
          video.title,
          video.category || '',
          video.thumbnailUrl,
          video.videoUrl,
          video.description || '',
          video.aspectRatio || null,
          video.sortOrder ?? idx,
        ]);

        await pool.query(
          `INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder)
           VALUES ?`,
          [videoValues]
        );
      }
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
