import { createClient } from '@/lib/supabase/server';
import type {
  RecoveryInput,
  RecoveryAnalysis,
  RecoveryMetrics,
  ReadinessStatus,
} from '@/types/ai';

/**
 * Recovery Score Calculator
 * Calculates readiness (0-100) from workout frequency, sleep, fatigue, and soreness
 */
export class RecoveryScoreCalculator {
  /**
   * Calculate comprehensive recovery score
   */
  async calculateRecoveryScore(
    user_id: string,
    input: RecoveryInput
  ): Promise<RecoveryAnalysis> {
    const { sleep_hours, sleep_quality, fatigue_level, soreness_level, stress_level } = input;

    // Calculate individual component scores
    const sleepScore = this.calculateSleepScore(sleep_hours, sleep_quality);
    const fatigueScore = this.calculateFatigueScore(fatigue_level);
    const sorenessScore = this.calculateSorenessScore(soreness_level);
    const stressScore = this.calculateStressScore(stress_level);

    // Weighted total score
    const totalScore = Math.round(
      sleepScore.score * 0.35 +
      fatigueScore.score * 0.30 +
      sorenessScore.score * 0.20 +
      stressScore.score * 0.15
    );

    // Determine readiness status
    const status = this.getReadinessStatus(totalScore);

    // Get workout recommendation
    const workoutIntensity = this.getWorkoutIntensity(totalScore, status);
    const recommendation = this.getRecommendation(totalScore, status, {
      sleepScore,
      fatigueScore,
      sorenessScore,
      stressScore,
    });

    // Save to database
    await this.saveRecoveryMetrics(user_id, input, totalScore, status);

    return {
      score: totalScore,
      status,
      recommendation,
      workout_intensity: workoutIntensity,
      factors: {
        sleep: sleepScore,
        fatigue: fatigueScore,
        soreness: sorenessScore,
        stress: stressScore,
      },
    };
  }

  /**
   * Calculate sleep score (0-100)
   * Optimal: 7-9 hours with good quality
   */
  private calculateSleepScore(hours: number, quality: number): { score: number; impact: string } {
    let hoursScore: number;

    // Hours score (0-50 points)
    if (hours >= 7 && hours <= 9) {
      hoursScore = 50;
    } else if (hours >= 6 && hours < 7) {
      hoursScore = 40;
    } else if (hours > 9 && hours <= 10) {
      hoursScore = 40;
    } else if (hours >= 5 && hours < 6) {
      hoursScore = 25;
    } else if (hours > 10) {
      hoursScore = 25;
    } else {
      hoursScore = 10;
    }

    // Quality score (0-50 points)
    const qualityScore = quality * 5;

    const totalScore = Math.min(100, hoursScore + qualityScore);

    let impact: string;
    if (totalScore >= 85) {
      impact = 'Excellent sleep - optimal recovery';
    } else if (totalScore >= 70) {
      impact = 'Good sleep - adequate recovery';
    } else if (totalScore >= 50) {
      impact = 'Fair sleep - recovery may be compromised';
    } else {
      impact = 'Poor sleep - recovery significantly impaired';
    }

    return { score: totalScore, impact };
  }

  /**
   * Calculate fatigue score (0-100)
   * Lower fatigue = higher score
   */
  private calculateFatigueScore(level: number): { score: number; impact: string } {
    const score = Math.round((10 - level) * 10);

    let impact: string;
    if (level <= 3) {
      impact = 'Minimal fatigue - ready for intense training';
    } else if (level <= 5) {
      impact = 'Moderate fatigue - normal training recommended';
    } else if (level <= 7) {
      impact = 'High fatigue - consider lighter session';
    } else {
      impact = 'Severe fatigue - rest or active recovery needed';
    }

    return { score, impact };
  }

  /**
   * Calculate soreness score (0-100)
   * Lower soreness = higher score
   */
  private calculateSorenessScore(level: number): { score: number; impact: string } {
    const score = Math.round((10 - level) * 10);

    let impact: string;
    if (level <= 3) {
      impact = 'Minimal soreness - muscles recovered';
    } else if (level <= 5) {
      impact = 'Moderate soreness - DOMS present but manageable';
    } else if (level <= 7) {
      impact = 'High soreness - muscles still recovering';
    } else {
      impact = 'Severe soreness - additional recovery time needed';
    }

    return { score, impact };
  }

