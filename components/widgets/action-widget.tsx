import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Icons from "lucide-react";

interface ActionItem {
  label: string;
  icon: string;
  path?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost";
  description?: string;
}

interface ActionWidgetProps {
  title: string;
  description?: string;
  actions: ActionItem[];
  layout?: "grid" | "list";
  className?: string;
}

export default function ActionWidget({
  title,
  description,
  actions,
  layout = "grid",
  className,
}: ActionWidgetProps) {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div
          className={
            layout === "grid"
              ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              : "space-y-3"
          }
        >
          {actions.map((action, index) => {
            const buttonContent = (
              <>
                {getIcon(action.icon)}
                <span className="font-medium">{action.label}</span>
                {action.description && (
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                )}
              </>
            );

            const buttonClasses = layout === "grid"
              ? "h-auto py-4 flex-col gap-2"
              : "w-full justify-start gap-3";

            if (action.path) {
              return (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  className={buttonClasses}
                  asChild
                >
                  <Link href={action.path}>{buttonContent}</Link>
                </Button>
              );
            }

            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                className={buttonClasses}
                onClick={action.onClick}
              >
                {buttonContent}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
