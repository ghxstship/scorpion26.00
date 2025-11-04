import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FolderOpen, MessageSquare, Users } from "lucide-react";
import type { DemoUser } from "@/lib/auth/demo-auth";

interface CollaboratorDashboardProps {
  user: DemoUser;
}

export default function CollaboratorDashboard({ user }: CollaboratorDashboardProps) {
  const projects = user.projects || [];

  return (
    <div className="space-y-6">
      {/* Collaborator Status */}
      <Card className="border-purple-500/50 bg-gradient-to-r from-purple-500/5 to-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Collaborator Access
          </CardTitle>
          <CardDescription>
            You have been invited to collaborate on specific projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{projects.length} Active Projects</p>
              <p className="text-xs text-muted-foreground">
                View and edit shared project content
              </p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Your Projects
          </CardTitle>
          <CardDescription>Projects you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{project}</p>
                      <p className="text-sm text-muted-foreground">Last updated 2 days ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Open</Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No projects assigned yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Updated project documentation</p>
                <p className="text-xs text-muted-foreground">Project Alpha • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Added comment on review</p>
                <p className="text-xs text-muted-foreground">Project Beta • 1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Tools</CardTitle>
          <CardDescription>Work with your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <span>Comments</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Documents</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