  /**
   * Calculate stress score (0-100)
   * Lower stress = higher score
   */
  private calculateStressScore(level: number): { score: number; impact: string } {
    const score = Math.round((10 - level) * 10);

    let impact: string;
    if (level <= 3) {
      impact = 'Low stress - mental readiness optimal';
    } else if (level <= 5) {
      impact = 'Moderate stress - manageable';
    } else if (level <= 7) {
      impact = 'High stress - may affect performance';
    } else {
      impact = 'Very high stress - recovery priority';
    }

    return { score, impact };
  }

  /**
   * Get readiness status from score
   */
  private getReadinessStatus(score: number): ReadinessStatus {
    if (score >= 85) return 'optimal';
    if (score >= 70) return 'good';
    if (score >= 50) return 'moderate';
    if (score >= 30) return 'low';
    return 'rest_needed';
  }

  /**
   * Get workout intensity recommendation
   */
  private getWorkoutIntensity(
    score: number,
    status: ReadinessStatus
  ): 'high' | 'moderate' | 'light' | 'rest' {
    if (status === 'optimal') return 'high';
    if (status === 'good') return 'moderate';
    if (status === 'moderate') return 'light';
    return 'rest';
  }

  /**
   * Get detailed recommendation
   */
  private getRecommendation(
    score: number,
    status: ReadinessStatus,
    factors: {
      sleepScore: { score: number; impact: string };
      fatigueScore: { score: number; impact: string };
      sorenessScore: { score: number; impact: string };
      stressScore: { score: number; impact: string };
    }
  ): string {
    const { sleepScore, fatigueScore, sorenessScore, stressScore } = factors;

    // Find the weakest factor
    const weakestFactor = [
      { name: 'sleep', ...sleepScore },
      { name: 'fatigue', ...fatigueScore },
      { name: 'soreness', ...sorenessScore },
      { name: 'stress', ...stressScore },
    ].sort((a, b) => a.score - b.score)[0];

    let recommendation = `Recovery Score: ${score}/100 (${status}). `;

    if (status === 'optimal') {
      recommendation += 'You\'re fully recovered and ready for high-intensity training. Consider progressive overload or personal records today.';
    } else if (status === 'good') {
      recommendation += 'Good recovery status. Proceed with your planned workout at normal intensity.';
    } else if (status === 'moderate') {
      recommendation += `Moderate recovery. Consider a lighter session focusing on technique and volume reduction. Primary concern: ${weakestFactor.name} (${weakestFactor.impact}).`;
    } else if (status === 'low') {
      recommendation += `Low recovery detected. Active recovery or rest is recommended. Main issue: ${weakestFactor.name} (${weakestFactor.impact}).`;
    } else {
      recommendation += `Rest day strongly recommended. Your body needs recovery. Critical factor: ${weakestFactor.name} (${weakestFactor.impact}).`;
    }

    return recommendation;
  }

  /**
   * Save recovery metrics to database
   */
  private async saveRecoveryMetrics(
    user_id: string,
    input: RecoveryInput,
    score: number,
    status: ReadinessStatus
  ): Promise<void> {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const metrics: Partial<RecoveryMetrics> = {
      user_id,
      date: today,
      sleep_hours: input.sleep_hours,
      sleep_quality: input.sleep_quality,
      fatigue_level: input.fatigue_level,
      soreness_level: input.soreness_level,
      stress_level: input.stress_level,
      recovery_score: score,
      readiness_status: status,
    };

    // Upsert (insert or update if exists for today)
    await supabase
      .from('recovery_metrics')
      .upsert(metrics, { onConflict: 'user_id,date' });
  }

  /**
   * Get recovery trend (last 7 days)
   */
  async getRecoveryTrend(user_id: string): Promise<RecoveryMetrics[]> {
    const supabase = await createClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data } = await supabase
      .from('recovery_metrics')
      .select('*')
      .eq('user_id', user_id)
      .gte('date', sevenDaysAgo)
      .order('date', { ascending: false });

    return data || [];
  }

  /**
   * Get average recovery score
   */
  async getAverageRecoveryScore(user_id: string, days: number = 7): Promise<number> {
    const trend = await this.getRecoveryTrend(user_id);
    
    if (trend.length === 0) return 70; // Default neutral score

    const sum = trend.reduce((acc, m) => acc + m.recovery_score, 0);
    return Math.round(sum / trend.length);
  }

  /**
   * Check if deload is recommended based on recovery trend
   */
  async shouldDeload(user_id: string): Promise<boolean> {
    const trend = await this.getRecoveryTrend(user_id);
    
    if (trend.length < 5) return false;

    // Check if recovery has been consistently low
    const recentScores = trend.slice(0, 5).map(m => m.recovery_score);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

    // Recommend deload if average is below 60 for 5 days
    return avgRecent < 60;
  }
}
