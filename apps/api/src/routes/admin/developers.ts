import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { developerService } from '../../services/developerService';
import { developerSchema, updateDeveloperSchema } from '../../schemas/validation';

const router = Router();
router.use(authenticateToken);

router.get('/', async (_req: AuthRequest, res) => {
  try {
    const developers = await developerService.getAll();
    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

router.get('/:slug', async (req: AuthRequest, res) => {
  try {
    const developer = await developerService.getBySlug(req.params.slug);
    if (!developer) return res.status(404).json({ error: 'Developer not found' });
    res.json(developer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch developer' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = developerSchema.parse(req.body);
    const id = await developerService.create(data);
    res.status(201).json({ message: 'Developer created successfully', id });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create developer' });
  }
});

router.put('/:slug', async (req: AuthRequest, res) => {
  try {
    const data = updateDeveloperSchema.parse(req.body);
    await developerService.update(req.params.slug, data);
    const developer = await developerService.getBySlug(req.params.slug);
    res.json(developer);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update developer' });
  }
});

router.delete('/:slug', async (req: AuthRequest, res) => {
  try {
    await developerService.delete(req.params.slug);
    res.json({ message: 'Developer deleted successfully' });
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to delete developer' });
  }
});

export default router;
