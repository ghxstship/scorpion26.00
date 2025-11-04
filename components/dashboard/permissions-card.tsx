import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X } from "lucide-react";
import { UserRole, ROLE_PERMISSIONS } from "@/lib/auth/rbac-types";
import { getAvailableActions } from "@/lib/auth/rbac-utils";
import { Icon } from "@/components/atoms/icon";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { FeatureItem } from "@/components/molecules/feature-item";
import { spacingClasses } from "@/lib/design-tokens";

interface PermissionsCardProps {
  role: UserRole;
}

export default function PermissionsCard({ role }: PermissionsCardProps) {
  const actions = getAvailableActions(role);
  const availableActions = actions.filter(a => a.available);
  const unavailableActions = actions.filter(a => !a.available);

  return (
    <Card>
      <CardHeader className={spacingClasses.card}>
        <CardTitle className="flex items-center gap-2">
          <Icon icon={Shield} size="sm" aria-hidden={true} />
          Your Permissions
        </CardTitle>
        <CardDescription>
          Features available to your role
        </CardDescription>
      </CardHeader>
      <CardContent className={spacingClasses.card}>
        <div className={spacingClasses.gap.md}>
          {/* Available Features */}
          {availableActions.length > 0 && (
            <div>
              <Heading level={4} className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Icon icon={Check} size="xs" className="text-green-600" aria-hidden={true} />
                Available Features
              </Heading>
              <div className="space-y-2">
                {availableActions.map((action) => (
                  <FeatureItem
                    key={action.id}
                    icon={Check}
                    title={action.label}
                    description={action.description}
                    variant="success"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unavailable Features */}
          {unavailableActions.length > 0 && (
            <div>
              <Heading level={4} className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Icon icon={X} size="xs" className="text-muted-foreground" aria-hidden={true} />
                Restricted Features
              </Heading>
              <div className="space-y-2">
                {unavailableActions.slice(0, 3).map((action) => (
                  <FeatureItem
                    key={action.id}
                    icon={X}
                    title={action.label}
                    description={action.description}
                    variant="muted"
                  />
                ))}
                {unavailableActions.length > 3 && (
                  <Text variant="caption" className="text-center py-2 block">
                    +{unavailableActions.length - 3} more restricted features
                  </Text>
                )}
              </div>
            </div>
          )}

          {/* Permission Count */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <Text variant="body-sm" className="text-muted-foreground">
                Total Permissions
              </Text>
              <Badge variant="outline">
                {ROLE_PERMISSIONS[role].length}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
