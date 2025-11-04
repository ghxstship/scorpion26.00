# 🔐 RBAC System - Complete Guide

## Overview

A production-ready Role-Based Access Control (RBAC) system with 5 user roles, 30+ granular permissions, and role-specific dashboards.

---

## 🚀 Quick Start

### 1. Login with Demo Accounts

Visit `/login` and use any of these credentials:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 🔓 **Guest** | guest@scorpion26.com | guest123 | Trial (Limited) |
| 👤 **Member** | member@scorpion26.com | member123 | Full Member |
| 🤝 **Collaborator** | collab@scorpion26.com | collab123 | Project-Based |
| 💼 **Team** | team@scorpion26.com | team123 | Staff Features |
| 🛡️ **Admin** | admin@scorpion26.com | admin123 | Full Control |

### 2. Explore Dashboards

Each role has a unique dashboard at `/member/dashboard`:
- Different layouts and features
- Role-specific actions
- Tailored content

### 3. Test Admin Features

Login as admin and visit:
- `/admin` - Admin panel home
- `/admin/roles` - Role management interface

---

## 📚 Documentation

### Complete Guides
- **[RBAC_SYSTEM.md](./RBAC_SYSTEM.md)** - Full technical documentation
- **[RBAC_QUICK_START.md](./RBAC_QUICK_START.md)** - Quick reference guide
- **[RBAC_IMPLEMENTATION_SUMMARY.md](./RBAC_IMPLEMENTATION_SUMMARY.md)** - Implementation details

### Key Files
- `lib/auth/rbac-types.ts` - Role and permission definitions
- `lib/auth/rbac-utils.ts` - Permission checking utilities
- `lib/auth/demo-auth.ts` - Authentication with RBAC
- `components/dashboard/*` - Role-specific dashboard components

---

## 🎯 Role Breakdown

### Guest (Trial Access)
**Purpose**: New users exploring the platform

**Features**:
- ✅ Basic content viewing
- ✅ Trial workout programs
- ✅ Community viewing (read-only)
- ✅ Shop browsing
- ❌ No premium content
- ❌ No custom workouts
- ❌ No analytics

**Dashboard**: Trial status, available features, upgrade prompts

---

### Member (Subscription Access)
**Purpose**: Paying customers with full access

**Features**:
- ✅ All Guest features
- ✅ Premium content
- ✅ Member programs
- ✅ Custom workouts
- ✅ Community posting
- ✅ Member discounts
- ✅ Personal analytics
- ✅ Data export

**Dashboard**: Workout stats, progress tracking, achievements, quick actions

---

### Collaborator (3rd Party Access)
**Purpose**: External partners on specific projects

**Features**:
- ✅ Basic content
- ✅ Shared project access
- ✅ Project editing
- ✅ Project comments
- ✅ Community viewing
- ❌ No full member features
- ❌ No admin access

**Dashboard**: Assigned projects, collaboration tools, recent contributions

---

### Team (Internal Staff)
**Purpose**: Internal team members and staff

**Features**:
- ✅ All content access
- ✅ All programs
- ✅ Community moderation
- ✅ Content management
- ✅ Platform analytics
- ✅ Support tools
- ❌ No user management
- ❌ No system config

**Dashboard**: Platform metrics, content tools, support queue, activity feed

---

### Admin (Full Control)
**Purpose**: System administrators

**Features**:
- ✅ **ALL** permissions
- ✅ User management
- ✅ Role management
- ✅ System configuration
- ✅ Billing management
- ✅ System logs
- ✅ Admin panel

**Dashboard**: System health, user stats, revenue, alerts, admin tools

---

## 🔧 Usage Examples

### Check Permission

```typescript
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";
import { getCurrentUser } from "@/lib/auth/demo-auth";

const user = getCurrentUser();

if (hasPermission(user.role, Permission.MANAGE_CONTENT)) {
  // User can manage content
  showContentEditor();
}
```

### Check Multiple Permissions

```typescript
import { hasAllPermissions, hasAnyPermission } from "@/lib/auth/rbac-utils";

// Check if user has ALL permissions
if (hasAllPermissions(user.role, [
  Permission.VIEW_PREMIUM_CONTENT,
  Permission.CREATE_CUSTOM_WORKOUTS
])) {
  // User has both permissions
}

// Check if user has ANY permission
if (hasAnyPermission(user.role, [
  Permission.MANAGE_CONTENT,
  Permission.MODERATE_COMMUNITY
])) {
  // User has at least one permission
}
```

### Protect Routes

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/demo-auth";
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";

export default function ProtectedPage() {
  const router = useRouter();

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
  }, [router]);

  return <div>Admin Content</div>;
}
```

### Check Feature Access

```typescript
import { canAccessFeature } from "@/lib/auth/rbac-utils";

// Check if user can access a feature at a specific level
if (canAccessFeature(user.role, "programs", "member")) {
  // User has at least "member" level access to programs
  showMemberPrograms();
}
```

### Get Available Actions

```typescript
import { getAvailableActions } from "@/lib/auth/rbac-utils";

const actions = getAvailableActions(user.role);

// Filter available actions
const availableActions = actions.filter(a => a.available);

// Display in UI
availableActions.forEach(action => {
  console.log(action.label, action.description);
});
```

---

## 🎨 UI Components

### Role Badge
Display user's role with color coding:

```typescript
import { Badge } from "@/components/ui/badge";
import { ROLE_INFO } from "@/lib/auth/rbac-types";

const roleInfo = ROLE_INFO[user.role];

<Badge variant="outline" className={`border-${roleInfo.color}-500`}>
  {roleInfo.label}
