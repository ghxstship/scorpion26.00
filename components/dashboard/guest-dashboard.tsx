import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Lock, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { responsiveSpacing, responsiveGrid, responsiveCard } from "@/lib/responsive-utils";

export default function GuestDashboard() {
  return (
    <div className={responsiveSpacing.gap.lg}>
      {/* Trial Status Banner */}
      <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Trial Access Active
          </CardTitle>
          <CardDescription>
            You have limited access. Upgrade to unlock all features!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Trial expires in 14 days</p>
              <p className="text-xs text-muted-foreground">
                Get unlimited access to all programs and content
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto min-h-[44px]">
              <Link href="/join">Upgrade Now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Features */}
      <Card>
        <CardHeader>
          <CardTitle>Available Trial Features</CardTitle>
          <CardDescription>What you can access with your trial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={responsiveGrid.cols[2]}>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Basic Workouts</p>
                <p className="text-xs text-muted-foreground">
                  Access to starter workout programs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Community Access</p>
                <p className="text-xs text-muted-foreground">
                  View community posts and discussions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locked Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Unlock with Membership
          </CardTitle>
          <CardDescription>Premium features available after upgrade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-semibold text-sm">Premium Programs</p>
                <p className="text-xs text-muted-foreground">
                  Advanced training programs and custom workouts
                </p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-semibold text-sm">Progress Analytics</p>
                <p className="text-xs text-muted-foreground">
                  Detailed tracking and performance insights
                </p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-semibold text-sm">Member Discounts</p>
                <p className="text-xs text-muted-foreground">
                  Exclusive pricing on shop products
                </p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
