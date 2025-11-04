import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Lock, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { responsiveSpacing, responsiveGrid, responsiveCard } from "@/lib/responsive-utils";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";

export default function GuestDashboard() {
  return (
    <div className={responsiveSpacing.gap.lg}>
      {/* Trial Status Banner */}
      <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Zap} size="md" className="text-primary" aria-hidden={true} />
            Trial Access Active
          </CardTitle>
          <CardDescription>
            You have limited access. Upgrade to unlock all features!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Text variant="body-sm" className="font-medium">Trial expires in 14 days</Text>
              <Text variant="caption" className="text-muted-foreground">
                Get unlimited access to all programs and content
              </Text>
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
                <Icon icon={Clock} size="md" className="text-green-600 dark:text-green-400" aria-hidden={true} />
              </div>
              <div>
                <Text variant="body-sm" className="font-semibold">Basic Workouts</Text>
                <Text variant="caption" className="text-muted-foreground">
                  Access to starter workout programs
                </Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Icon icon={TrendingUp} size="md" className="text-green-600 dark:text-green-400" aria-hidden={true} />
              </div>
              <div>
                <Text variant="body-sm" className="font-semibold">Community Access</Text>
                <Text variant="caption" className="text-muted-foreground">
                  View community posts and discussions
                </Text>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locked Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Lock} size="md" aria-hidden={true} />
            Unlock with Membership
          </CardTitle>
          <CardDescription>Premium features available after upgrade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Text variant="body-sm" className="font-semibold">Premium Programs</Text>
                <Text variant="caption" className="text-muted-foreground">
                  Advanced training programs and custom workouts
                </Text>
              </div>
              <Icon icon={Lock} size="sm" className="text-muted-foreground" aria-hidden={true} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Text variant="body-sm" className="font-semibold">Progress Analytics</Text>
                <Text variant="caption" className="text-muted-foreground">
                  Detailed tracking and performance insights
                </Text>
              </div>
              <Icon icon={Lock} size="sm" className="text-muted-foreground" aria-hidden={true} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Text variant="body-sm" className="font-semibold">Member Discounts</Text>
                <Text variant="caption" className="text-muted-foreground">
                  Exclusive pricing on shop products
                </Text>
              </div>
              <Icon icon={Lock} size="sm" className="text-muted-foreground" aria-hidden={true} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
