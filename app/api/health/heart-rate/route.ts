import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LogHeartRateRequest } from '@/types/health';
import { validateHeartRate } from '@/lib/health/health-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');
    const limit = parseInt(searchParams.get('limit') || '1000');

    let query = supabase
      .from('heart_rate_data')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    if (startTime) {
      query = query.gte('recorded_at', startTime);
    }

    if (endTime) {
      query = query.lte('recorded_at', endTime);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Get zone summary if session_id provided
    let zoneSummary = null;
    if (sessionId) {
      const { data: zones, error: zoneError } = await supabase.rpc('get_heart_rate_zones', {
        p_session_id: sessionId,
      });

      if (!zoneError && zones) {
        const totalMinutes = zones.reduce((sum: number, z: any) => sum + z.minutes, 0);
        zoneSummary = zones.map((z: any) => ({
          ...z,
          percentage: totalMinutes > 0 ? (z.minutes / totalMinutes) * 100 : 0,
        }));
      }
    }

    return NextResponse.json({ 
      heart_rate_data: data || [],
      zone_summary: zoneSummary,
    });
  } catch (error: any) {
    console.error('Error fetching heart rate data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch heart rate data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: LogHeartRateRequest = await request.json();
    const { recorded_at, bpm, session_id, source, zone } = body;

    if (!recorded_at || !bpm) {
      return NextResponse.json(
        { error: 'recorded_at and bpm are required' },
        { status: 400 }
      );
    }

    if (!validateHeartRate(bpm)) {
      return NextResponse.json(
        { error: 'Invalid heart rate value (must be between 30-250 bpm)' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('heart_rate_data')
      .insert({
        user_id: user.id,
        recorded_at,
        bpm,
        session_id,
        source: source || 'manual',
        zone,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ heart_rate: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging heart rate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log heart rate' },
      { status: 500 }
    );
  }
}
