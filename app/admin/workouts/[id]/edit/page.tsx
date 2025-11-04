"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VideoUpload } from "@/components/admin/video-upload";
import { ArrowLeft, Save, Video } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";
import { Badge } from "@/components/ui/badge";

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
}

export default function AdminWorkoutEditPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 30,
    difficulty: "Intermediate",
  });

  const fetchWorkout = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/workouts/${workoutId}`);
      const data = await response.json();
      
      if (data.workout) {
        setWorkout(data.workout);
        setFormData({
          title: data.workout.title,
          description: data.workout.description || "",
          duration_minutes: data.workout.duration_minutes || 30,
          difficulty: data.workout.difficulty || "Intermediate",
        });
      } else {
        // Mock data for demo
        const mockWorkout: Workout = {
          id: workoutId,
          title: "Upper Body Power",
          description: "Build strength and power in your upper body",
          duration_minutes: 45,
          difficulty: "Advanced",
          cloudflare_video_id: null,
          video_status: "pending",
          video_duration_seconds: null,
          video_thumbnail_url: null,
        };
        setWorkout(mockWorkout);
        setFormData({
          title: mockWorkout.title,
          description: mockWorkout.description,
          duration_minutes: mockWorkout.duration_minutes,
          difficulty: mockWorkout.difficulty,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workout:", error);
      setIsLoading(false);
    }
  }, [workoutId]);

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission(user.role, Permission.MANAGE_CONTENT)) {
      router.push("/member/dashboard");
      return;
    }

    fetchWorkout();
  }, [router, workoutId, fetchWorkout]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/admin/workouts/${workoutId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/workouts");
      } else {
        alert("Failed to save workout");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUploadComplete = (videoId: string) => {
    console.log("Video uploaded successfully:", videoId);
    // Refresh workout data to show new video
    fetchWorkout();
  };

  const handleVideoUploadError = (error: string) => {
    console.error("Video upload error:", error);
    alert(`Video upload failed: ${error}`);
  };

  const getVideoStatusBadge = () => {
    if (!workout) return null;

    switch (workout.video_status) {
      case "ready":
        return <Badge variant="default" className="bg-green-500">Ready</Badge>;
      case "processing":
        return <Badge variant="default" className="bg-yellow-500">Processing</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">No Video</Badge>;
    }
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
          <Button onClick={() => router.push("/admin/workouts")} className="mt-4">
            Back to Workouts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={spacingClasses.gap.lg}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/workouts")}
            className="mb-2"
          >
            <Icon icon={ArrowLeft} size="sm" className="mr-2" aria-hidden={true} />
            Back to Workouts
          </Button>
          <Heading level={1}>Edit Workout</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Update workout details and manage video content
          </Text>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Icon icon={Save} size="sm" className="mr-2" aria-hidden={true} />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Workout Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update workout title, description, and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the workout..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    min={5}
                    max={180}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Video Status */}
          {workout.cloudflare_video_id && (
            <Card>
              <CardHeader>
                <CardTitle>Current Video</CardTitle>
                <CardDescription>
                  Video status and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={Video} size="sm" aria-hidden={true} />
                    <span className="text-sm font-medium">Status:</span>
                  </div>
                  {getVideoStatusBadge()}
                </div>

                {workout.video_duration_seconds && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {Math.floor(workout.video_duration_seconds / 60)}:{String(workout.video_duration_seconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                )}

                {workout.video_thumbnail_url && (
                  <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <div className="relative w-full aspect-video">
                      <Image
                        src={workout.video_thumbnail_url}
                        alt="Video thumbnail"
                        fill
                        className="rounded-lg border object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Video Upload */}
        <div>
          <VideoUpload
            workoutId={workoutId}
            workoutTitle={workout.title}
            onUploadComplete={handleVideoUploadComplete}
            onUploadError={handleVideoUploadError}
          />
        </div>
      </div>
    </div>
  );
}