</Badge>
```

### Permissions Card
Show available permissions:

```typescript
import PermissionsCard from "@/components/dashboard/permissions-card";

<PermissionsCard role={user.role} />
```

### Role Comparison Table
Compare features across roles:

```typescript
import RoleComparisonTable from "@/components/dashboard/role-comparison-table";

<RoleComparisonTable />
```

---

## 🔒 Security Notes

### Current Implementation (Demo)
- ✅ Client-side role checking
- ✅ Permission-based UI rendering
- ✅ Protected route components
- ⚠️ **No server-side validation**
- ⚠️ **No API protection**
- ⚠️ **Demo credentials only**

### Production Requirements
For production, you **must** implement:

1. **Server-Side Auth**: NextAuth.js, Supabase, Auth0
2. **API Protection**: Middleware for route protection
3. **Database**: Store roles and permissions
4. **Session Security**: HTTP-only cookies, CSRF protection
5. **Audit Logging**: Track role changes and access

---

## 📊 Permission Categories

### Content Access (3)
- `view_basic_content`
- `view_premium_content`
- `view_exclusive_content`

### Workout & Programs (4)
- `access_trial_programs`
- `access_member_programs`
- `access_all_programs`
- `create_custom_workouts`

### Community (3)
- `view_community`
- `post_community`
- `moderate_community`

### Shop & Commerce (3)
- `view_shop`
- `purchase_products`
- `view_member_discounts`

### Profile & Data (3)
- `edit_own_profile`
- `view_own_analytics`
- `export_own_data`

### Collaboration (3)
- `view_shared_projects`
- `edit_shared_projects`
- `comment_on_projects`

### Team Features (4)
- `view_team_dashboard`
- `manage_content`
- `view_analytics`
- `respond_to_inquiries`

### Admin Features (7)
- `manage_users`
- `manage_roles`
- `manage_permissions`
- `view_system_logs`
- `manage_billing`
- `configure_system`
- `access_admin_panel`

**Total: 30 Permissions**

---

## 🧪 Testing Checklist

- [ ] Login with all 5 roles
- [ ] Verify unique dashboards for each role
- [ ] Check role badge displays correctly
- [ ] Test admin panel access (admin only)
- [ ] Verify role management page (admin only)
- [ ] Test logout functionality
- [ ] Confirm navigation updates on auth change
- [ ] Try accessing `/admin` with non-admin roles
- [ ] Verify "Access Denied" message
- [ ] Test permission checks in UI

---

## 🚀 Extending the System

### Add New Permission

1. Add to `Permission` enum in `rbac-types.ts`:
```typescript
export enum Permission {
  // ... existing permissions
  NEW_PERMISSION = "new_permission",
}
```

2. Add to role permissions:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.MEMBER]: [
    // ... existing permissions
    Permission.NEW_PERMISSION,
  ],
};
```

### Create New Role

1. Add to `UserRole` enum:
```typescript
export enum UserRole {
  // ... existing roles
  NEW_ROLE = "new_role",
}
```

2. Configure permissions:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.NEW_ROLE]: [
    Permission.VIEW_BASIC_CONTENT,
    // ... other permissions
  ],
};
```

3. Add role info:
```typescript
export const ROLE_INFO: Record<UserRole, RoleInfo> = {
  [UserRole.NEW_ROLE]: {
    role: UserRole.NEW_ROLE,
    label: "New Role",
    description: "Description of new role",
    color: "blue",
    icon: "Star",
  },
};
```

4. Create dashboard component
5. Update main dashboard router

---

## 📁 File Structure

```
lib/auth/
├── rbac-types.ts           # Roles, permissions, types
├── rbac-utils.ts           # Permission utilities
└── demo-auth.ts            # Auth with RBAC

components/dashboard/
├── guest-dashboard.tsx         # Guest UI
├── member-dashboard.tsx        # Member UI
├── collaborator-dashboard.tsx  # Collaborator UI
├── team-dashboard.tsx          # Team UI
├── admin-dashboard.tsx         # Admin UI
├── permissions-card.tsx        # Permission display
└── role-comparison-table.tsx   # Role comparison

app/
├── member/dashboard/page.tsx   # Main dashboard
├── admin/
│   ├── page.tsx               # Admin home
│   └── roles/page.tsx         # Role management
└── login/page.tsx             # Login with credentials

docs/
├── RBAC_SYSTEM.md                    # Full docs
├── RBAC_QUICK_START.md               # Quick guide
├── RBAC_IMPLEMENTATION_SUMMARY.md    # Summary
└── RBAC_README.md                    # This file
```

---

## 💡 Best Practices

1. **Always check permissions server-side** in production
2. **Use utility functions** instead of direct role checks
3. **Keep permissions granular** for flexibility
4. **Document role changes** in audit logs
5. **Test all permission combinations** thoroughly
6. **Use TypeScript** for type safety
7. **Follow principle of least privilege**
8. **Regular security audits** of role permissions

---

## 🤝 Support

- Review full documentation in `RBAC_SYSTEM.md`
- Check quick start guide in `RBAC_QUICK_START.md`
- See implementation details in `RBAC_IMPLEMENTATION_SUMMARY.md`
- Examine code examples in utility files
- Test with demo accounts

---

## ✨ Summary

The RBAC system provides comprehensive access control with:
- ✅ 5 distinct user roles
- ✅ 30+ granular permissions
- ✅ Role-specific dashboards
- ✅ Type-safe implementation
- ✅ Utility functions for easy integration
- ✅ Admin panel for management
- ✅ Complete documentation
- ✅ Production-ready structure

Ready to use for demo/testing with a clear migration path to production!
