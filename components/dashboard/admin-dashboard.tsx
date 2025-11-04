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
            <Shield className="h-5 w-5 text-red-600" />
            Administrator Dashboard
          </CardTitle>
          <CardDescription>
            Full system access and control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">System Administrator</p>
              <p className="text-xs text-muted-foreground">
                Manage users, roles, billing, and system configuration
              </p>
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
              icon: <Users className="h-4 w-4 text-muted-foreground" />
            },
            { 
              label: "Active Today", 
              value: "342",
              change: "+8%",
              trend: "up",
              icon: <UserPlus className="h-4 w-4 text-muted-foreground" />
            },
          ]}
        />

        <MetricWidget
          title="Revenue"
          metrics={[
            { 
              label: "This Month", 
              value: "$24.5K",
              icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
            },
            { 
              label: "Growth", 
              value: "+12%",
              trend: "up",
              icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
            },
          ]}
        />

        <MetricWidget
          title="Alerts"
          metrics={[
            { 
              label: "Critical", 
              value: "0",
              icon: <AlertTriangle className="h-4 w-4 text-green-600" />
            },
            { 
              label: "Warnings", 
              value: "3",
              icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />
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
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/roles">
                <Shield className="mr-2 h-4 w-4" />
                Role Management
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
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
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Database Management
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Billing Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Admin Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent System Activity
          </CardTitle>
          <CardDescription>Latest administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">User role updated</p>
                <p className="text-xs text-muted-foreground">Changed user@example.com from Member to Team • 15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">System configuration changed</p>
                <p className="text-xs text-muted-foreground">Updated email notification settings • 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Security alert resolved</p>
                <p className="text-xs text-muted-foreground">Failed login attempts blocked • 2 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>Comprehensive platform metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">$147.2K</p>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
              <p className="text-2xl font-bold">892</p>
              <p className="text-xs text-green-600 mt-1">+5% from last month</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Churn Rate</p>
              <p className="text-2xl font-bold">2.3%</p>
              <p className="text-xs text-green-600 mt-1">-0.5% improvement</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Avg Session Time</p>
              <p className="text-2xl font-bold">24m</p>
              <p className="text-xs text-green-600 mt-1">+3m from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
