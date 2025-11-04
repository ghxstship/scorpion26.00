# Role-Based Access Control (RBAC) System

A comprehensive RBAC implementation for the Scorpion26 fitness platform with five distinct user roles and granular permission management.

## User Roles

### 1. **Guest** (Trial Access)
- **Purpose**: Limited trial access to platform features
- **Use Case**: New users exploring the platform before committing
- **Access Level**: Basic features only
- **Demo Credentials**: `guest@scorpion26.com` / `guest123`

**Features**:
- ✅ View basic content
- ✅ Access trial workout programs
- ✅ View community posts (read-only)
- ✅ Browse shop
- ❌ No premium content
- ❌ No custom workouts
- ❌ No analytics

---

### 2. **Member** (Subscription Access)
- **Purpose**: Full member access with subscription
- **Use Case**: Paying customers with active subscriptions
- **Access Level**: All member features and content
- **Demo Credentials**: `member@scorpion26.com` / `member123`

**Features**:
- ✅ All Guest features
- ✅ Premium content access
- ✅ Member workout programs
- ✅ Create custom workouts
- ✅ Post in community
- ✅ Member discounts in shop
- ✅ Personal analytics and progress tracking
- ✅ Export personal data

---

### 3. **Collaborator** (3rd Party Invited Access)
- **Purpose**: External partners with project-specific access
- **Use Case**: Trainers, nutritionists, or partners working on specific projects
- **Access Level**: Project-based permissions
- **Demo Credentials**: `collab@scorpion26.com` / `collab123`

**Features**:
- ✅ View basic content
- ✅ Access shared projects
- ✅ Edit shared project content
- ✅ Comment on projects
- ✅ View community (read-only)
- ❌ No full member features
- ❌ No system administration

---

### 4. **Team** (Internal Team Access)
- **Purpose**: Internal staff members
- **Use Case**: Content managers, support staff, moderators
- **Access Level**: Staff features and content management
- **Demo Credentials**: `team@scorpion26.com` / `team123`

**Features**:
- ✅ All content access (basic, premium, exclusive)
- ✅ All workout programs
- ✅ Community moderation
- ✅ Content management
- ✅ View platform analytics
- ✅ Respond to member inquiries
- ✅ Team dashboard with metrics
- ❌ No user role management
- ❌ No system configuration

---

### 5. **Admin** (Internal All Access)
- **Purpose**: System administrators
- **Use Case**: Platform owners and technical administrators
- **Access Level**: Full system control
- **Demo Credentials**: `admin@scorpion26.com` / `admin123`

**Features**:
- ✅ **ALL** permissions
- ✅ User management
- ✅ Role and permission management
- ✅ System configuration
- ✅ Billing management
- ✅ View system logs
- ✅ Admin panel access
- ✅ Platform analytics (all data)

---

## Permission System

### Permission Categories

#### Content Access
- `view_basic_content` - Access to free/trial content
- `view_premium_content` - Access to member-only content
- `view_exclusive_content` - Access to team/admin content

#### Workout & Programs
- `access_trial_programs` - Trial workout programs
- `access_member_programs` - Full member programs
- `access_all_programs` - All programs including internal
- `create_custom_workouts` - Create personalized workouts

#### Community Features
- `view_community` - Read community posts
- `post_community` - Create community posts
- `moderate_community` - Moderate and manage community

#### Shop & Commerce
- `view_shop` - Browse shop products
- `purchase_products` - Make purchases
- `view_member_discounts` - See member pricing

#### Profile & Data
- `edit_own_profile` - Edit personal profile
- `view_own_analytics` - View personal metrics
- `export_own_data` - Export personal data

#### Collaboration
- `view_shared_projects` - View assigned projects
- `edit_shared_projects` - Edit project content
- `comment_on_projects` - Add project comments

#### Team Features
- `view_team_dashboard` - Access team dashboard
- `manage_content` - Create/edit platform content
- `view_analytics` - View platform analytics
- `respond_to_inquiries` - Handle support tickets

#### Admin Features
- `manage_users` - Create/edit/delete users
- `manage_roles` - Modify role permissions
- `manage_permissions` - Configure permission system
- `view_system_logs` - Access system logs
- `manage_billing` - Configure billing settings
- `configure_system` - System-wide configuration
- `access_admin_panel` - Access admin interface

---

## File Structure

