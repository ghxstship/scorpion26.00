"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Play } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function MemberProgramsPage() {
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

  const programs = [
    { id: 1, name: "Strength Builder", progress: 65, workouts: 24, completed: 15 },
    { id: 2, name: "Fat Loss Accelerator", progress: 30, workouts: 18, completed: 5 },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>My Programs</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Your active training programs
        </Text>
      </div>

      <div className={gridClasses.cards['2col']}>
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Icon icon={FolderOpen} size="lg" className="text-primary" aria-hidden={true} />
                <span className="text-sm text-muted-foreground">{program.progress}% Complete</span>
              </div>
              <CardTitle className="mt-4">{program.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${program.progress}%` }} />
                </div>
                <p className="text-sm text-muted-foreground">{program.completed} of {program.workouts} workouts completed</p>
                <Button className="w-full"><Icon icon={Play} size="sm" className="mr-2" aria-hidden={true} />Continue Program</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
