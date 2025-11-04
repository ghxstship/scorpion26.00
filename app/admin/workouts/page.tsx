"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Plus, Edit, Trash2, Clock } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function AdminWorkoutsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mockWorkouts = [
    { id: 1, name: "Upper Body Power", exercises: 8, duration: "45 min", difficulty: "Advanced", category: "Strength" },
    { id: 2, name: "HIIT Cardio Blast", exercises: 12, duration: "30 min", difficulty: "Intermediate", category: "Cardio" },
    { id: 3, name: "Lower Body Hypertrophy", exercises: 10, duration: "60 min", difficulty: "Advanced", category: "Strength" },
    { id: 4, name: "Core Stability", exercises: 6, duration: "20 min", difficulty: "Beginner", category: "Core" },
    { id: 5, name: "Full Body Circuit", exercises: 15, duration: "40 min", difficulty: "Intermediate", category: "Circuit" },
    { id: 6, name: "Mobility & Flexibility", exercises: 8, duration: "25 min", difficulty: "Beginner", category: "Recovery" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "border-green-500 text-green-700 dark:text-green-400";
      case "Intermediate": return "border-yellow-500 text-yellow-700 dark:text-yellow-400";
      case "Advanced": return "border-red-500 text-red-700 dark:text-red-400";
      default: return "";
    }
  };

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Workouts</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage workout library and exercises
          </Text>
        </div>
        <Button>
          <Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />
          Create Workout
        </Button>
      </div>

      <div className="grid gap-4">
        {mockWorkouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon icon={Dumbbell} size="lg" className="text-primary" aria-hidden={true} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{workout.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon icon={Clock} size="xs" aria-hidden={true} />
                        {workout.duration}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {workout.exercises} exercises
                      </span>
                      <Badge variant="outline">{workout.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
                    {workout.difficulty}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Icon icon={Edit} size="sm" className="mr-2" aria-hidden={true} />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon icon={Trash2} size="sm" aria-label="Delete workout" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
