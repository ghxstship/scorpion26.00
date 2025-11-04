"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function MemberSubscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Subscription</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Manage your membership
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Icon icon={CheckCircle} size="md" aria-hidden={true} />Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Pro Plan</p>
                <p className="text-sm text-muted-foreground">Full access to all features</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-semibold">$49.99/month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next billing date</span>
                <span className="font-semibold">Feb 15, 2024</span>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">Change Plan</Button>
              <Button variant="outline" className="flex-1">Cancel Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
