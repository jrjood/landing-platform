const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface ProjectVideo {
  id?: number;
  projectId?: number;
  title: string;
  category?: string;
  thumbnailUrl: string;
  videoUrl: string;
  description?: string;
  aspectRatio?: string;
  sortOrder?: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  heroImage: string;
  heroImageMobile?: string;
  aboutImage?: string;
  masterplanImage?: string;
  caption1?: string;
  caption2?: string;
  caption3?: string;
  gallery: GalleryImage[];
  videos?: ProjectVideo[];
  brochureUrl?: string;
  mapEmbedUrl?: string;
  location: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  job_title?: string;
  preferred_contact_way?: 'whatsapp' | 'call';
  unit_type?: string;
  message?: string;
  projectId?: number;
  projectTitle?: string;
  status: 'new' | 'qualified' | 'spam';
  notes?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

// Projects API
export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const getProjectBySlug = async (slug: string): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
};

// Leads API
export const createLead = async (
  lead: Omit<Lead, 'id' | 'createdAt' | 'projectTitle'>
): Promise<Lead> => {
  const response = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lead),
  });
  if (!response.ok) {
    throw new Error('Failed to create lead');
  }
  return response.json();
};

// Admin Auth API
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
};

export const verifyToken = async (
  token: string
): Promise<{ valid: boolean; user?: { id: number; email: string } }> => {
  const response = await fetch(`${API_URL}/admin/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return { valid: false };
  }
  return response.json();
};

// Admin Projects API
export const getAdminProjects = async (token: string): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/admin/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch admin projects');
  }
  return response.json();
};

export const createProject = async (
  token: string,
  project: Partial<Project>
): Promise<Project> => {
  const response = await fetch(`${API_URL}/admin/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }
  return response.json();
};

export const updateProject = async (
  token: string,
  slug: string,
  project: Partial<Project>
): Promise<Project> => {
  const response = await fetch(`${API_URL}/admin/projects/${slug}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update project');
  }
  return response.json();
};

export const deleteProject = async (
  token: string,
  slug: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/projects/${slug}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
};

// Admin Leads API
export const getAdminLeads = async (token: string): Promise<Lead[]> => {
  const response = await fetch(`${API_URL}/admin/leads`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch admin leads');
  }
  return response.json();
};

export const deleteLead = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/leads/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete lead');
  }
};

export const updateLeadStatus = async (
  token: string,
  id: number,
  status: 'new' | 'qualified' | 'spam',
  notes?: string
): Promise<Lead> => {
  const response = await fetch(`${API_URL}/admin/leads/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, notes }),
  });
  if (!response.ok) {
    throw new Error('Failed to update lead status');
  }
  return response.json();
};
