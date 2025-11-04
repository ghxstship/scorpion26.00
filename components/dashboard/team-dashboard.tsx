import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Mail, MessageSquare, Users, Zap } from "lucide-react";
import type { DemoUser } from "@/lib/auth/demo-auth";

interface TeamDashboardProps {
  user: DemoUser;
}

export default function TeamDashboard({ user }: TeamDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Team Member Status */}
      <Card className="border-green-500/50 bg-gradient-to-r from-green-500/5 to-green-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Team Member Dashboard
          </CardTitle>
          <CardDescription>
            {user.department && `${user.department} Department`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Internal Staff Access</p>
              <p className="text-xs text-muted-foreground">
                Manage content, view analytics, and support members
              </p>
            </div>
            <Button variant="outline" size="sm">Team Settings</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Platform Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>Platform metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Members</span>
              <span className="text-2xl font-bold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New This Week</span>
              <span className="text-2xl font-bold text-green-600">+45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Engagement Rate</span>
              <span className="text-2xl font-bold">87%</span>
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content
            </CardTitle>
            <CardDescription>Manage platform content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Edit Programs
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Manage Media
            </Button>
          </CardContent>
        </Card>

        {/* Member Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Support Queue
            </CardTitle>
            <CardDescription>Pending inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Open Tickets</span>
              <span className="text-2xl font-bold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Response Time</span>
              <span className="text-sm font-bold">2.5h</span>
            </div>
            <Button className="w-full" size="sm">View All Tickets</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Member Activity
          </CardTitle>
          <CardDescription>Latest platform updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">New member registration</p>
                <p className="text-xs text-muted-foreground">John Doe joined Premium tier • 10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Community post flagged</p>
                <p className="text-xs text-muted-foreground">Requires moderation review • 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Content published</p>
                <p className="text-xs text-muted-foreground">New workout program added • 3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Team Tools</CardTitle>
          <CardDescription>Quick access to team features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <span>Moderate</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <Mail className="h-6 w-6" />
              <span>Support</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Content</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
