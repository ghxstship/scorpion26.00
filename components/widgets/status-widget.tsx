import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicator {
  label: string;
  value: string;
  status?: "success" | "warning" | "error" | "neutral";
}

interface StatusWidgetProps {
  title: string;
  description?: string;
  overallStatus: "operational" | "warning" | "error";
  indicators: StatusIndicator[];
  className?: string;
}

export default function StatusWidget({
  title,
  description,
  overallStatus,
  indicators,
  className,
}: StatusWidgetProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Operational
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            Warning
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              {getStatusIcon(overallStatus)}
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {getStatusBadge(overallStatus)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {indicator.status && getStatusIcon(indicator.status)}
                <span className="text-sm">{indicator.label}</span>
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  indicator.status === "success" && "text-green-600",
                  indicator.status === "warning" && "text-yellow-600",
                  indicator.status === "error" && "text-red-600",
                  !indicator.status && "text-foreground"
                )}
              >
                {indicator.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
