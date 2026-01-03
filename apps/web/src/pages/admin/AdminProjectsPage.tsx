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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroImageMobile, setHeroImageMobile] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [masterplanImage, setMasterplanImage] = useState('');
  const [caption1, setCaption1] = useState('');
  const [caption2, setCaption2] = useState('');
  const [caption3, setCaption3] = useState('');
  const [galleryItems, setGalleryItems] = useState<
    { url: string; alt: string }[]
  >([]);
  const [videos, setVideos] = useState<
    {
      id?: number;
      title: string;
      category?: string;
      thumbnailUrl: string;
      videoUrl: string;
      description?: string;
      aspectRatio?: string;
      sortOrder?: number;
    }[]
  >([]);
  const [brochureUrl, setBrochureUrl] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
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
    setHeroImageMobile(project.heroImageMobile || '');
    setAboutImage(project.aboutImage || '');
    setMasterplanImage(project.masterplanImage || '');
    setCaption1(project.caption1 || '');
    setCaption2(project.caption2 || '');
    setCaption3(project.caption3 || '');
    setGalleryItems(project.gallery || []);
    setVideos(project.videos || []);
    setBrochureUrl(project.brochureUrl || '');
    setMapEmbedUrl(project.mapEmbedUrl || '');
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
    setHeroImageMobile('');
    setAboutImage('');
    setMasterplanImage('');
    setCaption1('');
    setCaption2('');
    setCaption3('');
    setMapEmbedUrl('');
    setGalleryItems([]);
    setVideos([]);
    setBrochureUrl('');
    setLocation('');
    setType('');
    setStatus('');
  };

  const saveProject = async () => {
    try {
      setSaving(true);

      const projectData = {
        // send both legacy and new keys to satisfy API validation
        name: title,
        title,
        slug,
        tagline: subtitle,
        subtitle,
        description,
        heroImage,
        mapEmbedUrl,
        gallery: galleryItems.filter((g) => g.url?.trim()),
        videos: videos?.filter((v) => v.videoUrl?.trim()),
        location,
        locationText: location,
        brochureUrl: brochureUrl || undefined,
        type,
        status,
        heroImageMobile: heroImageMobile || undefined,
        aboutImage: aboutImage || undefined,
        masterplanImage: masterplanImage || undefined,
        caption1: caption1 || undefined,
        caption2: caption2 || undefined,
        caption3: caption3 || undefined,
      };

      // console.log('Project data being sent:', projectData);
      if (editingProject) {
        await updateProject(token!, editingProject.slug, projectData);
        toast.success('Project updated successfully');
      } else {
        try {
          await createProject(token!, projectData);
          toast.success('Project created successfully');
        } catch (err: any) {
          if (err && err.message) {
            console.error('Create project error:', err.message);
          } else {
            console.error('Create project error:', err);
          }
          throw err;
        }
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

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setDeletingId(slug);
      await deleteProject(token!, slug);
      setProjects(projects.filter((p) => p.slug !== slug));
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
    <div className='min-h-screen  '>
      {/* Header */}
      <div className='  border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-card-foreground'>
            Admin Dashboard
          </h1>
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
                    className='flex items-center gap-4 p-4 border rounded-lg hover:bg-stone-800/10'
                  >
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className='w-24 h-24 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h3 className='font-semibold text-lg'>{project.title}</h3>
                      <p className='text-sm text-stone-400'>
                        {project.subtitle}
                      </p>
                      <div className='flex gap-4 mt-2 text-xs text-stone-500'>
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
                        onClick={() => handleDelete(project.slug)}
                        disabled={deletingId === project.slug}
                      >
                        {deletingId === project.slug ? (
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
              <Label htmlFor='heroImageMobile'>Hero Image (Mobile)</Label>
              <Input
                id='heroImageMobile'
                value={heroImageMobile}
                onChange={(e) => setHeroImageMobile(e.target.value)}
                placeholder='Optional mobile-specific hero image'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='aboutImage'>About Image</Label>
              <Input
                id='aboutImage'
                value={aboutImage}
                onChange={(e) => setAboutImage(e.target.value)}
                placeholder='Used in the About section'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='masterplanImage'>Masterplan Image</Label>
              <Input
                id='masterplanImage'
                value={masterplanImage}
                onChange={(e) => setMasterplanImage(e.target.value)}
                placeholder='Optional masterplan visual'
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
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label>Gallery Images</Label>
                <Button
                  type='button'
                  size='sm'
                  variant='ghost'
                  onClick={() =>
                    setGalleryItems([...galleryItems, { url: '', alt: '' }])
                  }
                >
                  Add Image
                </Button>
              </div>
              {galleryItems.length === 0 && (
                <p className='text-xs text-muted-foreground'>
                  No images added yet.
                </p>
              )}
              <div className='space-y-3'>
                {galleryItems.map((item, idx) => (
                  <div key={idx} className='grid gap-2 rounded border p-3'>
                    <div className='flex gap-2 items-center'>
                      <Input
                        value={item.url}
                        onChange={(e) => {
                          const next = [...galleryItems];
                          next[idx] = { ...next[idx], url: e.target.value };
                          setGalleryItems(next);
                        }}
                        placeholder='Image URL'
                      />
                      <Input
                        value={item.alt}
                        onChange={(e) => {
                          const next = [...galleryItems];
                          next[idx] = { ...next[idx], alt: e.target.value };
                          setGalleryItems(next);
                        }}
                        placeholder='Alt text'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          setGalleryItems(
                            galleryItems.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label>Videos</Label>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    setVideos([
                      ...videos,
                      {
                        title: '',
                        category: '',
                        thumbnailUrl: '',
                        videoUrl: '',
                        description: '',
                        sortOrder: videos.length,
                      },
                    ])
                  }
                >
                  Add Video
                </Button>
              </div>
              {videos.length === 0 && (
                <p className='text-xs text-muted-foreground'>
                  No videos added yet.
                </p>
              )}
              <div className='space-y-3'>
                {videos.map((video, idx) => (
                  <div key={idx} className='space-y-2 rounded border p-3'>
                    <div className='grid gap-2 md:grid-cols-2'>
                      <Input
                        value={video.title}
                        onChange={(e) => {
                          const next = [...videos];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setVideos(next);
                        }}
                        placeholder='Title'
                      />
                      <Input
                        value={video.category || ''}
                        onChange={(e) => {
                          const next = [...videos];
                          next[idx] = {
                            ...next[idx],
                            category: e.target.value,
                          };
                          setVideos(next);
                        }}
                        placeholder='Category'
                      />
                    </div>
                    <div className='grid gap-2 md:grid-cols-2'>
                      <Input
                        value={video.thumbnailUrl}
                        onChange={(e) => {
                          const next = [...videos];
                          next[idx] = {
                            ...next[idx],
                            thumbnailUrl: e.target.value,
                          };
                          setVideos(next);
                        }}
                        placeholder='Thumbnail URL'
                      />
                      <Input
                        value={video.videoUrl}
                        onChange={(e) => {
                          const next = [...videos];
                          next[idx] = {
                            ...next[idx],
                            videoUrl: e.target.value,
                          };
                          setVideos(next);
                        }}
                        placeholder='Video URL'
                      />
                    </div>
                    <Input
                      value={video.aspectRatio || ''}
                      onChange={(e) => {
                        const next = [...videos];
                        next[idx] = {
                          ...next[idx],
                          aspectRatio: e.target.value,
                        };
                        setVideos(next);
                      }}
                      placeholder='Aspect ratio (e.g., 16 / 9)'
                    />
                    <Textarea
                      value={video.description || ''}
                      onChange={(e) => {
                        const next = [...videos];
                        next[idx] = {
                          ...next[idx],
                          description: e.target.value,
                        };
                        setVideos(next);
                      }}
                      rows={2}
                      placeholder='Description (optional)'
                    />
                    <div className='flex items-center gap-3'>
                      <Input
                        type='number'
                        value={video.sortOrder ?? idx}
                        onChange={(e) => {
                          const next = [...videos];
                          next[idx] = {
                            ...next[idx],
                            sortOrder: Number(e.target.value),
                          };
                          setVideos(next);
                        }}
                        className='w-28'
                        placeholder='Order'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          setVideos(videos.filter((_, i) => i !== idx))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='brochureUrl'>
                Brochure Link (Google Drive, etc.)
              </Label>
              <Input
                id='brochureUrl'
                value={brochureUrl}
                onChange={(e) => setBrochureUrl(e.target.value)}
                placeholder='https://drive.google.com/your-brochure-link'
              />
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='caption1'>Caption 1 (optional)</Label>
                <Input
                  id='caption1'
                  value={caption1}
                  onChange={(e) => setCaption1(e.target.value)}
                  placeholder='Short supporting caption'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='caption2'>Caption 2 (optional)</Label>
                <Input
                  id='caption2'
                  value={caption2}
                  onChange={(e) => setCaption2(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='caption3'>Caption 3 (optional)</Label>
                <Input
                  id='caption3'
                  value={caption3}
                  onChange={(e) => setCaption3(e.target.value)}
                />
              </div>
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
