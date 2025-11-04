"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit, Save } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function MemberProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== UserRole.MEMBER) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!user) return null;

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>My Profile</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage your account
          </Text>
        </div>
        <Button><Icon icon={Edit} size="sm" className="mr-2" aria-hidden={true} />Edit Profile</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input id="weight" type="number" placeholder="150" />
            </div>
          </div>
          <Button className="w-full"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
