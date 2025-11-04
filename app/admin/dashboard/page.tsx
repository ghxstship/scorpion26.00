"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import AdminDashboard from "@/components/dashboard/admin-dashboard";

/**
 * Admin Dashboard Page
 * 
 * Renders admin dashboard content with permission check.
 * Authentication is handled by the parent layout.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    // Permission check - redirect non-admins
    if (user && !hasPermission(user.role, Permission.ACCESS_ADMIN_PANEL)) {
      router.push("/member/dashboard");
    }
  }, [router, user]);

  if (!user) return null;

  // Additional permission check before rendering
  if (!hasPermission(user.role, Permission.ACCESS_ADMIN_PANEL)) {
    return null;
  }

  return <AdminDashboard user={user} />;
}
