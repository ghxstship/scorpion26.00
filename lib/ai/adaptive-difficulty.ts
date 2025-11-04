import { createClient } from '@/lib/supabase/server';
import type {
  AdaptiveAnalysis,
  DifficultyAdjustment,
  AdjustmentType,
  AdaptiveDifficultyHistory,
} from '@/types/ai';

/**
 * Adaptive Difficulty System
 * Auto-adjusts workout difficulty based on completion rate, RPE, and form quality
 */
export class AdaptiveDifficultySystem {
  /**
   * Analyze workout performance and generate adjustments
   */
  async analyzeAndAdjust(
    user_id: string,
    workout_id: string,
    exercise_id: string
  ): Promise<AdaptiveAnalysis> {
    // Get exercise history
    const history = await this.getExerciseHistory(user_id, exercise_id, 10);

    if (history.length < 3) {
      return {
        completion_rate: 100,
        average_rpe: 7,
        form_quality: 8,
        consistency: 100,
        recommendation: 'maintain',
        adjustments: [],
      };
    }

    // Calculate metrics
    const completionRate = this.calculateCompletionRate(history);
    const averageRPE = this.calculateAverageRPE(history);
    const formQuality = this.calculateFormQuality(history);
    const consistency = this.calculateConsistency(history);

    // Determine recommendation
    const recommendation = this.determineRecommendation(
      completionRate,
      averageRPE,
      formQuality,
      consistency
    );

    // Generate adjustments
    const adjustments = await this.generateAdjustments(
      user_id,
      workout_id,
      exercise_id,
      history,
      recommendation,
      { completionRate, averageRPE, formQuality, consistency }
    );

    return {
      completion_rate: completionRate,
      average_rpe: averageRPE,
      form_quality: formQuality,
      consistency,
      recommendation,
      adjustments,
    };
  }

  /**
   * Calculate completion rate
   */
  private calculateCompletionRate(history: any[]): number {
    const completedSets = history.reduce((sum, workout) => {
      const exercises = workout.exercises || [];
      const exercise = exercises[0]; // Assuming filtered by exercise
      if (!exercise) return sum;

      const sets = exercise.sets || [];
      const completed = sets.filter((s: any) => s.completed).length;
      const planned = sets.length;

      return sum + (planned > 0 ? (completed / planned) * 100 : 0);
    }, 0);

    return Math.round(completedSets / history.length);
  }

  /**
   * Calculate average RPE
   */
  private calculateAverageRPE(history: any[]): number {
    let totalRPE = 0;
    let count = 0;

    history.forEach((workout) => {
      const exercises = workout.exercises || [];
      const exercise = exercises[0];
      if (!exercise) return;

      const sets = exercise.sets || [];
      sets.forEach((set: any) => {
        if (set.rpe) {
          totalRPE += set.rpe;
          count++;
        }
      });
    });

    return count > 0 ? Math.round((totalRPE / count) * 10) / 10 : 7;
  }

  /**
   * Calculate form quality (based on RPE and completion)
   */
  private calculateFormQuality(history: any[]): number {
    // Form quality is inferred from:
    // 1. Completion rate (good form = completed sets)
    // 2. RPE consistency (erratic RPE = form breakdown)
    
    const completionRate = this.calculateCompletionRate(history);
    const rpeValues: number[] = [];

    history.forEach((workout) => {
      const exercises = workout.exercises || [];
      const exercise = exercises[0];
      if (!exercise) return;

      const sets = exercise.sets || [];
      sets.forEach((set: any) => {
        if (set.rpe) rpeValues.push(set.rpe);
      });
    });

    if (rpeValues.length < 2) return 8;

    // Calculate RPE standard deviation
    const mean = rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length;
    const variance = rpeValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / rpeValues.length;
    const stdDev = Math.sqrt(variance);

    // Lower std dev = more consistent = better form
    const consistencyScore = Math.max(0, 10 - stdDev * 2);

    // Weighted average
    return Math.round((completionRate / 10 * 0.6 + consistencyScore * 0.4) * 10) / 10;
  }

