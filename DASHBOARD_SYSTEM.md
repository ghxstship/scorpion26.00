# Multi-Role Authenticated Dashboard System

A comprehensive, production-ready dashboard system with role-based access control (RBAC) supporting five distinct user roles.

## 🎯 Overview

This system provides a complete authenticated dashboard experience with:
- **5 User Roles**: Guest, Member, Collaborator, Team, Admin
- **60+ Permissions**: Granular access control
- **Role-Specific Navigation**: Custom menus for each role
- **Widget Library**: Reusable dashboard components
- **API Middleware**: Secure route protection
- **Responsive Layout**: Mobile-first design with collapsible sidebar

## 📁 File Structure

```
lib/
├── auth/
│   ├── rbac-types.ts          # Enhanced role & permission definitions
│   ├── rbac-utils.ts          # Permission checking utilities
│   └── demo-auth.ts           # Demo authentication (replace in production)
├── navigation/
│   └── navigation-config.ts   # Role-specific navigation menus
├── widgets/
│   └── widget-types.ts        # Widget configurations by role
└── api/
    └── middleware.ts          # API authentication & authorization

components/
├── layouts/
│   └── dashboard-layout.tsx   # Main dashboard layout with sidebar
├── widgets/
│   ├── metric-widget.tsx      # Metric display widget
│   ├── list-widget.tsx        # List display widget
│   ├── action-widget.tsx      # Action buttons widget
│   └── status-widget.tsx      # Status indicator widget
└── dashboard/
    ├── admin-dashboard.tsx    # Admin role dashboard
    ├── team-dashboard.tsx     # Team role dashboard
    ├── collaborator-dashboard.tsx
    ├── member-dashboard.tsx   # Member role dashboard
    └── guest-dashboard.tsx    # Guest role dashboard

app/
├── member/dashboard/
│   └── page.tsx              # Main dashboard page (role-aware)
└── api/example/
    ├── users/route.ts        # Example: Admin-only API
    └── workouts/route.ts     # Example: Permission-based API
```

## 👥 User Roles & Permissions

### 1. GUEST (Trial Access)
**Demo Login**: `guest@scorpion26.com` / `guest123`

**Permissions**:
- ✅ View basic content
- ✅ Access trial programs (limited)
- ✅ Stream videos
- ✅ Log workouts (limited)
- ✅ View community (read-only)
- ❌ No premium content
- ❌ No custom workouts
- ❌ No downloads

**Navigation**:
- Dashboard
- Trial Workouts
- View Plans (upgrade CTA)

---

### 2. MEMBER (Subscription Access)
**Demo Login**: `member@scorpion26.com` / `member123`

**Permissions**:
- ✅ All Guest permissions
- ✅ Premium content access
- ✅ Full workout programs
- ✅ Create custom workouts
- ✅ Download resources
- ✅ Progress tracking & analytics
- ✅ Community participation
- ✅ Join challenges
- ✅ Member discounts

**Navigation**:
- Home Dashboard
- My Programs
- Workouts
- Schedule
- Progress Tracking
- Achievements
- Community Feed
- Challenges
- Profile & Subscription

---

### 3. COLLABORATOR (3rd Party Access)
**Demo Login**: `collab@scorpion26.com` / `collab123`

**Permissions**:
- ✅ View shared projects
- ✅ Edit project content
- ✅ Submit content for approval
- ✅ View submission analytics
- ✅ Track earnings
- ✅ Message Team/Admin
- ❌ No member features
- ❌ No system access

**Navigation**:
- Dashboard
- My Submissions
- Submit New Content
- Analytics
- Earnings
- Messages

---

### 4. TEAM (Internal Staff)
**Demo Login**: `team@scorpion26.com` / `team123`

**Permissions**:
- ✅ All content access
- ✅ Content management
- ✅ Publish content (with approval)
- ✅ Member support
- ✅ Support tickets
- ✅ View member profiles
- ✅ Grant trial extensions
- ✅ Team analytics
- ❌ No user role management
- ❌ No system configuration

**Navigation**:
- Dashboard
- My Tasks
- Content Management
- Content Calendar
- Support Tickets
- Member Queries
- Analytics

---

