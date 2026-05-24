import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminDevelopers,
  getAdminMedia,
  getAdminProjects,
  uploadMedia,
  uploadMultipleMedia,
  deleteAdminMedia,
  updateAdminMedia,
  updateMediaOrder,
  type Developer,
  type MediaAsset,
  type Project,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, Trash2, Copy, Check, Image, FileText, Video, File } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_ICONS: Record<string, typeof Image> = {
  image: Image, video: Video, brochure: FileText, masterplan: Image, logo: Image, other: File,
};

const CATEGORIES = ['', 'hero', 'gallery', 'masterplan', 'brochure', 'logo', 'about', 'location', 'other'];

export function AdminMediaPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [uploadProjectId, setUploadProjectId] = useState('');
  const [uploadDeveloperId, setUploadDeveloperId] = useState('');
  const [uploadCategory, setUploadCategory] = useState('gallery');
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadMedia = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getAdminMedia(token);
      setItems(data);
      const [projectData, developerData] = await Promise.all([
        getAdminProjects(token).catch(() => []),
        getAdminDevelopers(token).catch(() => []),
      ]);
      setProjects(projectData);
      setDevelopers(developerData);
    } catch {
      toast.error('Failed to load media');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !token) return;
    setUploading(true);
    try {
      const projectId = uploadProjectId ? Number(uploadProjectId) : undefined;
      const developerId = uploadDeveloperId ? Number(uploadDeveloperId) : undefined;
      const result =
        files.length === 1
          ? [await uploadMedia(token, files[0], projectId, developerId, uploadCategory)]
          : await uploadMultipleMedia(token, files, projectId, uploadCategory, developerId);
      setItems(prev => [...result, ...prev]);
      toast.success(`${result.length} file${result.length === 1 ? '' : 's'} uploaded`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteAdminMedia(token!, id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('File deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const copyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success('URL copied');
    });
  };

  const saveMedia = async (id: number, patch: Partial<MediaAsset>) => {
    try {
      const updated = await updateAdminMedia(token!, id, patch);
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
      toast.success('Media updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const moveItem = async (id: number, direction: -1 | 1) => {
    const sorted = [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const index = sorted.findIndex(item => item.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    const ordered = next.map((item, idx) => ({ ...item, sortOrder: idx }));
    setItems(ordered);
    await updateMediaOrder(token!, ordered.map(item => ({ id: item.id!, sortOrder: item.sortOrder || 0 }))).catch(() => {
      toast.error('Order update failed');
      loadMedia();
    });
  };

  const filtered = items.filter(i => {
    if (filter && (i.category || '') !== filter) return false;
    if (projectFilter && String(i.projectId || '') !== projectFilter) return false;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library ({items.length})</h1>
          <p className="text-muted-foreground text-sm">Manage uploaded files</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select value={uploadProjectId} onChange={(e) => setUploadProjectId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">No project</option>
            {projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
          <select value={uploadDeveloperId} onChange={(e) => setUploadDeveloperId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">No developer</option>
            {developers.map(dev => <option key={dev.id} value={dev.id}>{dev.name}</option>)}
          </select>
          <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {CATEGORIES.filter(Boolean).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:pointer-events-none disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Files
            <input type="file" multiple className="hidden" onChange={handleUpload} accept="image/*,.pdf,.mp4,.webm" />
          </label>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={!filter ? 'default' : 'outline'} size="sm" onClick={() => setFilter('')}>All</Button>
        {CATEGORIES.filter(Boolean).map(cat => (
          <Button key={cat} variant={filter === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilter(cat)} className="capitalize">{cat}</Button>
        ))}
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All projects</option>
          {projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No media files found</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => {
            const TypeIcon = TYPE_ICONS[item.type || 'other'] || File;
            const isImage = item.type === 'image' || item.mimeType?.startsWith('image/');
            return (
              <Card key={item.id} className="group overflow-hidden">
                <div className="relative h-32 bg-muted flex items-center justify-center">
                  {isImage ? (
                    <img src={item.url} alt={item.altText || ''} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <TypeIcon className="w-10 h-10 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white" onClick={() => copyUrl(item.url!, item.id!)} title="Copy URL">
                      {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300" onClick={() => handleDelete(item.id!)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-2 space-y-1">
                  <input
                    value={item.title || ''}
                    onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))}
                    onBlur={() => saveMedia(item.id!, { title: item.title || '' })}
                    placeholder="Title"
                    className="w-full rounded border bg-background px-2 py-1 text-xs"
                  />
                  <input
                    value={item.altText || ''}
                    onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, altText: e.target.value } : i))}
                    onBlur={() => saveMedia(item.id!, { altText: item.altText || '' })}
                    placeholder="Alt text"
                    className="w-full rounded border bg-background px-2 py-1 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-1">
                    <select
                      value={item.category || 'gallery'}
                      onChange={(e) => saveMedia(item.id!, { category: e.target.value })}
                      className="rounded border bg-background px-1 py-1 text-xs"
                    >
                      {CATEGORIES.filter(Boolean).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select
                      value={item.projectId || ''}
                      onChange={(e) => saveMedia(item.id!, { projectId: e.target.value ? Number(e.target.value) : undefined })}
                      className="rounded border bg-background px-1 py-1 text-xs"
                    >
                      <option value="">No project</option>
                      {projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.category || 'uncategorized'}</span>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => moveItem(item.id!, -1)}>Up</Button>
                      <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => moveItem(item.id!, 1)}>Down</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
