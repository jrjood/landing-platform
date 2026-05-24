const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface GalleryImage { url: string; alt: string; }

export interface ProjectVideo {
  id?: number; projectId?: number; title: string; category?: string;
  thumbnailUrl: string; videoUrl: string; description?: string; aspectRatio?: string; sortOrder?: number;
}

export interface Developer {
  id: number; slug: string; name: string; description?: string; headline?: string;
  logoUrl?: string; showcaseImageUrl?: string; yearsOfExperience?: string;
  projectsDelivered?: string; happyFamilies?: string;
  brandColor?: string; contactEmail?: string; contactPhone?: string; websiteUrl?: string;
  socialLinks?: Record<string, string>; seoTitle?: string; seoDescription?: string;
}

export interface Amenity {
  id?: number; slug?: string; name: string; icon?: string; category?: string;
  description?: string; isActive?: boolean; sortOrder?: number;
}

export interface PaymentPlan {
  id?: number; title: string; downPayment?: string; installments?: string;
  years?: string; deliveryDate?: string; startingPrice?: string;
  promotionalOffer?: string; badge?: string; sortOrder?: number;
}

export interface ProjectHighlight {
  id?: number; projectId?: number; label: string; value: string;
  icon?: string; sortOrder?: number;
}

export interface MediaAsset {
  id?: number; url: string; originalUrl?: string; webpUrl?: string;
  thumbnailUrl?: string; mediumUrl?: string; altText?: string; title?: string;
  type?: 'image' | 'video' | 'brochure' | 'masterplan' | 'logo' | 'other';
  category?: string; mimeType?: string; width?: number; height?: number;
  size?: number; projectId?: number; developerId?: number; sortOrder?: number; isActive?: boolean | number;
}

export interface Project {
  id: number; developerId?: number; title: string; slug: string; subdomain?: string;
  subtitle: string; description: string; seoTitle?: string; seoDescription?: string;
  ogTitle?: string; ogDescription?: string; ogImage?: string; canonicalUrl?: string;
  landingVisibility?: 'public' | 'hidden' | 'draft';
  formSettings?: Record<string, unknown>;
  heroImage: string; heroImageMobile?: string; aboutImage?: string; masterplanImage?: string;
  caption1?: string; caption2?: string; caption3?: string;
  gallery: GalleryImage[]; videos?: ProjectVideo[]; developer?: Developer | null;
  amenities?: Amenity[]; paymentPlans?: PaymentPlan[]; highlights?: ProjectHighlight[];
  media?: MediaAsset[]; brochureUrl?: string; mapEmbedUrl?: string; location?: string;
  locationText?: string; locationImage?: string; type: string; status: string;
  createdAt: string; updatedAt: string;
}

export interface Lead {
  id: number; name: string; phone: string; email?: string; job_title?: string;
  preferred_contact_way?: 'whatsapp' | 'call'; unit_type?: string; message?: string;
  projectId?: number; projectTitle?: string; campaign?: string;
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  source_url?: string; landing_host?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';
  notes?: string; created_at?: string; createdAt?: string; updated_at?: string; updatedAt?: string;
}

export interface LeadStats { total: number; today: number; byStatus: Record<string, number>; topProjects: { title: string; count: number }[]; }
export interface ExtendedLeadStats extends LeadStats {
  byCampaign?: { campaign: string; count: number }[];
  bySource?: { source: string; count: number }[];
}

export interface PaginatedResponse<T> { rows: T[]; total: number; }

export interface LoginCredentials { email: string; password: string; }
export interface AuthResponse { token: string; user: { id: number; email: string }; }

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { ...options?.headers, 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

function authHeaders(token: string) { return { Authorization: `Bearer ${token}` }; }

// Public API
export const getProjects = () => apiFetch<Project[]>('/projects');
export const getProjectBySlug = (slug: string) => apiFetch<Project>(`/projects/${slug}`);

export const createLead = async (lead: any) => {
  const response = await fetch(`${API_URL}/leads`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!response.ok) throw new Error('Failed to create lead');
  return response.json();
};

// Admin Auth
export const login = (credentials: LoginCredentials) =>
  apiFetch<AuthResponse>('/admin/auth/login', {
    method: 'POST', body: JSON.stringify(credentials),
  });

export const verifyToken = async (token: string) => {
  try { await apiFetch('/admin/projects', { headers: authHeaders(token) }); return { valid: true }; }
  catch { return { valid: false }; }
};

// Admin Projects
export const getAdminProjects = (token: string) =>
  apiFetch<Project[]>('/admin/projects', { headers: authHeaders(token) });

export const createProject = (token: string, project: any) =>
  apiFetch('/admin/projects', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(project) });

