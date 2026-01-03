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
  preferredContactWay: z.enum(['whatsapp', 'call'], {
    errorMap: () => ({
      message: 'Preferred contact way must be WhatsApp or Call',
    }),
  }),
  unitType: z.string().min(1, 'Unit type is required').max(100),
  sourceUrl: z.string().url('Invalid source URL').optional().or(z.literal('')),
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

export const updateProjectSchema = z.object({
  slug: z.string().min(1).max(255).optional(),
  name: z.string().min(1).max(255).optional(),
  tagline: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
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
  brochureUrl: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  locationText: z.string().min(1).max(255).optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  deliveryDate: z.string().min(1).max(100).optional(),
  paymentPlan: z.string().min(1).optional(),
  startingPrice: z.string().min(1).max(100).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
