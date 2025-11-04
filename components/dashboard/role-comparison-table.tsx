import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { UserRole, ROLE_INFO, Permission } from "@/lib/auth/rbac-types";
import { hasPermission } from "@/lib/auth/rbac-utils";

const KEY_FEATURES = [
  { label: "View Basic Content", permission: Permission.VIEW_BASIC_CONTENT },
  { label: "View Premium Content", permission: Permission.VIEW_PREMIUM_CONTENT },
  { label: "Create Custom Workouts", permission: Permission.CREATE_CUSTOM_WORKOUTS },
  { label: "Post in Community", permission: Permission.POST_COMMUNITY },
  { label: "Moderate Community", permission: Permission.MODERATE_COMMUNITY },
  { label: "Member Discounts", permission: Permission.VIEW_MEMBER_DISCOUNTS },
  { label: "View Analytics", permission: Permission.VIEW_OWN_ANALYTICS },
  { label: "Manage Content", permission: Permission.MANAGE_CONTENT },
  { label: "Manage Users", permission: Permission.MANAGE_USERS },
  { label: "Admin Panel Access", permission: Permission.ACCESS_ADMIN_PANEL },
];

export default function RoleComparisonTable() {
  const roles = [UserRole.GUEST, UserRole.MEMBER, UserRole.COLLABORATOR, UserRole.TEAM, UserRole.ADMIN];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Comparison</CardTitle>
        <CardDescription>Feature access across different roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Feature</th>
                {roles.map((role) => {
                  const roleInfo = ROLE_INFO[role];
                  return (
                    <th key={role} className="text-center p-3">
                      <Badge
                        variant="outline"
                        className={`
                          ${roleInfo.color === 'red' && 'border-red-500 text-red-700 dark:text-red-400'}
                          ${roleInfo.color === 'green' && 'border-green-500 text-green-700 dark:text-green-400'}
                          ${roleInfo.color === 'blue' && 'border-blue-500 text-blue-700 dark:text-blue-400'}
                          ${roleInfo.color === 'purple' && 'border-purple-500 text-purple-700 dark:text-purple-400'}
                          ${roleInfo.color === 'gray' && 'border-gray-500 text-gray-700 dark:text-gray-400'}
                        `}
                      >
                        {roleInfo.label}
                      </Badge>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {KEY_FEATURES.map((feature, index) => (
                <tr key={feature.permission} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="p-3 font-medium">{feature.label}</td>
                  {roles.map((role) => {
                    const hasAccess = hasPermission(role, feature.permission);
                    return (
                      <td key={role} className="text-center p-3">
                        {hasAccess ? (
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
