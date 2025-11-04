"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Check } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

export default function GuestPlansPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.GUEST) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const plans = [
    { name: "Starter", price: "$19.99", features: ["10 workouts/month", "Basic tracking", "Community access"] },
    { name: "Pro", price: "$49.99", features: ["Unlimited workouts", "Advanced tracking", "Priority support", "Custom programs"], popular: true },
    { name: "Elite", price: "$99.99", features: ["Everything in Pro", "1-on-1 coaching", "Meal plans", "Early access"] },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Choose Your Plan</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Upgrade to unlock all features
        </Text>
      </div>

      <div className={gridClasses.cards['3col']}>
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
            <CardHeader>
              {plan.popular && <Icon icon={Star} size="sm" className="text-primary mb-2" />}
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold mt-2">{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>Select Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
