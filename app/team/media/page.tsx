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

export default function TeamMediaPage() {
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

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Media Uploads</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage your media files
          </Text>
        </div>
        <Button><Icon icon={Upload} size="sm" className="mr-2" aria-hidden={true} />Upload Media</Button>
      </div>

      <div className={gridClasses.cards['3col']}>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Icon icon={Upload} size="2xl" className="text-muted-foreground mb-4" aria-hidden={true} />
            <p className="text-sm text-muted-foreground mb-4">Drop files here or click to upload</p>
            <Button variant="outline">Browse Files</Button>
          </CardContent>
        </Card>

        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="aspect-video bg-muted flex items-center justify-center">
              {i % 2 === 0 ? <Icon icon={Video} size="2xl" className="text-muted-foreground" aria-hidden={true} /> : <Icon icon={ImageIcon} size="2xl" className="text-muted-foreground" aria-hidden={true} />}
            </div>
            <CardContent className="p-4">
              <p className="font-medium truncate">media-{i}.{i % 2 === 0 ? 'mp4' : 'jpg'}</p>
              <p className="text-xs text-muted-foreground mt-1">Uploaded {i} days ago</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
