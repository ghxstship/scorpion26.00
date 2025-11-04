// Role-Based Access Control (RBAC) Types and Permissions

/**
 * User roles in the system
 */
export enum UserRole {
  GUEST = "guest",           // Trial Access - Limited features
  MEMBER = "member",         // Subscription Access - Full member features
  COLLABORATOR = "collaborator", // 3rd Party Invited Access - Specific project access
  TEAM = "team",            // Internal Team Access - Staff features
  ADMIN = "admin"           // Internal All Access - Full system control
}

/**
 * Permission categories - Comprehensive permission system
 */
export enum Permission {
  // Content Access
  VIEW_BASIC_CONTENT = "view_basic_content",
  VIEW_PREMIUM_CONTENT = "view_premium_content",
  VIEW_EXCLUSIVE_CONTENT = "view_exclusive_content",
  
  // Workout & Programs
  ACCESS_TRIAL_PROGRAMS = "access_trial_programs",
  ACCESS_MEMBER_PROGRAMS = "access_member_programs",
  ACCESS_ALL_PROGRAMS = "access_all_programs",
  CREATE_CUSTOM_WORKOUTS = "create_custom_workouts",
  DOWNLOAD_RESOURCES = "download_resources",
  STREAM_VIDEOS = "stream_videos",
  
  // Progress & Tracking
  LOG_WORKOUTS = "log_workouts",
  TRACK_PROGRESS = "track_progress",
  VIEW_PROGRESS_CHARTS = "view_progress_charts",
  EARN_ACHIEVEMENTS = "earn_achievements",
  SET_GOALS = "set_goals",
  
  // Community Features
  VIEW_COMMUNITY = "view_community",
  POST_COMMUNITY = "post_community",
  MODERATE_COMMUNITY = "moderate_community",
  JOIN_CHALLENGES = "join_challenges",
  MESSAGE_MEMBERS = "message_members",
  
  // Shop & Commerce
  VIEW_SHOP = "view_shop",
  PURCHASE_PRODUCTS = "purchase_products",
  VIEW_MEMBER_DISCOUNTS = "view_member_discounts",
  
  // Profile & Data
  EDIT_OWN_PROFILE = "edit_own_profile",
  VIEW_OWN_ANALYTICS = "view_own_analytics",
  EXPORT_OWN_DATA = "export_own_data",
  MANAGE_SUBSCRIPTION = "manage_subscription",
  
  // Collaboration (Collaborator-specific)
  VIEW_SHARED_PROJECTS = "view_shared_projects",
  EDIT_SHARED_PROJECTS = "edit_shared_projects",
  COMMENT_ON_PROJECTS = "comment_on_projects",
  SUBMIT_CONTENT = "submit_content",
  VIEW_SUBMISSION_ANALYTICS = "view_submission_analytics",
  VIEW_EARNINGS = "view_earnings",
  
  // Team Features
  VIEW_TEAM_DASHBOARD = "view_team_dashboard",
  MANAGE_CONTENT = "manage_content",
  PUBLISH_CONTENT = "publish_content",
  VIEW_ANALYTICS = "view_analytics",
  RESPOND_TO_INQUIRIES = "respond_to_inquiries",
  VIEW_MEMBER_PROFILES = "view_member_profiles",
  GRANT_TRIAL_EXTENSIONS = "grant_trial_extensions",
  MANAGE_SUPPORT_TICKETS = "manage_support_tickets",
  
  // Admin Features - User Management
  MANAGE_USERS = "manage_users",
  MANAGE_ROLES = "manage_roles",
  MANAGE_PERMISSIONS = "manage_permissions",
  IMPERSONATE_USERS = "impersonate_users",
  VIEW_USER_ACTIVITY = "view_user_activity",
  BULK_USER_OPERATIONS = "bulk_user_operations",
  
  // Admin Features - Content Management
  MANAGE_ALL_CONTENT = "manage_all_content",
  MANAGE_MEDIA_LIBRARY = "manage_media_library",
  MANAGE_EMAIL_TEMPLATES = "manage_email_templates",
  
  // Admin Features - Financial
  VIEW_FINANCIAL_REPORTS = "view_financial_reports",
  MANAGE_SUBSCRIPTIONS = "manage_subscriptions",
  PROCESS_REFUNDS = "process_refunds",
  VIEW_REVENUE_ANALYTICS = "view_revenue_analytics",
  
  // Admin Features - System
  VIEW_SYSTEM_LOGS = "view_system_logs",
  MANAGE_BILLING = "manage_billing",
  CONFIGURE_SYSTEM = "configure_system",
  ACCESS_ADMIN_PANEL = "access_admin_panel",
  MANAGE_INTEGRATIONS = "manage_integrations",
  DATABASE_OPERATIONS = "database_operations",
  VIEW_SYSTEM_HEALTH = "view_system_health",
}

