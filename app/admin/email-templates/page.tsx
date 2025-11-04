"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Edit } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function AdminEmailTemplatesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!hasPermission(user.role, Permission.ACCESS_ADMIN_PANEL)) {
      router.push("/member/dashboard");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const templates = [
    { id: 1, name: "Welcome Email", description: "Sent to new users after registration", lastUpdated: "2024-01-15" },
    { id: 2, name: "Password Reset", description: "Password recovery instructions", lastUpdated: "2024-01-10" },
    { id: 3, name: "Subscription Confirmation", description: "Confirms new subscription", lastUpdated: "2024-01-08" },
    { id: 4, name: "Workout Reminder", description: "Daily workout notification", lastUpdated: "2024-01-05" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Email Templates</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage automated email templates
        </Text>
      </div>
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon icon={Mail} size="lg" className="text-primary" aria-hidden={true} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: {template.lastUpdated}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Icon icon={Edit} size="sm" className="mr-2" aria-hidden={true} />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
