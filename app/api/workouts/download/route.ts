import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/workouts/download
 * Register a video download for offline viewing
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

    const body = await request.json();
    const { workoutId, quality } = body;

    if (!workoutId || !quality) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get workout to calculate file size
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .select("video_duration_seconds")
      .eq("id", workoutId)
      .single();

    if (workoutError || !workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }

    // Estimate file size based on quality and duration
    const bitrateMap: Record<string, number> = {
      "1080p": 8 * 1024 * 1024, // 8 Mbps
      "720p": 5 * 1024 * 1024,  // 5 Mbps
      "540p": 3 * 1024 * 1024,  // 3 Mbps
      "360p": 1.5 * 1024 * 1024, // 1.5 Mbps
    };

    const bitrate = bitrateMap[quality] || bitrateMap["720p"];
    const estimatedSize = Math.floor(
      (workout.video_duration_seconds * bitrate) / 8
    );

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Register download
    const { data, error } = await supabase
      .from("video_downloads")
      .upsert(
        {
          user_id: user.id,
          workout_id: workoutId,
          download_quality: quality,
          file_size_bytes: estimatedSize,
          downloaded_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: "user_id,workout_id,download_quality",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error registering download:", error);
      return NextResponse.json(
        { error: "Failed to register download" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      download: data,
    });
  } catch (error) {
    console.error("Error in POST /api/workouts/download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workouts/download
 * Get list of downloaded videos for current user
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

    // Get all downloads for user
    const { data: downloads, error } = await supabase
      .from("video_downloads")
      .select(`
        *,
        workouts (
          id,
          title,
          video_thumbnail_url,
          video_duration_seconds
        )
      `)
      .eq("user_id", user.id)
      .order("last_accessed_at", { ascending: false });

    if (error) {
      console.error("Error fetching downloads:", error);
      return NextResponse.json(
        { error: "Failed to fetch downloads" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      downloads: downloads || [],
    });
  } catch (error) {
    console.error("Error in GET /api/workouts/download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workouts/download
 * Delete a downloaded video
 */
export async function DELETE(request: NextRequest) {
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
    const workoutId = searchParams.get("workoutId");
    const quality = searchParams.get("quality");

    if (!workoutId) {
      return NextResponse.json(
        { error: "Missing workoutId parameter" },
        { status: 400 }
      );
    }

    // Delete download record
    const query = supabase
      .from("video_downloads")
      .delete()
      .eq("user_id", user.id)
      .eq("workout_id", workoutId);

    if (quality) {
      query.eq("download_quality", quality);
    }

    const { error } = await query;

    if (error) {
      console.error("Error deleting download:", error);
      return NextResponse.json(
        { error: "Failed to delete download" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in DELETE /api/workouts/download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
