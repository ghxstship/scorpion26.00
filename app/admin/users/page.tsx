"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission, UserRole, ROLE_INFO } from "@/lib/auth/rbac-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus, Shield, Mail, MoreVertical } from "lucide-react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { spacingClasses } from "@/lib/design-tokens";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission(user.role, Permission.MANAGE_USERS)) {
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

  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: UserRole.MEMBER, status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: UserRole.TEAM, status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: UserRole.COLLABORATOR, status: "Active" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: UserRole.MEMBER, status: "Inactive" },
  ];

  return (
    <div className={spacingClasses.gap.lg}>
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>User Management</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Manage all platform users and their roles
          </Text>
        </div>
        <Button>
          <Icon icon={UserPlus} size="sm" className="mr-2" aria-hidden={true} />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon icon={Users} size="md" aria-hidden={true} />
                <Heading level={4}>All Users</Heading>
              </CardTitle>
              <Text variant="body-sm" className="text-muted-foreground">Total: {mockUsers.length} users</Text>
            </div>
            <div className="relative w-64">
              <Icon icon={Search} size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden={true} />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => {
              const roleInfo = ROLE_INFO[user.role];
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon icon={Mail} size="xs" aria-hidden={true} />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`
                      ${roleInfo.color === 'red' && 'border-red-500 text-red-700 dark:text-red-400'}
                      ${roleInfo.color === 'green' && 'border-green-500 text-green-700 dark:text-green-400'}
                      ${roleInfo.color === 'blue' && 'border-blue-500 text-blue-700 dark:text-blue-400'}
                      ${roleInfo.color === 'purple' && 'border-purple-500 text-purple-700 dark:text-purple-400'}
                    `}>
                      <Icon icon={Shield} size="xs" className="mr-1" aria-hidden={true} />
                      {roleInfo.label}
                    </Badge>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icon icon={MoreVertical} size="sm" aria-hidden={true} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem>View Activity</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
