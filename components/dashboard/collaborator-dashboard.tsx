import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FolderOpen, MessageSquare, Users } from "lucide-react";
import type { DemoUser } from "@/lib/auth/demo-auth";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";

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
            <Icon icon={Users} size="md" className="text-purple-600" aria-hidden={true} />
            Collaborator Access
          </CardTitle>
          <CardDescription>
            You have been invited to collaborate on specific projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Text variant="body-sm" className="font-medium">{projects.length} Active Projects</Text>
              <Text variant="caption" className="text-muted-foreground">
                View and edit shared project content
              </Text>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={FolderOpen} size="md" aria-hidden={true} />
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
                      <Icon icon={FolderOpen} size="md" className="text-purple-600 dark:text-purple-400" aria-hidden={true} />
                    </div>
                    <div>
                      <Text variant="body-md" className="font-semibold">{project}</Text>
                      <Text variant="body-sm" className="text-muted-foreground">Last updated 2 days ago</Text>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Open</Button>
                </div>
              ))
            ) : (
              <Text variant="body-sm" className="text-muted-foreground text-center py-8">
                No projects assigned yet
              </Text>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={FileText} size="md" aria-hidden={true} />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Icon icon={FileText} size="md" className="text-blue-600 dark:text-blue-400" aria-hidden={true} />
              </div>
              <div className="flex-1">
                <Text variant="body-sm" className="font-semibold">Updated project documentation</Text>
                <Text variant="caption" className="text-muted-foreground">Project Alpha • 2 hours ago</Text>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Icon icon={MessageSquare} size="md" className="text-green-600 dark:text-green-400" aria-hidden={true} />
              </div>
              <div className="flex-1">
                <Text variant="body-sm" className="font-semibold">Added comment on review</Text>
                <Text variant="caption" className="text-muted-foreground">Project Beta • 1 day ago</Text>
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
              <Icon icon={MessageSquare} size="lg" aria-hidden={true} />
              <Text variant="body-sm">Comments</Text>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2" variant="outline">
              <Icon icon={FileText} size="lg" aria-hidden={true} />
              <Text variant="body-sm">Documents</Text>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
