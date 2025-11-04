import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/progress/prs - Get personal records
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
    const exerciseName = searchParams.get('exercise');

    let query = supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', user.id)
      .order('achieved_at', { ascending: false });

    if (exerciseName) {
      query = query.eq('exercise_name', exerciseName);
    }

    const { data: prs, error } = await query;

    if (error) {
      console.error('Error fetching personal records:', error);
      return NextResponse.json(
        { error: 'Failed to fetch personal records' },
        { status: 500 }
      );
    }

    // Group PRs by exercise
    const prsByExercise: Record<string, any[]> = {};
    prs?.forEach((pr: any) => {
      if (!prsByExercise[pr.exercise_name]) {
        prsByExercise[pr.exercise_name] = [];
      }
      prsByExercise[pr.exercise_name].push(pr);
    });

    return NextResponse.json({
      prs: prs || [],
      prsByExercise,
      totalPRs: prs?.length || 0,
    });
  } catch (error) {
    console.error('Error in GET /api/progress/prs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/progress/prs - Manually set a personal record
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { exercise_name, record_type, value, unit, session_id, activity_id } = body;

    if (!exercise_name || !record_type || !value || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for existing PR
    const { data: existingPR } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('exercise_name', exercise_name)
      .eq('record_type', record_type)
      .single();

    const improvement_percent = existingPR
      ? ((value - existingPR.value) / existingPR.value) * 100
      : 100;

    // Upsert PR
    const { data: pr, error } = await supabase
      .from('personal_records')
      .upsert(
        {
          user_id: user.id,
          exercise_name,
          record_type,
          value,
          unit,
          session_id,
          activity_id,
          previous_record: existingPR?.value,
          improvement_percent,
          achieved_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,exercise_name,record_type',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error creating personal record:', error);
      return NextResponse.json(
        { error: 'Failed to create personal record' },
        { status: 500 }
      );
    }

    return NextResponse.json(pr, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/progress/prs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
