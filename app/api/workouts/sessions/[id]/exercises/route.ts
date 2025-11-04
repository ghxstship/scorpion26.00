import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateExerciseLogRequest } from '@/types/workout';

// POST /api/workouts/sessions/[id]/exercises - Log exercise for session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: sessionId } = params;
    const body: CreateExerciseLogRequest = await request.json();

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Workout session not found' },
        { status: 404 }
      );
    }

    // Calculate total volume for this exercise
    const totalVolume = body.sets
      .filter((s) => s.completed && !s.is_warmup)
      .reduce((sum, s) => sum + s.reps * s.weight, 0);

    // Create exercise log
    const { data: exerciseLog, error } = await supabase
      .from('exercise_logs')
      .insert({
        session_id: sessionId,
        exercise_name: body.exercise_name,
        exercise_category: body.exercise_category,
        sets: body.sets,
        order_index: body.order_index,
        is_superset: body.is_superset || false,
        superset_group: body.superset_group,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating exercise log:', error);
      return NextResponse.json(
        { error: 'Failed to create exercise log' },
        { status: 500 }
      );
    }

    // Update session total volume
    const { data: sessionData } = await supabase
      .from('workout_sessions')
      .select('total_volume')
      .eq('id', sessionId)
      .single();

    const currentVolume = sessionData?.total_volume || 0;
    await supabase
      .from('workout_sessions')
      .update({
        total_volume: currentVolume + totalVolume,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    // Check for personal records
    await checkForPersonalRecords(supabase, user.id, body.exercise_name, body.sets, sessionId);

    return NextResponse.json(exerciseLog, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/workouts/sessions/[id]/exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check for personal records
async function checkForPersonalRecords(
  supabase: any,
  userId: string,
  exerciseName: string,
  sets: any[],
  sessionId: string
) {
  try {
    // Get completed working sets
    const workingSets = sets.filter((s) => s.completed && !s.is_warmup);
    if (workingSets.length === 0) return;

    // Calculate max weight
    const maxWeight = Math.max(...workingSets.map((s) => s.weight));
    
    // Calculate max reps at max weight
    const maxReps = Math.max(
      ...workingSets.filter((s) => s.weight === maxWeight).map((s) => s.reps)
    );

    // Calculate total volume
    const totalVolume = workingSets.reduce((sum, s) => sum + s.reps * s.weight, 0);

    // Check existing PRs
    const { data: existingPRs } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_name', exerciseName);

    const prsToUpdate = [];

    // Check max weight PR
    const maxWeightPR = existingPRs?.find((pr: any) => pr.record_type === '1rm');
    if (!maxWeightPR || maxWeight > maxWeightPR.value) {
      prsToUpdate.push({
        user_id: userId,
        exercise_name: exerciseName,
        record_type: '1rm',
        value: maxWeight,
        unit: 'lbs',
        session_id: sessionId,
        previous_record: maxWeightPR?.value,
        improvement_percent: maxWeightPR
          ? ((maxWeight - maxWeightPR.value) / maxWeightPR.value) * 100
          : 100,
      });
    }

    // Check max volume PR
    const maxVolumePR = existingPRs?.find((pr: any) => pr.record_type === 'max_volume');
    if (!maxVolumePR || totalVolume > maxVolumePR.value) {
      prsToUpdate.push({
        user_id: userId,
        exercise_name: exerciseName,
        record_type: 'max_volume',
        value: totalVolume,
        unit: 'lbs',
        session_id: sessionId,
        previous_record: maxVolumePR?.value,
        improvement_percent: maxVolumePR
          ? ((totalVolume - maxVolumePR.value) / maxVolumePR.value) * 100
          : 100,
      });
    }

    // Upsert PRs
    if (prsToUpdate.length > 0) {
      await supabase.from('personal_records').upsert(prsToUpdate, {
        onConflict: 'user_id,exercise_name,record_type',
      });
    }
  } catch (error) {
    console.error('Error checking personal records:', error);
  }
}
