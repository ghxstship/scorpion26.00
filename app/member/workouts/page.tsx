"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Play, Clock } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function MemberWorkoutsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const workouts = [
    { id: 1, name: "Upper Body Power", duration: "45 min", difficulty: "Advanced", completed: false },
    { id: 2, name: "HIIT Cardio Blast", duration: "30 min", difficulty: "Intermediate", completed: true },
    { id: 3, name: "Lower Body Strength", duration: "50 min", difficulty: "Advanced", completed: false },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Workouts</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Your workout library
        </Text>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon icon={Dumbbell} size="lg" className="text-primary" aria-hidden={true} />
                  <div>
                    <h3 className="font-semibold">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon icon={Clock} size="xs" aria-hidden={true} />
                      {workout.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{workout.difficulty}</Badge>
                  {workout.completed && <Badge variant="default">Completed</Badge>}
                  <Button size="sm"><Icon icon={Play} size="sm" className="mr-2" aria-hidden={true} />Start</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