/**
 * Role-based permission mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    // Content & Programs
    Permission.VIEW_BASIC_CONTENT,
    Permission.ACCESS_TRIAL_PROGRAMS,
    Permission.STREAM_VIDEOS,
    // Progress (Limited)
    Permission.LOG_WORKOUTS,
    Permission.TRACK_PROGRESS,
    Permission.SET_GOALS,
    // Community (Read-only)
    Permission.VIEW_COMMUNITY,
    // Shop
    Permission.VIEW_SHOP,
    // Profile
    Permission.EDIT_OWN_PROFILE,
  ],
  
  [UserRole.MEMBER]: [
    // Content & Programs
    Permission.VIEW_BASIC_CONTENT,
    Permission.VIEW_PREMIUM_CONTENT,
    Permission.ACCESS_TRIAL_PROGRAMS,
    Permission.ACCESS_MEMBER_PROGRAMS,
    Permission.CREATE_CUSTOM_WORKOUTS,
    Permission.DOWNLOAD_RESOURCES,
    Permission.STREAM_VIDEOS,
    // Progress & Tracking
    Permission.LOG_WORKOUTS,
    Permission.TRACK_PROGRESS,
    Permission.VIEW_PROGRESS_CHARTS,
    Permission.EARN_ACHIEVEMENTS,
    Permission.SET_GOALS,
    // Community
    Permission.VIEW_COMMUNITY,
    Permission.POST_COMMUNITY,
    Permission.JOIN_CHALLENGES,
    Permission.MESSAGE_MEMBERS,
    // Shop
    Permission.VIEW_SHOP,
    Permission.PURCHASE_PRODUCTS,
    Permission.VIEW_MEMBER_DISCOUNTS,
    // Profile & Account
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_OWN_ANALYTICS,
    Permission.EXPORT_OWN_DATA,
    Permission.MANAGE_SUBSCRIPTION,
  ],
  
  [UserRole.COLLABORATOR]: [
    // Content
    Permission.VIEW_BASIC_CONTENT,
    // Collaboration
    Permission.VIEW_SHARED_PROJECTS,
    Permission.EDIT_SHARED_PROJECTS,
    Permission.COMMENT_ON_PROJECTS,
    Permission.SUBMIT_CONTENT,
    Permission.VIEW_SUBMISSION_ANALYTICS,
    Permission.VIEW_EARNINGS,
    // Community (Read-only)
    Permission.VIEW_COMMUNITY,
    // Profile
    Permission.EDIT_OWN_PROFILE,
  ],
  
  [UserRole.TEAM]: [
    // Content Access (All)
    Permission.VIEW_BASIC_CONTENT,
    Permission.VIEW_PREMIUM_CONTENT,
    Permission.VIEW_EXCLUSIVE_CONTENT,
    Permission.ACCESS_ALL_PROGRAMS,
    Permission.STREAM_VIDEOS,
    Permission.DOWNLOAD_RESOURCES,
    // Content Management
    Permission.VIEW_TEAM_DASHBOARD,
    Permission.MANAGE_CONTENT,
    Permission.PUBLISH_CONTENT,
    // Community
    Permission.VIEW_COMMUNITY,
    Permission.POST_COMMUNITY,
    Permission.MODERATE_COMMUNITY,
    // Member Support
    Permission.VIEW_MEMBER_PROFILES,
    Permission.RESPOND_TO_INQUIRIES,
    Permission.GRANT_TRIAL_EXTENSIONS,
    Permission.MANAGE_SUPPORT_TICKETS,
    // Analytics
    Permission.VIEW_ANALYTICS,
    // Shop
    Permission.VIEW_SHOP,
    // Profile
    Permission.EDIT_OWN_PROFILE,
  ],
  
  [UserRole.ADMIN]: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],
};

/**
 * Role hierarchy (higher roles inherit lower role permissions)
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.MEMBER]: 1,
  [UserRole.COLLABORATOR]: 1,
  [UserRole.TEAM]: 2,
  [UserRole.ADMIN]: 3,
};

/**
 * Role display information
 */
export interface RoleInfo {
  role: UserRole;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export const ROLE_INFO: Record<UserRole, RoleInfo> = {
  [UserRole.GUEST]: {
    role: UserRole.GUEST,
    label: "Guest",
    description: "Trial access with limited features",
    color: "gray",
    icon: "UserCircle",
  },
  [UserRole.MEMBER]: {
    role: UserRole.MEMBER,
    label: "Member",
    description: "Full subscription access to member features",
    color: "blue",
    icon: "User",
  },
  [UserRole.COLLABORATOR]: {
    role: UserRole.COLLABORATOR,
    label: "Collaborator",
    description: "3rd party invited access to specific projects",
    color: "purple",
    icon: "Users",
  },
  [UserRole.TEAM]: {
    role: UserRole.TEAM,
    label: "Team",
    description: "Internal team member with staff features",
    color: "green",
    icon: "Briefcase",
  },
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    label: "Admin",
    description: "Full system access and control",
    color: "red",
    icon: "Shield",
  },
};

/**
 * Feature access levels
 */
export interface FeatureAccess {
  dashboard: boolean;
  programs: "none" | "trial" | "member" | "all";
  community: "view" | "post" | "moderate";
  shop: "view" | "purchase" | "discount";
  analytics: "none" | "own" | "team" | "all";
  admin: boolean;
}

/**
 * Get feature access for a role
 */
export function getFeatureAccess(role: UserRole): FeatureAccess {
  switch (role) {
    case UserRole.GUEST:
      return {
        dashboard: true,
        programs: "trial",
        community: "view",
        shop: "view",
        analytics: "none",
        admin: false,
      };
    
    case UserRole.MEMBER:
      return {
        dashboard: true,
        programs: "member",
        community: "post",
        shop: "discount",
        analytics: "own",
        admin: false,
      };
    
    case UserRole.COLLABORATOR:
      return {
        dashboard: true,
        programs: "none",
        community: "view",
        shop: "view",
        analytics: "none",
        admin: false,
      };
    
    case UserRole.TEAM:
      return {
        dashboard: true,
        programs: "all",
        community: "moderate",
        shop: "view",
        analytics: "team",
        admin: false,
      };
    
    case UserRole.ADMIN:
      return {
        dashboard: true,
        programs: "all",
        community: "moderate",
        shop: "discount",
        analytics: "all",
        admin: true,
      };
    
    default:
      return {
        dashboard: false,
        programs: "none",
        community: "view",
        shop: "view",
        analytics: "none",
        admin: false,
      };
  }
}
