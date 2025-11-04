import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';

// GET /api/progress - Get user's progress summary
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const supabase = await createClient();

    // Get recent workout logs
    const { data: workouts } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    // Get current streak
    const { data: streakData } = await supabase
      .from('user_engagement_scores')
      .select('login_streak, workouts_completed, last_login')
      .eq('user_id', user.id)
      .single();

    // Get achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    return successResponse({
      workouts: workouts || [],
      streak: streakData?.login_streak || 0,
      totalWorkouts: streakData?.workouts_completed || 0,
      achievements: achievements || [],
      lastActivity: streakData?.last_login,
    });
  } catch (error: any) {
    console.error('Progress GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch progress', 500);
  }
});

// POST /api/progress - Log a workout
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_logs')
      .insert({
        user_id: user.id,
        workout_id: body.workout_id,
        started_at: body.started_at,
        completed_at: body.completed_at || new Date().toISOString(),
        duration_minutes: body.duration_minutes,
        calories_burned: body.calories_burned,
        difficulty_rating: body.difficulty_rating,
        notes: body.notes,
        mood: body.mood,
      })
      .select()
      .single();

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    // Update engagement score
    await supabase.rpc('increment_workout_count', { user_id_param: user.id });

    return successResponse(data);
  } catch (error: any) {
    console.error('Progress POST error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to log workout', 500);
  }
});
