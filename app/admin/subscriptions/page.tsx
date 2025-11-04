"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function AdminSubscriptionsPage() {
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

  const mockSubscriptions = [
    { id: 1, user: "john@example.com", plan: "Pro", status: "Active", amount: "$49.99", nextBilling: "2024-02-15" },
    { id: 2, user: "jane@example.com", plan: "Elite", status: "Active", amount: "$99.99", nextBilling: "2024-02-18" },
    { id: 3, user: "bob@example.com", plan: "Starter", status: "Cancelled", amount: "$19.99", nextBilling: "-" },
    { id: 4, user: "alice@example.com", plan: "Advanced", status: "Active", amount: "$34.99", nextBilling: "2024-02-20" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Subscriptions</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage user subscriptions and billing
        </Text>
      </div>

      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Icon icon={Users} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingUp} size="xs" aria-hidden={true} />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <Icon icon={CreditCard} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingUp} size="xs" aria-hidden={true} />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3%</div>
            <p className="text-xs text-green-600 mt-1">
              -0.5% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
            <Icon icon={CreditCard} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingUp} size="xs" aria-hidden={true} />
              +8.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest subscription activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{sub.user}</p>
                  <p className="text-sm text-muted-foreground">{sub.plan} Plan • {sub.amount}/month</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Next Billing</p>
                    <p className="text-sm font-medium">{sub.nextBilling}</p>
                  </div>
                  <Badge variant={sub.status === "Active" ? "default" : "secondary"}>
                    {sub.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
