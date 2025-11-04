import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/workouts/[id]/progress
 * Get video progress for a specific workout
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const workoutId = params.id;

    // Get video progress
    const { data: progress, error } = await supabase
      .from("video_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("workout_id", workoutId)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
      console.error("Error fetching video progress:", error);
      return NextResponse.json(
        { error: "Failed to fetch video progress" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      progress: progress || {
        progress_seconds: 0,
        duration_seconds: 0,
        completed: false,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/workouts/[id]/progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workouts/[id]/progress
 * Save or update video progress
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const workoutId = params.id;
    const body = await request.json();
    const { progress_seconds, duration_seconds } = body;

    if (
      typeof progress_seconds !== "number" ||
      typeof duration_seconds !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid progress data" },
        { status: 400 }
      );
    }

    // Calculate if video is completed (95% or more watched)
    const completed = duration_seconds > 0 && 
      (progress_seconds / duration_seconds) >= 0.95;

    // Upsert video progress
    const { data, error } = await supabase
      .from("video_progress")
      .upsert(
        {
          user_id: user.id,
          workout_id: workoutId,
          progress_seconds: Math.floor(progress_seconds),
          duration_seconds: Math.floor(duration_seconds),
          completed,
          last_watched_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,workout_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving video progress:", error);
      return NextResponse.json(
        { error: "Failed to save video progress" },
        { status: 500 }
      );
    }

    // If video is completed, also update user_progress table
    if (completed) {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          workout_id: workoutId,
          completed_at: new Date().toISOString(),
          duration_minutes: Math.floor(duration_seconds / 60),
        },
        {
          onConflict: "user_id,workout_id",
        }
      );
    }

    return NextResponse.json({
      success: true,
      progress: data,
    });
  } catch (error) {
    console.error("Error in POST /api/workouts/[id]/progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
