import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getHlsUrl, getSignedStreamUrl } from "@/lib/video/cloudflare-stream";

/**
 * GET /api/workouts/[id]/stream
 * Get signed streaming URL for a workout video
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

    // Get workout with video information
    const { data: workout, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", workoutId)
      .single();

    if (error || !workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }

    // Check if video is ready
    if (workout.video_status !== "ready") {
      return NextResponse.json(
        { 
          error: "Video not ready",
          status: workout.video_status,
          message: workout.video_processing_error || "Video is still processing"
        },
        { status: 400 }
      );
    }

    if (!workout.cloudflare_video_id) {
      return NextResponse.json(
        { error: "No video available for this workout" },
        { status: 404 }
      );
    }

    // Get HLS URL (public or signed depending on configuration)
    const hlsUrl = getHlsUrl(workout.cloudflare_video_id);
    
    // Optional: Generate signed URL for additional security
    // const signedToken = await getSignedStreamUrl(workout.cloudflare_video_id, 3600);

    // Get captions if available
    const { data: captions } = await supabase
      .from("video_captions")
      .select("*")
      .eq("workout_id", workoutId);

    return NextResponse.json({
      videoUrl: hlsUrl,
      thumbnailUrl: workout.video_thumbnail_url,
      duration: workout.video_duration_seconds,
      resolution: workout.video_resolution,
      captions: captions || [],
    });
  } catch (error) {
    console.error("Error in GET /api/workouts/[id]/stream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
