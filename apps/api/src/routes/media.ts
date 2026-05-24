import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { upload, mediaService } from '../services/mediaService';

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { projectId, developerId, category } = req.body;
    const result = await mediaService.uploadFile(req.file, projectId ? Number(projectId) : undefined, developerId ? Number(developerId) : undefined, category);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

router.post('/upload-multiple', authenticateToken, upload.array('files', 20), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ error: 'No files uploaded' });

    const { projectId, developerId, category } = req.body;
    const results = await Promise.all(
      files.map((file) => mediaService.uploadFile(file, projectId ? Number(projectId) : undefined, developerId ? Number(developerId) : undefined, category))
    );
    res.status(201).json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload files' });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId, type } = req.query as any;
    const media = await mediaService.getMedia(projectId ? Number(projectId) : undefined, type);
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const media = await mediaService.updateMedia(Number(req.params.id), req.body);
    res.json(media);
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update media' });
  }
});

router.patch('/order/bulk', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    await mediaService.updateSortOrder(items);
    res.json({ message: 'Media order updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update media order' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await mediaService.deleteMedia(Number(req.params.id));
    res.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
