import { createClient } from '@/lib/supabase/server';
import type {
  AIRecommendation,
  WorkoutAnalysis,
  AnalysisFactor,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationType,
} from '@/types/ai';

// Weights for recommendation scoring
const WEIGHTS = {
  WORKOUT_HISTORY: 0.40,
  RECOVERY: 0.25,
  GOALS: 0.20,
  PREFERENCES: 0.15,
};

export class RecommendationEngine {
  /**
   * Generate personalized workout recommendations
   */
  async generateRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    const { user_id, recommendation_type, context } = request;

    // Get user data
    const [profile, workoutHistory, recoveryMetrics, currentPlan] = await Promise.all([
      this.getUserProfile(user_id),
      this.getWorkoutHistory(user_id, 30), // Last 30 days
      this.getLatestRecovery(user_id),
      this.getActivePlan(user_id),
    ]);

    // Analyze user data
    const analysis = await this.analyzeUserData(
      profile,
      workoutHistory,
      recoveryMetrics,
      currentPlan
    );

    // Generate recommendations based on analysis
    const recommendations = await this.createRecommendations(
      user_id,
      analysis,
      recommendation_type,
      context
    );

    return {
      recommendations,
      analysis,
    };
  }

  /**
   * Analyze user data with weighted scoring
   */
  private async analyzeUserData(
    profile: any,
    workoutHistory: any[],
    recovery: any,
    plan: any
  ): Promise<WorkoutAnalysis> {
    const factors: AnalysisFactor[] = [];

    // 1. Workout History Analysis (40%)
    const historyScore = this.analyzeWorkoutHistory(workoutHistory);
    factors.push({
      name: 'Workout History',
      weight: WEIGHTS.WORKOUT_HISTORY,
      score: historyScore,
      reasoning: this.getHistoryReasoning(workoutHistory, historyScore),
    });

    // 2. Recovery Analysis (25%)
    const recoveryScore = recovery?.recovery_score || 70;
    factors.push({
      name: 'Recovery Status',
      weight: WEIGHTS.RECOVERY,
      score: recoveryScore,
      reasoning: this.getRecoveryReasoning(recovery),
    });

    // 3. Goal Alignment (20%)
    const goalScore = this.analyzeGoalProgress(profile, workoutHistory, plan);
    factors.push({
      name: 'Goal Alignment',
      weight: WEIGHTS.GOALS,
      score: goalScore,
      reasoning: this.getGoalReasoning(profile, goalScore),
    });

    // 4. Preferences (15%)
    const preferenceScore = this.analyzePreferences(profile, workoutHistory);
    factors.push({
      name: 'Preferences',
      weight: WEIGHTS.PREFERENCES,
      score: preferenceScore,
      reasoning: this.getPreferenceReasoning(profile),
    });

    // Calculate total weighted score
    const total_score = factors.reduce(
      (sum, factor) => sum + factor.score * factor.weight,
      0
    );

    return {
      workout_history_score: historyScore,
      recovery_score: recoveryScore,
      goal_alignment_score: goalScore,
      preference_score: preferenceScore,
      total_score,
      factors,
    };
  }

  /**
   * Analyze workout history patterns
   */
  private analyzeWorkoutHistory(workouts: any[]): number {
    if (workouts.length === 0) return 50;

    const now = new Date();
    const recentWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.created_at);
      const daysDiff = (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    // Frequency score
    const weeklyFrequency = recentWorkouts.length;
    const frequencyScore = Math.min(100, (weeklyFrequency / 4) * 100);

    // Completion rate
    const completedWorkouts = workouts.filter((w) => w.status === 'completed');
    const completionRate = (completedWorkouts.length / workouts.length) * 100;

    // Volume trend
    const volumeTrend = this.calculateVolumeTrend(workouts);

    // Weighted average
    return (frequencyScore * 0.4 + completionRate * 0.4 + volumeTrend * 0.2);
  }

  /**
   * Calculate volume trend
   */
  private calculateVolumeTrend(workouts: any[]): number {
    if (workouts.length < 2) return 70;

    const volumes = workouts.map((w) => {
      const exercises = w.exercises || [];
      return exercises.reduce((sum: number, ex: any) => {
        const sets = ex.sets || [];
        const exerciseVolume = sets.reduce(
          (s: number, set: any) => s + (set.weight || 0) * (set.reps || 0),
          0
        );
        return sum + exerciseVolume;
      }, 0);
    });

    // Compare recent vs older workouts
    const mid = Math.floor(volumes.length / 2);
    const recentAvg = volumes.slice(mid).reduce((a, b) => a + b, 0) / (volumes.length - mid);
    const olderAvg = volumes.slice(0, mid).reduce((a, b) => a + b, 0) / mid;

    if (olderAvg === 0) return 70;

    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    // Positive trend is good, but too much might indicate overtraining
    if (trend > 20) return 60; // Too aggressive
    if (trend > 0) return 90; // Good progression
    if (trend > -10) return 70; // Slight decrease, acceptable
    return 50; // Significant decrease
  }

  /**
   * Analyze goal progress
   */
  private analyzeGoalProgress(profile: any, workouts: any[], plan: any): number {
    if (!profile) return 50;

    const goal = profile.fitness_goal;
    let score = 70; // Base score

    // Check if workouts align with goal
    if (goal === 'strength') {
      const strengthWorkouts = workouts.filter((w) => 
        w.workout_type === 'strength' || w.name?.toLowerCase().includes('strength')
      );
      score = (strengthWorkouts.length / Math.max(workouts.length, 1)) * 100;
    } else if (goal === 'hypertrophy') {
      const hypertrophyWorkouts = workouts.filter((w) =>
        w.workout_type === 'hypertrophy' || w.name?.toLowerCase().includes('hypertrophy')
      );
      score = (hypertrophyWorkouts.length / Math.max(workouts.length, 1)) * 100;
    } else if (goal === 'endurance') {
      const enduranceWorkouts = workouts.filter((w) =>
        w.workout_type === 'cardio' || w.name?.toLowerCase().includes('cardio')
      );
      score = (enduranceWorkouts.length / Math.max(workouts.length, 1)) * 100;
    }

    // Adjust based on plan progress
    if (plan && plan.completion_percentage) {
      score = (score + plan.completion_percentage) / 2;
    }

    return Math.min(100, score);
  }

  /**
   * Analyze user preferences
   */
  private analyzePreferences(profile: any, workouts: any[]): number {
    if (!profile) return 70;

    const preferredTypes = profile.preferred_workout_types || [];
    if (preferredTypes.length === 0) return 70;

    // Check if recent workouts match preferences
    const matchingWorkouts = workouts.filter((w) =>
      preferredTypes.some((type: string) =>
        w.workout_type?.toLowerCase().includes(type.toLowerCase()) ||
        w.name?.toLowerCase().includes(type.toLowerCase())
      )
    );

    return (matchingWorkouts.length / Math.max(workouts.length, 1)) * 100;
  }

  /**
   * Create recommendations based on analysis
   */
  private async createRecommendations(
    user_id: string,
    analysis: WorkoutAnalysis,
    type?: RecommendationType,
    context?: Record<string, any>
  ): Promise<AIRecommendation[]> {
    const recommendations: Partial<AIRecommendation>[] = [];
    const { total_score, recovery_score } = analysis;

    // Rest day recommendation
    if (recovery_score < 50) {
      recommendations.push({
        user_id,
        recommendation_type: 'rest_day',
        reasoning: `Your recovery score is ${recovery_score}/100. Your body needs rest to adapt and grow stronger. Consider taking a rest day or doing light active recovery.`,
        confidence_score: 0.95,
        metadata: { recovery_score },
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Deload week recommendation
    const workoutHistory = await this.getWorkoutHistory(user_id, 21);
    const highIntensityWeeks = this.countHighIntensityWeeks(workoutHistory);
    if (highIntensityWeeks >= 3) {
      recommendations.push({
        user_id,
        recommendation_type: 'deload_week',
        reasoning: `You've completed ${highIntensityWeeks} consecutive high-intensity weeks. A deload week (50-60% volume) will help prevent overtraining and optimize long-term progress.`,
        confidence_score: 0.85,
        metadata: { high_intensity_weeks: highIntensityWeeks },
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Progressive overload recommendation
    if (total_score > 80 && recovery_score > 70) {
      recommendations.push({
        user_id,
        recommendation_type: 'progressive_overload',
        reasoning: `Your performance and recovery are excellent (${total_score.toFixed(0)}/100). You're ready to increase training intensity. Consider adding 5-10% weight or 1-2 reps to your main lifts.`,
        confidence_score: 0.90,
        metadata: { total_score, recovery_score },
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Save recommendations to database
    const supabase = await createClient();
    const savedRecommendations: AIRecommendation[] = [];
    for (const rec of recommendations) {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .insert(rec)
        .select()
        .single();

      if (!error && data) {
        savedRecommendations.push(data);
      }
    }

    return savedRecommendations;
  }

  /**
   * Count high intensity weeks
   */
  private countHighIntensityWeeks(workouts: any[]): number {
    const weeks: Record<string, any[]> = {};
    
    workouts.forEach((w) => {
      const date = new Date(w.created_at);
      const weekKey = `${date.getFullYear()}-W${this.getWeekNumber(date)}`;
      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(w);
    });

    let consecutiveHighIntensity = 0;
    const weekKeys = Object.keys(weeks).sort().reverse();

    for (const key of weekKeys) {
      const weekWorkouts = weeks[key];
      const avgIntensity = this.calculateWeekIntensity(weekWorkouts);
      
      if (avgIntensity > 7.5) {
        consecutiveHighIntensity++;
      } else {
        break;
      }
    }

    return consecutiveHighIntensity;
  }

  /**
   * Calculate week intensity
   */
  private calculateWeekIntensity(workouts: any[]): number {
    if (workouts.length === 0) return 0;

    const intensities = workouts.map((w) => {
      const exercises = w.exercises || [];
      const avgRPE = exercises.reduce((sum: number, ex: any) => {
        const sets = ex.sets || [];
        const rpeSum = sets.reduce((s: number, set: any) => s + (set.rpe || 7), 0);
        return sum + rpeSum / Math.max(sets.length, 1);
      }, 0) / Math.max(exercises.length, 1);
      
      return avgRPE;
    });

    return intensities.reduce((a, b) => a + b, 0) / intensities.length;
  }

  /**
   * Get week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  // Reasoning helpers
  private getHistoryReasoning(workouts: any[], score: number): string {
    if (score > 80) return 'Excellent workout consistency and progression';
    if (score > 60) return 'Good workout frequency with room for improvement';
    if (score > 40) return 'Moderate activity, consider increasing frequency';
    return 'Low activity detected, gradual increase recommended';
  }

  private getRecoveryReasoning(recovery: any): string {
    if (!recovery) return 'No recovery data available';
    const status = recovery.readiness_status;
    const score = recovery.recovery_score;
    
    if (status === 'optimal') return `Excellent recovery (${score}/100) - ready for high intensity`;
    if (status === 'good') return `Good recovery (${score}/100) - normal training recommended`;
    if (status === 'moderate') return `Moderate recovery (${score}/100) - consider lighter session`;
    if (status === 'low') return `Low recovery (${score}/100) - light activity or rest recommended`;
    return `Poor recovery (${score}/100) - rest day strongly recommended`;
  }

  private getGoalReasoning(profile: any, score: number): string {
    const goal = profile?.fitness_goal || 'general fitness';
    if (score > 80) return `Training aligns well with ${goal} goal`;
    if (score > 60) return `Decent alignment with ${goal} goal, minor adjustments suggested`;
    return `Training could better align with ${goal} goal`;
  }

  private getPreferenceReasoning(profile: any): string {
    const types = profile?.preferred_workout_types || [];
    if (types.length === 0) return 'No workout preferences set';
    return `Preferences: ${types.join(', ')}`;
  }

  // Database helpers
  private async getUserProfile(user_id: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('user_fitness_profile')
      .select('*')
      .eq('user_id', user_id)
      .single();
    return data;
  }

  private async getWorkoutHistory(user_id: string, days: number) {
    const supabase = await createClient();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user_id)
      .gte('created_at', since)
      .order('created_at', { ascending: false });
    return data || [];
  }

  private async getLatestRecovery(user_id: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('recovery_metrics')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    return data;
  }

  private async getActivePlan(user_id: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('training_plans')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .single();
    return data;
  }
}
