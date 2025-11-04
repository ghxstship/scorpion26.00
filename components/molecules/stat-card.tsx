import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms/icon";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

/**
 * StatCard Molecule - Displays a statistic with icon
 * Used for trust indicators, metrics, and key numbers
 */

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  className,
}: StatCardProps) {
  return (
    <div className={cn("flex flex-col items-center", className)} role="listitem">
      <div className={cn(
        "mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-primary/20",
        iconBgColor
      )}>
        <Icon icon={icon} size="sm" className={cn("sm:h-6 sm:w-6", iconColor)} aria-hidden={true} />
      </div>
      <Heading level={3} className="text-xl sm:text-2xl md:text-3xl font-bold">
        {value}
      </Heading>
      <Text variant="body-sm" className="text-xs sm:text-sm text-muted-foreground text-center">
        {label}
      </Text>
    </div>
  );
}
