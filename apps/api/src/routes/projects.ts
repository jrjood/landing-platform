import { Router } from 'express';
import { projectService } from '../services/projectService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const projects = await projectService.getPublicProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/:identifier', async (req, res) => {
  try {
    const project = await projectService.getPublicProject(req.params.identifier);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;
