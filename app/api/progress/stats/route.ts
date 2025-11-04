import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';

// GET /api/progress/stats - Get detailed statistics
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const supabase = await createClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get workout stats
    const { data: workouts } = await supabase
      .from('workout_logs')
      .select('duration_minutes, calories_burned, completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', startDate.toISOString());

    // Get body measurements
    const { data: measurements } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Calculate stats
    const totalWorkouts = workouts?.length || 0;
    const totalMinutes = workouts?.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) || 0;
    const totalCalories = workouts?.reduce((sum, w) => sum + (w.calories_burned || 0), 0) || 0;
    const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
    const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;

    // Weight progress
    const weightProgress = measurements && measurements.length > 1
      ? {
          start: measurements[0].weight,
          current: measurements[measurements.length - 1].weight,
          change: measurements[measurements.length - 1].weight - measurements[0].weight,
        }
      : null;

    return successResponse({
      period: parseInt(period),
      workouts: {
        total: totalWorkouts,
        totalMinutes,
        totalCalories,
        avgDuration,
        avgCalories,
      },
      weight: weightProgress,
      measurements: measurements || [],
      workoutHistory: workouts || [],
    });
  } catch (error: any) {
    console.error('Stats GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch stats', 500);
  }
});
