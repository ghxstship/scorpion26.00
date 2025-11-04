import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWeekDates } from '@/lib/health/health-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const weekDates = getWeekDates();
    const startDate = weekDates[0];
    const endDate = weekDates[weekDates.length - 1];

    const { data, error } = await supabase.rpc('get_weekly_health_summary', {
      p_user_id: user.id,
      p_start_date: startDate,
      p_end_date: endDate,
    });

    if (error) throw error;

    // Format response
    const summary = {
      dates: weekDates,
      steps: weekDates.map(date => {
        const stat = data?.find((s: any) => s.date === date);
        return stat?.steps || 0;
      }),
      active_calories: weekDates.map(date => {
        const stat = data?.find((s: any) => s.date === date);
        return stat?.active_calories || 0;
      }),
      active_minutes: weekDates.map(date => {
        const stat = data?.find((s: any) => s.date === date);
        return stat?.active_minutes || 0;
      }),
      sleep_minutes: weekDates.map(date => {
        const stat = data?.find((s: any) => s.date === date);
        return stat?.sleep_minutes || 0;
      }),
      avg_heart_rate: weekDates.map(date => {
        const stat = data?.find((s: any) => s.date === date);
        return stat?.avg_heart_rate || null;
      }),
      weight_kg: weekDates.map(date => {
        const stat = data?.find((s: any) => s.date === date);
        return stat?.weight_kg || null;
      }),
    };

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error fetching weekly stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weekly stats' },
      { status: 500 }
    );
  }
}
