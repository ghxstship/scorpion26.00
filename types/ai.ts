// AI Personalization Types

export type FitnessGoal = 
  | 'strength' 
  | 'hypertrophy' 
  | 'endurance' 
  | 'weight_loss' 
  | 'general_fitness' 
  | 'athletic_performance';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type RecommendationType = 
  | 'workout' 
  | 'rest_day' 
  | 'deload_week' 
  | 'progressive_overload' 
  | 'exercise_swap' 
  | 'volume_adjustment';

export type RecommendationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export type TrainingPlanStatus = 'draft' | 'active' | 'completed' | 'paused' | 'archived';

export type ReadinessStatus = 'optimal' | 'good' | 'moderate' | 'low' | 'rest_needed';

export type AdjustmentType = 
  | 'weight_increase' 
  | 'weight_decrease' 
  | 'rep_increase' 
  | 'rep_decrease' 
  | 'rest_increase' 
  | 'rest_decrease' 
  | 'volume_increase' 
  | 'volume_decrease';

export interface UserFitnessProfile {
  id: string;
  user_id: string;
  fitness_goal: FitnessGoal;
  experience_level: ExperienceLevel;
  equipment_available: string[];
  preferred_workout_types: string[];
  limitations: string[];
  training_frequency: number;
  session_duration: number;
  created_at: string;
  updated_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  recommendation_type: RecommendationType;
  workout_id?: string;
  exercise_id?: string;
  reasoning: string;
  confidence_score: number;
  metadata: Record<string, any>;
  status: RecommendationStatus;
  created_at: string;
  expires_at?: string;
  acted_on_at?: string;
}

export interface TrainingPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  plan_data: TrainingPlanData;
  ai_generated: boolean;
  duration_weeks: number;
  goal?: string;
  difficulty?: ExperienceLevel;
  status: TrainingPlanStatus;
  start_date?: string;
  end_date?: string;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingPlanData {
  weeks: WeekPlan[];
  progression_strategy: string;
  notes?: string;
}

export interface WeekPlan {
  week_number: number;
  days: DayPlan[];
  focus?: string;
  notes?: string;
}

export interface DayPlan {
  day_number: number;
  day_name: string;
  workout_type: string;
  exercises: PlannedExercise[];
  rest_day: boolean;
  notes?: string;
}

export interface PlannedExercise {
  exercise_id?: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  weight?: number;
  rpe?: number;
  notes?: string;
}

export interface AIChatSession {
  id: string;
  user_id: string;
  title?: string;
  messages: ChatMessage[];
  context: Record<string, any>;
  token_count: number;
  last_message_at: string;
  created_at: string;
  archived: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RecoveryMetrics {
  id: string;
  user_id: string;
  date: string;
  sleep_hours: number;
  sleep_quality: number;
  fatigue_level: number;
  soreness_level: number;
  stress_level: number;
  recovery_score: number;
  readiness_status: ReadinessStatus;
  notes?: string;
  created_at: string;
}

export interface AdaptiveDifficultyHistory {
  id: string;
  user_id: string;
  workout_id?: string;
  exercise_id?: string;
  adjustment_type: AdjustmentType;
  previous_value: number;
  new_value: number;
  adjustment_percentage: number;
  reason: string;
  metrics: Record<string, any>;
  created_at: string;
}

// Recommendation Engine Types
export interface WorkoutAnalysis {
  workout_history_score: number;
  recovery_score: number;
  goal_alignment_score: number;
  preference_score: number;
  total_score: number;
  factors: AnalysisFactor[];
}

export interface AnalysisFactor {
  name: string;
  weight: number;
  score: number;
  reasoning: string;
}

export interface RecommendationRequest {
  user_id: string;
  recommendation_type?: RecommendationType;
  context?: Record<string, any>;
}

export interface RecommendationResponse {
  recommendations: AIRecommendation[];
  analysis: WorkoutAnalysis;
}

// Training Plan Generator Types
export interface TrainingPlanRequest {
  user_id: string;
  goal: FitnessGoal;
  experience_level: ExperienceLevel;
  duration_weeks: number;
  training_frequency: number;
  session_duration: number;
  equipment_available: string[];
  limitations?: string[];
  preferences?: string[];
}

export interface TrainingPlanResponse {
  plan: TrainingPlan;
  reasoning: string;
  estimated_results: string;
}

// Adaptive Difficulty Types
export interface DifficultyAdjustment {
  adjustment_type: AdjustmentType;
  previous_value: number;
  new_value: number;
  adjustment_percentage: number;
  reason: string;
}

export interface AdaptiveAnalysis {
  completion_rate: number;
  average_rpe: number;
  form_quality: number;
  consistency: number;
  recommendation: 'increase' | 'maintain' | 'decrease';
  adjustments: DifficultyAdjustment[];
}

// Recovery Score Types
export interface RecoveryInput {
  sleep_hours: number;
  sleep_quality: number;
  fatigue_level: number;
  soreness_level: number;
  stress_level: number;
}

export interface RecoveryAnalysis {
  score: number;
  status: ReadinessStatus;
  recommendation: string;
  workout_intensity: 'high' | 'moderate' | 'light' | 'rest';
  factors: {
    sleep: { score: number; impact: string };
    fatigue: { score: number; impact: string };
    soreness: { score: number; impact: string };
    stress: { score: number; impact: string };
  };
}

// AI Chat Types
export interface ChatRequest {
  session_id?: string;
  message: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  session_id: string;
  message: string;
  suggestions?: string[];
  workout_generated?: boolean;
}
