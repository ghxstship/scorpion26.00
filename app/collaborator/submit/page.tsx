"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function CollaboratorSubmitPage() {
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

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Submit Content</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Share your expertise with our community
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Submission Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter content title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <select id="type" className="w-full rounded-md border border-input bg-background px-3 py-2">
              <option>Article</option>
              <option>Video</option>
              <option>Guide</option>
              <option>Workout</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your content" rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input id="file" type="file" />
          </div>
          <Button className="w-full">
            <Icon icon={Upload} size="sm" className="mr-2" aria-hidden={true} />
            Submit Content
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
