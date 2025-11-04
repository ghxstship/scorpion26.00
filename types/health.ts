// Health Data Types

export type HealthProvider = 
  | 'apple_health' 
  | 'google_fit' 
  | 'fitbit' 
  | 'garmin' 
  | 'whoop';

export type HealthDataType = 
  | 'workout' 
  | 'heart_rate' 
  | 'steps' 
  | 'sleep' 
  | 'weight'
  | 'calories'
  | 'distance';

export type HeartRateZone = 'resting' | 'fat_burn' | 'cardio' | 'peak';

export type SyncStatus = 'success' | 'partial' | 'failed';

export type QueueStatus = 'pending' | 'processing' | 'failed' | 'completed';

export interface HealthConnection {
  id: string;
  user_id: string;
  provider: HealthProvider;
  connected_at: string;
  last_sync_at: string | null;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  sync_enabled: boolean;
  sync_frequency_hours: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface HealthDataSync {
  id: string;
  user_id: string;
  connection_id: string;
  provider: HealthProvider;
  data_type: HealthDataType;
  sync_date: string;
  data: Record<string, any>;
  records_synced: number;
  sync_status: SyncStatus;
  error_message?: string;
  synced_at: string;
}

export interface HeartRateData {
  id: string;
  user_id: string;
  session_id?: string;
  recorded_at: string;
  bpm: number;
  source?: string;
  zone?: HeartRateZone;
  confidence?: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DailyStats {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  active_calories: number;
  total_calories: number;
  distance_meters: number;
  active_minutes: number;
  exercise_minutes: number;
  stand_hours: number;
  sleep_minutes: number;
  deep_sleep_minutes?: number;
  rem_sleep_minutes?: number;
  light_sleep_minutes?: number;
  resting_heart_rate?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  weight_kg?: number;
  body_fat_percentage?: number;
  floors_climbed: number;
  vo2_max?: number;
  data_sources: string[];
  created_at: string;
  updated_at: string;
}

export interface SleepSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  total_minutes: number;
  deep_sleep_minutes: number;
  rem_sleep_minutes: number;
  light_sleep_minutes: number;
  awake_minutes: number;
  sleep_quality_score?: number;
  avg_heart_rate?: number;
  avg_hrv?: number;
  source?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  recorded_at: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  bmi?: number;
  source?: string;
  notes?: string;
  created_at: string;
}

export interface HealthSyncQueue {
  id: string;
  user_id: string;
  connection_id: string;
  provider: HealthProvider;
  data_type: HealthDataType;
  sync_date: string;
  retry_count: number;
  max_retries: number;
  last_error?: string;
  next_retry_at?: string;
  status: QueueStatus;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types

export interface ConnectProviderRequest {
  provider: HealthProvider;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  metadata?: Record<string, any>;
}

export interface SyncRequest {
  provider?: HealthProvider;
  data_types?: HealthDataType[];
  start_date?: string;
  end_date?: string;
  force?: boolean;
}

export interface SyncResponse {
  success: boolean;
  provider: HealthProvider;
  data_types: HealthDataType[];
  records_synced: number;
  errors?: string[];
}

export interface DailyStatsRequest {
  date?: string;
  start_date?: string;
  end_date?: string;
}

export interface WeeklyStatsResponse {
  dates: string[];
  steps: number[];
  active_calories: number[];
  active_minutes: number[];
  sleep_minutes: number[];
  avg_heart_rate: (number | null)[];
  weight_kg: (number | null)[];
}

export interface HeartRateRequest {
  session_id?: string;
  start_time?: string;
  end_time?: string;
}

export interface HeartRateZoneSummary {
  zone: HeartRateZone;
  minutes: number;
  avg_bpm: number;
  max_bpm: number;
  percentage: number;
}

export interface LogHeartRateRequest {
  recorded_at: string;
  bpm: number;
  session_id?: string;
  source?: string;
  zone?: HeartRateZone;
}

export interface LogWeightRequest {
  recorded_at: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  notes?: string;
}

// Apple Health Types

export interface AppleHealthWorkout {
  workoutActivityType: string;
  duration: number;
  totalEnergyBurned: number;
  totalDistance: number;
  startDate: string;
  endDate: string;
  metadata?: Record<string, any>;
}

export interface AppleHealthSample {
  type: string;
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
  metadata?: Record<string, any>;
}

// Google Fit Types

export interface GoogleFitDataPoint {
  dataTypeName: string;
  startTimeNanos: string;
  endTimeNanos: string;
  value: Array<{
    intVal?: number;
    fpVal?: number;
    mapVal?: Array<{ key: string; value: any }>;
  }>;
  originDataSourceId?: string;
}

export interface GoogleFitSession {
  id: string;
  name: string;
  description?: string;
  startTimeMillis: string;
  endTimeMillis: string;
  activityType: number;
  application?: {
    packageName: string;
    version?: string;
  };
}

// Fitbit Types

export interface FitbitActivity {
  activityId: number;
  activityName: string;
  calories: number;
  duration: number;
  distance: number;
  startTime: string;
  steps?: number;
  averageHeartRate?: number;
}

export interface FitbitHeartRate {
  dateTime: string;
  value: {
    bpm: number;
    confidence: number;
  };
}

export interface FitbitSleep {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  startTime: string;
  endTime: string;
  minutesAsleep: number;
  minutesAwake: number;
  levels: {
    summary: {
      deep?: { minutes: number };
      light?: { minutes: number };
      rem?: { minutes: number };
      wake?: { minutes: number };
    };
  };
}

// Garmin Types

export interface GarminActivity {
  activityId: string;
  activityName: string;
  activityType: string;
  startTimeGMT: string;
  duration: number;
  distance: number;
  calories: number;
  averageHR?: number;
  maxHR?: number;
}

export interface GarminDailySummary {
  calendarDate: string;
  steps: number;
  distanceInMeters: number;
  activeKilocalories: number;
  bmrKilocalories: number;
  moderateIntensityMinutes: number;
  vigorousIntensityMinutes: number;
  floorsAscended?: number;
  restingHeartRate?: number;
}

// Utility Types

export interface HealthProviderConfig {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  requiresNativeApp: boolean;
  platforms: ('ios' | 'android' | 'web')[];
}

export interface SyncConflict {
  field: string;
  existingValue: any;
  newValue: any;
  source: HealthProvider;
  timestamp: string;
}

export interface SyncPreferences {
  auto_sync: boolean;
  sync_frequency_hours: number;
  conflict_resolution: 'newest' | 'highest' | 'manual';
  data_types: HealthDataType[];
  bidirectional: boolean;
}
