"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, FolderOpen, Headphones, TrendingUp } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";
import Link from "next/link";

/**
 * Team Dashboard Page
 * 
 * Dashboard for team members.
 * Authentication is handled by the parent layout.
 */
export default function TeamDashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    // Role check - redirect non-team members
    if (user && user.role !== UserRole.TEAM) {
      router.push("/member/dashboard");
    }
  }, [router, user]);

  if (!user) return null;

  // Additional role check before rendering
  if (user.role !== UserRole.TEAM) {
    return null;
  }

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Welcome back, {user.name}!</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Team Member Dashboard
        </Text>
      </div>

      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
            <Icon icon={CheckSquare} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <Icon icon={FolderOpen} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">3 pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <Icon icon={Headphones} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 unassigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Icon icon={TrendingUp} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600">+2% this month</p>
          </CardContent>
        </Card>
      </div>

      <div className={gridClasses.cards['2col']}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/team/content"><FolderOpen className="mr-2 h-4 w-4" />Manage Content</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/team/tasks"><CheckSquare className="mr-2 h-4 w-4" />View Tasks</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/team/tickets"><Headphones className="mr-2 h-4 w-4" />Support Tickets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Updated workout program</p>
                <p className="text-muted-foreground text-xs">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Responded to support ticket</p>
                <p className="text-muted-foreground text-xs">4 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Uploaded new media</p>
                <p className="text-muted-foreground text-xs">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