export const updateProject = (token: string, slug: string, project: any) =>
  apiFetch(`/admin/projects/${slug}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(project) });

export const deleteProject = (token: string, slug: string) =>
  apiFetch(`/admin/projects/${slug}`, { method: 'DELETE', headers: authHeaders(token) });

// Admin Leads
export const getAdminLeads = (token: string, params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<PaginatedResponse<Lead>>(`/admin/leads${qs}`, { headers: authHeaders(token) });
};

export const getLeadStats = (token: string) =>
  apiFetch<ExtendedLeadStats>('/admin/leads/stats', { headers: authHeaders(token) });

export const getLead = (token: string, id: number) =>
  apiFetch<Lead>(`/admin/leads/${id}`, { headers: authHeaders(token) });

export const deleteLead = (token: string, id: number) =>
  apiFetch(`/admin/leads/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const updateLeadStatus = (token: string, id: number, status: string, notes?: string) =>
  apiFetch<Lead>(`/admin/leads/${id}/status`, {
    method: 'PATCH', headers: authHeaders(token),
    body: JSON.stringify({ status, notes }),
  });

export const updateLead = (token: string, id: number, data: any) =>
  apiFetch(`/admin/leads/${id}`, {
    method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(data),
  });

export const exportLeadsCsv = async (token: string, params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const response = await fetch(`${API_URL}/admin/leads/export/csv${qs}`, {
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to export leads');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `leads-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Admin Amenities
export const getAdminAmenities = (token: string) =>
  apiFetch<Amenity[]>('/admin/amenities', { headers: authHeaders(token) });

export const getAmenityCategories = (token: string) =>
  apiFetch<string[]>('/admin/amenities/categories', { headers: authHeaders(token) });

export const createAmenity = (token: string, amenity: any) =>
  apiFetch<Amenity>('/admin/amenities', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(amenity) });

export const updateAmenity = (token: string, id: number, amenity: any) =>
  apiFetch<Amenity>(`/admin/amenities/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(amenity) });

export const deleteAmenity = (token: string, id: number) =>
  apiFetch(`/admin/amenities/${id}`, { method: 'DELETE', headers: authHeaders(token) });

// Admin Developers
export const getAdminDevelopers = (token: string) =>
  apiFetch<Developer[]>('/admin/developers', { headers: authHeaders(token) });

export const getDeveloper = (token: string, slug: string) =>
  apiFetch<Developer>(`/admin/developers/${slug}`, { headers: authHeaders(token) });

export const createDeveloper = (token: string, dev: any) =>
  apiFetch('/admin/developers', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(dev) });

export const updateDeveloper = (token: string, slug: string, dev: any) =>
  apiFetch(`/admin/developers/${slug}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(dev) });

export const deleteDeveloper = (token: string, slug: string) =>
  apiFetch(`/admin/developers/${slug}`, { method: 'DELETE', headers: authHeaders(token) });

// Media Upload
export const uploadMedia = async (token: string, file: File, projectId?: number, developerId?: number, category?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (projectId) formData.append('projectId', String(projectId));
  if (developerId) formData.append('developerId', String(developerId));
  if (category) formData.append('category', category);

  const response = await fetch(`${API_URL}/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

export const uploadMultipleMedia = async (token: string, files: File[], projectId?: number, category?: string, developerId?: number) => {
  const formData = new FormData();
  for (const file of files) formData.append('files', file);
  if (projectId) formData.append('projectId', String(projectId));
  if (developerId) formData.append('developerId', String(developerId));
  if (category) formData.append('category', category);

  const response = await fetch(`${API_URL}/media/upload-multiple`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

export const getAdminMedia = (token: string, projectId?: number, type?: string) => {
  const params = new URLSearchParams();
  if (projectId) params.set('projectId', String(projectId));
  if (type) params.set('type', type);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<MediaAsset[]>(`/media${qs}`, { headers: authHeaders(token) });
};

export const deleteAdminMedia = (token: string, id: number) =>
  apiFetch(`/media/${id}`, { method: 'DELETE', headers: authHeaders(token) });

export const updateAdminMedia = (token: string, id: number, media: Partial<MediaAsset>) =>
  apiFetch<MediaAsset>(`/media/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(media),
  });

export const updateMediaOrder = (token: string, items: { id: number; sortOrder: number }[]) =>
  apiFetch('/media/order/bulk', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });

export const getMedia = (token: string, projectId?: number, type?: string) => {
  const params = new URLSearchParams();
  if (projectId) params.set('projectId', String(projectId));
  if (type) params.set('type', type);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/media${qs}`, { headers: authHeaders(token) });
};

export const deleteMedia = (token: string, id: number) =>
  apiFetch(`/media/${id}`, { method: 'DELETE', headers: authHeaders(token) });
