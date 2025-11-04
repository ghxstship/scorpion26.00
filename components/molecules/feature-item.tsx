import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

/**
 * FeatureItem Molecule - Feature list item with icon and text
 * Used in feature lists, permission cards, and benefit sections
 */

interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconColor?: string;
  variant?: 'default' | 'success' | 'muted';
  className?: string;
}

const variantStyles = {
  default: {
    container: "bg-background border",
    icon: "text-primary",
    title: "text-foreground",
  },
  success: {
    container: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    title: "text-foreground",
  },
  muted: {
    container: "bg-muted/50 border",
    icon: "text-muted-foreground",
    title: "text-muted-foreground",
  },
};

export function FeatureItem({
  icon,
  title,
  description,
  iconColor,
  variant = 'default',
  className,
}: FeatureItemProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg",
        styles.container,
        className
      )}
    >
      <Icon
        icon={icon}
        size="sm"
        className={cn("mt-0.5 flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5", iconColor || styles.icon)}
        aria-hidden={true}
      />
      <div className="flex-1 min-w-0">
        <Text variant="body-sm" className={cn("font-semibold text-sm", styles.title)}>
          {title}
        </Text>
        {description && (
          <Text variant="caption" className="mt-1 text-xs">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
}
