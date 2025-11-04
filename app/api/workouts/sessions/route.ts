import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateWorkoutSessionRequest } from '@/types/workout';

// POST /api/workouts/sessions - Create new workout session
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

    const body: CreateWorkoutSessionRequest = await request.json();

    // Create workout session
    const { data: session, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        workout_id: body.workout_id,
        started_at: body.started_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workout session:', error);
      return NextResponse.json(
        { error: 'Failed to create workout session' },
        { status: 500 }
      );
    }

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/workouts/sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/workouts/sessions - List workout sessions
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get workout sessions with exercise logs
    const { data: sessions, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        exercise_logs (*)
      `)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching workout sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout sessions' },
        { status: 500 }
      );
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error in GET /api/workouts/sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
