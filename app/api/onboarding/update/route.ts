import { NextRequest } from 'next/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { createClient } from '@/lib/supabase/server';

// POST /api/onboarding/update - Update onboarding progress
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      currentStep,
      completedSteps,
      fitnessLevel,
      experienceLevel,
      physicalLimitations,
      primaryGoal,
      secondaryGoals,
      targetTimeline,
      targetWeight,
      targetBodyFat,
      workoutFrequency,
      preferredWorkoutTypes,
      preferredWorkoutDuration,
      availableEquipment,
      workoutTimePreference,
      healthConditions,
      injuries,
      dietaryRestrictions,
      medications,
    } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (currentStep !== undefined) updateData.current_step = currentStep;
    if (completedSteps !== undefined) updateData.completed_steps = completedSteps;
    if (fitnessLevel) updateData.fitness_level = fitnessLevel;
    if (experienceLevel) updateData.experience_level = experienceLevel;
    if (physicalLimitations) updateData.physical_limitations = physicalLimitations;
    if (primaryGoal) updateData.primary_goal = primaryGoal;
    if (secondaryGoals) updateData.secondary_goals = secondaryGoals;
    if (targetTimeline) updateData.target_timeline = targetTimeline;
    if (targetWeight) updateData.target_weight = targetWeight;
    if (targetBodyFat) updateData.target_body_fat = targetBodyFat;
    if (workoutFrequency !== undefined) updateData.workout_frequency = workoutFrequency;
    if (preferredWorkoutTypes) updateData.preferred_workout_types = preferredWorkoutTypes;
    if (preferredWorkoutDuration) updateData.preferred_workout_duration = preferredWorkoutDuration;
    if (availableEquipment) updateData.available_equipment = availableEquipment;
    if (workoutTimePreference) updateData.workout_time_preference = workoutTimePreference;
    if (healthConditions) updateData.health_conditions = healthConditions;
    if (injuries) updateData.injuries = injuries;
    if (dietaryRestrictions) updateData.dietary_restrictions = dietaryRestrictions;
    if (medications) updateData.medications = medications;

    // Upsert onboarding progress
    const { data, error } = await supabase
      .from('onboarding_progress')
      .upsert(
        {
          user_id: user.id,
          ...updateData,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return successResponse({ progress: data });
  } catch (error: any) {
    console.error('Onboarding update error:', error);
    return errorResponse('INTERNAL_ERROR', error.message, 500);
  }
});
