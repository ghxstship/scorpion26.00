import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { format, subDays, eachDayOfInterval } from 'date-fns';

// GET /api/progress/charts - Get chart data for progress visualization
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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '90');

    const startDate = subDays(new Date(), days);

    // Get workout sessions for volume chart
    const { data: workoutSessions } = await supabase
      .from('workout_sessions')
      .select('completed_at, total_volume, duration_minutes')
      .eq('user_id', user.id)
      .gte('completed_at', startDate.toISOString())
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: true });

    // Get cardio activities
    const { data: cardioActivities } = await supabase
      .from('cardio_activities')
      .select('completed_at, distance_meters, duration_seconds, calories_burned')
      .eq('user_id', user.id)
      .gte('completed_at', startDate.toISOString())
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: true });

    // Generate volume over time data
    const volumeByDate: Record<string, { volume: number; workouts: number }> = {};
    workoutSessions?.forEach((session: any) => {
      const date = format(new Date(session.completed_at), 'yyyy-MM-dd');
      if (!volumeByDate[date]) {
        volumeByDate[date] = { volume: 0, workouts: 0 };
      }
      volumeByDate[date].volume += session.total_volume || 0;
      volumeByDate[date].workouts++;
    });

    const volumeOverTime = Object.entries(volumeByDate).map(([date, data]) => ({
      date,
      volume: Math.round(data.volume),
      workouts: data.workouts,
    }));

    // Generate streak calendar data
    const allDates = eachDayOfInterval({ start: startDate, end: new Date() });
    const workoutDates = new Set([
      ...(workoutSessions?.map((s: any) => format(new Date(s.completed_at), 'yyyy-MM-dd')) || []),
      ...(cardioActivities?.map((a: any) => format(new Date(a.completed_at), 'yyyy-MM-dd')) || []),
    ]);

    const streakCalendar = allDates.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasStrength = workoutSessions?.some(
        (s: any) => format(new Date(s.completed_at), 'yyyy-MM-dd') === dateStr
      );
      const hasCardio = cardioActivities?.some(
        (a: any) => format(new Date(a.completed_at), 'yyyy-MM-dd') === dateStr
      );

      return {
        date: dateStr,
        count: workoutDates.has(dateStr) ? 1 : 0,
        type: hasStrength && hasCardio ? 'both' : hasStrength ? 'strength' : hasCardio ? 'cardio' : 'none',
      };
    });

    // Get exercise-specific progress
    const { data: exerciseLogs } = await supabase
      .from('exercise_logs')
      .select(`
        exercise_name,
        sets,
        created_at,
        workout_sessions!inner(completed_at, user_id)
      `)
      .eq('workout_sessions.user_id', user.id)
      .gte('workout_sessions.completed_at', startDate.toISOString())
      .not('workout_sessions.completed_at', 'is', null);

    // Group by exercise and calculate progress
    const exerciseProgress: Record<string, any[]> = {};
    exerciseLogs?.forEach((log: any) => {
      if (!exerciseProgress[log.exercise_name]) {
        exerciseProgress[log.exercise_name] = [];
      }

      const workingSets = log.sets?.filter((s: any) => s.completed && !s.is_warmup) || [];
      if (workingSets.length > 0) {
        const maxWeight = Math.max(...workingSets.map((s: any) => s.weight));
        const totalReps = workingSets.reduce((sum: number, s: any) => sum + s.reps, 0);
        const totalVolume = workingSets.reduce((sum: number, s: any) => sum + s.reps * s.weight, 0);

        exerciseProgress[log.exercise_name].push({
          date: format(new Date(log.workout_sessions.completed_at), 'yyyy-MM-dd'),
          weight: maxWeight,
          reps: totalReps,
          volume: totalVolume,
        });
      }
    });

    // Get PR timeline
    const { data: prs } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('achieved_at', startDate.toISOString())
      .order('achieved_at', { ascending: true });

    const prTimeline = prs?.map((pr: any) => ({
      date: format(new Date(pr.achieved_at), 'yyyy-MM-dd'),
      exercise: pr.exercise_name,
      value: pr.value,
      unit: pr.unit,
      improvement: pr.improvement_percent || 0,
      recordType: pr.record_type,
    })) || [];

    return NextResponse.json({
      volumeOverTime,
      exerciseProgress,
      streakCalendar,
      prTimeline,
    });
  } catch (error) {
    console.error('Error in GET /api/progress/charts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