### 5. ADMIN (Full System Access)
**Demo Login**: `admin@scorpion26.com` / `admin123`

**Permissions**:
- ✅ **ALL PERMISSIONS**
- ✅ User management
- ✅ Role & permission management
- ✅ Financial reports
- ✅ System configuration
- ✅ Database operations
- ✅ Integrations
- ✅ Audit logs

**Navigation**:
- Dashboard & Analytics
- User Management
- Roles & Permissions
- Activity Logs
- Programs & Workouts
- Blog & Media
- Revenue & Subscriptions
- Support Tickets
- System Settings
- Integrations

## 🎨 Dashboard Layout Features

### Responsive Sidebar
- **Desktop**: Collapsible sidebar (64px collapsed, 256px expanded)
- **Mobile**: Slide-out drawer with backdrop
- **Persistent State**: Remembers collapsed/expanded preference
- **Role Badge**: Color-coded role indicator
- **User Profile**: Dropdown with profile, settings, logout

### Top Navigation Bar
- **Search Bar**: Global search functionality
- **Role Badge**: Current role display
- **Notifications**: Bell icon with unread count
- **Mobile Menu**: Hamburger menu for mobile devices

### Navigation Sections
Each role has custom navigation organized by sections:
- Dashboard
- Primary Features
- Secondary Features
- Account/Settings

### Breadcrumbs
Automatic breadcrumb generation based on current path.

## 📊 Widget Library

### MetricWidget
Display key metrics with trends and icons.

```tsx
<MetricWidget
  title="Workout Stats"
  description="This month"
  metrics={[
    { 
      label: "Total Workouts", 
      value: "12",
      change: "+3",
      trend: "up",
      icon: <Dumbbell className="h-4 w-4" />
    },
  ]}
/>
```

### ListWidget
Display lists with status badges and actions.

```tsx
<ListWidget
  title="Support Tickets"
  items={[
    {
      id: "1",
      title: "Login Issue",
      subtitle: "2 hours ago",
      status: "Open",
      statusVariant: "destructive",
    },
  ]}
  maxItems={5}
  viewAllPath="/admin/tickets"
/>
```

### ActionWidget
Quick action buttons in grid or list layout.

```tsx
<ActionWidget
  title="Quick Actions"
  layout="grid"
  actions={[
    { label: "Start Workout", icon: "Dumbbell", path: "/member/workouts" },
    { label: "View Progress", icon: "TrendingUp", path: "/member/progress" },
  ]}
/>
```

### StatusWidget
System status with indicators.

```tsx
<StatusWidget
  title="System Health"
  overallStatus="operational"
  indicators={[
    { label: "API", value: "Operational", status: "success" },
    { label: "Database", value: "99.9%", status: "success" },
  ]}
/>
```

## 🔐 API Middleware

### Authentication
```typescript
import { requireAuth } from "@/lib/api/middleware";

export const GET = requireAuth(async (request) => {
  // request.user is available
  return successResponse({ data: "protected" });
});
```

### Role-Based Protection
```typescript
import { requireRole } from "@/lib/api/middleware";
import { UserRole } from "@/lib/auth/rbac-types";

export const POST = requireRole(UserRole.ADMIN)(async (request) => {
  // Only admins can access
  return successResponse({ message: "Admin action" });
});
```

### Permission-Based Protection
```typescript
import { requirePermission } from "@/lib/api/middleware";
import { Permission } from "@/lib/auth/rbac-types";

export const GET = requirePermission(Permission.MANAGE_CONTENT)(
  async (request) => {
    // Only users with MANAGE_CONTENT permission
    return successResponse({ data: "content" });
  }
);
```

### Minimum Role Level
```typescript
import { requireMinRole } from "@/lib/api/middleware";
import { UserRole } from "@/lib/auth/rbac-types";

export const POST = requireMinRole(UserRole.TEAM)(async (request) => {
  // Team and Admin can access
  return successResponse({ message: "Team action" });
});
```

### Error Handling
```typescript
import { withErrorHandler } from "@/lib/api/middleware";

export const GET = withErrorHandler(async (request) => {
  // Automatic error handling and logging
  throw new Error("Something went wrong");
  // Returns proper error response
});
```