```
lib/auth/
├── rbac-types.ts          # Role and permission definitions
├── rbac-utils.ts          # Permission checking utilities
└── demo-auth.ts           # Authentication with RBAC support

components/dashboard/
├── guest-dashboard.tsx         # Guest role dashboard
├── member-dashboard.tsx        # Member role dashboard
├── collaborator-dashboard.tsx  # Collaborator role dashboard
├── team-dashboard.tsx          # Team role dashboard
└── admin-dashboard.tsx         # Admin role dashboard

app/
├── member/dashboard/page.tsx   # Main dashboard (role-aware)
└── admin/
    ├── page.tsx               # Admin panel home
    └── roles/page.tsx         # Role management interface
```

---

## Usage Examples

### Check if User Has Permission

```typescript
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";

const user = getCurrentUser();

if (hasPermission(user.role, Permission.MANAGE_CONTENT)) {
  // User can manage content
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

### Check Feature Access

```typescript
import { canAccessFeature } from "@/lib/auth/rbac-utils";

// Check if user can access a feature
if (canAccessFeature(user.role, "programs", "member")) {
  // User has at least "member" level access to programs
}
```

### Get Available Actions for Role

```typescript
import { getAvailableActions } from "@/lib/auth/rbac-utils";

const actions = getAvailableActions(user.role);
// Returns array of actions with availability status
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

  return <div>Protected Content</div>;
}
```

---

## Role Hierarchy

Roles are organized in a hierarchy for permission inheritance:

```
Admin (Level 3)
  ├── Team (Level 2)
  ├── Member (Level 1)
  ├── Collaborator (Level 1)
  └── Guest (Level 0)
```

Use hierarchy checks:

```typescript
import { isRoleAtLeast, isRoleHigherThan } from "@/lib/auth/rbac-utils";

// Check if user role meets minimum requirement
if (isRoleAtLeast(user.role, UserRole.TEAM)) {
  // User is Team or Admin
}

// Check if one role is higher than another
if (isRoleHigherThan(UserRole.ADMIN, UserRole.MEMBER)) {
  // true - Admin is higher than Member
}
```

---

## Dashboard Routing

The main dashboard at `/member/dashboard` automatically renders the appropriate dashboard component based on the user's role:

- **Guest** → `GuestDashboard` (trial features, upgrade prompts)
- **Member** → `MemberDashboard` (workout stats, progress tracking)
- **Collaborator** → `CollaboratorDashboard` (project access, collaboration tools)
- **Team** → `TeamDashboard` (content management, analytics, support)
- **Admin** → `AdminDashboard` (system overview, user management, configuration)

---

## Security Considerations

### Current Implementation (Demo)
- ✅ Client-side role checking
- ✅ localStorage session management
- ✅ Permission-based UI rendering
- ⚠️ **No server-side validation**
- ⚠️ **No API route protection**
- ⚠️ **Demo credentials only**

### Production Requirements
For production use, implement:

1. **Server-Side Authentication**
   - Use NextAuth.js, Supabase Auth, or similar
   - Validate sessions on the server
   - Protect API routes with middleware

2. **Database-Backed RBAC**
   - Store roles and permissions in database
   - Dynamic permission assignment
   - Audit logging for role changes

3. **API Route Protection**
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';
   
   export function middleware(request: NextRequest) {
     // Validate user session and permissions
     // Redirect or return 403 if unauthorized
   }
   ```

4. **Secure Session Management**
   - HTTP-only cookies
   - CSRF protection
   - Session expiration
   - Refresh tokens

---

## Testing the System

1. **Login with different roles**:
   - Visit `/login`
   - Use any of the demo credentials listed above
   - Each role shows a different dashboard

2. **Test permissions**:
   - Try accessing `/admin` with different roles
   - Only Admin role can access admin panel
   - Other roles see "Access Denied"

3. **Role badge display**:
   - Dashboard header shows role badge
   - Color-coded by role type
   - Updates immediately on login

---

## Future Enhancements

- [ ] Dynamic role creation
- [ ] Custom permission sets
- [ ] Role templates
- [ ] Permission inheritance
- [ ] Time-based access (temporary permissions)
- [ ] IP-based restrictions
- [ ] Two-factor authentication for admin roles
- [ ] Audit log for permission changes
- [ ] Role approval workflows
- [ ] Bulk user role updates

---

## Migration from Demo to Production

1. Replace `demo-auth.ts` with real authentication
2. Move RBAC types to database schema
3. Implement server-side permission checks
4. Add API route middleware
5. Set up audit logging
6. Configure role management UI for admins
7. Test all permission combinations
8. Document custom roles and permissions
