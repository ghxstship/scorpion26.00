import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Dumbbell, Target, TrendingUp, Trophy, Flame, Clock } from "lucide-react";
import type { DemoUser } from "@/lib/auth/demo-auth";
import MetricWidget from "@/components/widgets/metric-widget";
import ActionWidget from "@/components/widgets/action-widget";
import ListWidget from "@/components/widgets/list-widget";
import { Text } from "@/components/atoms/text";

interface MemberDashboardProps {
  user: DemoUser;
}

export default function MemberDashboard({ user }: MemberDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Membership Status */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {user.membershipType && user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)} Membership
          </CardTitle>
          <CardDescription>
            Full access to all member features and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Text variant="body-sm" className="font-medium">Active Subscription</Text>
              <Text variant="caption" className="text-muted-foreground">
                Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Text>
            </div>
            <Button variant="outline" size="sm">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Workout Stats */}
      <MetricWidget
        title="Workout Stats"
        description="This month"
        metrics={[
          { 
            label: "Total Workouts", 
            value: "12",
            change: "+3",
            trend: "up",
            icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />
          },
          { 
            label: "Hours Trained", 
            value: "18",
            icon: <Clock className="h-4 w-4 text-muted-foreground" />
          },
          { 
            label: "Current Streak", 
            value: "7 days",
            icon: <Flame className="h-4 w-4 text-orange-500" />
          },
        ]}
      />

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress
          </CardTitle>
          <CardDescription>Your improvements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Text variant="body-sm">Monthly Goal</Text>
              <Text variant="body-sm" className="font-medium">80%</Text>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "80%" }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Text variant="body-sm">Strength Gains</Text>
              <Text variant="body-sm" className="font-medium text-green-600">+15%</Text>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-600" style={{ width: "75%" }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Recent milestones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <Text variant="body-sm" className="font-semibold">30-Day Streak</Text>
              <Text variant="caption" className="text-muted-foreground">Completed</Text>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <Text variant="body-sm" className="font-semibold">First PR</Text>
              <Text variant="caption" className="text-muted-foreground">Completed</Text>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <ActionWidget
        title="Quick Actions"
        description="Get started with your training"
        layout="grid"
        actions={[
          { label: "Book Class", icon: "Calendar", path: "/member/schedule" },
          { label: "Start Workout", icon: "Dumbbell", path: "/member/workouts", variant: "default" },
          { label: "Set Goals", icon: "Target", path: "/member/goals" },
          { label: "View Analytics", icon: "TrendingUp", path: "/member/progress" },
        ]}
        className="md:col-span-2 lg:col-span-3"
      />
    </div>
  );
}
