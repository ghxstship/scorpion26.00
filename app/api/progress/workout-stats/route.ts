import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/progress/workout-stats - Get comprehensive workout statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create user stats
    let { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError || !userStats) {
      // Create initial stats
      const { data: newStats } = await supabase
        .from('user_stats')
        .insert({ user_id: user.id })
        .select()
        .single();
      userStats = newStats;
    }

    // Get recent workouts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentWorkouts } = await supabase
      .from('workout_sessions')
      .select('completed_at, duration_minutes, total_volume')
      .eq('user_id', user.id)
      .gte('completed_at', thirtyDaysAgo.toISOString())
      .not('completed_at', 'is', null);

    const { data: recentCardio } = await supabase
      .from('cardio_activities')
      .select('completed_at, duration_seconds, distance_meters, calories_burned')
      .eq('user_id', user.id)
      .gte('completed_at', thirtyDaysAgo.toISOString())
      .not('completed_at', 'is', null);

    // Calculate recent stats
    const recentWorkoutCount = (recentWorkouts?.length || 0) + (recentCardio?.length || 0);
    const weeklyAverage = Math.round((recentWorkoutCount / 30) * 7);

    // Get top exercises by frequency
    const { data: exerciseLogs } = await supabase
      .from('exercise_logs')
      .select('exercise_name, sets, session_id')
      .in(
        'session_id',
        recentWorkouts?.map((w: any) => w.id) || []
      );

    const exerciseFrequency: Record<string, { count: number; totalVolume: number }> = {};
    exerciseLogs?.forEach((log: any) => {
      if (!exerciseFrequency[log.exercise_name]) {
        exerciseFrequency[log.exercise_name] = { count: 0, totalVolume: 0 };
      }
      exerciseFrequency[log.exercise_name].count++;
      
      const volume = log.sets
        ?.filter((s: any) => s.completed && !s.is_warmup)
        .reduce((sum: number, s: any) => sum + s.reps * s.weight, 0) || 0;
      exerciseFrequency[log.exercise_name].totalVolume += volume;
    });

    const topExercises = Object.entries(exerciseFrequency)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get recent PRs
    const { data: recentPRs } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('achieved_at', thirtyDaysAgo.toISOString())
      .order('achieved_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: userStats,
      recentWorkouts: recentWorkoutCount,
      weeklyAverage,
      monthlyTotal: recentWorkoutCount,
      topExercises,
      recentPRs: recentPRs || [],
    });
  } catch (error) {
    console.error('Error in GET /api/progress/workout-stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
