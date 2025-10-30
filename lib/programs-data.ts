import { TrackInfo, LevelInfo, ProgramTrack, ProgramLevel, CustomProgramLevel } from '@/types/shop';

// Track Definitions
export const TRACKS: Record<ProgramTrack, TrackInfo> = {
  'strength-conditioning': {
    id: 'strength-conditioning',
    name: 'Strength & Conditioning',
    description: 'Build power, muscle, and functional strength',
    color: '#8B0000',
    icon: 'Dumbbell',
    zone: 'mainBrand',
  },
  'performance-training': {
    id: 'performance-training',
    name: 'Performance Training',
    description: 'Elite athletic development and explosive power',
    color: '#A0522D',
    icon: 'Zap',
    zone: 'vipPerformance',
  },
  'cardio-core': {
    id: 'cardio-core',
    name: 'Cardio & Core',
    description: 'Endurance, agility, and core stability',
    color: '#8B7500',
    icon: 'Activity',
    zone: 'coreTraining',
  },
  'nutrition': {
    id: 'nutrition',
    name: 'Nutrition',
    description: 'Fuel your body for optimal performance',
    color: '#2F4538',
    icon: 'Apple',
    zone: 'nutrition',
  },
  'mental-stamina': {
    id: 'mental-stamina',
    name: 'Mental Stamina',
    description: 'Mental toughness and performance psychology',
    color: '#1C2841',
    icon: 'Brain',
    zone: 'intelligence',
  },
  'recovery': {
    id: 'recovery',
    name: 'Recovery',
    description: 'Restoration, mobility, and injury prevention',
    color: '#3E2347',
    icon: 'Heart',
    zone: 'recovery',
  },
  'team-sports': {
    id: 'team-sports',
    name: 'Team Sports',
    description: 'Community-driven training and team dynamics',
    color: '#8B2252',
    icon: 'Users',
    zone: 'community',
  },
};

// Level Definitions (Main Tiers)
export const LEVELS: Record<ProgramLevel, LevelInfo> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    displayName: 'Starter',
    description: 'Foundation training accessible to everyone',
    accessType: 'public',
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced',
    displayName: 'Advanced',
    description: 'Enhanced programming with premium features',
    accessType: 'premium',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro',
    description: 'Professional-grade training systems',
    accessType: 'professional',
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    displayName: 'Elite',
    description: 'Invitation-only elite performance program',
    accessType: 'invite-only',
  },
};

// Custom Programs Level (Fancy - Private Training)
export const CUSTOM_LEVEL = {
  id: 'fancy' as CustomProgramLevel,
  name: 'Fancy',
  displayName: 'Custom Private Training',
  description: 'Exclusive one-on-one coaching and personalization',
  accessType: 'private' as const,
};

// Tier order for display
export const TIER_ORDER: ProgramLevel[] = ['starter', 'advanced', 'pro', 'elite'];

// Track order for display
export const TRACK_ORDER: ProgramTrack[] = [
  'strength-conditioning',
  'performance-training',
  'cardio-core',
  'nutrition',
  'mental-stamina',
  'recovery',
  'team-sports',
];

// Helper function to calculate pricing
export const calculatePricing = (monthlyBase: number) => {
  const weekly = Math.round((monthlyBase / 4) * 100) / 100;
  const annual = Math.round(monthlyBase * 10 * 100) / 100; // 2 months free
  const annualSavings = 17; // ~17% savings
  return { weekly, monthly: monthlyBase, annual, annualSavings };
};
