import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Database, 
  DollarSign, 
  Settings, 
  Shield, 
  Users, 
  AlertTriangle,
  Activity,
  TrendingUp,
  UserPlus,
  CreditCard
} from "lucide-react";
import type { DemoUser } from "@/lib/auth/demo-auth";
import Link from "next/link";
import MetricWidget from "@/components/widgets/metric-widget";
import StatusWidget from "@/components/widgets/status-widget";
import ListWidget from "@/components/widgets/list-widget";
import ActionWidget from "@/components/widgets/action-widget";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

interface AdminDashboardProps {
  user: DemoUser;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Admin Status */}
      <Card className="border-red-500/50 bg-gradient-to-r from-red-500/5 to-red-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Shield} size="md" className="text-red-600" aria-hidden={true} />
            Administrator Dashboard
          </CardTitle>
          <CardDescription>
            Full system access and control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Text variant="body-sm" className="font-medium">System Administrator</Text>
              <Text variant="caption" className="text-muted-foreground">
                Manage users, roles, billing, and system configuration
              </Text>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatusWidget
          title="System Health"
          overallStatus="operational"
          indicators={[
            { label: "Status", value: "Operational", status: "success" },
            { label: "Uptime", value: "99.9%" },
            { label: "Load", value: "Normal", status: "success" },
          ]}
        />

        <MetricWidget
          title="Users"
          metrics={[
            { 
              label: "Total Users", 
              value: "1,456",
              icon: <Icon icon={Users} size="sm" className="text-muted-foreground" aria-hidden={true} />
            },
            { 
              label: "Active Today", 
              value: "342",
              change: "+8%",
              trend: "up",
              icon: <Icon icon={UserPlus} size="sm" className="text-muted-foreground" aria-hidden={true} />
            },
          ]}
        />

        <MetricWidget
          title="Revenue"
          metrics={[
            { 
              label: "This Month", 
              value: "$24.5K",
              icon: <Icon icon={DollarSign} size="sm" className="text-muted-foreground" aria-hidden={true} />
            },
            { 
              label: "Growth", 
              value: "+12%",
              trend: "up",
              icon: <Icon icon={TrendingUp} size="sm" className="text-muted-foreground" aria-hidden={true} />
            },
          ]}
        />

        <MetricWidget
          title="Alerts"
          metrics={[
            { 
              label: "Critical", 
              value: "0",
              icon: <Icon icon={AlertTriangle} size="sm" className="text-green-600" aria-hidden={true} />
            },
            { 
              label: "Warnings", 
              value: "3",
              icon: <Icon icon={AlertTriangle} size="sm" className="text-yellow-600" aria-hidden={true} />
            },
          ]}
        />
      </div>

      {/* Admin Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/users">
                <Icon icon={Users} size="sm" className="mr-2" aria-hidden={true} />
                Manage Users
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/roles">
                <Icon icon={Shield} size="sm" className="mr-2" aria-hidden={true} />
                Role Management
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon icon={Users} size="sm" className="mr-2" aria-hidden={true} />
              Bulk Operations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Platform settings and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Icon icon={Settings} size="sm" className="mr-2" aria-hidden={true} />
              System Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon icon={Database} size="sm" className="mr-2" aria-hidden={true} />
              Database Management
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon icon={DollarSign} size="sm" className="mr-2" aria-hidden={true} />
              Billing Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Admin Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Activity} size="md" aria-hidden={true} />
            Recent System Activity
          </CardTitle>
          <CardDescription>Latest administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Icon icon={Users} size="md" className="text-blue-600 dark:text-blue-400" aria-hidden={true} />
              </div>
              <div className="flex-1">
                <Text variant="body-sm" className="font-semibold">User role updated</Text>
                <Text variant="caption" className="text-muted-foreground">Changed user@example.com from Member to Team • 15 minutes ago</Text>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Icon icon={Settings} size="md" className="text-green-600 dark:text-green-400" aria-hidden={true} />
              </div>
              <div className="flex-1">
                <Text variant="body-sm" className="font-semibold">System configuration changed</Text>
                <Text variant="caption" className="text-muted-foreground">Updated email notification settings • 1 hour ago</Text>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Icon icon={AlertTriangle} size="md" className="text-yellow-600 dark:text-yellow-400" aria-hidden={true} />
              </div>
              <div className="flex-1">
                <Text variant="body-sm" className="font-semibold">Security alert resolved</Text>
                <Text variant="caption" className="text-muted-foreground">Failed login attempts blocked • 2 hours ago</Text>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={BarChart3} size="md" aria-hidden={true} />
            Platform Analytics
          </CardTitle>
          <CardDescription>Comprehensive platform metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border">
              <Text variant="body-sm" className="text-muted-foreground mb-1">Total Revenue</Text>
              <Text variant="body-lg" className="text-2xl font-bold">$147.2K</Text>
              <Text variant="caption" className="text-green-600 mt-1">+18% from last month</Text>
            </div>
            <div className="p-4 rounded-lg border">
              <Text variant="body-sm" className="text-muted-foreground mb-1">Active Subscriptions</Text>
              <Text variant="body-lg" className="text-2xl font-bold">892</Text>
              <Text variant="caption" className="text-green-600 mt-1">+5% from last month</Text>
            </div>
            <div className="p-4 rounded-lg border">
              <Text variant="body-sm" className="text-muted-foreground mb-1">Churn Rate</Text>
              <Text variant="body-lg" className="text-2xl font-bold">2.3%</Text>
              <Text variant="caption" className="text-green-600 mt-1">-0.5% improvement</Text>
            </div>
            <div className="p-4 rounded-lg border">
              <Text variant="body-sm" className="text-muted-foreground mb-1">Avg Session Time</Text>
              <Text variant="body-lg" className="text-2xl font-bold">24m</Text>
              <Text variant="caption" className="text-green-600 mt-1">+3m from last month</Text>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
