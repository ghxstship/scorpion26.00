"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plug, Check, X } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function AdminIntegrationsPage() {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mockIntegrations = [
    { id: 1, name: "Stripe", description: "Payment processing", status: "Connected", category: "Payments" },
    { id: 2, name: "SendGrid", description: "Email delivery service", status: "Connected", category: "Email" },
    { id: 3, name: "Google Analytics", description: "Website analytics", status: "Disconnected", category: "Analytics" },
    { id: 4, name: "Zapier", description: "Workflow automation", status: "Connected", category: "Automation" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Integrations</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage third-party integrations and APIs
        </Text>
      </div>

      <div className={gridClasses.cards['3col']}>
        {mockIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Icon icon={Plug} size="lg" className="text-primary" aria-hidden={true} />
                <Badge variant={integration.status === "Connected" ? "default" : "secondary"}>
                  {integration.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-3">{integration.category}</Badge>
              <div className="flex gap-2">
                {integration.status === "Connected" ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">Configure</Button>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full">Connect</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
