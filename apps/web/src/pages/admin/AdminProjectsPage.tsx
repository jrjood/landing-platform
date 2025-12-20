import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function AdminProjectsPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [galleryText, setGalleryText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadProjects();
  }, [token, navigate]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getAdminProjects(token!);
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setSlug(project.slug);
    setSubtitle(project.subtitle);
    setDescription(project.description);
    setHeroImage(project.heroImage);
    setGalleryText(JSON.stringify(project.gallery));
    setVideoUrl(project.videoUrl || '');
    setMapEmbedUrl(project.mapEmbedUrl || '');
    setHighlightsText(
      project.highlights ? JSON.stringify(project.highlights) : ''
    );
    setLocation(project.location);
    setType(project.type);
    setStatus(project.status);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSubtitle('');
    setDescription('');
    setHeroImage('');
    setMapEmbedUrl('');
    setHighlightsText('');
    setGalleryText('');
    setVideoUrl('');
    setLocation('');
    setType('');
    setStatus('');
  };

  const saveProject = async () => {
    try {
      setSaving(true);

      // Parse gallery JSON
      let gallery: { url: string; alt: string }[] = [];
      if (galleryText.trim()) {
        try {
          gallery = JSON.parse(galleryText);
        } catch (e) {
          toast.error('Invalid JSON format in gallery');
          return;
        }
      }

      const projectData = {
        title,
        slug,
        subtitle,
        description,
        heroImage,
        mapEmbedUrl,
        highlights: highlightsText ? JSON.parse(highlightsText) : [],
        gallery,
        videoUrl: videoUrl || undefined,
        location,
        type,
        status,
        phone: '+20 112 189 8883',
        whatsapp: '+20 110 008 2530',
        email: 'info@wealthholding-eg.com',
        facebook: 'https://www.facebook.com/WealthHoldingDevelopments',
        instagram: 'https://www.instagram.com/wealthholdingdevelopments',
        youtube: 'https://www.youtube.com/@WealthHoldingDevelopments',
        linkedin:
          'https://www.linkedin.com/company/wealth-holding-developments',
        faqs: [],
      };

      if (editingProject) {
        await updateProject(token!, editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await createProject(token!, projectData);
        toast.success('Project created successfully');
      }

      setIsDialogOpen(false);
      loadProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setDeletingId(id);
      await deleteProject(token!, id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Loader2 className='w-8 h-8 animate-spin text-burgundy' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
          <div className='flex items-center gap-4'>
            <Button variant='outline' onClick={() => navigate('/admin/leads')}>
              Leads
            </Button>
            <Button variant='outline' onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your real estate projects
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className='w-4 h-4 mr-2' />
              New Project
            </Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                No projects yet. Create your first project!
              </div>
            ) : (
              <div className='grid gap-4'>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className='flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50'
                  >
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className='w-24 h-24 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h3 className='font-semibold text-lg'>{project.title}</h3>
                      <p className='text-sm text-gray-600'>
                        {project.subtitle}
                      </p>
                      <div className='flex gap-4 mt-2 text-xs text-gray-500'>
                        <span>{project.location}</span>
                        <span>•</span>
                        <span>{project.type}</span>
                        <span>•</span>
                        <span>{project.status}</span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          window.open(`/${project.slug}`, '_blank')
                        }
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <Trash2 className='w-4 h-4 text-red-500' />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
            <DialogDescription>
              Fill in the project details below
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='slug'>Slug (URL)</Label>
              <Input
                id='slug'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder='project-name'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='subtitle'>Subtitle</Label>
              <Input
                id='subtitle'
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='heroImage'>Hero Image URL</Label>
              <Input
                id='heroImage'
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='mapEmbedUrl'>Google Maps Embed URL</Label>
              <Input
                id='mapEmbedUrl'
                placeholder='https://www.google.com/maps/embed?pb=...'
                value={mapEmbedUrl}
                onChange={(e) => setMapEmbedUrl(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='highlights'>Highlights (JSON Array)</Label>
              <textarea
                id='highlights'
                className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='["Highlight 1", "Highlight 2", "Highlight 3"]'
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='gallery'>Gallery (JSON array of URLs)</Label>
              <Textarea
                id='gallery'
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                rows={3}
                placeholder='["url1", "url2", "url3"]'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='videoUrl'>Video URL (optional)</Label>
              <Input
                id='videoUrl'
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='type'>Type</Label>
                <Input
                  id='type'
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder='Residential/Commercial'
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='status'>Status</Label>
                <Input
                  id='status'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder='Under Construction/Completed'
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProject} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
