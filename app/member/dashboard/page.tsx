"use client";

import { getCurrentUser } from "@/lib/auth/demo-auth";
import { UserRole } from "@/lib/auth/rbac-types";
import GuestDashboard from "@/components/dashboard/guest-dashboard";
import MemberDashboardComponent from "@/components/dashboard/member-dashboard";
import CollaboratorDashboard from "@/components/dashboard/collaborator-dashboard";
import TeamDashboard from "@/components/dashboard/team-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon } from "@/components/atoms/icon";
import { Calendar } from "lucide-react";

/**
 * Member Dashboard Page
 * 
 * Renders role-specific dashboard content.
 * Authentication and layout are handled by the parent layout.
 */
export default function DashboardPage() {
  // Get current user (guaranteed to exist due to layout authentication)
  const user = getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  // Render role-specific dashboard
  const renderDashboardContent = () => {
    switch (user.role) {
      case UserRole.GUEST:
        return <GuestDashboard />;
      case UserRole.MEMBER:
        return <MemberDashboardComponent user={user} />;
      case UserRole.COLLABORATOR:
        return <CollaboratorDashboard user={user} />;
      case UserRole.TEAM:
        return <TeamDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={user} />;
      default:
        return <GuestDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <Heading level={1} className="text-3xl font-montserrat">Welcome back, {user.name}!</Heading>
        <Text variant="body-md" className="text-muted-foreground mt-1 flex items-center gap-2">
          <Icon icon={Calendar} size="sm" aria-hidden={true} />
          Here&apos;s what&apos;s happening with your account today.
        </Text>
      </div>

      {/* Dashboard Content */}
      {renderDashboardContent()}
    </div>
  );
}
