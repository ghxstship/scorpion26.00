"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function AdminRevenuePage() {
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
        <Heading level={1}>Revenue</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Financial overview and revenue analytics
        </Text>
      </div>

      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$147,234</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingUp} size="xs" aria-hidden={true} />
              +18.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Icon icon={CreditCard} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,567</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingUp} size="xs" aria-hidden={true} />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.50</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingDown} size="xs" aria-hidden={true} />
              -2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Icon icon={CreditCard} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,645</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <Icon icon={TrendingUp} size="xs" aria-hidden={true} />
              +23.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Revenue by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Subscriptions</p>
                <p className="text-sm text-muted-foreground">Monthly recurring revenue</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">$98,450</p>
                <p className="text-xs text-green-600">+15.3%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">One-time Purchases</p>
                <p className="text-sm text-muted-foreground">Programs and products</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">$34,234</p>
                <p className="text-xs text-green-600">+22.7%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Coaching Services</p>
                <p className="text-sm text-muted-foreground">Private training sessions</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">$14,550</p>
                <p className="text-xs text-green-600">+8.9%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
