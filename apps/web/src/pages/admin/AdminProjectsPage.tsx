import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminProjects, createProject, updateProject, deleteProject,
  getAdminDevelopers, getAdminAmenities, uploadMedia,
  type Project, type Developer, type Amenity, type ProjectHighlight,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Eye, Upload, ImagePlus } from 'lucide-react';
import { SortableGallery } from '@/components/SortableGallery';
import { toast } from 'sonner';
import { AMENITY_ICON_OPTIONS, getAmenityIcon } from '@/lib/amenityIcons';

const emptyProject = {
  title: '', slug: '', subdomain: '', subtitle: '', description: '',
  seoTitle: '', seoDescription: '', ogTitle: '', ogDescription: '', ogImage: '',
  canonicalUrl: '', landingVisibility: 'public' as const,
  heroImage: '', heroImageMobile: '', aboutImage: '', masterplanImage: '',
  caption1: '', caption2: '', caption3: '',
  gallery: [] as { url: string; alt: string }[],
  videos: [] as any[],
  brochureUrl: '', mapEmbedUrl: '', locationImage: '', locationText: '',
  type: '', status: '',
  paymentPlans: [] as any[], media: [] as any[],
  highlights: [] as ProjectHighlight[],
  amenities: [] as any[], developerId: undefined as number | undefined,
};

