"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, DollarSign, BarChart3, Plus } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

/**
 * Collaborator Dashboard Page
 * 
 * Dashboard for content collaborators.
 * Authentication is handled by the parent layout.
 */
export default function CollaboratorDashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    // Role check - redirect non-collaborators
    if (user && user.role !== UserRole.COLLABORATOR) {
      router.push("/member/dashboard");
    }
  }, [router, user]);

  if (!user) return null;

  // Additional role check before rendering
  if (user.role !== UserRole.COLLABORATOR) {
    return null;
  }

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Welcome, {user.name}!</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Collaborator Dashboard
        </Text>
      </div>

      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Icon icon={FolderOpen} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Icon icon={DollarSign} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-xs text-green-600">+$320 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Icon icon={BarChart3} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5K</div>
            <p className="text-xs text-green-600">+18% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Icon icon={BarChart3} size="sm" aria-hidden={true} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-green-600">+5% this month</p>
          </CardContent>
        </Card>
      </div>

      <div className={gridClasses.cards['2col']}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/collaborator/submit"><Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />Submit Content</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/collaborator/submissions"><Icon icon={FolderOpen} size="sm" className="mr-2" aria-hidden={true} />View Submissions</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/collaborator/earnings"><Icon icon={DollarSign} size="sm" className="mr-2" aria-hidden={true} />View Earnings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Content approved: &ldquo;Advanced Training Tips&rdquo;</p>
                <p className="text-muted-foreground text-xs">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">New submission under review</p>
                <p className="text-muted-foreground text-xs">1 day ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Payment received: $250</p>
                <p className="text-muted-foreground text-xs">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
