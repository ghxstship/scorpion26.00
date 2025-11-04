"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function AdminAnalyticsPage() {
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

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Analytics</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Comprehensive platform analytics and insights
        </Text>
      </div>

      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icon icon={DollarSign} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <Text variant="body-lg" className="text-2xl font-bold">$147,234</Text>
            <Text variant="body-xs" className="text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last month
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Icon icon={Users} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <Text variant="body-lg" className="text-2xl font-bold">1,456</Text>
            <Text variant="body-xs" className="text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <Icon icon={TrendingUp} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <Text variant="body-lg" className="text-2xl font-bold">23.4%</Text>
            <Text variant="body-xs" className="text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last month
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Icon icon={Activity} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <Text variant="body-lg" className="text-2xl font-bold">89.2%</Text>
            <Text variant="body-xs" className="text-muted-foreground">
              <span className="text-green-600">+5.3%</span> from last month
            </Text>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={BarChart3} size="md" aria-hidden={true} />
            Revenue Trends
          </CardTitle>
          <CardDescription>Monthly revenue performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center border rounded-lg bg-muted/20">
            <Text variant="body-md" className="text-muted-foreground">
              Chart visualization would go here
            </Text>
          </div>
        </CardContent>
      </Card>

      <div className={gridClasses.cards['2col']}>
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-50 flex items-center justify-center border rounded-lg bg-muted/20">
              <Text variant="body-md" className="text-muted-foreground">
                User growth chart
              </Text>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Active subscriptions by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-50 flex items-center justify-center border rounded-lg bg-muted/20">
              <Text variant="body-md" className="text-muted-foreground">
                Subscription chart
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
