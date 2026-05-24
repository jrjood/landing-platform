import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface ProjectRow extends RowDataPacket {
  id: number;
  developerId: number | null;
  slug: string;
  subdomain: string | null;
  title: string;
  subtitle: string;
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  landingVisibility: 'public' | 'hidden' | 'draft';
  formSettings: string | null;
  heroImage: string;
  heroImageMobile: string | null;
  aboutImage: string | null;
  masterplanImage: string | null;
  caption1: string | null;
  caption2: string | null;
  caption3: string | null;
  gallery: string;
  brochureUrl: string | null;
  mapEmbedUrl: string | null;
  locationImage: string | null;
  locationText: string | null;
  location: string | null;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectVideoRow extends RowDataPacket {
  id: number;
  projectId: number;
  title: string;
  category: string | null;
  thumbnailUrl: string;
  videoUrl: string;
  description: string | null;
  aspectRatio: string | null;
  sortOrder: number | null;
}

interface DeveloperRow extends RowDataPacket {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  headline: string | null;
  logoUrl: string | null;
  showcaseImageUrl: string | null;
  yearsOfExperience: string | null;
  projectsDelivered: string | null;
  happyFamilies: string | null;
  brandColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  websiteUrl: string | null;
  socialLinks: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface AmenityRow extends RowDataPacket {
  projectId: number;
  id: number;
  slug: string;
  name: string;
  icon: string | null;
  category: string | null;
  description: string | null;
  isActive: number;
  sortOrder: number | null;
}

interface PaymentPlanRow extends RowDataPacket {
  id: number;
  projectId: number;
  title: string;
  downPayment: string | null;
  installments: string | null;
  years: string | null;
  deliveryDate: string | null;
  startingPrice: string | null;
  promotionalOffer: string | null;
  badge: string | null;
  sortOrder: number | null;
}

interface ProjectHighlightRow extends RowDataPacket {
  id: number;
  projectId: number;
  label: string;
  value: string;
  icon: string | null;
  sortOrder: number | null;
}

interface MediaAssetRow extends RowDataPacket {
  id: number;
  projectId: number | null;
  developerId: number | null;
  url: string;
  originalUrl: string | null;
  webpUrl: string | null;
  thumbnailUrl: string | null;
  mediumUrl: string | null;
  altText: string | null;
  title: string | null;
  type: 'image' | 'video' | 'brochure' | 'masterplan' | 'logo' | 'other';
  category: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  sortOrder: number | null;
  isActive: number;
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseProjectJson(project: ProjectRow) {
  return {
    ...project,
    gallery: parseJson(project.gallery, []),
    formSettings: parseJson(project.formSettings, {}),
    videos: [] as ProjectVideoRow[],
    developer: null as any,
    amenities: [] as AmenityRow[],
    paymentPlans: [] as PaymentPlanRow[],
    highlights: [] as ProjectHighlightRow[],
    media: [] as MediaAssetRow[],
  };
}

export async function attachProjectRelations<T extends ReturnType<typeof parseProjectJson>>(
  projects: T[]
) {
  const projectIds = projects.map((project) => project.id);
  if (!projectIds.length) return projects;

  const [videoRows] = await pool.query<ProjectVideoRow[]>(
    'SELECT * FROM project_videos WHERE projectId IN (?) ORDER BY sortOrder ASC, id ASC',
    [projectIds]
  );

  const [developerRows] = await pool.query<DeveloperRow[]>(
    `SELECT developers.*
     FROM developers
     INNER JOIN projects ON projects.developerId = developers.id
     WHERE projects.id IN (?)`,
    [projectIds]
  );

  const [amenityRows] = await pool.query<AmenityRow[]>(
    `SELECT project_amenities.projectId, amenities.*, project_amenities.sortOrder
     FROM project_amenities
     INNER JOIN amenities ON amenities.id = project_amenities.amenityId
     WHERE project_amenities.projectId IN (?) AND amenities.isActive = 1
     ORDER BY project_amenities.sortOrder ASC, amenities.name ASC`,
    [projectIds]
  );

  const [paymentRows] = await pool.query<PaymentPlanRow[]>(
    'SELECT * FROM payment_plans WHERE projectId IN (?) ORDER BY sortOrder ASC, id ASC',
    [projectIds]
  );

  const [highlightRows] = await pool.query<ProjectHighlightRow[]>(
    'SELECT * FROM project_highlights WHERE projectId IN (?) ORDER BY sortOrder ASC, id ASC',
    [projectIds]
  );

  const [mediaRows] = await pool.query<MediaAssetRow[]>(
    'SELECT * FROM media_assets WHERE projectId IN (?) AND isActive = 1 ORDER BY sortOrder ASC, id ASC',
    [projectIds]
  );

  const projectById = new Map(projects.map((project) => [project.id, project]));
  const developerById = new Map(developerRows.map((developer) => [developer.id, developer]));

  projects.forEach((project) => {
    const developer = project.developerId
      ? developerById.get(project.developerId)
      : null;
    project.developer = developer
      ? {
          ...developer,
          socialLinks: parseJson(developer.socialLinks, {}),
        }
      : null;
  });

  videoRows.forEach((video) => projectById.get(video.projectId)?.videos.push(video));
  amenityRows.forEach((amenity) => projectById.get(amenity.projectId)?.amenities.push(amenity));
  paymentRows.forEach((plan) => projectById.get(plan.projectId)?.paymentPlans.push(plan));
  highlightRows.forEach((highlight) => projectById.get(highlight.projectId)?.highlights.push(highlight));
  mediaRows.forEach((media) => {
    if (media.projectId) projectById.get(media.projectId)?.media.push(media);
  });

  return projects;
}