### Audit Logging
```typescript
import { auditLog } from "@/lib/api/middleware";

await auditLog({
  userId: request.user?.id,
  action: "user.created",
  resourceType: "user",
  resourceId: newUser.id,
  changes: newUser,
});
```

## 🚀 Usage Examples

### Check Permission in Component
```typescript
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";

if (hasPermission(user.role, Permission.MANAGE_CONTENT)) {
  // Show content management UI
}
```

### Get Navigation for Role
```typescript
import { getNavigationForRole } from "@/lib/navigation/navigation-config";

const navigation = getNavigationForRole(user.role);
```

### Check Feature Access
```typescript
import { canAccessFeature } from "@/lib/auth/rbac-utils";

if (canAccessFeature(user.role, "programs", "member")) {
  // User has at least member-level program access
}
```

## 🎨 Customization

### Adding New Permissions
1. Add to `Permission` enum in `lib/auth/rbac-types.ts`
2. Update `ROLE_PERMISSIONS` mapping
3. Use in middleware or components

### Adding Navigation Items
Edit `lib/navigation/navigation-config.ts`:
```typescript
{
  section: "New Section",
  items: [
    { label: "New Page", icon: "Star", path: "/role/new-page" },
  ],
}
```

### Creating Custom Widgets
Create new widget component in `components/widgets/`:
```typescript
export default function CustomWidget({ title, data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Custom content */}
      </CardContent>
    </Card>
  );
}
```

## 🔒 Security Best Practices

### Current Implementation (Demo)
- ✅ Client-side role checking
- ✅ Permission-based UI rendering
- ✅ API middleware structure
- ⚠️ Demo authentication only
- ⚠️ No JWT validation
- ⚠️ No database integration

### Production Requirements

#### 1. Replace Demo Auth
```typescript
// Replace lib/auth/demo-auth.ts with:
- NextAuth.js (recommended)
- Supabase Auth
- Auth0
- Custom JWT implementation
```

#### 2. Implement Server-Side Validation
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Validate JWT token
  // Check user permissions
  // Redirect if unauthorized
}
```

#### 3. Add Database Integration
- Store roles and permissions in database
- Implement dynamic permission assignment
- Add audit logging to database
- Track user sessions

#### 4. Secure API Routes
- Validate all inputs
- Sanitize user data
- Rate limiting per role
- CSRF protection
- SQL injection prevention

#### 5. Environment Variables
```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
```

## 📱 Mobile Responsiveness

- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Sidebar**: Drawer on mobile, fixed on desktop
- **Grid Layouts**: Responsive columns (1 → 2 → 3 → 4)
- **Touch Friendly**: Large tap targets, swipe gestures

## 🧪 Testing

### Test Different Roles
1. Visit `/login`
2. Use demo credentials for each role
3. Verify navigation and permissions
4. Test API endpoints with different roles

### Test Responsive Design
- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Drawer navigation

## 📈 Performance Considerations

- **Code Splitting**: Each dashboard component lazy-loaded
- **Widget Refresh**: Configurable intervals per widget
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: Redis for session and rate limiting

## 🔄 Migration Path

### From Demo to Production

1. **Authentication** (Week 1)
   - Implement NextAuth.js or similar
   - Set up JWT token validation
   - Configure OAuth providers

2. **Database** (Week 2)
   - Create user, role, permission tables
   - Migrate demo users to database
   - Implement audit logging

3. **API Security** (Week 3)
   - Add rate limiting (Redis)
   - Implement CSRF protection
   - Add input validation (Zod)

4. **Testing** (Week 4)
   - Unit tests for RBAC utilities
   - Integration tests for API routes
   - E2E tests for user flows

5. **Deployment** (Week 5)
   - Set up CI/CD pipeline
   - Configure environment variables
   - Deploy to production

## 📚 Additional Resources

- [RBAC System Documentation](./RBAC_SYSTEM.md)
- [RBAC Quick Start](./RBAC_QUICK_START.md)
- [API Route Examples](./app/api/example/)
- [Widget Library](./components/widgets/)

## 🤝 Support

For questions or issues:
1. Check existing documentation
2. Review example implementations
3. Test with demo credentials
4. Verify role permissions

---

**Built with**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
**License**: MIT
**Version**: 1.0.0
