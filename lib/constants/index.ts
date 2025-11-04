// Application Constants
// Centralized constants used throughout the application

// ============================================================================
// APP CONFIGURATION
// ============================================================================

export const APP_NAME = 'Scorpion26';
export const APP_DESCRIPTION = 'Your Personal Fitness Journey';
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ============================================================================
// PAGINATION
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================================================
// FILE UPLOAD LIMITS
// ============================================================================

export const MAX_FILE_SIZES = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 500 * 1024 * 1024, // 500MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
  AVATAR: 5 * 1024 * 1024, // 5MB
} as const;

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  VIDEO: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  DOCUMENT: ['application/pdf'],
} as const;

// ============================================================================
// WORKOUT CONSTANTS
// ============================================================================

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

export const WORKOUT_CATEGORIES = [
  'strength',
  'cardio',
  'flexibility',
  'hiit',
  'yoga',
  'pilates',
  'crossfit',
  'bodyweight',
  'weightlifting',
  'running',
] as const;
export type WorkoutCategory = typeof WORKOUT_CATEGORIES[number];

export const EQUIPMENT_LIST = [
  'dumbbells',
  'barbell',
  'kettlebell',
  'resistance_bands',
  'pull_up_bar',
  'bench',
  'mat',
  'foam_roller',
  'jump_rope',
  'medicine_ball',
  'none',
] as const;
export type Equipment = typeof EQUIPMENT_LIST[number];

// ============================================================================
// SUBSCRIPTION CONSTANTS
// ============================================================================

export const SUBSCRIPTION_STATUS = [
  'active',
  'cancelled',
  'past_due',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'unpaid',
] as const;
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[number];

export const BILLING_CYCLES = ['monthly', 'annual'] as const;
export type BillingCycle = typeof BILLING_CYCLES[number];

export const TRIAL_DAYS = {
  DEFAULT: 7,
  EXTENDED: 14,
  PROMOTIONAL: 30,
} as const;

// ============================================================================
// SUPPORT TICKET CONSTANTS
// ============================================================================

export const TICKET_STATUS = [
  'open',
  'in_progress',
  'waiting_reply',
  'resolved',
  'closed',
] as const;
export type TicketStatus = typeof TICKET_STATUS[number];

export const TICKET_PRIORITY = ['low', 'normal', 'high', 'urgent'] as const;
export type TicketPriority = typeof TICKET_PRIORITY[number];

export const TICKET_CATEGORIES = [
  'technical',
  'billing',
  'content',
  'account',
  'other',
] as const;
export type TicketCategory = typeof TICKET_CATEGORIES[number];

// ============================================================================
// NOTIFICATION CONSTANTS
// ============================================================================

export const NOTIFICATION_TYPES = [
  'info',
  'success',
  'warning',
  'error',
  'achievement',
  'reminder',
] as const;
export type NotificationType = typeof NOTIFICATION_TYPES[number];

// ============================================================================
// CONTENT STATUS
// ============================================================================

export const CONTENT_STATUS = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'published',
  'archived',
] as const;
export type ContentStatus = typeof CONTENT_STATUS[number];

// ============================================================================
// USER STATUS
// ============================================================================

export const USER_STATUS = ['active', 'suspended', 'deleted'] as const;
export type UserStatus = typeof USER_STATUS[number];

// ============================================================================
// ANALYTICS TIME RANGES
// ============================================================================

export const TIME_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' },
  { label: 'All time', value: 'all' },
] as const;

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

export const ACHIEVEMENT_TYPES = [
  'workout_streak',
  'total_workouts',
  'program_completion',
  'challenge_winner',
  'community_contributor',
  'milestone',
] as const;
export type AchievementType = typeof ACHIEVEMENT_TYPES[number];

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RATE_LIMITS = {
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
  AUTH: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  API: {
    GUEST: { max: 50, windowMs: 15 * 60 * 1000 },
    MEMBER: { max: 200, windowMs: 15 * 60 * 1000 },
    TEAM: { max: 500, windowMs: 15 * 60 * 1000 },
    ADMIN: { max: 1000, windowMs: 15 * 60 * 1000 },
  },
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  POST: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5000,
  },
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  COMMUNITY: true,
  CHALLENGES: true,
  ACHIEVEMENTS: true,
  PROGRESS_PHOTOS: true,
  NUTRITION_TRACKING: false, // Coming soon
  WEARABLE_SYNC: false, // Coming soon
  AI_RECOMMENDATIONS: false, // Coming soon
  LIVE_CLASSES: false, // Coming soon
} as const;

// ============================================================================
// SOCIAL LINKS
// ============================================================================

export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/scorpion26',
  FACEBOOK: 'https://facebook.com/scorpion26',
  TWITTER: 'https://twitter.com/scorpion26',
  YOUTUBE: 'https://youtube.com/@scorpion26',
  TIKTOK: 'https://tiktok.com/@scorpion26',
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You must be logged in to access this resource.',
  FORBIDDEN: 'You don&apos;t have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  SERVER: 'Server error. Our team has been notified.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully!',
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  UPLOADED: 'Uploaded successfully!',
  SENT: 'Sent successfully!',
  LOGGED_IN: 'Welcome back!',
  LOGGED_OUT: 'Logged out successfully!',
  REGISTERED: 'Account created successfully!',
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    ME: '/api/auth/me',
  },
  USERS: {
    LIST: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  PROGRAMS: {
    LIST: '/api/programs',
    GET: (id: string) => `/api/programs/${id}`,
    CREATE: '/api/programs',
    UPDATE: (id: string) => `/api/programs/${id}`,
    DELETE: (id: string) => `/api/programs/${id}`,
  },
  WORKOUTS: {
    LIST: '/api/workouts',
    GET: (id: string) => `/api/workouts/${id}`,
    CREATE: '/api/workouts',
    UPDATE: (id: string) => `/api/workouts/${id}`,
    DELETE: (id: string) => `/api/workouts/${id}`,
    COMPLETE: (id: string) => `/api/workouts/${id}/complete`,
  },
  PROGRESS: {
    GET: '/api/progress',
    LOG: '/api/progress/log',
    STATS: '/api/progress/stats',
    PHOTO: '/api/progress/photo',
    ACHIEVEMENTS: '/api/progress/achievements',
    STREAK: '/api/progress/streak',
  },
} as const;

// ============================================================================
// DASHBOARD ROUTES
// ============================================================================

export const DASHBOARD_ROUTES = {
  ADMIN: '/admin/dashboard',
  TEAM: '/team/dashboard',
  COLLABORATOR: '/collaborator/dashboard',
  MEMBER: '/member/dashboard',
  GUEST: '/guest/dashboard',
} as const;

// ============================================================================
// CACHE KEYS
// ============================================================================

export const CACHE_KEYS = {
  USER: 'user',
  PROGRAMS: 'programs',
  WORKOUTS: 'workouts',
  PROGRESS: 'progress',
  ACHIEVEMENTS: 'achievements',
  NOTIFICATIONS: 'notifications',
} as const;

// ============================================================================
// CACHE DURATIONS (in seconds)
// ============================================================================

export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;
