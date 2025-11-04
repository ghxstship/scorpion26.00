"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Lock } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function GuestWorkoutsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.GUEST) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const workouts = [
    { id: 1, name: "Beginner Full Body", duration: "30 min", locked: false },
    { id: 2, name: "Cardio Basics", duration: "20 min", locked: false },
    { id: 3, name: "Advanced Strength", duration: "45 min", locked: true },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Sample Workouts</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Try these free workouts
        </Text>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className={workout.locked ? "opacity-60" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon icon={Dumbbell} size="lg" className="text-primary" aria-hidden={true} />
                  <div>
                    <h3 className="font-semibold">{workout.name}</h3>
                    <Icon icon={Lock} size="sm" className="mr-2" aria-hidden={true} /><p className="text-sm text-muted-foreground">{workout.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {workout.locked ? (
                    <>
                      <Badge variant="secondary"><Lock className="mr-1 h-3 w-3" />Locked</Badge>
                      <Button variant="outline">Upgrade</Button>
                    </>
                  ) : (
                    <Button>Start</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
