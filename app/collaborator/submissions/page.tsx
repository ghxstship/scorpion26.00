"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, Eye } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function CollaboratorSubmissionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.COLLABORATOR) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const submissions = [
    { id: 1, title: "Advanced Training Techniques", type: "Article", status: "Approved", submitted: "5 days ago", views: 2340 },
    { id: 2, title: "Nutrition for Muscle Growth", type: "Guide", status: "Under Review", submitted: "2 days ago", views: 0 },
    { id: 3, title: "HIIT Workout Video", type: "Video", status: "Approved", submitted: "1 week ago", views: 5670 },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>My Submissions</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Track your content submissions
        </Text>
      </div>

      <div className="grid gap-4">
        {submissions.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon icon={FolderOpen} size="lg" className="text-primary" aria-hidden={true} />
                  <div>
                    <h3 className="font-semibold">{sub.title}</h3>
                    <p className="text-sm text-muted-foreground">Submitted: {sub.submitted} • {sub.views} views</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{sub.type}</Badge>
                  <Badge variant={sub.status === "Approved" ? "default" : "secondary"}>{sub.status}</Badge>
                  <Button variant="outline" size="sm"><Icon icon={Eye} size="sm" className="mr-2" aria-hidden={true} />View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
