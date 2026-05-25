import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { amenityService } from '../../services/amenityService';
import { amenitySchema, updateAmenitySchema } from '../../schemas/validation';

const router = Router();
router.use(authenticateToken);

router.get('/', async (_req: AuthRequest, res) => {
  try {
    const amenities = await amenityService.getAll();
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

router.get('/categories', async (_req: AuthRequest, res) => {
  try {
    const categories = await amenityService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = amenitySchema.parse(req.body);
    const id = await amenityService.create(data);
    const amenity = await amenityService.getById(id);
    res.status(201).json(amenity);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create amenity' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = updateAmenitySchema.parse(req.body);
    await amenityService.update(Number(req.params.id), data);
    const amenity = await amenityService.getById(Number(req.params.id));
    res.json(amenity);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update amenity' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await amenityService.delete(Number(req.params.id));
    res.json({ message: 'Amenity deleted successfully' });
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to delete amenity' });
  }
});

export default router;
