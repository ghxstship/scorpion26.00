// =====================================================
// WORKOUT TRACKING TYPES
// =====================================================

export interface WorkoutSet {
  set: number;
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
  completed: boolean;
  is_warmup?: boolean;
  is_dropset?: boolean;
  is_failure?: boolean;
  rest_seconds?: number;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id?: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  feeling?: 'great' | 'good' | 'okay' | 'tired' | 'exhausted';
  total_volume?: number;
  created_at: string;
  updated_at: string;
}

export interface ExerciseLog {
  id: string;
  session_id: string;
  exercise_name: string;
  exercise_category?: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  sets: WorkoutSet[];
  order_index: number;
  is_superset: boolean;
  superset_group?: number;
  created_at: string;
  updated_at: string;
}

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: string;
  elevation?: number;
  speed?: number;
  accuracy?: number;
}

export interface Split {
  distance: number; // meters
  time_seconds: number;
  pace: string; // "6:00" format
  elevation_gain?: number;
}

export interface CardioActivity {
  id: string;
  user_id: string;
  activity_type: 'running' | 'cycling' | 'walking' | 'hiking' | 'swimming' | 'rowing';
  started_at: string;
  completed_at?: string;
  duration_seconds: number;
  distance_meters?: number;
  calories_burned?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  elevation_gain_meters?: number;
  route_data?: GPSPoint[];
  splits?: Split[];
  notes?: string;
  weather?: {
    temp: number;
    conditions: string;
    humidity: number;
  };
  created_at: string;
  updated_at: string;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_name: string;
  record_type: '1rm' | '3rm' | '5rm' | '10rm' | 'max_reps' | 'max_distance' | 'fastest_time' | 'max_volume';
  value: number;
  unit: 'lbs' | 'kg' | 'meters' | 'km' | 'miles' | 'seconds' | 'minutes' | 'reps';
  achieved_at: string;
  session_id?: string;
  activity_id?: string;
  previous_record?: number;
  improvement_percent?: number;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_workouts: number;
  total_cardio_activities: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_workout_date?: string;
  total_volume_lifted: number;
  total_distance_meters: number;
  total_calories_burned: number;
  total_workout_minutes: number;
  prs_achieved_total: number;
  prs_achieved_this_month: number;
  avg_workout_duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    notes?: string;
  }[];
  is_public: boolean;
  times_used: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// UI STATE TYPES
// =====================================================

export interface ActiveWorkout {
  session: WorkoutSession;
  exercises: ExerciseLog[];
  currentExerciseIndex: number;
  startTime: Date;
}

export interface ActiveCardio {
  activity: Partial<CardioActivity>;
  isTracking: boolean;
  isPaused: boolean;
  currentLocation?: GPSPoint;
  routePoints: GPSPoint[];
  currentDistance: number;
  currentDuration: number;
  currentPace: number;
  splits: Split[];
}

export interface ExerciseOption {
  name: string;
  category: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string;
  muscleGroups: string[];
}

// =====================================================
// CHART DATA TYPES
// =====================================================

export interface VolumeChartData {
  date: string;
  volume: number;
  workouts: number;
}

export interface ExerciseProgressData {
  date: string;
  weight: number;
  reps: number;
  volume: number;
}

export interface StreakCalendarData {
  date: string;
  count: number;
  type: 'strength' | 'cardio' | 'both';
}

export interface PRTimelineData {
  date: string;
  exercise: string;
  value: number;
  unit: string;
  improvement: number;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateWorkoutSessionRequest {
  workout_id?: string;
  started_at?: string;
}

export interface UpdateWorkoutSessionRequest {
  completed_at?: string;
  duration_minutes?: number;
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  feeling?: 'great' | 'good' | 'okay' | 'tired' | 'exhausted';
  total_volume?: number;
}

export interface CreateExerciseLogRequest {
  exercise_name: string;
  exercise_category?: string;
  sets: WorkoutSet[];
  order_index: number;
  is_superset?: boolean;
  superset_group?: number;
}

export interface CreateCardioActivityRequest {
  activity_type: CardioActivity['activity_type'];
  started_at?: string;
  completed_at?: string;
  duration_seconds: number;
  distance_meters?: number;
  calories_burned?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  elevation_gain_meters?: number;
  route_data?: GPSPoint[];
  splits?: Split[];
  notes?: string;
  weather?: CardioActivity['weather'];
}

export interface ProgressStatsResponse {
  stats: UserStats;
  recentWorkouts: number;
  weeklyAverage: number;
  monthlyTotal: number;
  topExercises: {
    name: string;
    count: number;
    totalVolume: number;
  }[];
}

export interface ChartDataResponse {
  volumeOverTime: VolumeChartData[];
  exerciseProgress: Record<string, ExerciseProgressData[]>;
  streakCalendar: StreakCalendarData[];
  prTimeline: PRTimelineData[];
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type WorkoutType = 'strength' | 'cardio';

export interface WorkoutHistoryItem {
  id: string;
  type: WorkoutType;
  started_at: string;
  completed_at: string;
  duration_minutes: number;
  details: Record<string, any>;
}

export interface RestTimerState {
  isActive: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  exerciseName?: string;
  setNumber?: number;
}

// =====================================================
// CONSTANTS
// =====================================================

export const EXERCISE_CATEGORIES = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
] as const;

export const ACTIVITY_TYPES = [
  'running',
  'cycling',
  'walking',
  'hiking',
  'swimming',
  'rowing',
] as const;

export const FEELINGS = [
  'great',
  'good',
  'okay',
  'tired',
  'exhausted',
] as const;

export const REST_TIMER_PRESETS = [30, 60, 90, 120, 180, 240] as const; // seconds

export const RPE_SCALE = [
  { value: 1, label: 'Very Easy', color: '#10b981' },
  { value: 2, label: 'Easy', color: '#34d399' },
  { value: 3, label: 'Moderate', color: '#fbbf24' },
  { value: 4, label: 'Somewhat Hard', color: '#fb923c' },
  { value: 5, label: 'Hard', color: '#f97316' },
  { value: 6, label: 'Very Hard', color: '#ef4444' },
  { value: 7, label: 'Extremely Hard', color: '#dc2626' },
  { value: 8, label: 'Near Max', color: '#b91c1c' },
  { value: 9, label: 'Max Effort', color: '#991b1b' },
  { value: 10, label: 'Absolute Max', color: '#7f1d1d' },
] as const;
