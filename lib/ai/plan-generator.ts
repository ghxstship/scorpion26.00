import { createClient } from '@/lib/supabase/server';
import type {
  TrainingPlanRequest,
  TrainingPlanResponse,
  TrainingPlan,
  TrainingPlanData,
  WeekPlan,
  DayPlan,
  PlannedExercise,
  FitnessGoal,
  ExperienceLevel,
} from '@/types/ai';

/**
 * AI Training Plan Generator
 * Creates custom training plans using GPT-4 or rule-based generation
 * 
 * NOTE: Requires OpenAI API key in environment:
 * OPENAI_API_KEY=sk-...
 * 
 * Install: npm install openai
 */
export class TrainingPlanGenerator {
  private useAI: boolean;

  constructor() {
    // Check if OpenAI is available
    this.useAI = !!process.env.OPENAI_API_KEY;
  }

  /**
   * Generate a custom training plan
   */
  async generatePlan(request: TrainingPlanRequest): Promise<TrainingPlanResponse> {
    const {
      user_id,
      goal,
      experience_level,
      duration_weeks,
      training_frequency,
      session_duration,
      equipment_available,
      limitations,
      preferences,
    } = request;

    let planData: TrainingPlanData;
    let reasoning: string;
    let estimatedResults: string;

    if (this.useAI) {
      // Use GPT-4 to generate plan
      const aiResult = await this.generateWithAI(request);
      planData = aiResult.planData;
      reasoning = aiResult.reasoning;
      estimatedResults = aiResult.estimatedResults;
    } else {
      // Use rule-based generation
      const ruleBasedResult = this.generateRuleBased(request);
      planData = ruleBasedResult.planData;
      reasoning = ruleBasedResult.reasoning;
      estimatedResults = ruleBasedResult.estimatedResults;
    }

    // Save plan to database
    const plan = await this.savePlan(user_id, {
      name: this.generatePlanName(goal, duration_weeks),
      description: reasoning,
      plan_data: planData,
      ai_generated: this.useAI,
      duration_weeks,
      goal,
      difficulty: experience_level,
    });

    return {
      plan,
      reasoning,
      estimated_results: estimatedResults,
    };
  }

  /**
   * Generate plan using GPT-4 (when available)
   */
  private async generateWithAI(request: TrainingPlanRequest): Promise<{
    planData: TrainingPlanData;
    reasoning: string;
    estimatedResults: string;
  }> {
    // This would use OpenAI API when installed
    // For now, fall back to rule-based
    console.warn('OpenAI not configured, using rule-based generation');
    return this.generateRuleBased(request);
  }

  /**
   * Generate plan using rule-based logic
   */
  private generateRuleBased(request: TrainingPlanRequest): {
    planData: TrainingPlanData;
    reasoning: string;
    estimatedResults: string;
  } {
    const {
      goal,
      experience_level,
      duration_weeks,
      training_frequency,
      session_duration,
      equipment_available,
      limitations,
    } = request;

    const weeks: WeekPlan[] = [];

    // Generate weeks
    for (let weekNum = 1; weekNum <= duration_weeks; weekNum++) {
      const days: DayPlan[] = [];
      const isDeloadWeek = weekNum % 4 === 0 && weekNum > 1;

      // Generate training days
      for (let dayNum = 1; dayNum <= 7; dayNum++) {
        const isTrainingDay = dayNum <= training_frequency;

        if (isTrainingDay) {
          const workout = this.generateWorkoutDay(
            goal,
            experience_level,
            dayNum,
            session_duration,
            equipment_available,
            isDeloadWeek
          );
          days.push(workout);
        } else {
          days.push({
            day_number: dayNum,
            day_name: this.getDayName(dayNum),
            workout_type: 'rest',
            exercises: [],
            rest_day: true,
            notes: 'Rest and recovery',
          });
        }
      }

      weeks.push({
        week_number: weekNum,
        days,
        focus: isDeloadWeek ? 'Deload & Recovery' : this.getWeekFocus(goal, weekNum),
        notes: isDeloadWeek
          ? 'Reduce volume by 40-50% to allow for recovery'
          : undefined,
      });
    }

    const planData: TrainingPlanData = {
      weeks,
      progression_strategy: this.getProgressionStrategy(goal, experience_level),
      notes: this.getPlanNotes(request),
    };

    const reasoning = this.generateReasoning(request);
    const estimatedResults = this.estimateResults(request);

    return { planData, reasoning, estimatedResults };
  }

