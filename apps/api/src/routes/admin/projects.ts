import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { projectService } from '../../services/projectService';
import { updateProjectSchema } from '../../schemas/validation';

const router = Router();
router.use(authenticateToken);

router.get('/', async (_req: AuthRequest, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const validatedData = updateProjectSchema.parse(req.body);
    const projectId = await projectService.createProject(validatedData);
    res.status(201).json({ message: 'Project created successfully', id: projectId });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/:slug', async (req: AuthRequest, res) => {
  try {
    const { slug } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);
    await projectService.updateProject(slug, validatedData);
    res.json({ message: 'Project updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:slug', async (req: AuthRequest, res) => {
  try {
    await projectService.deleteProject(req.params.slug);
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
