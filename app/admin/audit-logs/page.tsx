"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Shield, User, Settings, Database, AlertTriangle } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission(user.role, Permission.ACCESS_ADMIN_PANEL)) {
      router.push("/member/dashboard");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mockLogs = [
    { id: 1, action: "User role updated", user: "admin@example.com", target: "john@example.com", type: "user", time: "5 minutes ago", severity: "info" },
    { id: 2, action: "System settings changed", user: "admin@example.com", target: "Email notifications", type: "settings", time: "1 hour ago", severity: "info" },
    { id: 3, action: "Failed login attempt", user: "unknown@example.com", target: "Login system", type: "security", time: "2 hours ago", severity: "warning" },
    { id: 4, action: "Database backup completed", user: "system", target: "Database", type: "system", time: "3 hours ago", severity: "success" },
    { id: 5, action: "User created", user: "admin@example.com", target: "jane@example.com", type: "user", time: "5 hours ago", severity: "info" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="h-4 w-4" />;
      case "settings": return <Settings className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      case "system": return <Database className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "border-green-500 text-green-700 dark:text-green-400";
      case "warning": return "border-yellow-500 text-yellow-700 dark:text-yellow-400";
      case "error": return "border-red-500 text-red-700 dark:text-red-400";
      default: return "border-blue-500 text-blue-700 dark:text-blue-400";
    }
  };

  return (
    <div className={spacingClasses.gap.lg}>
      <div>
        <Heading level={1}>Activity Logs</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          System-wide activity and audit trail
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={History} size="md" aria-hidden={true} />
            Recent Activity
          </CardTitle>
          <CardDescription>All administrative and system actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  log.type === 'security' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  log.type === 'user' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  log.type === 'settings' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{log.action}</p>
                    <Badge variant="outline" className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By: <span className="font-medium">{log.user}</span>
                    {log.target && <> • Target: <span className="font-medium">{log.target}</span></>}
                  </p>
                  <p className="text-xs text-muted-foreground">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