export function AdminProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [amenityLibrary, setAmenityLibrary] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState<any>({ ...emptyProject });

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const [p, d, a] = await Promise.all([
        getAdminProjects(token).catch(() => []),
        getAdminDevelopers(token).catch(() => []),
        getAdminAmenities(token).catch(() => []),
      ]);
      setProjects(p);
      setDevelopers(d);
      setAmenityLibrary(a);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setForm({ ...emptyProject });
    setEditing(null);
    setActiveTab('basic');
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      slug: project.slug,
      subdomain: project.subdomain || '',
      subtitle: project.subtitle,
      description: project.description,
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || '',
      ogTitle: project.ogTitle || '',
      ogDescription: project.ogDescription || '',
      ogImage: project.ogImage || '',
      canonicalUrl: project.canonicalUrl || '',
      landingVisibility: project.landingVisibility || 'public',
      heroImage: project.heroImage,
      heroImageMobile: project.heroImageMobile || '',
      aboutImage: project.aboutImage || '',
      masterplanImage: project.masterplanImage || '',
      caption1: project.caption1 || '',
      caption2: project.caption2 || '',
      caption3: project.caption3 || '',
      gallery: project.gallery || [],
      videos: project.videos || [],
      brochureUrl: project.brochureUrl || '',
      mapEmbedUrl: project.mapEmbedUrl || '',
      locationImage: project.locationImage || '',
      locationText: project.locationText || '',
      type: project.type,
      status: project.status,
      paymentPlans: project.paymentPlans || [],
      highlights: project.highlights || [],
      amenities: project.amenities || [],
      media: project.media || [],
      developerId: project.developerId,
    });
    setDialogOpen(true);
  };

  const handleFileUpload = async (field: string, file: File) => {
    try {
      const result = await uploadMedia(token!, file, editing?.id);
      setForm((prev: any) => ({ ...prev, [field]: result.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleGalleryUpload = async (idx: number, file: File) => {
    try {
      const result = await uploadMedia(token!, file, editing?.id, undefined, 'gallery');
      setForm((prev: any) => {
        const next = [...prev.gallery];
        if (!next[idx]) {
          next[idx] = { url: result.url, alt: '' };
        } else {
          next[idx] = { ...next[idx], url: result.url };
        }
        return { ...prev, gallery: next };
      });
      toast.success('Gallery image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleGalleryAddFromUpload = async (file: File) => {
    try {
      const result = await uploadMedia(token!, file, editing?.id, undefined, 'gallery');
      setForm((prev: any) => ({
        ...prev, gallery: [...prev.gallery, { url: result.url, alt: '' }]
      }));
      toast.success('Gallery image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const addGalleryItem = () => {
    setForm((prev: any) => ({ ...prev, gallery: [...prev.gallery, { url: '', alt: '' }] }));
  };

  const updateGalleryItem = (idx: number, field: string, value: string) => {
    setForm((prev: any) => {
      const next = [...prev.gallery];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, gallery: next };
    });
  };

  const removeGalleryItem = (idx: number) => {
    setForm((prev: any) => ({ ...prev, gallery: prev.gallery.filter((_: any, i: number) => i !== idx) }));
  };

  const ensurePaymentPlan = () => {
    setForm((prev: any) => {
      if (prev.paymentPlans.length) return prev;
      return {
        ...prev,
        paymentPlans: [{ title: '', downPayment: '', installments: '', years: '', deliveryDate: '', startingPrice: '', promotionalOffer: '', badge: '' }],
      };
    });
  };

  const updatePaymentPlan = (idx: number, field: string, value: string) => {
    setForm((prev: any) => {
      const next = [...prev.paymentPlans];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, paymentPlans: next };
    });
  };

  const removePaymentPlan = (idx: number) => {
    setForm((prev: any) => ({ ...prev, paymentPlans: prev.paymentPlans.filter((_: any, i: number) => i !== idx) }));
  };

  const addHighlight = () => {
    setForm((prev: any) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        { label: '', value: '', icon: 'check', sortOrder: prev.highlights.length },
      ],
    }));
  };

  const updateHighlight = (idx: number, field: keyof ProjectHighlight, value: string) => {
    setForm((prev: any) => {
      const next = [...prev.highlights];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, highlights: next };
    });
  };

  const removeHighlight = (idx: number) => {
    setForm((prev: any) => ({ ...prev, highlights: prev.highlights.filter((_: any, i: number) => i !== idx) }));
  };

  const toggleAmenity = (amenity: Amenity) => {
    setForm((prev: any) => {
      const exists = prev.amenities.some((item: Amenity) => item.id === amenity.id);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item: Amenity) => item.id !== amenity.id)
          : [...prev.amenities, amenity],
      };
    });
  };

  const save = async () => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: form.title, slug: form.slug, subdomain: form.subdomain || undefined,
        tagline: form.subtitle, description: form.description,
        seoTitle: form.seoTitle || undefined, seoDescription: form.seoDescription || undefined,
        ogTitle: form.ogTitle || undefined, ogDescription: form.ogDescription || undefined,
        ogImage: form.ogImage || undefined, canonicalUrl: form.canonicalUrl || undefined,
        landingVisibility: form.landingVisibility,
        heroImage: form.heroImage, heroImageMobile: form.heroImageMobile || undefined,
        aboutImage: form.aboutImage || undefined, masterplanImage: form.masterplanImage || undefined,
        caption1: form.caption1 || undefined, caption2: form.caption2 || undefined,
        caption3: form.caption3 || undefined,
        gallery: form.gallery.filter((g: any) => g.url?.trim()),
        videos: form.videos?.filter((v: any) => v.videoUrl?.trim()),
        brochureUrl: form.brochureUrl || undefined,
        mapEmbedUrl: form.mapEmbedUrl || undefined,
        locationImage: form.locationImage || undefined,
        locationText: form.locationText || undefined,
        location: form.locationText || undefined,
        type: form.type, status: form.status,
        paymentPlans: form.paymentPlans.slice(0, 1).filter((plan: any) => plan.title?.trim()),
        highlights: form.highlights
          .filter((highlight: ProjectHighlight) => highlight.label?.trim() && highlight.value?.trim())
          .map((highlight: ProjectHighlight, idx: number) => ({ ...highlight, sortOrder: idx })),
        amenities: form.amenities.filter((amenity: any) => amenity.name?.trim()),
        media: form.media.filter((asset: any) => asset.url?.trim()),
        developerId: form.developerId || null,
      };

      if (editing) {
        await updateProject(token!, editing.slug, data);
        toast.success('Project updated');
      } else {
        await createProject(token!, data);
        toast.success('Project created');
      }

      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      setDeleting(slug);
      await deleteProject(token!, slug);
      setProjects(projects.filter(p => p.slug !== slug));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const tabs = ['basic', 'media', 'content', 'seo'];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage real estate projects</p>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No projects yet</div>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <img src={project.heroImage} alt={project.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{project.subtitle}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{project.locationText || project.location || '-'}</span>
                      <span>{project.type}</span>
                      <span className={`capitalize ${project.landingVisibility === 'public' ? 'text-green-600' : project.landingVisibility === 'hidden' ? 'text-amber-600' : 'text-gray-400'}`}>
                        {project.landingVisibility}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/${project.slug}`, '_blank')}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(project)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(project.slug)} disabled={deleting === project.slug}>
                      {deleting === project.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) setDialogOpen(false); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'Create Project'}</DialogTitle>
            <DialogDescription>Complete all required fields</DialogDescription>
          </DialogHeader>

          <div className="flex gap-1 border-b mb-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'basic' ? 'Basic Info' : tab === 'media' ? 'Media' : tab === 'content' ? 'Content' : 'SEO'}
              </button>
            ))}
          </div>

          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Project name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug *</label>
                  <Input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="project-name" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subdomain</label>
                  <Input value={form.subdomain} onChange={(e) => updateField('subdomain', e.target.value)} placeholder="citra" />
                  <p className="text-xs text-muted-foreground">Leave empty for slug-based URL</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visibility</label>
                  <select
                    value={form.landingVisibility}
                    onChange={(e) => updateField('landingVisibility', e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="public">Public</option>
                    <option value="hidden">Hidden</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input value={form.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Tagline" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Input value={form.type} onChange={(e) => updateField('type', e.target.value)} placeholder="Residential" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Input value={form.status} onChange={(e) => updateField('status', e.target.value)} placeholder="Under Construction" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Text</label>
                  <Input value={form.locationText} onChange={(e) => updateField('locationText', e.target.value)} placeholder="New Cairo, Egypt" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Map Embed URL</label>
                  <Input value={form.mapEmbedUrl} onChange={(e) => updateField('mapEmbedUrl', e.target.value)} placeholder="Google Maps embed URL" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brochure PDF</label>
                  <div className="flex gap-2">
                    <Input value={form.brochureUrl} onChange={(e) => updateField('brochureUrl', e.target.value)} placeholder="PDF link or upload" className="flex-1" />
                    <Button type="button" size="sm" variant="outline" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = '.pdf';
                      input.onchange = async (e: any) => {
                        try {
                          const result = await uploadMedia(token!, e.target.files[0], editing?.id, undefined, 'brochure');
                          setForm((prev: any) => ({ ...prev, brochureUrl: result.url }));
                          toast.success('Brochure uploaded');
                        } catch { toast.error('Upload failed'); }
                      };
                      input.click();
                    }}><Upload className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Developer</label>
                  <select
                    value={form.developerId || ''}
                    onChange={(e) => updateField('developerId', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">No developer</option>
                    {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption 1</label>
                  <Input value={form.caption1} onChange={(e) => updateField('caption1', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption 2</label>
                  <Input value={form.caption2} onChange={(e) => updateField('caption2', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption 3</label>
                  <Input value={form.caption3} onChange={(e) => updateField('caption3', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Image URL</label>
                <div className="flex gap-2">
                  <Input value={form.heroImage} onChange={(e) => updateField('heroImage', e.target.value)} placeholder="Image URL" className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file'; input.accept = 'image/*';
                    input.onchange = (e: any) => handleFileUpload('heroImage', e.target.files[0]);
                    input.click();
                  }}><ImagePlus className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Hero</label>
                  <div className="flex gap-2">
                    <Input value={form.heroImageMobile} onChange={(e) => updateField('heroImageMobile', e.target.value)} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = (e: any) => handleFileUpload('heroImageMobile', e.target.files[0]);
                      input.click();
                    }}><Upload className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">About Image</label>
                  <div className="flex gap-2">
                    <Input value={form.aboutImage} onChange={(e) => updateField('aboutImage', e.target.value)} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = (e: any) => handleFileUpload('aboutImage', e.target.files[0]);
                      input.click();
                    }}><Upload className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Masterplan Image</label>
                  <div className="flex gap-2">
                    <Input value={form.masterplanImage} onChange={(e) => updateField('masterplanImage', e.target.value)} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = (e: any) => handleFileUpload('masterplanImage', e.target.files[0]);
                      input.click();
                    }}><Upload className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Image</label>
                  <div className="flex gap-2">
                    <Input value={form.locationImage} onChange={(e) => updateField('locationImage', e.target.value)} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file'; input.accept = 'image/*';
                      input.onchange = (e: any) => handleFileUpload('locationImage', e.target.files[0]);
                      input.click();
                    }}><Upload className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              <SortableGallery
                items={form.gallery}
                onChange={(items) => setForm((prev: any) => ({ ...prev, gallery: items }))}
                onItemChange={updateGalleryItem}
                onRemove={removeGalleryItem}
                onUpload={handleGalleryUpload}
                onAddFromUpload={handleGalleryAddFromUpload}
                onAddUrl={addGalleryItem}
              />
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Hero Highlights</label>
                    <p className="text-xs text-muted-foreground">Manage the icon, label, and value shown under the hero headline.</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addHighlight} disabled={form.highlights.length >= 6}>
                    <Plus className="w-4 h-4 mr-2" /> Add Highlight
                  </Button>
                </div>
                {form.highlights.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No custom highlights yet. The landing page will fall back to location, type, and status.</p>
                ) : (
                  <div className="space-y-2">
                    {form.highlights.map((highlight: ProjectHighlight, idx: number) => {
                      const Icon = getAmenityIcon(highlight.icon);
                      return (
                        <div key={idx} className="grid gap-2 border p-3 sm:grid-cols-[9rem_1fr_1.3fr_auto]">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Icon</label>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" />
                              <select
                                value={highlight.icon || 'check'}
                                onChange={(e) => updateHighlight(idx, 'icon', e.target.value)}
                                className="h-10 w-full border border-input bg-background px-3 text-sm"
                              >
                                {AMENITY_ICON_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Label</label>
                            <Input value={highlight.label} onChange={(e) => updateHighlight(idx, 'label', e.target.value)} placeholder="Prime Location" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Value</label>
                            <Input value={highlight.value} onChange={(e) => updateHighlight(idx, 'value', e.target.value)} placeholder="New Zayed" />
                          </div>
                          <div className="flex items-end">
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeHighlight(idx)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Payment Plan</label>
                  {form.paymentPlans.length === 0 && (
                    <Button type="button" size="sm" variant="outline" onClick={ensurePaymentPlan}>Add Plan</Button>
                  )}
                </div>
                {form.paymentPlans.slice(0, 1).map((plan: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={plan.title} onChange={(e) => updatePaymentPlan(idx, 'title', e.target.value)} placeholder="Plan title" />
                      <Input value={plan.downPayment} onChange={(e) => updatePaymentPlan(idx, 'downPayment', e.target.value)} placeholder="Down payment" />
                      <Input value={plan.installments} onChange={(e) => updatePaymentPlan(idx, 'installments', e.target.value)} placeholder="Installments" />
                      <Input value={plan.years} onChange={(e) => updatePaymentPlan(idx, 'years', e.target.value)} placeholder="Years" />
                      <Input value={plan.deliveryDate} onChange={(e) => updatePaymentPlan(idx, 'deliveryDate', e.target.value)} placeholder="Delivery date" />
                      <Input value={plan.startingPrice} onChange={(e) => updatePaymentPlan(idx, 'startingPrice', e.target.value)} placeholder="Starting price" />
                      <Input value={plan.promotionalOffer} onChange={(e) => updatePaymentPlan(idx, 'promotionalOffer', e.target.value)} placeholder="Promo offer" />
                      <Input value={plan.badge} onChange={(e) => updatePaymentPlan(idx, 'badge', e.target.value)} placeholder="Badge" />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removePaymentPlan(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                ))}
                {form.paymentPlans.length > 1 && (
                  <p className="text-xs text-amber-600">
                    Multiple plans were detected. Only the first plan will be kept when you save.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Project Amenities</label>
                {amenityLibrary.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No amenities in the library yet.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {amenityLibrary.map((amenity) => {
                      const selected = form.amenities.some((item: Amenity) => item.id === amenity.id);
                      const Icon = getAmenityIcon(amenity.icon);
                      return (
                        <label
                          key={amenity.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                            selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleAmenity(amenity)}
                            className="mt-1"
                          />
                          <span>
                            <span className="flex items-center gap-2 font-medium">
                              <Icon className="h-4 w-4 text-primary" />
                              {amenity.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">{amenity.category || 'General'}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Title</label>
                <Input value={form.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)} placeholder="Defaults to project title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Description</label>
                <Textarea value={form.seoDescription} onChange={(e) => updateField('seoDescription', e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OG Title</label>
                  <Input value={form.ogTitle} onChange={(e) => updateField('ogTitle', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">OG Image URL</label>
                  <Input value={form.ogImage} onChange={(e) => updateField('ogImage', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">OG Description</label>
                <Textarea value={form.ogDescription} onChange={(e) => updateField('ogDescription', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Canonical URL</label>
                <Input value={form.canonicalUrl} onChange={(e) => updateField('canonicalUrl', e.target.value)} placeholder="Custom canonical URL" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