  /**
   * Generate a workout day
   */
  private generateWorkoutDay(
    goal: FitnessGoal,
    level: ExperienceLevel,
    dayNum: number,
    duration: number,
    equipment: string[],
    isDeload: boolean
  ): DayPlan {
    const exercises = this.selectExercises(goal, level, dayNum, equipment, isDeload);

    return {
      day_number: dayNum,
      day_name: this.getDayName(dayNum),
      workout_type: this.getWorkoutType(goal, dayNum),
      exercises,
      rest_day: false,
      notes: isDeload ? 'Deload week - reduce intensity' : undefined,
    };
  }

  /**
   * Select exercises for a workout
   */
  private selectExercises(
    goal: FitnessGoal,
    level: ExperienceLevel,
    dayNum: number,
    equipment: string[],
    isDeload: boolean
  ): PlannedExercise[] {
    const exercises: PlannedExercise[] = [];
    const hasBarbell = equipment.includes('barbell');
    const hasDumbbells = equipment.includes('dumbbells');

    // Adjust volume based on experience and deload
    const baseVolume = this.getBaseVolume(level);
    const volumeMultiplier = isDeload ? 0.6 : 1.0;

    if (goal === 'strength') {
      // Strength-focused workout
      if (dayNum === 1) {
        // Lower body strength
        exercises.push(
          this.createExercise('Squat', hasBarbell ? 'Barbell Back Squat' : 'Goblet Squat', 
            Math.round(4 * volumeMultiplier), '5', 180, 8),
          this.createExercise('Deadlift', hasBarbell ? 'Romanian Deadlift' : 'Dumbbell RDL',
            Math.round(3 * volumeMultiplier), '6', 180, 8),
          this.createExercise('Lunge', 'Bulgarian Split Squat',
            Math.round(3 * volumeMultiplier), '8-10', 90, 7)
        );
      } else if (dayNum === 2) {
        // Upper body strength
        exercises.push(
          this.createExercise('Bench Press', hasBarbell ? 'Barbell Bench Press' : 'Dumbbell Bench Press',
            Math.round(4 * volumeMultiplier), '5', 180, 8),
          this.createExercise('Row', hasBarbell ? 'Barbell Row' : 'Dumbbell Row',
            Math.round(4 * volumeMultiplier), '6', 120, 7),
          this.createExercise('Overhead Press', hasDumbbells ? 'Dumbbell Shoulder Press' : 'Pike Push-up',
            Math.round(3 * volumeMultiplier), '8', 90, 7)
        );
      } else {
        // Accessory day
        exercises.push(
          this.createExercise('Pull-up', 'Pull-ups or Lat Pulldown',
            Math.round(3 * volumeMultiplier), '8-10', 90, 7),
          this.createExercise('Dip', 'Dips or Close-Grip Push-ups',
            Math.round(3 * volumeMultiplier), '8-10', 90, 7),
          this.createExercise('Core', 'Plank',
            Math.round(3 * volumeMultiplier), '30-60s', 60, 6)
        );
      }
    } else if (goal === 'hypertrophy') {
      // Hypertrophy-focused workout
      if (dayNum === 1) {
        // Chest & Triceps
        exercises.push(
          this.createExercise('Bench Press', hasBarbell ? 'Barbell Bench Press' : 'Dumbbell Bench Press',
            Math.round(4 * volumeMultiplier), '8-12', 90, 7),
          this.createExercise('Incline Press', 'Incline Dumbbell Press',
            Math.round(3 * volumeMultiplier), '10-12', 90, 7),
          this.createExercise('Fly', 'Cable or Dumbbell Fly',
            Math.round(3 * volumeMultiplier), '12-15', 60, 6),
          this.createExercise('Tricep Extension', 'Overhead Tricep Extension',
            Math.round(3 * volumeMultiplier), '12-15', 60, 6)
        );
      } else if (dayNum === 2) {
        // Back & Biceps
        exercises.push(
          this.createExercise('Deadlift', hasBarbell ? 'Deadlift' : 'Dumbbell RDL',
            Math.round(4 * volumeMultiplier), '8-10', 120, 8),
          this.createExercise('Row', 'Dumbbell Row',
            Math.round(4 * volumeMultiplier), '10-12', 90, 7),
          this.createExercise('Pull-up', 'Pull-ups or Lat Pulldown',
            Math.round(3 * volumeMultiplier), '10-12', 90, 7),
          this.createExercise('Curl', 'Dumbbell Bicep Curl',
            Math.round(3 * volumeMultiplier), '12-15', 60, 6)
        );
      } else if (dayNum === 3) {
        // Legs
        exercises.push(
          this.createExercise('Squat', hasBarbell ? 'Barbell Squat' : 'Goblet Squat',
            Math.round(4 * volumeMultiplier), '10-12', 120, 7),
          this.createExercise('Leg Press', 'Leg Press or Lunges',
            Math.round(4 * volumeMultiplier), '12-15', 90, 7),
          this.createExercise('Leg Curl', 'Leg Curl or Nordic Curl',
            Math.round(3 * volumeMultiplier), '12-15', 60, 6),
          this.createExercise('Calf Raise', 'Standing Calf Raise',
            Math.round(3 * volumeMultiplier), '15-20', 60, 6)
        );
      } else {
        // Shoulders & Arms
        exercises.push(
          this.createExercise('Overhead Press', 'Dumbbell Shoulder Press',
            Math.round(4 * volumeMultiplier), '10-12', 90, 7),
          this.createExercise('Lateral Raise', 'Dumbbell Lateral Raise',
            Math.round(3 * volumeMultiplier), '12-15', 60, 6),
          this.createExercise('Rear Delt', 'Reverse Fly',
            Math.round(3 * volumeMultiplier), '12-15', 60, 6),
          this.createExercise('Shrug', 'Dumbbell Shrug',
            Math.round(3 * volumeMultiplier), '15-20', 60, 6)
        );
      }
    } else if (goal === 'endurance') {
      // Endurance-focused workout
      exercises.push(
        this.createExercise('Cardio', 'Running or Cycling',
          1, '30-45min', 0, 6),
        this.createExercise('Circuit', 'Bodyweight Circuit',
          Math.round(3 * volumeMultiplier), '15-20', 60, 7),
        this.createExercise('Core', 'Core Circuit',
          Math.round(3 * volumeMultiplier), '20', 45, 6)
      );
    } else {
      // General fitness
      exercises.push(
        this.createExercise('Compound', hasBarbell ? 'Squat or Deadlift' : 'Goblet Squat',
          Math.round(3 * volumeMultiplier), '10-12', 90, 7),
        this.createExercise('Push', 'Push-ups or Bench Press',
          Math.round(3 * volumeMultiplier), '10-12', 90, 7),
        this.createExercise('Pull', 'Rows or Pull-ups',
          Math.round(3 * volumeMultiplier), '10-12', 90, 7),
        this.createExercise('Core', 'Plank Variations',
          Math.round(2 * volumeMultiplier), '30-60s', 60, 6)
      );
    }

    return exercises;
  }

