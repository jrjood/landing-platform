import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import {
  attachProjectRelations,
  parseProjectJson,
  type ProjectRow,
} from '../lib/projectPayload';

const RESERVED_ROUTE_SLUGS = new Set(['admin', 'api', 'assets', 'login']);
const RESERVED_SUBDOMAINS = new Set(['www', 'new', 'admin', 'api', 'app']);

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function hasProjectConflict(
  slug?: string,
  subdomain?: string,
  currentProjectId?: number
) {
  const clauses: string[] = [];
  const params: any[] = [];

  if (slug) { clauses.push('slug = ?'); params.push(slug); }
  if (subdomain) { clauses.push('subdomain = ?'); params.push(subdomain); }
  if (!clauses.length) return false;

  const idClause = currentProjectId ? ' AND id <> ?' : '';
  if (currentProjectId) params.push(currentProjectId);

  const [rows] = await pool.query<ProjectRow[]>(
    `SELECT id FROM projects WHERE (${clauses.join(' OR ')})${idClause} LIMIT 1`,
    params
  );

  return rows.length > 0;
}

export const projectService = {
  async getPublicProjects() {
    const [rows] = await pool.query<ProjectRow[]>(
      "SELECT * FROM projects WHERE landingVisibility = 'public' ORDER BY created_at DESC"
    );
    const projects = rows.map(parseProjectJson);
    await attachProjectRelations(projects);
    return projects;
  },

  async getPublicProject(identifier: string) {
    const [rows] = await pool.query<ProjectRow[]>(
      "SELECT * FROM projects WHERE (slug = ? OR subdomain = ?) AND landingVisibility = 'public' LIMIT 1",
      [identifier, identifier]
    );
    if (rows.length === 0) return null;
    const project = parseProjectJson(rows[0]);
    await attachProjectRelations([project]);
    return project;
  },

  async getAllProjects() {
    const [rows] = await pool.query<ProjectRow[]>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    const projects = rows.map(parseProjectJson);
    await attachProjectRelations(projects);
    return projects;
  },

  async getProjectById(id: number) {
    const [rows] = await pool.query<ProjectRow[]>(
      'SELECT * FROM projects WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    const project = parseProjectJson(rows[0]);
    await attachProjectRelations([project]);
    return project;
  },

  async getProjectBySlug(slug: string) {
    const [rows] = await pool.query<ProjectRow[]>(
      'SELECT * FROM projects WHERE slug = ? LIMIT 1',
      [slug]
    );
    if (rows.length === 0) return null;
    const project = parseProjectJson(rows[0]);
    await attachProjectRelations([project]);
    return project;
  },

  async createProject(data: any) {
    if (!data.slug || !data.name || !data.tagline || !data.description) {
      throw { status: 400, message: 'Missing required fields: slug, name, tagline, description' };
    }

    if (RESERVED_ROUTE_SLUGS.has(data.slug)) {
      throw { status: 409, message: 'Slug conflicts with a reserved route' };
    }

    if (data.subdomain && RESERVED_SUBDOMAINS.has(data.subdomain)) {
      throw { status: 409, message: 'Subdomain conflicts with a reserved host' };
    }

    if (await hasProjectConflict(data.slug, data.subdomain || undefined)) {
      throw { status: 409, message: 'Project slug or subdomain already exists' };
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO projects (
        slug, subdomain, developerId, title, subtitle, description, seoTitle, seoDescription, ogTitle, ogDescription, ogImage, canonicalUrl, landingVisibility, formSettings, heroImage, heroImageMobile, aboutImage, masterplanImage, caption1, caption2, caption3, gallery, brochureUrl, mapEmbedUrl, locationImage, locationText, location, type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.slug,
        data.subdomain || null,
        data.developerId || null,
        data.name,
        data.tagline,
        data.description,
        data.seoTitle || null,
        data.seoDescription || null,
        data.ogTitle || null,
        data.ogDescription || null,
        data.ogImage || null,
        data.canonicalUrl || null,
        data.landingVisibility || 'public',
        JSON.stringify(data.formSettings || {}),
        data.heroImage || '',
        data.heroImageMobile || '',
        data.aboutImage || '',
        data.masterplanImage || '',
        data.caption1 || '',
        data.caption2 || '',
        data.caption3 || '',
        JSON.stringify(data.gallery || []),
        data.brochureUrl || '',
        data.mapEmbedUrl || '',
        data.locationImage || '',
        data.locationText || '',
        data.locationText || '',
        data.type || '',
        data.status || '',
      ]
    );

    const projectId = result.insertId;

    if (data.videos?.length) {
      const videoValues = data.videos.map((video: any, idx: number) => [
        projectId,
        video.title,
        video.category || '',
        video.thumbnailUrl,
        video.videoUrl,
        video.description || '',
        video.aspectRatio || null,
        video.sortOrder ?? idx,
      ]);
      await pool.query(
        `INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder) VALUES ?`,
        [videoValues]
      );
    }

    await this.persistRelations(projectId, data);
    return projectId;
  },

  async updateProject(slug: string, data: any) {
    const [projectRows] = await pool.query<ProjectRow[]>(
      'SELECT id FROM projects WHERE slug = ?', [slug]
    );
    if (projectRows.length === 0) throw { status: 404, message: 'Project not found' };

    const projectId = projectRows[0].id;

    if (data.slug && RESERVED_ROUTE_SLUGS.has(data.slug)) {
      throw { status: 409, message: 'Slug conflicts with a reserved route' };
    }
    if (data.subdomain && RESERVED_SUBDOMAINS.has(data.subdomain)) {
      throw { status: 409, message: 'Subdomain conflicts with a reserved host' };
    }
    if (await hasProjectConflict(data.slug, data.subdomain || undefined, projectId)) {
      throw { status: 409, message: 'Project slug or subdomain already exists' };
    }

    const updates: string[] = [];
    const params: any[] = [];
    const fieldMap: Record<string, string> = {
      slug: 'slug', subdomain: 'subdomain', name: 'title', tagline: 'subtitle',
      description: 'description', seoTitle: 'seoTitle', seoDescription: 'seoDescription',
      ogTitle: 'ogTitle', ogDescription: 'ogDescription', ogImage: 'ogImage',
      canonicalUrl: 'canonicalUrl', landingVisibility: 'landingVisibility',
      developerId: 'developerId',
      heroImage: 'heroImage', heroImageMobile: 'heroImageMobile',
      aboutImage: 'aboutImage', masterplanImage: 'masterplanImage',
      caption1: 'caption1', caption2: 'caption2', caption3: 'caption3',
      brochureUrl: 'brochureUrl', mapEmbedUrl: 'mapEmbedUrl',
      locationImage: 'locationImage', locationText: 'locationText',
      type: 'type', status: 'status',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        updates.push(`${col} = ?`);
        params.push(data[key] === '' ? null : data[key]);
      }
    }

    if (data.gallery) {
      updates.push('gallery = ?');
      params.push(JSON.stringify(data.gallery));
    }
    if (data.formSettings) {
      updates.push('formSettings = ?');
      params.push(JSON.stringify(data.formSettings));
    }

    const hasVideoUpdate = data.videos !== undefined;
    if (updates.length > 0) {
      params.push(slug);
      await pool.query<ResultSetHeader>(
        `UPDATE projects SET ${updates.join(', ')} WHERE slug = ?`, params
      );
    }

    if (hasVideoUpdate) {
      await pool.query('DELETE FROM project_videos WHERE projectId = ?', [projectId]);
      if (data.videos.length) {
        const videoValues = data.videos.map((video: any, idx: number) => [
          projectId, video.title, video.category || '', video.thumbnailUrl,
          video.videoUrl, video.description || '', video.aspectRatio || null,
          video.sortOrder ?? idx,
        ]);
        await pool.query(
          `INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder) VALUES ?`,
          [videoValues]
        );
      }
    }

    await this.persistRelations(projectId, data);
  },

  async deleteProject(slug: string) {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM projects WHERE slug = ?', [slug]
    );
    if (result.affectedRows === 0) throw { status: 404, message: 'Project not found' };
  },

  async persistRelations(projectId: number, data: any) {
    if (data.paymentPlans !== undefined) {
      await pool.query('DELETE FROM payment_plans WHERE projectId = ?', [projectId]);
      if (data.paymentPlans.length) {
        const [plan] = data.paymentPlans;
        const values = [[
          projectId,
          plan.title,
          plan.downPayment || null,
          plan.installments || null,
          plan.years || null,
          plan.deliveryDate || null,
          plan.startingPrice || null,
          plan.promotionalOffer || null,
          plan.badge || null,
          plan.sortOrder ?? 0,
        ]];
        await pool.query(
          `INSERT INTO payment_plans (projectId, title, downPayment, installments, years, deliveryDate, startingPrice, promotionalOffer, badge, sortOrder) VALUES ?`,
          [values]
        );
      }
    }

    if (data.media !== undefined) {
      await pool.query('DELETE FROM media_assets WHERE projectId = ?', [projectId]);
      if (data.media.length) {
        const values = data.media.map((asset: any, idx: number) => [
          projectId, asset.url, asset.originalUrl || asset.url,
          asset.webpUrl || (asset.url?.endsWith('.webp') ? asset.url : null),
          asset.thumbnailUrl || null, asset.mediumUrl || null,
          asset.altText || '', asset.title || '',
          asset.type || 'image', asset.category || 'gallery',
          asset.mimeType || null, asset.width || null, asset.height || null,
          asset.size || null,
          asset.sortOrder ?? idx,
        ]);
        await pool.query(
          `INSERT INTO media_assets (
            projectId, url, originalUrl, webpUrl, thumbnailUrl, mediumUrl,
            altText, title, type, category, mimeType, width, height, size, sortOrder
          ) VALUES ?`,
          [values]
        );
      }
    }

    if (data.highlights !== undefined) {
      await pool.query('DELETE FROM project_highlights WHERE projectId = ?', [projectId]);
      const highlights = data.highlights.filter((highlight: any) =>
        highlight.label?.trim() && highlight.value?.trim()
      );
      if (highlights.length) {
        const values = highlights.map((highlight: any, idx: number) => [
          projectId,
          highlight.label.trim(),
          highlight.value.trim(),
          highlight.icon || 'check',
          highlight.sortOrder ?? idx,
        ]);
        await pool.query(
          `INSERT INTO project_highlights (projectId, label, value, icon, sortOrder) VALUES ?`,
          [values]
        );
      }
    }

    if (data.amenities !== undefined) {
      await pool.query('DELETE FROM project_amenities WHERE projectId = ?', [projectId]);
      for (const [idx, amenity] of data.amenities.entries()) {
        const amenitySlug = amenity.slug || toSlug(amenity.name);
        if (!amenitySlug) continue;

        await pool.query(
          `INSERT INTO amenities (slug, name, icon, category, description, isActive) VALUES (?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon), category = VALUES(category), description = VALUES(description), isActive = 1`,
          [amenitySlug, amenity.name, amenity.icon || null, amenity.category || 'General', amenity.description || null]
        );

        const [rows] = await pool.query<RowDataPacket[]>(
          'SELECT id FROM amenities WHERE slug = ? LIMIT 1', [amenitySlug]
        );
        const amenityId = rows[0]?.id;
        if (!amenityId) continue;

        await pool.query(
          `INSERT INTO project_amenities (projectId, amenityId, sortOrder) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE sortOrder = VALUES(sortOrder)`,
          [projectId, amenityId, amenity.sortOrder ?? idx]
        );
      }
    }
  },

  async getSitemapProjects() {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT slug, subdomain, updated_at FROM projects WHERE landingVisibility = 'public' ORDER BY updated_at DESC"
    );
    return rows as { slug: string; subdomain: string | null; updated_at: Date }[];
  },
};
