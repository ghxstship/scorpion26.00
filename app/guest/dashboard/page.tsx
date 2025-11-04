"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Dumbbell } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";
import Link from "next/link";

/**
 * Guest Dashboard Page
 * 
 * Dashboard for trial/guest users.
 * Authentication is handled by the parent layout.
 */
export default function GuestDashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    // Role check - redirect non-guests
    if (user && user.role !== UserRole.GUEST) {
      router.push("/member/dashboard");
    }
  }, [router, user]);

  if (!user) return null;

  // Additional role check before rendering
  if (user.role !== UserRole.GUEST) {
    return null;
  }

  return (
    <div className={spacingClasses.gap.lg}>
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Icon icon={Star} size="md" className="text-primary" aria-hidden={true} />Trial Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Welcome to your trial! Explore limited features and upgrade for full access.</p>
          <Button asChild><Link href="/guest/plans">Upgrade Now</Link></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trial Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild><Link href="/guest/workouts"><Icon icon={Dumbbell} size="sm" className="mr-2" aria-hidden={true} />Browse Workouts</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
