import { NextRequest } from 'next/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { createClient } from '@/lib/supabase/server';

// POST /api/onboarding/complete - Mark onboarding as complete
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { skipped = false } = body;

    // Update onboarding progress
    const { data: progress, error: progressError } = await supabase
      .from('onboarding_progress')
      .update({
        completed: !skipped,
        completed_at: !skipped ? new Date().toISOString() : null,
        skipped: skipped,
        skipped_at: skipped ? new Date().toISOString() : null,
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (progressError) throw progressError;

    // Update user profile onboarding_completed flag
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (profileError) throw profileError;

    // If not skipped, generate AI recommendations based on onboarding data
    if (!skipped && progress) {
      try {
        // Call AI training plan generation
        const aiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ai/training-plan`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              fitnessLevel: progress.fitness_level,
              primaryGoal: progress.primary_goal,
              workoutFrequency: progress.workout_frequency,
              availableEquipment: progress.available_equipment,
              preferences: {
                workoutTypes: progress.preferred_workout_types,
                duration: progress.preferred_workout_duration,
                timePreference: progress.workout_time_preference,
              },
            }),
          }
        );

        if (!aiResponse.ok) {
          console.error('AI training plan generation failed');
        }
      } catch (aiError) {
        console.error('AI training plan error:', aiError);
        // Don't fail onboarding completion if AI fails
      }
    }

    return successResponse({
      progress,
      message: skipped
        ? 'Onboarding skipped successfully'
        : 'Onboarding completed successfully',
    });
  } catch (error: any) {
    console.error('Onboarding complete error:', error);
    return errorResponse('INTERNAL_ERROR', error.message, 500);
  }
});