  /**
   * Calculate consistency (workout frequency)
   */
  private calculateConsistency(history: any[]): number {
    if (history.length < 2) return 100;

    const dates = history.map((w) => new Date(w.created_at).getTime());
    dates.sort((a, b) => b - a);

    // Calculate average days between workouts
    const gaps: number[] = [];
    for (let i = 0; i < dates.length - 1; i++) {
      const daysDiff = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
      gaps.push(daysDiff);
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

    // Ideal gap: 2-4 days
    if (avgGap >= 2 && avgGap <= 4) return 100;
    if (avgGap >= 1 && avgGap < 2) return 90;
    if (avgGap > 4 && avgGap <= 7) return 80;
    if (avgGap > 7 && avgGap <= 10) return 60;
    return 40;
  }

  /**
   * Determine adjustment recommendation
   */
  private determineRecommendation(
    completionRate: number,
    averageRPE: number,
    formQuality: number,
    consistency: number
  ): 'increase' | 'maintain' | 'decrease' {
    // Increase criteria: high completion, moderate RPE, good form
    if (
      completionRate >= 90 &&
      averageRPE <= 7.5 &&
      formQuality >= 8 &&
      consistency >= 80
    ) {
      return 'increase';
    }

    // Decrease criteria: low completion, high RPE, poor form
    if (
      completionRate < 70 ||
      averageRPE > 9 ||
      formQuality < 6 ||
      consistency < 50
    ) {
      return 'decrease';
    }

    return 'maintain';
  }

  /**
   * Generate specific adjustments
   */
  private async generateAdjustments(
    user_id: string,
    workout_id: string,
    exercise_id: string,
    history: any[],
    recommendation: 'increase' | 'maintain' | 'decrease',
    metrics: {
      completionRate: number;
      averageRPE: number;
      formQuality: number;
      consistency: number;
    }
  ): Promise<DifficultyAdjustment[]> {
    if (recommendation === 'maintain') {
      return [];
    }

    const adjustments: DifficultyAdjustment[] = [];
    const latestWorkout = history[0];
    const exercises = latestWorkout?.exercises || [];
    const exercise = exercises[0];

    if (!exercise) return [];

    const sets = exercise.sets || [];
    if (sets.length === 0) return [];

    // Get average values from recent sets
    const avgWeight = sets.reduce((sum: number, s: any) => sum + (s.weight || 0), 0) / sets.length;
    const avgReps = sets.reduce((sum: number, s: any) => sum + (s.reps || 0), 0) / sets.length;
    const avgRest = sets.reduce((sum: number, s: any) => sum + (s.rest_seconds || 90), 0) / sets.length;

    if (recommendation === 'increase') {
      // Progressive overload strategies
      const { completionRate, averageRPE } = metrics;

      if (completionRate >= 95 && averageRPE <= 7) {
        // Very easy - increase weight
        const newWeight = Math.round(avgWeight * 1.10 * 100) / 100; // +10%
        adjustments.push({
          adjustment_type: 'weight_increase',
          previous_value: avgWeight,
          new_value: newWeight,
          adjustment_percentage: 10,
          reason: `Excellent completion rate (${completionRate}%) and low RPE (${averageRPE}). Ready for weight increase.`,
        });
      } else if (completionRate >= 90 && averageRPE <= 7.5) {
        // Moderately easy - increase reps or decrease rest
        if (avgReps < 12) {
          adjustments.push({
            adjustment_type: 'rep_increase',
            previous_value: avgReps,
            new_value: avgReps + 2,
            adjustment_percentage: (2 / avgReps) * 100,
            reason: `Strong performance. Adding 2 reps to build volume.`,
          });
        } else {
          // Already high reps, decrease rest
          const newRest = Math.max(30, avgRest - 15);
          adjustments.push({
            adjustment_type: 'rest_decrease',
            previous_value: avgRest,
            new_value: newRest,
            adjustment_percentage: ((avgRest - newRest) / avgRest) * 100,
            reason: `High rep range achieved. Decreasing rest to increase intensity.`,
          });
        }
      }
    } else if (recommendation === 'decrease') {
      // Regression strategies
      const { completionRate, averageRPE, formQuality } = metrics;

      if (completionRate < 60 || averageRPE > 9.5) {
        // Significant struggle - decrease weight
        const newWeight = Math.round(avgWeight * 0.85 * 100) / 100; // -15%
        adjustments.push({
          adjustment_type: 'weight_decrease',
          previous_value: avgWeight,
          new_value: newWeight,
          adjustment_percentage: -15,
          reason: `Low completion rate (${completionRate}%) or very high RPE (${averageRPE}). Reducing weight to maintain form.`,
        });
      } else if (completionRate < 75 || formQuality < 6) {
        // Moderate struggle - decrease reps or increase rest
        if (avgReps > 5) {
          adjustments.push({
            adjustment_type: 'rep_decrease',
            previous_value: avgReps,
            new_value: Math.max(5, avgReps - 2),
            adjustment_percentage: (-2 / avgReps) * 100,
            reason: `Form quality declining (${formQuality}/10). Reducing reps to focus on quality.`,
          });
        }

        // Also increase rest
        const newRest = Math.min(180, avgRest + 30);
        adjustments.push({
          adjustment_type: 'rest_increase',
          previous_value: avgRest,
          new_value: newRest,
          adjustment_percentage: ((newRest - avgRest) / avgRest) * 100,
          reason: `Incomplete recovery between sets. Adding rest time.`,
        });
      }
    }

    // Save adjustments to history
    await this.saveAdjustments(user_id, workout_id, exercise_id, adjustments, metrics);

    return adjustments;
  }

  /**
   * Save adjustments to database
   */
  private async saveAdjustments(
    user_id: string,
    workout_id: string,
    exercise_id: string,
    adjustments: DifficultyAdjustment[],
    metrics: any
  ): Promise<void> {
    const supabase = await createClient();

    for (const adj of adjustments) {
      const record: Partial<AdaptiveDifficultyHistory> = {
        user_id,
        workout_id,
        exercise_id,
        adjustment_type: adj.adjustment_type,
        previous_value: adj.previous_value,
        new_value: adj.new_value,
        adjustment_percentage: adj.adjustment_percentage,
        reason: adj.reason,
        metrics,
      };

      await supabase.from('adaptive_difficulty_history').insert(record);
    }
  }

  /**
   * Get exercise history
   */
  private async getExerciseHistory(
    user_id: string,
    exercise_id: string,
    limit: number = 10
  ): Promise<any[]> {
    const supabase = await createClient();

    // Get recent workouts containing this exercise
    const { data: workouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Get more to filter

    if (!workouts) return [];

    // Filter workouts that contain the exercise
    const filtered = workouts.filter((w) => {
      const exercises = w.exercises || [];
      return exercises.some((e: any) => e.exercise_id === exercise_id);
    });

    return filtered.slice(0, limit);
  }

  /**
   * Get adjustment history for an exercise
   */
  async getAdjustmentHistory(
    user_id: string,
    exercise_id: string,
    limit: number = 10
  ): Promise<AdaptiveDifficultyHistory[]> {
    const supabase = await createClient();

    const { data } = await supabase
      .from('adaptive_difficulty_history')
      .select('*')
      .eq('user_id', user_id)
      .eq('exercise_id', exercise_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  /**
   * Apply adjustments to a workout plan
   */
  applyAdjustments(
    exercise: any,
    adjustments: DifficultyAdjustment[]
  ): any {
    const adjusted = { ...exercise };

    adjustments.forEach((adj) => {
      switch (adj.adjustment_type) {
        case 'weight_increase':
        case 'weight_decrease':
          adjusted.weight = adj.new_value;
          break;
        case 'rep_increase':
        case 'rep_decrease':
          adjusted.reps = Math.round(adj.new_value);
          break;
        case 'rest_increase':
        case 'rest_decrease':
          adjusted.rest_seconds = Math.round(adj.new_value);
          break;
      }
    });

    return adjusted;
  }
}
