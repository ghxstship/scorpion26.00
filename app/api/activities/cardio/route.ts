import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateCardioActivityRequest } from '@/types/workout';

// POST /api/activities/cardio - Log cardio activity
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

    const body: CreateCardioActivityRequest = await request.json();

    // Create cardio activity
    const { data: activity, error } = await supabase
      .from('cardio_activities')
      .insert({
        user_id: user.id,
        activity_type: body.activity_type,
        started_at: body.started_at || new Date().toISOString(),
        completed_at: body.completed_at || new Date().toISOString(),
        duration_seconds: body.duration_seconds,
        distance_meters: body.distance_meters,
        calories_burned: body.calories_burned,
        avg_heart_rate: body.avg_heart_rate,
        max_heart_rate: body.max_heart_rate,
        elevation_gain_meters: body.elevation_gain_meters,
        route_data: body.route_data,
        splits: body.splits,
        notes: body.notes,
        weather: body.weather,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating cardio activity:', error);
      return NextResponse.json(
        { error: 'Failed to create cardio activity' },
        { status: 500 }
      );
    }

    // Check for distance/time PRs
    if (body.distance_meters && body.duration_seconds) {
      await checkCardioPersonalRecords(
        supabase,
        user.id,
        body.activity_type,
        body.distance_meters,
        body.duration_seconds,
        activity.id
      );
    }

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/activities/cardio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/activities/cardio - List cardio activities
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
    const activityType = searchParams.get('activity_type');

    let query = supabase
      .from('cardio_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    const { data: activities, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching cardio activities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cardio activities' },
        { status: 500 }
      );
    }

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error in GET /api/activities/cardio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check for cardio personal records
async function checkCardioPersonalRecords(
  supabase: any,
  userId: string,
  activityType: string,
  distanceMeters: number,
  durationSeconds: number,
  activityId: string
) {
  try {
    const exerciseName = `${activityType} (cardio)`;

    // Check existing PRs
    const { data: existingPRs } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_name', exerciseName);

    const prsToUpdate = [];

    // Check max distance PR
    const maxDistancePR = existingPRs?.find((pr: any) => pr.record_type === 'max_distance');
    if (!maxDistancePR || distanceMeters > maxDistancePR.value) {
      prsToUpdate.push({
        user_id: userId,
        exercise_name: exerciseName,
        record_type: 'max_distance',
        value: distanceMeters,
        unit: 'meters',
        activity_id: activityId,
        previous_record: maxDistancePR?.value,
        improvement_percent: maxDistancePR
          ? ((distanceMeters - maxDistancePR.value) / maxDistancePR.value) * 100
          : 100,
      });
    }

    // Check fastest time for standard distances (5K, 10K, etc.)
    const standardDistances = [5000, 10000, 21097, 42195]; // 5K, 10K, Half Marathon, Marathon
    for (const standardDistance of standardDistances) {
      if (Math.abs(distanceMeters - standardDistance) < 100) {
        // Within 100m of standard distance
        const fastestTimePR = existingPRs?.find(
          (pr: any) => pr.record_type === 'fastest_time' && Math.abs(pr.value - standardDistance) < 100
        );

        if (!fastestTimePR || durationSeconds < fastestTimePR.value) {
          prsToUpdate.push({
            user_id: userId,
            exercise_name: `${exerciseName} - ${standardDistance}m`,
            record_type: 'fastest_time',
            value: durationSeconds,
            unit: 'seconds',
            activity_id: activityId,
            previous_record: fastestTimePR?.value,
            improvement_percent: fastestTimePR
              ? ((fastestTimePR.value - durationSeconds) / fastestTimePR.value) * 100
              : 100,
          });
        }
      }
    }

    // Upsert PRs
    if (prsToUpdate.length > 0) {
      await supabase.from('personal_records').upsert(prsToUpdate, {
        onConflict: 'user_id,exercise_name,record_type',
      });
    }
  } catch (error) {
    console.error('Error checking cardio personal records:', error);
  }
}
