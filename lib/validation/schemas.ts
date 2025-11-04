// Comprehensive Validation Schemas using Zod
// These schemas validate all user inputs across the application

import { z } from 'zod';

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/).optional(),
  lastName: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
});

export const avatarUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
});

// ============================================================================
// PROGRAM SCHEMAS
// ============================================================================

export const programSchema = z.object({
  title: z.string().min(3, 'Title too short').max(200, 'Title too long'),
  description: z.string().min(10, 'Description too short').max(5000, 'Description too long'),
  duration: z.string().min(1, 'Duration is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Invalid difficulty level' }),
  }),
  category: z.string().min(1, 'Category is required').max(50),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
});

export const programUpdateSchema = programSchema.partial();

// ============================================================================
// WORKOUT SCHEMAS
// ============================================================================

export const workoutSchema = z.object({
  programId: z.string().uuid('Invalid program ID').optional(),
  title: z.string().min(3, 'Title too short').max(200, 'Title too long'),
  description: z.string().min(10, 'Description too short').max(5000, 'Description too long'),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute').max(300, 'Duration too long'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  videoUrl: z.string().url('Invalid video URL').optional(),
  equipment: z.array(z.string()).max(20, 'Too many equipment items').optional(),
  exercises: z.array(z.object({
    name: z.string().min(1).max(100),
    sets: z.number().int().min(1).max(20).optional(),
    reps: z.number().int().min(1).max(100).optional(),
    duration: z.number().int().min(1).optional(),
    notes: z.string().max(500).optional(),
  })).optional(),
  targetMuscles: z.array(z.string()).max(10).optional(),
});

export const workoutUpdateSchema = workoutSchema.partial();

// ============================================================================
// PROGRESS TRACKING SCHEMAS
// ============================================================================

export const workoutLogSchema = z.object({
  workoutId: z.string().uuid('Invalid workout ID'),
  completedAt: z.string().datetime('Invalid date format').optional(),
  durationMinutes: z.number().int().min(1).max(300),
  notes: z.string().max(1000, 'Notes too long').optional(),
  rating: z.number().int().min(1).max(5).optional(),
  exercises: z.array(z.object({
    exerciseId: z.string().optional(),
    name: z.string().min(1),
    setsCompleted: z.number().int().min(0),
    repsCompleted: z.number().int().min(0).optional(),
    weight: z.number().min(0).optional(),
  })).optional(),
});

export const progressPhotoSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
  notes: z.string().max(500).optional(),
  weight: z.number().min(0).max(1000).optional(),
  measurements: z.object({
    chest: z.number().min(0).optional(),
    waist: z.number().min(0).optional(),
    hips: z.number().min(0).optional(),
    arms: z.number().min(0).optional(),
    thighs: z.number().min(0).optional(),
  }).optional(),
});

// ============================================================================
// CONTENT SUBMISSION SCHEMAS (Collaborator)
// ============================================================================

export const contentSubmissionSchema = z.object({
  type: z.enum(['workout', 'blog_post', 'recipe', 'video'], {
    errorMap: () => ({ message: 'Invalid content type' }),
  }),
  title: z.string().min(3).max(200),
  content: z.record(z.any()), // Flexible JSON content
  tags: z.array(z.string()).max(10).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

export const contentSubmissionUpdateSchema = contentSubmissionSchema.partial();

export const contentReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reviewNotes: z.string().max(1000).optional(),
});

// ============================================================================
// SUPPORT TICKET SCHEMAS
// ============================================================================

export const supportTicketSchema = z.object({
  subject: z.string().min(3, 'Subject too short').max(200, 'Subject too long'),
  description: z.string().min(10, 'Description too short').max(5000, 'Description too long'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  category: z.enum(['technical', 'billing', 'content', 'account', 'other']).optional(),
});

export const supportTicketReplySchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
  isInternal: z.boolean().default(false),
});

export const supportTicketUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_reply', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  assignedTo: z.string().uuid().optional(),
});

// ============================================================================
// COMMUNITY SCHEMAS
// ============================================================================

export const communityPostSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000, 'Post too long'),
  images: z.array(z.string().url()).max(5, 'Maximum 5 images').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
  visibility: z.enum(['public', 'friends', 'private']).default('public'),
});

export const communityCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(1000, 'Comment too long'),
});

// ============================================================================
// USER MANAGEMENT SCHEMAS (Admin)
// ============================================================================

export const userCreateSchema = z.object({
  email: z.string().email().max(255),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['admin', 'team', 'collaborator', 'member', 'guest']),
  sendWelcomeEmail: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  status: z.enum(['active', 'suspended', 'deleted']).optional(),
});

export const roleAssignmentSchema = z.object({
  roleId: z.number().int().positive(),
  expiresAt: z.string().datetime().optional(),
});

// ============================================================================
// SUBSCRIPTION SCHEMAS
// ============================================================================

export const subscriptionPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priceMonthly: z.number().min(0).max(9999.99),
  priceAnnual: z.number().min(0).max(99999.99),
  features: z.array(z.string()).min(1, 'At least one feature required'),
  roleId: z.number().int().positive(),
  trialDays: z.number().int().min(0).max(90).default(0),
  isActive: z.boolean().default(true),
});

export const checkoutSchema = z.object({
  planId: z.number().int().positive(),
  billingCycle: z.enum(['monthly', 'annual']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// ============================================================================
// NOTIFICATION SCHEMAS
// ============================================================================

export const notificationPreferencesSchema = z.object({
  email: z.object({
    marketing: z.boolean().default(true),
    productUpdates: z.boolean().default(true),
    workoutReminders: z.boolean().default(true),
    communityActivity: z.boolean().default(true),
    supportReplies: z.boolean().default(true),
  }),
  push: z.object({
    workoutReminders: z.boolean().default(true),
    communityActivity: z.boolean().default(false),
    achievements: z.boolean().default(true),
  }),
});

// ============================================================================
// MEDIA UPLOAD SCHEMAS
// ============================================================================

export const imageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Image must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'Invalid image format'
    ),
  alt: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
});

export const videoUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 500 * 1024 * 1024, 'Video must be less than 500MB')
    .refine(
      (file) => ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(file.type),
      'Only MP4, MOV, and AVI videos are allowed'
    ),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

export const documentUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 20 * 1024 * 1024, 'Document must be less than 20MB')
    .refine(
      (file) => ['application/pdf'].includes(file.type),
      'Only PDF documents are allowed'
    ),
  title: z.string().min(1).max(200),
});

// ============================================================================
// SEARCH & FILTER SCHEMAS
// ============================================================================

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  type: z.enum(['programs', 'workouts', 'users', 'posts', 'all']).optional(),
  filters: z.record(z.any()).optional(),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ProgramInput = z.infer<typeof programSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>;
export type WorkoutLogInput = z.infer<typeof workoutLogSchema>;
export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export type CommunityPostInput = z.infer<typeof communityPostSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
