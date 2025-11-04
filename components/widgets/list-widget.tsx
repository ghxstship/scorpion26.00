import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: string;
  statusVariant?: "default" | "secondary" | "destructive" | "outline";
  action?: string;
  actionPath?: string;
}

interface ListWidgetProps {
  title: string;
  description?: string;
  items: ListItem[];
  maxItems?: number;
  viewAllPath?: string;
  emptyMessage?: string;
  className?: string;
}

export default function ListWidget({
  title,
  description,
  items,
  maxItems = 5,
  viewAllPath,
  emptyMessage = "No items to display",
  className,
}: ListWidgetProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {viewAllPath && items.length > maxItems && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={viewAllPath}>
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                {item.icon && (
                  <div className="flex-shrink-0">{item.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                  )}
                </div>
                {item.status && (
                  <Badge variant={item.statusVariant || "secondary"} className="flex-shrink-0">
                    {item.status}
                  </Badge>
                )}
                {item.action && item.actionPath && (
                  <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                    <Link href={item.actionPath}>
                      {item.action}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
