import { z } from 'zod';

// Lead validation schemas
export const createLeadSchema = z.object({
  projectSlug: z.string().min(1, 'Project slug is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(50),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  jobTitle: z.string().max(255).optional().or(z.literal('')),
  preferredContactWay: z
    .enum(['whatsapp', 'call'], {
      errorMap: () => ({
        message: 'Preferred contact way must be WhatsApp or Call',
      }),
    })
    .optional(),
  unitType: z.string().max(100).optional().or(z.literal('')),
  sourceUrl: z.string().url('Invalid source URL').optional().or(z.literal('')),
  campaign: z.string().max(255).optional().or(z.literal('')),
  landingHost: z.string().max(255).optional().or(z.literal('')),
  utm: z
    .object({
      source: z.string().max(255).optional().or(z.literal('')),
      medium: z.string().max(255).optional().or(z.literal('')),
      campaign: z.string().max(255).optional().or(z.literal('')),
      content: z.string().max(255).optional().or(z.literal('')),
      term: z.string().max(255).optional().or(z.literal('')),
    })
    .optional(),
  honeypot: z.string().optional(), // Anti-spam field
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Lead update schema (admin)
export const updateLeadSchema = z.object({
  status: z
    .enum(['new', 'contacted', 'qualified', 'closed', 'spam'])
    .optional(),
  notes: z.string().optional(),
});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

// Project update schema (admin)
const urlOrLocalPath = z
  .string()
  .refine(
    (v) => /^https?:\/\//.test(v) || v.startsWith('/'),
    'Must be a valid URL or a path starting with /'
  );

const videoSchema = z.object({
  title: z.string().min(1, 'Video title is required'),
  category: z.string().optional(),
  thumbnailUrl: urlOrLocalPath,
  videoUrl: urlOrLocalPath,
  description: z.string().optional(),
  aspectRatio: z.string().optional(),
  sortOrder: z.number().optional(),
});

const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Use lowercase letters, numbers, and hyphens only',
  });

const paymentPlanSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(255),
  downPayment: z.string().max(100).optional().or(z.literal('')),
  installments: z.string().max(100).optional().or(z.literal('')),
  years: z.string().max(100).optional().or(z.literal('')),
  deliveryDate: z.string().max(100).optional().or(z.literal('')),
  startingPrice: z.string().max(100).optional().or(z.literal('')),
  promotionalOffer: z.string().max(255).optional().or(z.literal('')),
  badge: z.string().max(100).optional().or(z.literal('')),
  sortOrder: z.number().optional(),
});

const amenityInputSchema = z.object({
  id: z.number().optional(),
  slug: slugSchema.optional(),
  name: z.string().min(1).max(255),
  icon: z.string().max(100).optional().or(z.literal('')),
  category: z.string().max(100).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  sortOrder: z.number().optional(),
});

const mediaAssetSchema = z.object({
  id: z.number().optional(),
  url: urlOrLocalPath,
  originalUrl: urlOrLocalPath.optional().or(z.literal('')),
  webpUrl: urlOrLocalPath.optional().or(z.literal('')),
  thumbnailUrl: urlOrLocalPath.optional().or(z.literal('')),
  mediumUrl: urlOrLocalPath.optional().or(z.literal('')),
  altText: z.string().max(255).optional().or(z.literal('')),
  title: z.string().max(255).optional().or(z.literal('')),
  type: z
    .enum(['image', 'video', 'brochure', 'masterplan', 'logo', 'other'])
    .optional(),
  category: z.string().max(100).optional().or(z.literal('')),
  mimeType: z.string().max(100).optional().or(z.literal('')),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number().optional(),
  sortOrder: z.number().optional(),
});

const projectHighlightSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1).max(80),
  value: z.string().min(1).max(160),
  icon: z.string().max(100).optional().or(z.literal('')),
  sortOrder: z.number().optional(),
});

const subdomainSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Use lowercase letters, numbers, and hyphens only',
  });

export const updateProjectSchema = z.object({
  slug: slugSchema.optional(),
  subdomain: subdomainSchema.optional().or(z.literal('')),
  developerId: z.number().int().positive().optional().nullable(),
  name: z.string().min(1).max(255).optional(),
  tagline: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  seoTitle: z.string().max(255).optional().or(z.literal('')),
  seoDescription: z.string().max(500).optional().or(z.literal('')),
  ogTitle: z.string().max(255).optional().or(z.literal('')),
  ogDescription: z.string().max(500).optional().or(z.literal('')),
  ogImage: z.string().optional().or(z.literal('')),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  landingVisibility: z.enum(['public', 'hidden', 'draft']).optional(),
  formSettings: z.record(z.unknown()).optional(),
  heroImage: urlOrLocalPath.optional(),
  heroImageMobile: urlOrLocalPath.optional(),
  aboutImage: urlOrLocalPath.optional(),
  masterplanImage: urlOrLocalPath.optional(),
  caption1: z.string().optional(),
  caption2: z.string().optional(),
  caption3: z.string().optional(),
  gallery: z
    .array(
      z.object({
        url: urlOrLocalPath,
        alt: z.string(),
      })
    )
    .optional(),
  videos: z.array(videoSchema).optional(),
  paymentPlans: z.array(paymentPlanSchema).max(1, 'Only one payment plan is allowed per project').optional(),
  highlights: z.array(projectHighlightSchema).max(6, 'Use up to 6 hero highlights').optional(),
  amenities: z.array(amenityInputSchema).optional(),
  media: z.array(mediaAssetSchema).optional(),
  brochureUrl: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  locationText: z.string().min(1).max(255).optional(),
  locationImage: urlOrLocalPath.optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  deliveryDate: z.string().min(1).max(100).optional(),
  paymentPlan: z.string().min(1).optional(),
  startingPrice: z.string().min(1).max(100).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const developerSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional().or(z.literal('')),
  headline: z.string().max(255).optional().or(z.literal('')),
  logoUrl: urlOrLocalPath.optional().or(z.literal('')),
  showcaseImageUrl: urlOrLocalPath.optional().or(z.literal('')),
  yearsOfExperience: z.string().max(100).optional().or(z.literal('')),
  projectsDelivered: z.string().max(100).optional().or(z.literal('')),
  happyFamilies: z.string().max(100).optional().or(z.literal('')),
  brandColor: z.string().max(50).optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().max(50).optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  socialLinks: z.record(z.string().url().or(z.literal(''))).optional(),
  seoTitle: z.string().max(255).optional().or(z.literal('')),
  seoDescription: z.string().max(500).optional().or(z.literal('')),
});

export const updateDeveloperSchema = developerSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'At least one field is required'
);

export const amenitySchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(1).max(255),
  icon: z.string().max(100).optional().or(z.literal('')),
  category: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

export const updateAmenitySchema = amenitySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'At least one field is required'
);
