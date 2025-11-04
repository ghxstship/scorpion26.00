"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";
import { Flag } from "lucide-react";

export default function MemberChallengesPage() {
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

  const challenges = [
    { id: 1, name: "30-Day Consistency", description: "Complete 30 workouts in 30 days", progress: 18, total: 30, status: "Active" },
    { id: 2, name: "Cardio King", description: "Burn 10,000 calories this month", progress: 6500, total: 10000, status: "Active" },
    { id: 3, name: "Strength Challenge", description: "Complete 50 strength workouts", progress: 50, total: 50, status: "Completed" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Challenges</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Join fitness challenges
        </Text>
      </div>

      <div className={gridClasses.cards['2col']}>
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Icon icon={Trophy} size="lg" className="text-primary" aria-hidden={true} />
                <Badge variant={challenge.status === "Completed" ? "default" : "secondary"}>{challenge.status}</Badge>
              </div>
              <CardTitle className="mt-4">{challenge.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <Icon icon={Trophy} size="sm" aria-hidden={true} /><span className="font-semibold">{challenge.progress} / {challenge.total}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(challenge.progress / challenge.total) * 100}%` }} />
                </div>
                {challenge.status === "Active" && <Button className="w-full mt-4">View Details</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
