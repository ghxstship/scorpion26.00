"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Eye, TrendingUp, Users } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function CollaboratorAnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.COLLABORATOR) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your content performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5K</div>
            <p className="text-xs text-green-600 flex items-center gap-1"><Icon icon={TrendingUp} size="xs" aria-hidden={true} />+18% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Icon icon={BarChart3} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-green-600 flex items-center gap-1"><Icon icon={TrendingUp} size="xs" aria-hidden={true} />+5% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-green-600 flex items-center gap-1"><Icon icon={TrendingUp} size="xs" aria-hidden={true} />+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Watch Time</CardTitle>
            <Icon icon={BarChart3} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-green-600">+30s this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
