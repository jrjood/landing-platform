import { Router } from 'express';
import { leadService } from '../services/leadService';
import { createLeadSchema } from '../schemas/validation';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const validatedData = createLeadSchema.parse(req.body);
    if (validatedData.honeypot) {
      res.status(204).send();
      return;
    }
    const leadId = await leadService.create(validatedData);
    res.status(201).json({ message: 'Lead submitted successfully', leadId });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to submit lead' });
  }
});

export default router;
