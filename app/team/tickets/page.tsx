"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function TeamTicketsPage() {
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

  const tickets = [
    { id: 1, subject: "Cannot access workout videos", user: "john@example.com", priority: "High", status: "Open" },
    { id: 2, subject: "Billing question", user: "jane@example.com", priority: "Medium", status: "In Progress" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Support Tickets</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage member support requests
        </Text>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon icon={Headphones} size="lg" className="text-primary" aria-hidden={true} />
                  <div>
                    <h3 className="font-semibold">{ticket.subject}</h3>
                    <p className="text-sm text-muted-foreground">From: {ticket.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={ticket.priority === "High" ? "destructive" : "default"}>{ticket.priority}</Badge>
                  <Badge variant="outline">{ticket.status}</Badge>
                  <Button size="sm">Respond</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
