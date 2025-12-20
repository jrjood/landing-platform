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
export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  tagline: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  locationText: z.string().min(1).max(255).optional(),
  mapEmbedUrl: z.string().optional(),
  deliveryDate: z.string().min(1).max(100).optional(),
  paymentPlan: z.string().min(1).optional(),
  startingPrice: z.string().min(1).max(100).optional(),
  highlights: z.array(z.string()).optional(),
  gallery: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string(),
      })
    )
    .optional(),
  faqs: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    )
    .optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
