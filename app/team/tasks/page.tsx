"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, CheckCircle } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function TeamTasksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.TEAM) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const tasks = [
    { id: 1, title: "Review new workout content", priority: "High", dueDate: "Today", status: "In Progress" },
    { id: 2, title: "Update blog post images", priority: "Medium", dueDate: "Tomorrow", status: "Todo" },
    { id: 3, title: "Respond to member feedback", priority: "High", dueDate: "Today", status: "Todo" },
    { id: 4, title: "Schedule social media posts", priority: "Low", dueDate: "This week", status: "Todo" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>My Tasks</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage your assigned tasks
        </Text>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {task.status === "In Progress" ? <Icon icon={Clock} size="md" className="text-primary" aria-hidden={true} /> : <Icon icon={CheckSquare} size="md" className="text-primary" aria-hidden={true} />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">{task.status}</Badge>
                  <Button size="sm">Complete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
