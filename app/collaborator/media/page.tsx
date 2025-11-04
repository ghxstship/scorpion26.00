"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, Video } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function CollaboratorMediaPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-montserrat font-bold">My Media</h1>
          <p className="text-muted-foreground">Manage your media library</p>
        </div>
        <Button><Upload className="mr-2 h-4 w-4" />Upload Media</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Icon icon={Upload} size="2xl" className="text-muted-foreground mb-4" aria-hidden={true} />
            <p className="text-sm text-muted-foreground mb-4">Drop files here</p>
            <Button variant="outline">Browse Files</Button>
          </CardContent>
        </Card>

        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="aspect-video bg-muted flex items-center justify-center">
              {i % 2 === 0 ? <Video className="h-12 w-12 text-muted-foreground" /> : <Icon icon={ImageIcon} size="2xl" className="text-muted-foreground" aria-hidden={true} />}
            </div>
            <CardContent className="p-4">
              <p className="font-medium">media-{i}.{i % 2 === 0 ? 'mp4' : 'jpg'}</p>
              <p className="text-xs text-muted-foreground mt-1">Uploaded {i} days ago</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
