"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission, UserRole, ROLE_INFO, ROLE_PERMISSIONS } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ChevronLeft, Check } from "lucide-react";
import Link from "next/link";

export default function RoleManagementPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission(user.role, Permission.MANAGE_ROLES)) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    router.push("/admin");
    return null;
  }

  const roles = Object.values(UserRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-500/5">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-heading font-bold">Role Management</h1>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {roles.map((role) => {
            const roleInfo = ROLE_INFO[role];
            const permissions = ROLE_PERMISSIONS[role];

            return (
              <Card key={role}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle>{roleInfo.label}</CardTitle>
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
                        {permissions.length} Permissions
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{roleInfo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Permissions:</h4>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {permissions.slice(0, 9).map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                          >
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs">
                              {permission.replace(/_/g, ' ').toLowerCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                      {permissions.length > 9 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{permissions.length - 9} more permissions
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
