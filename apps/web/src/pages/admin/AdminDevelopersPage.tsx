import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminDevelopers, createDeveloper, updateDeveloper, deleteDeveloper,
  uploadMedia,
  type Developer,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDevelopersPage() {
  const { token } = useAuth();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Developer | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingShowcase, setUploadingShowcase] = useState(false);
  const [form, setForm] = useState<any>({
    name: '', description: '', headline: '', logoUrl: '', showcaseImageUrl: '', brandColor: '',
    yearsOfExperience: '', projectsDelivered: '', happyFamilies: '',
    contactEmail: '', contactPhone: '', websiteUrl: '',
    socialLinks: {} as Record<string, string>,
    seoTitle: '', seoDescription: '',
  });

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAdminDevelopers(token);
      setDevelopers(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({
      name: '', description: '', headline: '', logoUrl: '', showcaseImageUrl: '',
      yearsOfExperience: '', projectsDelivered: '', happyFamilies: '',
      brandColor: '', contactEmail: '', contactPhone: '', websiteUrl: '',
      socialLinks: {}, seoTitle: '', seoDescription: '',
    });
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (dev: Developer) => {
    setForm({
      name: dev.name, description: dev.description || '', headline: dev.headline || '',
      logoUrl: dev.logoUrl || '', showcaseImageUrl: dev.showcaseImageUrl || '',
      yearsOfExperience: dev.yearsOfExperience || '',
      projectsDelivered: dev.projectsDelivered || '',
      happyFamilies: dev.happyFamilies || '',
      brandColor: dev.brandColor || '', contactEmail: dev.contactEmail || '',
      contactPhone: dev.contactPhone || '', websiteUrl: dev.websiteUrl || '',
      socialLinks: dev.socialLinks || {}, seoTitle: dev.seoTitle || '', seoDescription: dev.seoDescription || '',
    });
    setEditing(dev);
    setDialogOpen(true);
  };

  const updateSocialLink = (key: string, value: string) => {
    setForm({
      ...form,
      socialLinks: {
        ...form.socialLinks,
        [key]: value,
      },
    });
  };

  const uploadLogo = async (file?: File) => {
    if (!file || !token) return;

    try {
      setUploadingLogo(true);
      const media = await uploadMedia(token, file, undefined, editing?.id, 'logo');
      setForm({ ...form, logoUrl: media.webpUrl || media.url });
      toast.success('Logo uploaded');
    } catch {
      toast.error('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const uploadShowcaseImage = async (file?: File) => {
    if (!file || !token) return;

    try {
      setUploadingShowcase(true);
      const media = await uploadMedia(token, file, undefined, editing?.id, 'developer-showcase');
      setForm({ ...form, showcaseImageUrl: media.webpUrl || media.url });
      toast.success('Showcase image uploaded');
    } catch {
      toast.error('Showcase image upload failed');
    } finally {
      setUploadingShowcase(false);
    }
  };

  const save = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateDeveloper(token!, editing.slug, form);
        toast.success('Developer updated');
      } else {
        await createDeveloper(token!, form);
        toast.success('Developer created');
      }
      setDialogOpen(false);
      load();
    } catch (error: any) { toast.error(error.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this developer?')) return;
    try {
      await deleteDeveloper(token!, slug);
      setDevelopers(developers.filter(d => d.slug !== slug));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Developers</h1>
          <p className="text-muted-foreground text-sm">Manage real estate developers</p>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Developer</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {developers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No developers</div>
          ) : (
            <div className="divide-y">
              {developers.map((dev) => (
                <div key={dev.id} className="flex items-center gap-4 p-4">
                  {dev.logoUrl && <img src={dev.logoUrl} alt={dev.name} className="w-12 h-12 object-contain rounded" />}
                  <div className="flex-1">
                    <h3 className="font-semibold">{dev.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{dev.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(dev)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(dev.slug)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Developer' : 'Add Developer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Landing Section Headline</label>
              <Input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="Built on Trust. Driven by Excellence."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo URL</label>
                <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Color</label>
                <Input value={form.brandColor} onChange={(e) => setForm({ ...form, brandColor: e.target.value })} placeholder="#000000" />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              {form.logoUrl && <img src={form.logoUrl} alt="Developer logo preview" className="h-12 w-12 rounded object-contain" />}
              <div className="flex-1">
                <label className="text-sm font-medium">Upload Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadLogo(event.target.files?.[0])}
                  className="mt-2 block w-full text-sm"
                  disabled={uploadingLogo}
                />
              </div>
              {uploadingLogo && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Showcase Image URL</label>
              <Input
                value={form.showcaseImageUrl}
                onChange={(e) => setForm({ ...form, showcaseImageUrl: e.target.value })}
                placeholder="/uploads/developer-showcase.jpg"
              />
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              {form.showcaseImageUrl && <img src={form.showcaseImageUrl} alt="Developer showcase preview" className="h-16 w-24 rounded object-cover" />}
              <div className="flex-1">
                <label className="text-sm font-medium">Upload Showcase Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadShowcaseImage(event.target.files?.[0])}
                  className="mt-2 block w-full text-sm"
                  disabled={uploadingShowcase}
                />
              </div>
              {uploadingShowcase && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Excellence</label>
                <Input value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} placeholder="25+" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Projects Delivered</label>
                <Input value={form.projectsDelivered} onChange={(e) => setForm({ ...form, projectsDelivered: e.target.value })} placeholder="50+" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Happy Families</label>
                <Input value={form.happyFamilies} onChange={(e) => setForm({ ...form, happyFamilies: e.target.value })} placeholder="20,000+" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone</label>
                <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL</label>
              <Input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Social Links</label>
              <div className="grid grid-cols-2 gap-3">
                {['facebook', 'instagram', 'linkedin', 'youtube'].map((network) => (
                  <Input
                    key={network}
                    value={form.socialLinks?.[network] || ''}
                    onChange={(event) => updateSocialLink(network, event.target.value)}
                    placeholder={`${network.charAt(0).toUpperCase()}${network.slice(1)} URL`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Title</label>
                <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Description</label>
                <Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
              </div>
            </div>
          </div>
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
