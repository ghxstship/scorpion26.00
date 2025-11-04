import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/text";

interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

interface MetricWidgetProps {
  title: string;
  description?: string;
  metrics: MetricItem[];
  className?: string;
}

export default function MetricWidget({ title, description, metrics, className }: MetricWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {metric.icon}
                <Text variant="body-sm" className="text-muted-foreground">{metric.label}</Text>
              </div>
              <div className="flex items-center gap-2">
                <Text variant="body-lg" className="text-xl font-bold">{metric.value}</Text>
                {metric.change && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      metric.trend === "up" && "text-green-600",
                      metric.trend === "down" && "text-red-600",
                      metric.trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {metric.trend === "up" && <TrendingUp className="h-3 w-3" />}
                    {metric.trend === "down" && <TrendingDown className="h-3 w-3" />}
                    {metric.trend === "neutral" && <Minus className="h-3 w-3" />}
                    {metric.change}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
