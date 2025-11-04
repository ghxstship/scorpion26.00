"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Pencil } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function MemberLogPage() {
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

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Workout Log</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Record your workouts
          </Text>
        </div>
        <Button><Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />Log Workout</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout">Workout Name</Label>
            <Input id="workout" placeholder="Enter workout name" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="45" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned</Label>
              <Input id="calories" type="number" placeholder="350" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea id="notes" className="w-full rounded-md border border-input bg-background px-3 py-2" rows={4} placeholder="How did it go?" />
          </div>
          <Button className="w-full"><Plus className="mr-2 h-4 w-4" />Log Workout</Button>
          <Button variant="outline" size="sm"><Icon icon={Pencil} size="sm" className="mr-2" aria-hidden={true} />Edit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
