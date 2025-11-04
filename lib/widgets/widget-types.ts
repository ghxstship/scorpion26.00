// Widget Types and Configurations for Role-Based Dashboards

import { UserRole } from "@/lib/auth/rbac-types";

export interface WidgetConfig {
  id: string;
  title: string;
  description?: string;
  type: "metric" | "chart" | "list" | "action" | "status" | "feed";
  refreshInterval?: number; // milliseconds
  size?: "small" | "medium" | "large" | "full";
  priority?: number; // for ordering
}

export interface MetricWidget extends WidgetConfig {
  type: "metric";
  metrics: {
    label: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "neutral";
  }[];
}

export interface ChartWidget extends WidgetConfig {
  type: "chart";
  chartType: "line" | "bar" | "pie" | "area";
  timeframes?: string[];
  data?: any;
}

export interface ListWidget extends WidgetConfig {
  type: "list";
  items: {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    status?: string;
    action?: string;
  }[];
  maxItems?: number;
}

export interface ActionWidget extends WidgetConfig {
  type: "action";
  actions: {
    label: string;
    icon: string;
    path?: string;
    onClick?: () => void;
  }[];
}

export interface StatusWidget extends WidgetConfig {
  type: "status";
  status: "operational" | "warning" | "error";
  indicators: {
    label: string;
    value: string;
    status?: "success" | "warning" | "error";
  }[];
}

export interface FeedWidget extends WidgetConfig {
  type: "feed";
  items: {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon?: string;
  }[];
}

export type Widget = MetricWidget | ChartWidget | ListWidget | ActionWidget | StatusWidget | FeedWidget;

/**
 * Widget configurations by role
 */
export const widgetsByRole: Record<UserRole, WidgetConfig[]> = {
  [UserRole.ADMIN]: [
    {
      id: "admin-revenue",
      title: "Revenue Overview",
      type: "metric",
      size: "medium",
      refreshInterval: 300000, // 5 minutes
      priority: 1,
    },
    {
      id: "admin-member-growth",
      title: "Member Growth",
      type: "chart",
      size: "large",
      priority: 2,
    },
    {
      id: "admin-active-users",
      title: "Active Users Right Now",
      type: "metric",
      size: "small",
      refreshInterval: 60000, // 1 minute
      priority: 3,
    },
    {
      id: "admin-system-health",
      title: "System Status",
      type: "status",
      size: "medium",
      refreshInterval: 120000, // 2 minutes
      priority: 4,
    },
    {
      id: "admin-support-queue",
      title: "Support Tickets",
      type: "list",
      size: "medium",
      refreshInterval: 180000, // 3 minutes
      priority: 5,
    },
    {
      id: "admin-content-approvals",
      title: "Pending Approvals",
      type: "list",
      size: "medium",
      priority: 6,
    },
    {
      id: "admin-top-programs",
      title: "Best Performing Programs",
      type: "chart",
      size: "large",
      priority: 7,
    },
    {
      id: "admin-churn-risk",
      title: "At-Risk Members",
      type: "list",
      size: "medium",
      priority: 8,
    },
  ],

  [UserRole.TEAM]: [
    {
      id: "team-tasks",
      title: "My Tasks",
      type: "list",
      size: "medium",
      priority: 1,
    },
    {
      id: "team-support-tickets",
      title: "My Ticket Queue",
      type: "list",
      size: "medium",
      refreshInterval: 180000,
      priority: 2,
    },
    {
      id: "team-content-calendar",
      title: "Publishing Schedule",
      type: "list",
      size: "large",
      priority: 3,
    },
    {
      id: "team-member-activity",
      title: "Recent Member Activity",
      type: "feed",
      size: "medium",
      priority: 4,
    },
    {
      id: "team-collaboration",
      title: "Team Collaboration",
      type: "feed",
      size: "medium",
      priority: 5,
    },
  ],

  [UserRole.COLLABORATOR]: [
    {
      id: "collab-submission-status",
      title: "My Content Status",
      type: "list",
      size: "large",
      priority: 1,
    },
    {
      id: "collab-performance",
      title: "My Content Analytics",
      type: "chart",
      size: "large",
      priority: 2,
    },
    {
      id: "collab-earnings",
      title: "Earnings Dashboard",
      type: "metric",
      size: "medium",
      priority: 3,
    },
    {
      id: "collab-opportunities",
      title: "New Collaboration Opportunities",
      type: "list",
      size: "medium",
      priority: 4,
    },
    {
      id: "collab-messages",
      title: "Messages",
      type: "list",
      size: "medium",
      priority: 5,
    },
  ],

  [UserRole.MEMBER]: [
    {
      id: "member-todays-workout",
      title: "Today's Recommended Workout",
      type: "action",
      size: "large",
      priority: 1,
    },
    {
      id: "member-progress-streak",
      title: "Workout Streak",
      type: "metric",
      size: "medium",
      priority: 2,
    },
    {
      id: "member-upcoming-schedule",
      title: "My Schedule",
      type: "list",
      size: "medium",
      priority: 3,
    },
    {
      id: "member-community-feed",
      title: "Community Activity",
      type: "feed",
      size: "large",
      priority: 4,
    },
    {
      id: "member-achievements",
      title: "Latest Achievements",
      type: "list",
      size: "medium",
      priority: 5,
    },
    {
      id: "member-weekly-summary",
      title: "This Week Summary",
      type: "metric",
      size: "medium",
      priority: 6,
    },
    {
      id: "member-nutrition",
      title: "Today's Nutrition",
      type: "metric",
      size: "medium",
      priority: 7,
    },
    {
      id: "member-leaderboard",
      title: "Challenge Rankings",
      type: "list",
      size: "medium",
      priority: 8,
    },
  ],

  [UserRole.GUEST]: [
    {
      id: "guest-trial-countdown",
      title: "Trial Status",
      type: "status",
      size: "full",
      priority: 1,
    },
    {
      id: "guest-trial-workouts",
      title: "Your Trial Workouts",
      type: "list",
      size: "large",
      priority: 2,
    },
    {
      id: "guest-upgrade-comparison",
      title: "Member Benefits",
      type: "action",
      size: "large",
      priority: 3,
    },
    {
      id: "guest-progress",
      title: "Trial Progress",
      type: "metric",
      size: "medium",
      priority: 4,
    },
    {
      id: "guest-success-stories",
      title: "Member Transformations",
      type: "feed",
      size: "large",
      priority: 5,
    },
    {
      id: "guest-features-locked",
      title: "Unlock Full Access",
      type: "action",
      size: "medium",
      priority: 6,
    },
  ],
};

/**
 * Get widgets for a specific role
 */
export function getWidgetsForRole(role: UserRole): WidgetConfig[] {
  return widgetsByRole[role] || widgetsByRole[UserRole.GUEST];
}

/**
 * Get widget by ID
 */
export function getWidgetById(widgetId: string, role: UserRole): WidgetConfig | undefined {
  const widgets = getWidgetsForRole(role);
  return widgets.find(w => w.id === widgetId);
}
