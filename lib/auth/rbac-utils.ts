// RBAC Utility Functions

import { UserRole, Permission, ROLE_PERMISSIONS, ROLE_HIERARCHY, getFeatureAccess } from "./rbac-types";

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if one role is higher than another in the hierarchy
 */
export function isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

/**
 * Check if one role is equal to or higher than another
 */
export function isRoleAtLeast(role: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimumRole];
}

/**
 * Get the highest role from a list of roles
 */
export function getHighestRole(roles: UserRole[]): UserRole | null {
  if (roles.length === 0) return null;
  
  return roles.reduce((highest, current) => {
    return ROLE_HIERARCHY[current] > ROLE_HIERARCHY[highest] ? current : highest;
  });
}

/**
 * Check if a user can access a specific feature
 */
export function canAccessFeature(
  role: UserRole,
  feature: keyof ReturnType<typeof getFeatureAccess>,
  requiredLevel?: string
): boolean {
  const access = getFeatureAccess(role);
  const featureAccess = access[feature];
  
  if (typeof featureAccess === "boolean") {
    return featureAccess;
  }
  
  if (requiredLevel) {
    // For string-based access levels, check if user's level meets requirement
    const levels: Record<string, number> = {
      none: 0,
      view: 1,
      trial: 1,
      post: 2,
      member: 2,
      purchase: 2,
      own: 2,
      moderate: 3,
      discount: 3,
      team: 3,
      all: 4,
    };
    
    const userLevel = levels[featureAccess as string] || 0;
    const requiredLevelNum = levels[requiredLevel] || 0;
    
    return userLevel >= requiredLevelNum;
  }
  
  return featureAccess !== "none";
}

/**
 * Filter items based on role permissions
 */
export function filterByPermission<T>(
  items: T[],
  role: UserRole,
  getRequiredPermission: (item: T) => Permission
): T[] {
  return items.filter(item => hasPermission(role, getRequiredPermission(item)));
}

/**
 * Check if user can manage another user based on roles
 */
export function canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
  // Admins can manage everyone
  if (managerRole === UserRole.ADMIN) return true;
  
  // Team members can manage guests and members
  if (managerRole === UserRole.TEAM) {
    return targetRole === UserRole.GUEST || targetRole === UserRole.MEMBER;
  }
  
  // Others cannot manage users
  return false;
}

/**
 * Get available actions for a role
 */
export interface RoleAction {
  id: string;
  label: string;
  description: string;
  permission: Permission;
  available: boolean;
}

export function getAvailableActions(role: UserRole): RoleAction[] {
  const allActions: Omit<RoleAction, "available">[] = [
    {
      id: "view_premium",
      label: "View Premium Content",
      description: "Access premium workout programs and content",
      permission: Permission.VIEW_PREMIUM_CONTENT,
    },
    {
      id: "create_workouts",
      label: "Create Custom Workouts",
      description: "Design and save personalized workout routines",
      permission: Permission.CREATE_CUSTOM_WORKOUTS,
    },
    {
      id: "post_community",
      label: "Post in Community",
      description: "Share updates and engage with the community",
      permission: Permission.POST_COMMUNITY,
    },
    {
      id: "member_discounts",
      label: "Member Discounts",
      description: "Access exclusive member pricing in shop",
      permission: Permission.VIEW_MEMBER_DISCOUNTS,
    },
    {
      id: "analytics",
      label: "View Analytics",
      description: "Track your progress and performance metrics",
      permission: Permission.VIEW_OWN_ANALYTICS,
    },
    {
      id: "manage_content",
      label: "Manage Content",
      description: "Create and edit platform content",
      permission: Permission.MANAGE_CONTENT,
    },
    {
      id: "admin_panel",
      label: "Admin Panel",
      description: "Access system administration features",
      permission: Permission.ACCESS_ADMIN_PANEL,
    },
  ];
  
  return allActions.map(action => ({
    ...action,
    available: hasPermission(role, action.permission),
  }));
}

/**
 * Validate role transition
 */
export function canTransitionRole(
  currentRole: UserRole,
  newRole: UserRole,
  performedBy: UserRole
): { allowed: boolean; reason?: string } {
  // Admins can change any role
  if (performedBy === UserRole.ADMIN) {
    return { allowed: true };
  }
  
  // Team can upgrade guests to members
  if (performedBy === UserRole.TEAM) {
    if (currentRole === UserRole.GUEST && newRole === UserRole.MEMBER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Team members can only upgrade guests to members" };
  }
  
  // Users cannot change their own role
  return { allowed: false, reason: "Insufficient permissions to change roles" };
}
