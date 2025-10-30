import { z } from 'zod';

// Profile validation
export const profileUpdateSchema = z.object({
  first_name: z.string().max(50).optional().nullable(),
  last_name: z.string().max(50).optional().nullable(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Company validation - helper to normalize website URL
function normalizeWebsite(url: string | null | undefined): string | null {
  if (!url || url.trim() === '') return null;
  const trimmed = url.trim();
  // Auto-add http:// if missing protocol
  if (!trimmed.match(/^https?:\/\//i)) {
    return `http://${trimmed}`;
  }
  return trimmed;
}

// Company validation
export const companyUpdateSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  timezone: z.string().min(1, 'Timezone is required'),
  business_address: z.string().optional().nullable(),
  business_address_street: z.string().optional().nullable(),
  business_address_city: z.string().optional().nullable(),
  business_address_state: z.string().optional().nullable(),
  business_address_postal_code: z.string().optional().nullable(),
  business_address_country: z.string().optional().nullable(),
  phone: z.string().optional().nullable().refine((val) => !val || /^[\d\s()+-]+$/.test(val), {
    message: 'Invalid phone number format',
  }),
  website: z.string().optional().nullable().transform((val) => normalizeWebsite(val)).refine((val) => {
    // If website is provided, validate it's a valid URL after normalization
    if (!val) return true; // Optional, so empty is fine
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: 'Invalid website URL format',
  }),
  tax_id: z.string().max(50).optional().nullable(),
});

// Team invitation validation
export const teamInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'manager', 'technician'], {
    message: 'Invalid role',
  }),
});

export const teamRoleUpdateSchema = z.object({
  role: z.enum(['owner', 'manager', 'technician']),
});

// Auth validation
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const onboardingSchema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(100),
  timezone: z.string().min(1, 'Timezone is required'),
});

// Type exports
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
export type TeamInviteInput = z.infer<typeof teamInviteSchema>;
export type TeamRoleUpdateInput = z.infer<typeof teamRoleUpdateSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

