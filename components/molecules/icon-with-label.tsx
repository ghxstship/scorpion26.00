import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon, IconSize } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

/**
 * IconWithLabel Molecule - Icon paired with text label
 * Common pattern for features, stats, and navigation items
 */

interface IconWithLabelProps {
  icon: LucideIcon;
  label: string;
  iconSize?: IconSize;
  iconColor?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function IconWithLabel({
  icon,
  label,
  iconSize = 'md',
  iconColor,
  orientation = 'horizontal',
  className,
}: IconWithLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        orientation === 'vertical' ? "flex-col gap-2 text-center" : "gap-2",
        className
      )}
    >
      <Icon 
        icon={icon} 
        size={iconSize} 
        className={iconColor}
        aria-hidden={true}
      />
      <Text variant="body-sm" as="span">
        {label}
      </Text>
    </div>
  );
}
