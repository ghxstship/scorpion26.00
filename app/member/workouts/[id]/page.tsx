"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/workout/video-player";
import { ArrowLeft, Clock, Dumbbell, Target } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

interface Workout {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  cloudflare_video_id: string | null;
  video_status: string;
  video_duration_seconds: number | null;
  video_thumbnail_url: string | null;
  equipment: string[];
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    duration?: number;
  }>;
}

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  const fetchWorkout = useCallback(async () => {
    try {
      // Fetch workout details
      const workoutResponse = await fetch(`/api/workouts/${workoutId}`);
      const workoutData = await workoutResponse.json();
      
      const fallbackWorkout: Workout = {
        id: workoutId,
        title: "Upper Body Power",
        description: "Build strength and power in your upper body with this comprehensive workout targeting chest, back, shoulders, and arms.",
        duration_minutes: 45,
        difficulty: "Advanced",
        cloudflare_video_id: null,
        video_status: "pending",
        video_duration_seconds: null,
        video_thumbnail_url: null,
        equipment: ["Dumbbells", "Barbell", "Bench"],
        exercises: [
          { name: "Bench Press", sets: 4, reps: 8 },
          { name: "Bent Over Rows", sets: 4, reps: 10 },
          { name: "Overhead Press", sets: 3, reps: 10 },
          { name: "Pull-ups", sets: 3, reps: 12 },
          { name: "Dumbbell Curls", sets: 3, reps: 12 },
          { name: "Tricep Dips", sets: 3, reps: 12 },
        ],
      };
      
      setWorkout(workoutData.workout || fallbackWorkout);

      // Fetch video stream URL if video exists
      if (workoutData.workout?.cloudflare_video_id) {
        const videoResponse = await fetch(`/api/workouts/${workoutId}/stream`);
        if (videoResponse.ok) {
          const video = await videoResponse.json();
          setVideoData(video);
        }
      }

      // Fetch progress
      const progressResponse = await fetch(`/api/workouts/${workoutId}/progress`);
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData.progress);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workout:", error);
      const fallbackWorkout: Workout = {
        id: workoutId,
        title: "Upper Body Power",
        description: "Build strength and power in your upper body.",
        duration_minutes: 45,
        difficulty: "Advanced",
        cloudflare_video_id: null,
        video_status: "pending",
        video_duration_seconds: null,
        video_thumbnail_url: null,
        equipment: ["Dumbbells", "Barbell", "Bench"],
        exercises: [
          { name: "Bench Press", sets: 4, reps: 8 },
          { name: "Bent Over Rows", sets: 4, reps: 10 },
        ],
      };
      setWorkout(fallbackWorkout);
      setIsLoading(false);
    }
  }, [workoutId]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push("/login");
      return;
    }

    fetchWorkout();
  }, [router, workoutId, fetchWorkout]);

  const handleProgressUpdate = async (progressSeconds: number, durationSeconds: number) => {
    try {
      await fetch(`/api/workouts/${workoutId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress_seconds: progressSeconds,
          duration_seconds: durationSeconds,
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleVideoComplete = async () => {
    console.log("Workout video completed!");
    // Optionally show completion modal or redirect
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heading level={2}>Workout Not Found</Heading>
          <Button onClick={() => router.push("/member/workouts")} className="mt-4">
            Back to Workouts
          </Button>
        </div>
      </div>
    );
  }

  const mockWorkout: Workout = {
    id: workoutId,
    title: "Upper Body Power",
    description: "Build strength and power in your upper body with this comprehensive workout targeting chest, back, shoulders, and arms.",
    duration_minutes: 45,
    difficulty: "Advanced",
    cloudflare_video_id: null,
    video_status: "pending",
    video_duration_seconds: null,
    video_thumbnail_url: null,
    equipment: ["Dumbbells", "Barbell", "Bench"],
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8 },
      { name: "Bent Over Rows", sets: 4, reps: 10 },
      { name: "Overhead Press", sets: 3, reps: 10 },
      { name: "Pull-ups", sets: 3, reps: 12 },
      { name: "Dumbbell Curls", sets: 3, reps: 12 },
      { name: "Tricep Dips", sets: 3, reps: 15 },
    ],
  };

  return (
    <div className={spacingClasses.gap.lg}>
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/member/workouts")}
        className="mb-4"
      >
        <Icon icon={ArrowLeft} size="sm" className="mr-2" aria-hidden={true} />
        Back to Workouts
      </Button>

      {/* Workout Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Heading level={1}>{workout.title}</Heading>
          <Badge variant="outline">{workout.difficulty}</Badge>
        </div>
        <Text variant="body-lg" className="text-muted-foreground">
          {workout.description}
        </Text>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon icon={Clock} size="xs" aria-hidden={true} />
            {workout.duration_minutes} minutes
          </span>
          <span className="flex items-center gap-1">
            <Icon icon={Dumbbell} size="xs" aria-hidden={true} />
            {workout.equipment?.join(", ") || "No equipment"}
          </span>
        </div>
      </div>

      {/* Video Player */}
      {videoData && workout.video_status === "ready" ? (
        <Card>
          <CardContent className="p-0">
            <VideoPlayer
              workoutId={workoutId}
              videoUrl={videoData.videoUrl}
              thumbnailUrl={videoData.thumbnailUrl}
              captions={videoData.captions}
              initialProgress={progress?.progress_seconds || 0}
              onProgressUpdate={handleProgressUpdate}
              onComplete={handleVideoComplete}
              autoPlay={false}
              allowDownload={true}
            />
          </CardContent>
        </Card>
      ) : workout.video_status === "processing" ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <Heading level={3}>Video Processing</Heading>
            <Text variant="body-md" className="text-muted-foreground">
              Your workout video is being processed. This usually takes 2-5 minutes.
            </Text>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon icon={Target} size="xl" className="mx-auto mb-4 text-muted-foreground" aria-hidden={true} />
            <Heading level={3}>No Video Available</Heading>
            <Text variant="body-md" className="text-muted-foreground">
              This workout doesn&apos;t have a video yet. Follow the exercise list below.
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
          <CardDescription>
            Complete each exercise with proper form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workout.exercises?.map((exercise, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.duration && ` (${exercise.duration}s)`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Needed */}
      {workout.equipment && workout.equipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Equipment Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {workout.equipment.map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
