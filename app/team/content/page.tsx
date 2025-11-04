"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, Edit } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function TeamContentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.TEAM) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const content = [
    { id: 1, title: "Upper Body Workout Guide", type: "Workout", status: "Published", lastEdited: "2 days ago" },
    { id: 2, title: "Nutrition Tips for Athletes", type: "Article", status: "Draft", lastEdited: "1 hour ago" },
    { id: 3, title: "HIIT Training Program", type: "Program", status: "Under Review", lastEdited: "Yesterday" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>My Content</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage your content items
          </Text>
        </div>
        <Button><Icon icon={Plus} size="sm" className="mr-2" aria-hidden={true} />New Content</Button>
      </div>

      <div className="grid gap-4">
        {content.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon icon={FolderOpen} size="lg" className="text-primary" aria-hidden={true} />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">Last edited: {item.lastEdited}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.type}</Badge>
                  <Badge variant={item.status === "Published" ? "default" : "secondary"}>{item.status}</Badge>
                  <Button variant="outline" size="sm"><Icon icon={Edit} size="sm" className="mr-2" aria-hidden={true} />Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
