import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { leadService } from '../../services/leadService';
import { updateLeadSchema } from '../../schemas/validation';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, projectId, campaign, search, dateFrom, dateTo, sortBy, sortOrder, page, limit } = req.query as any;
    const leads = await leadService.getAll({
      status, projectId: projectId ? Number(projectId) : undefined,
      campaign, search, dateFrom, dateTo, sortBy, sortOrder,
      page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined,
    });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.get('/stats', async (_req: AuthRequest, res) => {
  try {
    const stats = await leadService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead stats' });
  }
});

router.get('/export/csv', async (req: AuthRequest, res) => {
  try {
    const { status, projectId, campaign, search, dateFrom, dateTo, sortBy, sortOrder } = req.query as any;
    const leads = await leadService.exportCsv({
      status,
      projectId: projectId ? Number(projectId) : undefined,
      campaign,
      search,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    });
    const headers = ['ID', 'Project', 'Name', 'Phone', 'Email', 'Job Title', 'Preferred Contact', 'Unit Type', 'Status', 'Notes', 'Campaign', 'UTM Source', 'Source URL', 'Created At'];
    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      csvRows.push([
        lead.id, `"${lead.projectTitle || ''}"`, `"${lead.name}"`, lead.phone,
        `"${lead.email || ''}"`, `"${lead.job_title || ''}"`, lead.preferred_contact_way || '',
        `"${lead.unit_type || ''}"`, lead.status, `"${(lead.notes || '').replace(/"/g, '""')}"`,
        `"${lead.campaign || ''}"`, `"${lead.utm_source || ''}"`, `"${lead.source_url || ''}"`,
        new Date(lead.created_at).toISOString(),
      ].join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${Date.now()}.csv`);
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ error: 'Failed to export leads' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const lead = await leadService.getById(Number(req.params.id));
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

router.patch('/:id/status', async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;
    if (!status || !['new', 'contacted', 'qualified', 'closed', 'spam'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await leadService.update(Number(req.params.id), { status, notes });
    const lead = await leadService.getById(Number(req.params.id));
    res.json(lead);
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const validatedData = updateLeadSchema.parse(req.body);
    await leadService.update(Number(req.params.id), validatedData);
    res.json({ message: 'Lead updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await leadService.delete(Number(req.params.id));
    res.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;
