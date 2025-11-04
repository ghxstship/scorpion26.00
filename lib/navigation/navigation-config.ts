// Navigation Configuration for Role-Based Dashboards

import { UserRole } from "@/lib/auth/rbac-types";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  highlight?: boolean;
  description?: string;
}

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
}

export type NavigationConfig = Record<UserRole, NavigationSection[]>;

/**
 * Role-specific navigation menus
 */
export const navigationByRole: NavigationConfig = {
  [UserRole.ADMIN]: [
    {
      section: "Dashboard",
      items: [
        { label: "Overview", icon: "LayoutDashboard", path: "/admin/dashboard" },
        { label: "Analytics", icon: "BarChart3", path: "/admin/analytics" },
      ],
    },
    {
      section: "User Management",
      items: [
        { label: "All Users", icon: "Users", path: "/admin/users" },
        { label: "Roles & Permissions", icon: "Shield", path: "/admin/roles" },
        { label: "Activity Logs", icon: "History", path: "/admin/audit-logs" },
      ],
    },
    {
      section: "Content",
      items: [
        { label: "Programs", icon: "FolderOpen", path: "/admin/programs" },
        { label: "Workouts", icon: "Dumbbell", path: "/admin/workouts" },
        { label: "Blog Posts", icon: "FileText", path: "/admin/blog" },
        { label: "Media Library", icon: "Image", path: "/admin/media" },
      ],
    },
    {
      section: "Business",
      items: [
        { label: "Revenue", icon: "DollarSign", path: "/admin/revenue" },
        { label: "Subscriptions", icon: "CreditCard", path: "/admin/subscriptions" },
        { label: "Support Tickets", icon: "Headphones", path: "/admin/support" },
      ],
    },
    {
      section: "Settings",
      items: [
        { label: "System Settings", icon: "Settings", path: "/admin/settings" },
        { label: "Integrations", icon: "Plug", path: "/admin/integrations" },
        { label: "Email Templates", icon: "Mail", path: "/admin/email-templates" },
      ],
    },
  ],

  [UserRole.TEAM]: [
    {
      section: "Dashboard",
      items: [
        { label: "Overview", icon: "LayoutDashboard", path: "/team/dashboard" },
        { label: "My Tasks", icon: "CheckSquare", path: "/team/tasks" },
      ],
    },
    {
      section: "Content Management",
      items: [
        { label: "My Content", icon: "FolderOpen", path: "/team/content" },
        { label: "Content Calendar", icon: "Calendar", path: "/team/calendar" },
        { label: "Media Uploads", icon: "Image", path: "/team/media" },
      ],
    },
    {
      section: "Member Support",
      items: [
        { label: "Support Tickets", icon: "Headphones", path: "/team/tickets" },
        { label: "Member Queries", icon: "MessageSquare", path: "/team/messages" },
      ],
    },
    {
      section: "Reports",
      items: [
        { label: "My Analytics", icon: "BarChart3", path: "/team/analytics" },
      ],
    },
  ],

  [UserRole.COLLABORATOR]: [
    {
      section: "Dashboard",
      items: [
        { label: "Overview", icon: "LayoutDashboard", path: "/collaborator/dashboard" },
      ],
    },
    {
      section: "Content",
      items: [
        { label: "My Submissions", icon: "FolderOpen", path: "/collaborator/submissions" },
        { label: "Submit New", icon: "Plus", path: "/collaborator/submit" },
        { label: "My Media", icon: "Image", path: "/collaborator/media" },
      ],
    },
    {
      section: "Performance",
      items: [
        { label: "Analytics", icon: "BarChart3", path: "/collaborator/analytics" },
        { label: "Earnings", icon: "DollarSign", path: "/collaborator/earnings" },
      ],
    },
    {
      section: "Communication",
      items: [
        { label: "Messages", icon: "MessageSquare", path: "/collaborator/messages" },
      ],
    },
  ],

  [UserRole.MEMBER]: [
    {
      section: "Dashboard",
      items: [
        { label: "Home", icon: "Home", path: "/member/dashboard" },
      ],
    },
    {
      section: "Training",
      items: [
        { label: "My Programs", icon: "FolderOpen", path: "/member/programs" },
        { label: "Workouts", icon: "Dumbbell", path: "/member/workouts" },
        { label: "Schedule", icon: "Calendar", path: "/member/schedule" },
      ],
    },
    {
      section: "Progress",
      items: [
        { label: "My Progress", icon: "TrendingUp", path: "/member/progress" },
        { label: "Log Workout", icon: "Plus", path: "/member/log" },
        { label: "Achievements", icon: "Trophy", path: "/member/achievements" },
      ],
    },
    {
      section: "Community",
      items: [
        { label: "Feed", icon: "Users", path: "/member/community" },
        { label: "Challenges", icon: "Flag", path: "/member/challenges" },
        { label: "Leaderboard", icon: "Star", path: "/member/leaderboard" },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "Profile", icon: "User", path: "/member/profile" },
        { label: "Subscription", icon: "CreditCard", path: "/member/subscription" },
      ],
    },
  ],

  [UserRole.GUEST]: [
    {
      section: "Trial",
      items: [
        { label: "Dashboard", icon: "Home", path: "/guest/dashboard" },
        { label: "Trial Workouts", icon: "Dumbbell", path: "/guest/workouts" },
      ],
    },
    {
      section: "Upgrade",
      items: [
        { 
          label: "View Plans", 
          icon: "Star", 
          path: "/guest/plans", 
          highlight: true,
          description: "Unlock full access"
        },
      ],
    },
  ],
};

/**
 * Get navigation items for a specific role
 */
export function getNavigationForRole(role: UserRole): NavigationSection[] {
  return navigationByRole[role] || navigationByRole[UserRole.GUEST];
}

/**
 * Check if a path is accessible for a role
 */
export function isPathAccessible(role: UserRole, path: string): boolean {
  const navigation = getNavigationForRole(role);
  return navigation.some(section =>
    section.items.some(item => path.startsWith(item.path))
  );
}

/**
 * Get breadcrumb trail for current path
 */
export function getBreadcrumbs(role: UserRole, currentPath: string): { label: string; path: string }[] {
  const breadcrumbs: { label: string; path: string }[] = [
    { label: "Dashboard", path: `/${role}/dashboard` },
  ];

  const navigation = getNavigationForRole(role);
  for (const section of navigation) {
    for (const item of section.items) {
      if (currentPath.startsWith(item.path)) {
        breadcrumbs.push({ label: item.label, path: item.path });
        break;
      }
    }
  }

  return breadcrumbs;
}
