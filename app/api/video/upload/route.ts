import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSignedUploadUrl, getVideoMetadata } from "@/lib/video/cloudflare-stream";

/**
 * POST /api/video/upload
 * Get a signed upload URL for direct video upload to Cloudflare Stream
 */
export async function POST(request: NextRequest) {
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

    // Check if user has admin permissions
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role_id, roles(name)")
      .eq("user_id", user.id)
      .eq("is_active", true);

    const hasAdminAccess = userRoles?.some(
      (ur: any) => ["admin", "team"].includes(ur.roles?.name)
    );

    if (!hasAdminAccess) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { workoutId, maxDurationSeconds = 7200 } = body; // 2 hours default

    if (!workoutId) {
      return NextResponse.json(
        { error: "Missing workoutId" },
        { status: 400 }
      );
    }

    // Verify workout exists
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .select("id, title")
      .eq("id", workoutId)
      .single();

    if (workoutError || !workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }

    // Get signed upload URL from Cloudflare Stream
    const { uploadURL, uid } = await getSignedUploadUrl(maxDurationSeconds);

    // Update workout with pending video status
    await supabase
      .from("workouts")
      .update({
        cloudflare_video_id: uid,
        video_status: "pending",
        video_processing_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workoutId);

    return NextResponse.json({
      uploadURL,
      videoId: uid,
      workoutId,
    });
  } catch (error) {
    console.error("Error in POST /api/video/upload:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/video/upload
 * Check video upload/processing status
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId parameter" },
        { status: 400 }
      );
    }

    // Get video metadata from Cloudflare Stream
    const metadata = await getVideoMetadata(videoId);

    // Map Cloudflare status to our status
    let status = "pending";
    let errorMessage = null;

    switch (metadata.status.state) {
      case "ready":
        status = "ready";
        break;
      case "error":
        status = "error";
        errorMessage = metadata.status.errorReasonText || "Video processing failed";
        break;
      case "inprogress":
      case "queued":
        status = "processing";
        break;
      default:
        status = "pending";
    }

    // Update workout with video metadata
    const { data: workout } = await supabase
      .from("workouts")
      .select("id")
      .eq("cloudflare_video_id", videoId)
      .single();

    if (workout) {
      await supabase
        .from("workouts")
        .update({
          video_status: status,
          video_duration_seconds: metadata.duration || null,
          video_thumbnail_url: metadata.thumbnail || null,
          video_resolution: metadata.input ? 
            `${metadata.input.height}p` : null,
          video_file_size_bytes: metadata.size || null,
          video_processing_error: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", workout.id);
    }

    return NextResponse.json({
      videoId,
      status,
      readyToStream: metadata.readyToStream,
      duration: metadata.duration,
      thumbnail: metadata.thumbnail,
      resolution: metadata.input ? 
        `${metadata.input.width}x${metadata.input.height}` : null,
      size: metadata.size,
      errorMessage,
      percentComplete: metadata.status.pctComplete,
    });
  } catch (error) {
    console.error("Error in GET /api/video/upload:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
