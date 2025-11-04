"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Headphones, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function AdminSupportPage() {
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

  const mockTickets = [
    { id: 1, subject: "Cannot access workout videos", user: "john@example.com", priority: "High", status: "Open", time: "5 min ago" },
    { id: 2, subject: "Billing question about subscription", user: "jane@example.com", priority: "Medium", status: "In Progress", time: "1 hour ago" },
    { id: 3, subject: "Feature request: Dark mode", user: "bob@example.com", priority: "Low", status: "Open", time: "3 hours ago" },
    { id: 4, subject: "Account login issues", user: "alice@example.com", priority: "High", status: "Resolved", time: "5 hours ago" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "border-red-500 text-red-700 dark:text-red-400";
      case "Medium": return "border-yellow-500 text-yellow-700 dark:text-yellow-400";
      case "Low": return "border-green-500 text-green-700 dark:text-green-400";
      default: return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "border-blue-500 text-blue-700 dark:text-blue-400";
      case "In Progress": return "border-yellow-500 text-yellow-700 dark:text-yellow-400";
      case "Resolved": return "border-green-500 text-green-700 dark:text-green-400";
      default: return "";
    }
  };

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Support Tickets</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage customer support requests
        </Text>
      </div>

      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Icon icon={Clock} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Being handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <Icon icon={CheckCircle} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-green-600 mt-1">
              Great work!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Icon icon={Clock} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-green-600 mt-1">
              -15 min improvement
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Headphones} size="md" aria-hidden={true} />
            Support Tickets
          </CardTitle>
          <CardDescription>All customer support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Icon icon={Headphones} size="lg" className="text-primary" aria-hidden={true} />
                  <div>
                    <h4 className="font-semibold mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      From: {ticket.user} • {ticket.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
