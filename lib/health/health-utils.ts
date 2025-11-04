import { 
  HeartRateZone, 
  HealthProvider, 
  HealthProviderConfig,
  DailyStats,
  SyncConflict 
} from '@/types/health';

// Provider Configurations
export const HEALTH_PROVIDERS: Record<HealthProvider, HealthProviderConfig> = {
  apple_health: {
    name: 'apple_health',
    displayName: 'Apple Health',
    icon: '🍎',
    color: '#000000',
    description: 'Sync data from Apple Health and Apple Watch',
    features: ['Workouts', 'Heart Rate', 'Steps', 'Sleep', 'Weight', 'VO2 Max'],
    requiresNativeApp: true,
    platforms: ['ios'],
  },
  google_fit: {
    name: 'google_fit',
    displayName: 'Google Fit',
    icon: '🏃',
    color: '#4285F4',
    description: 'Sync data from Google Fit and Wear OS devices',
    features: ['Activities', 'Heart Rate', 'Steps', 'Sleep', 'Weight'],
    requiresNativeApp: false,
    platforms: ['android', 'web'],
  },
  fitbit: {
    name: 'fitbit',
    displayName: 'Fitbit',
    icon: '⌚',
    color: '#00B0B9',
    description: 'Sync data from Fitbit devices and app',
    features: ['Activities', 'Heart Rate', 'Steps', 'Sleep', 'Weight', 'Floors'],
    requiresNativeApp: false,
    platforms: ['ios', 'android', 'web'],
  },
  garmin: {
    name: 'garmin',
    displayName: 'Garmin',
    icon: '🎯',
    color: '#007CC3',
    description: 'Sync data from Garmin devices',
    features: ['Activities', 'Heart Rate', 'Steps', 'Sleep', 'VO2 Max'],
    requiresNativeApp: false,
    platforms: ['ios', 'android', 'web'],
  },
  whoop: {
    name: 'whoop',
    displayName: 'WHOOP',
    icon: '💪',
    color: '#000000',
    description: 'Sync recovery, strain, and sleep data from WHOOP',
    features: ['Recovery Score', 'Strain', 'Sleep', 'Heart Rate', 'HRV'],
    requiresNativeApp: false,
    platforms: ['ios', 'android', 'web'],
  },
};

// Heart Rate Zone Calculations
export function calculateHeartRateZone(bpm: number, maxHeartRate: number): HeartRateZone {
  const percentage = (bpm / maxHeartRate) * 100;
  
  if (percentage >= 90) return 'peak';
  if (percentage >= 70) return 'cardio';
  if (percentage >= 50) return 'fat_burn';
  return 'resting';
}

export function estimateMaxHeartRate(age: number): number {
  return 220 - age;
}

export function getHeartRateZoneRange(zone: HeartRateZone, maxHeartRate: number): [number, number] {
  switch (zone) {
    case 'peak':
      return [Math.round(maxHeartRate * 0.9), maxHeartRate];
    case 'cardio':
      return [Math.round(maxHeartRate * 0.7), Math.round(maxHeartRate * 0.89)];
    case 'fat_burn':
      return [Math.round(maxHeartRate * 0.5), Math.round(maxHeartRate * 0.69)];
    case 'resting':
      return [0, Math.round(maxHeartRate * 0.49)];
  }
}

export function getHeartRateZoneColor(zone: HeartRateZone): string {
  switch (zone) {
    case 'peak':
      return '#EF4444'; // red
    case 'cardio':
      return '#F59E0B'; // orange
    case 'fat_burn':
      return '#10B981'; // green
    case 'resting':
      return '#3B82F6'; // blue
  }
}

// Data Conversion Utilities
export function metersToMiles(meters: number): number {
  return meters * 0.000621371;
}

export function metersToKilometers(meters: number): number {
  return meters / 1000;
}

