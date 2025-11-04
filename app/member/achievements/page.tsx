"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Star } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function MemberAchievementsPage() {
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

  const achievements = [
    { id: 1, name: "First Workout", description: "Complete your first workout", unlocked: true, icon: Trophy },
    { id: 2, name: "Week Warrior", description: "Complete 7 workouts in a week", unlocked: true, icon: Award },
    { id: 3, name: "Century Club", description: "Complete 100 workouts", unlocked: false, icon: Star },
    { id: 4, name: "Early Bird", description: "Complete a workout before 7 AM", unlocked: true, icon: Trophy },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Achievements</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Your earned badges and milestones
        </Text>
      </div>

      <div className={gridClasses.cards['3col']}>
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card key={achievement.id} className={achievement.unlocked ? "" : "opacity-50"}>
              <CardHeader>
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Icon className={`h-8 w-8 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <CardTitle className="mt-4">{achievement.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked && <p className="text-xs text-green-600 mt-2">Unlocked!</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
