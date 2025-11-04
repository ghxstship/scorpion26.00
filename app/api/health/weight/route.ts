import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LogWeightRequest } from '@/types/health';
import { validateWeight, validateBodyFatPercentage, calculateBMI } from '@/lib/health/health-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }

    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ weight_logs: data || [] });
  } catch (error: any) {
    console.error('Error fetching weight logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weight logs' },
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

    const body: LogWeightRequest = await request.json();
    const { recorded_at, weight_kg, body_fat_percentage, muscle_mass_kg, notes } = body;

    if (!recorded_at || !weight_kg) {
      return NextResponse.json(
        { error: 'recorded_at and weight_kg are required' },
        { status: 400 }
      );
    }

    if (!validateWeight(weight_kg)) {
      return NextResponse.json(
        { error: 'Invalid weight value' },
        { status: 400 }
      );
    }

    if (body_fat_percentage && !validateBodyFatPercentage(body_fat_percentage)) {
      return NextResponse.json(
        { error: 'Invalid body fat percentage (must be between 0-100)' },
        { status: 400 }
      );
    }

    // Get user height to calculate BMI
    const { data: profile } = await supabase
      .from('profiles')
      .select('height_cm')
      .eq('id', user.id)
      .single();

    let bmi = null;
    if (profile?.height_cm) {
      bmi = calculateBMI(weight_kg, profile.height_cm);
    }

    const { data, error } = await supabase
      .from('weight_logs')
      .insert({
        user_id: user.id,
        recorded_at,
        weight_kg,
        body_fat_percentage,
        muscle_mass_kg,
        bmi,
        source: 'manual',
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Update daily stats
    const date = new Date(recorded_at).toISOString().split('T')[0];
    await supabase.rpc('update_daily_stats', {
      p_user_id: user.id,
      p_date: date,
      p_stats: {
        weight_kg,
        body_fat_percentage,
        data_sources: ['manual'],
      },
    });

    return NextResponse.json({ weight_log: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging weight:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log weight' },
      { status: 500 }
    );
  }
}