export function kilogramsToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKilograms(lbs: number): number {
  return lbs / 2.20462;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function minutesToHours(minutes: number): number {
  return minutes / 60;
}

// Sleep Quality Calculations
export function calculateSleepQuality(sleep: {
  total_minutes: number;
  deep_sleep_minutes?: number;
  rem_sleep_minutes?: number;
  awake_minutes?: number;
}): number {
  const { total_minutes, deep_sleep_minutes = 0, rem_sleep_minutes = 0, awake_minutes = 0 } = sleep;
  
  // Ideal sleep composition percentages
  const idealDeepPercentage = 20; // 15-25%
  const idealRemPercentage = 25; // 20-25%
  const maxAwakePercentage = 5; // <5%
  
  const deepPercentage = (deep_sleep_minutes / total_minutes) * 100;
  const remPercentage = (rem_sleep_minutes / total_minutes) * 100;
  const awakePercentage = (awake_minutes / total_minutes) * 100;
  
  // Calculate scores (0-100)
  let score = 100;
  
  // Duration score (7-9 hours is ideal)
  const hours = total_minutes / 60;
  if (hours < 7) {
    score -= (7 - hours) * 10;
  } else if (hours > 9) {
    score -= (hours - 9) * 5;
  }
  
  // Deep sleep score
  const deepDiff = Math.abs(deepPercentage - idealDeepPercentage);
  score -= deepDiff * 2;
  
  // REM sleep score
  const remDiff = Math.abs(remPercentage - idealRemPercentage);
  score -= remDiff * 2;
  
  // Awake time penalty
  if (awakePercentage > maxAwakePercentage) {
    score -= (awakePercentage - maxAwakePercentage) * 3;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Activity Level Calculations
export function getActivityLevel(activeMinutes: number): {
  level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  label: string;
  color: string;
} {
  if (activeMinutes < 30) {
    return { level: 'sedentary', label: 'Sedentary', color: '#EF4444' };
  } else if (activeMinutes < 60) {
    return { level: 'lightly_active', label: 'Lightly Active', color: '#F59E0B' };
  } else if (activeMinutes < 90) {
    return { level: 'moderately_active', label: 'Moderately Active', color: '#10B981' };
  } else if (activeMinutes < 120) {
    return { level: 'very_active', label: 'Very Active', color: '#3B82F6' };
  } else {
    return { level: 'extremely_active', label: 'Extremely Active', color: '#8B5CF6' };
  }
}

// Goal Progress Calculations
export function calculateGoalProgress(current: number, goal: number): {
  percentage: number;
  remaining: number;
  achieved: boolean;
} {
  const percentage = Math.min(100, (current / goal) * 100);
  const remaining = Math.max(0, goal - current);
  const achieved = current >= goal;
  
  return { percentage, remaining, achieved };
}

// Sync Conflict Resolution
export function resolveConflict(
  conflict: SyncConflict,
  strategy: 'newest' | 'highest' | 'manual'
): any {
  if (strategy === 'manual') {
    return null; // Requires user input
  }
  
  if (strategy === 'newest') {
    return conflict.newValue;
  }
  
  if (strategy === 'highest') {
    const existing = parseFloat(conflict.existingValue);
    const newVal = parseFloat(conflict.newValue);
    
    if (!isNaN(existing) && !isNaN(newVal)) {
      return Math.max(existing, newVal);
    }
    return conflict.newValue;
  }
  
  return conflict.newValue;
}

// Data Aggregation
export function aggregateDailyStats(stats: DailyStats[]): {
  total_steps: number;
  total_active_calories: number;
  total_active_minutes: number;
  avg_sleep_minutes: number;
  avg_resting_heart_rate: number | null;
  total_distance_km: number;
} {
  if (stats.length === 0) {
    return {
      total_steps: 0,
      total_active_calories: 0,
      total_active_minutes: 0,
      avg_sleep_minutes: 0,
      avg_resting_heart_rate: null,
      total_distance_km: 0,
    };
  }
  
  const total_steps = stats.reduce((sum, s) => sum + s.steps, 0);
  const total_active_calories = stats.reduce((sum, s) => sum + s.active_calories, 0);
  const total_active_minutes = stats.reduce((sum, s) => sum + s.active_minutes, 0);
  const total_sleep_minutes = stats.reduce((sum, s) => sum + s.sleep_minutes, 0);
  const total_distance_meters = stats.reduce((sum, s) => sum + s.distance_meters, 0);
  
  const restingHRValues = stats
    .filter(s => s.resting_heart_rate)
    .map(s => s.resting_heart_rate!);
  
  const avg_resting_heart_rate = restingHRValues.length > 0
    ? Math.round(restingHRValues.reduce((sum, hr) => sum + hr, 0) / restingHRValues.length)
    : null;
  
  return {
    total_steps,
    total_active_calories,
    total_active_minutes,
    avg_sleep_minutes: Math.round(total_sleep_minutes / stats.length),
    avg_resting_heart_rate,
    total_distance_km: metersToKilometers(total_distance_meters),
  };
}

// Validation
export function validateHeartRate(bpm: number): boolean {
  return bpm >= 30 && bpm <= 250;
}

export function validateWeight(kg: number): boolean {
  return kg > 0 && kg < 500;
}

export function validateBodyFatPercentage(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}

export function validateSleepDuration(minutes: number): boolean {
  return minutes > 0 && minutes <= 1440; // Max 24 hours
}

// Formatting
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDistance(meters: number, unit: 'km' | 'mi' = 'km'): string {
  if (unit === 'mi') {
    const miles = metersToMiles(meters);
    return `${miles.toFixed(2)} mi`;
  }
  
  const km = metersToKilometers(meters);
  return `${km.toFixed(2)} km`;
}

export function formatWeight(kg: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    const lbs = kilogramsToLbs(kg);
    return `${lbs.toFixed(1)} lbs`;
  }
  
  return `${kg.toFixed(1)} kg`;
}

export function formatCalories(calories: number): string {
  return `${calories.toLocaleString()} cal`;
}

// Date Utilities
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return { start, end };
}

export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDateForAPI(date));
  }
  
  return dates;
}

// Sync Utilities
export function shouldSync(lastSyncAt: string | null, frequencyHours: number): boolean {
  if (!lastSyncAt) return true;
  
  const lastSync = new Date(lastSyncAt);
  const now = new Date();
  const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceSync >= frequencyHours;
}

export function getNextSyncTime(lastSyncAt: string, frequencyHours: number): Date {
  const lastSync = new Date(lastSyncAt);
  const nextSync = new Date(lastSync);
  nextSync.setHours(nextSync.getHours() + frequencyHours);
  
  return nextSync;
}

// Error Handling
export function isRateLimitError(error: any): boolean {
  return error?.status === 429 || error?.message?.includes('rate limit');
}

export function isAuthError(error: any): boolean {
  return error?.status === 401 || error?.status === 403;
}

export function getRetryDelay(retryCount: number): number {
  // Exponential backoff: 1min, 2min, 4min, 8min
  return Math.min(Math.pow(2, retryCount) * 60 * 1000, 8 * 60 * 1000);
}