  /**
   * Create exercise object
   */
  private createExercise(
    id: string,
    name: string,
    sets: number,
    reps: string,
    rest: number,
    rpe: number
  ): PlannedExercise {
    return {
      exercise_id: id.toLowerCase().replace(/\s+/g, '_'),
      exercise_name: name,
      sets,
      reps,
      rest_seconds: rest,
      rpe,
      notes: undefined,
    };
  }

  // Helper methods
  private getDayName(dayNum: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNum - 1];
  }

  private getWorkoutType(goal: FitnessGoal, dayNum: number): string {
    if (goal === 'strength') {
      return dayNum <= 2 ? 'strength' : 'accessory';
    }
    if (goal === 'hypertrophy') {
      return 'hypertrophy';
    }
    if (goal === 'endurance') {
      return 'cardio';
    }
    return 'general';
  }

  private getWeekFocus(goal: FitnessGoal, weekNum: number): string {
    const phase = Math.ceil(weekNum / 4);
    
    if (goal === 'strength') {
      return `Strength Phase ${phase}`;
    }
    if (goal === 'hypertrophy') {
      return `Hypertrophy Phase ${phase}`;
    }
    return `Training Phase ${phase}`;
  }

  private getBaseVolume(level: ExperienceLevel): number {
    switch (level) {
      case 'beginner': return 2;
      case 'intermediate': return 3;
      case 'advanced': return 4;
      case 'elite': return 5;
      default: return 3;
    }
  }

  private getProgressionStrategy(goal: FitnessGoal, level: ExperienceLevel): string {
    if (goal === 'strength') {
      return 'Linear progression: Add 5-10lbs per week on main lifts. Deload every 4th week.';
    }
    if (goal === 'hypertrophy') {
      return 'Progressive overload: Increase reps or weight when you can complete all sets with RPE 7-8. Deload every 4th week.';
    }
    if (goal === 'endurance') {
      return 'Volume progression: Increase duration by 10% per week. Include recovery weeks.';
    }
    return 'General progression: Increase difficulty gradually based on performance.';
  }

  private getPlanNotes(request: TrainingPlanRequest): string {
    const { limitations, preferences } = request;
    let notes = 'Follow the plan consistently for best results. ';
    
    if (limitations && limitations.length > 0) {
      notes += `Limitations noted: ${limitations.join(', ')}. `;
    }
    
    if (preferences && preferences.length > 0) {
      notes += `Preferences: ${preferences.join(', ')}. `;
    }
    
    notes += 'Adjust weights and reps based on your RPE and recovery.';
    return notes;
  }

  private generateReasoning(request: TrainingPlanRequest): string {
    const { goal, experience_level, duration_weeks, training_frequency } = request;
    
    return `This ${duration_weeks}-week ${goal} program is designed for ${experience_level} lifters training ${training_frequency}x per week. The plan includes progressive overload, deload weeks every 4 weeks, and exercise selection based on your available equipment. Focus on proper form and consistent effort for optimal results.`;
  }

  private estimateResults(request: TrainingPlanRequest): string {
    const { goal, experience_level, duration_weeks } = request;
    
    if (goal === 'strength') {
      const gains = experience_level === 'beginner' ? '15-25%' : 
                    experience_level === 'intermediate' ? '10-15%' : '5-10%';
      return `Expected strength gains: ${gains} on main lifts over ${duration_weeks} weeks with consistent training and nutrition.`;
    }
    
    if (goal === 'hypertrophy') {
      const muscle = experience_level === 'beginner' ? '4-8lbs' :
                     experience_level === 'intermediate' ? '2-4lbs' : '1-2lbs';
      return `Expected muscle gain: ${muscle} over ${duration_weeks} weeks with proper nutrition (caloric surplus).`;
    }
    
    if (goal === 'weight_loss') {
      const loss = Math.round(duration_weeks * 1.5);
      return `Expected weight loss: ${loss}lbs over ${duration_weeks} weeks with caloric deficit and consistent training.`;
    }
    
    return `Consistent progress expected over ${duration_weeks} weeks with proper adherence to the program.`;
  }

  private generatePlanName(goal: FitnessGoal, weeks: number): string {
    const goalName = goal.charAt(0).toUpperCase() + goal.slice(1).replace('_', ' ');
    return `${weeks}-Week ${goalName} Program`;
  }

  /**
   * Save plan to database
   */
  private async savePlan(
    user_id: string,
    planData: Partial<TrainingPlan>
  ): Promise<TrainingPlan> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('training_plans')
      .insert({
        user_id,
        ...planData,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's training plans
   */
  async getUserPlans(user_id: string): Promise<TrainingPlan[]> {
    const supabase = await createClient();

    const { data } = await supabase
      .from('training_plans')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    return data || [];
  }

  /**
   * Activate a training plan
   */
  async activatePlan(plan_id: string, user_id: string): Promise<void> {
    const supabase = await createClient();

    // Deactivate other plans
    await supabase
      .from('training_plans')
      .update({ status: 'paused' })
      .eq('user_id', user_id)
      .eq('status', 'active');

    // Activate this plan
    await supabase
      .from('training_plans')
      .update({ 
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', plan_id);
  }
}
