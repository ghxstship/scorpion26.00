# Quick Reference Guide

Fast lookup for common tasks and implementations.

## 🚀 Installation Commands

```bash
# Core dependencies
npm install zod date-fns

# UI components (shadcn/ui)
npx shadcn-ui@latest add skeleton alert avatar

# Supabase (when ready)
npm install @supabase/supabase-js @supabase/ssr
```

## 📁 File Locations

| Feature | File Path |
|---------|-----------|
| Validation Schemas | `lib/validation/schemas.ts` |
| Error Handling | `lib/utils/error-handler.ts` |
| Analytics | `lib/utils/analytics.ts` |
| Formatters | `lib/utils/formatters.ts` |
| Constants | `lib/constants/index.ts` |
| Permissions | `lib/utils/permissions.ts` |
| RBAC Types | `lib/auth/rbac-types.ts` |
| Navigation | `lib/navigation/navigation-config.ts` |
| Widgets | `components/widgets/*` |
| Loading States | `components/ui/loading-states.tsx` |
| Error States | `components/ui/error-states.tsx` |
| Notifications | `components/notifications/notification-provider.tsx` |
| API Middleware | `lib/api/middleware.ts` |
| Supabase Client | `lib/supabase/client.ts` |
| Supabase Server | `lib/supabase/server.ts` |

## 🔧 Common Code Snippets

### Validate Input
```typescript
import { loginSchema } from '@/lib/validation/schemas';

const result = loginSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}
```

### Throw Custom Error
```typescript
import { ValidationError } from '@/lib/utils/error-handler';

throw new ValidationError('Invalid email', { field: 'email' });
```

### Track Event
```typescript
import { trackUserEvent } from '@/lib/utils/analytics';

trackUserEvent.login(userId, 'email');
```

### Format Date
```typescript
import { formatDate, formatRelativeTime } from '@/lib/utils/formatters';

formatDate(new Date(), 'short'); // "Nov 3, 2025"
formatRelativeTime(new Date()); // "2h ago"
```

### Check Permission
```typescript
import { hasPermission } from '@/lib/auth/rbac-utils';
import { Permission } from '@/lib/auth/rbac-types';

if (hasPermission(user.role, Permission.MANAGE_CONTENT)) {
  // User can manage content
}
```

### Show Notification
```typescript
import { useNotifications } from '@/components/notifications/notification-provider';

const { success, error } = useNotifications();
success('Saved!', 'Changes saved successfully');
```

### Display Loading
```typescript
import { PageLoader } from '@/components/ui/loading-states';

if (loading) return <PageLoader />;
```

### Display Error
```typescript
import { PageError } from '@/components/ui/error-states';

if (error) return <PageError message={error} onRetry={refetch} />;
```

## 🎨 Widget Usage

### Metric Widget
```typescript
import MetricWidget from '@/components/widgets/metric-widget';

<MetricWidget
  title="Total Users"
  description="Active members"
  metrics={[{
    label: "Members",
    value: "1,234",
    change: "+12%",
    trend: "up"
  }]}
/>
```

### Chart Widget
```typescript
import ChartWidget from '@/components/widgets/chart-widget';

<ChartWidget
  title="Growth"
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
  ]}
  chartType="line"
  showTrend
  trendValue={25}
/>
```

### Feed Widget
```typescript
import FeedWidget from '@/components/widgets/feed-widget';

<FeedWidget
  title="Activity Feed"
  events={[{
    id: '1',
    type: 'workout_completed',
    user: { id: '1', name: 'John' },
    title: 'Completed workout',
    timestamp: new Date().toISOString()
  }]}
/>
```

## 🔐 API Route Protection

### Require Authentication
```typescript
import { requireAuth } from '@/lib/api/middleware';

export const GET = requireAuth(async (request) => {
  // request.user is available
  return NextResponse.json({ data: 'protected' });
});
```

### Require Role
```typescript
import { requireRole } from '@/lib/api/middleware';
import { UserRole } from '@/lib/auth/rbac-types';

export const POST = requireRole(UserRole.ADMIN)(async (request) => {
  // Only admins
  return NextResponse.json({ success: true });
});
```

### Require Permission
```typescript
import { requirePermission } from '@/lib/api/middleware';
import { Permission } from '@/lib/auth/rbac-types';

export const POST = requirePermission(Permission.MANAGE_CONTENT)(
  async (request) => {
    // Only users with permission
    return NextResponse.json({ success: true });
  }
);
```

## 📊 Constants Usage

```typescript
import {
  DIFFICULTY_LEVELS,
  MAX_FILE_SIZES,
  ERROR_MESSAGES,
  API_ROUTES,
} from '@/lib/constants';

// Check difficulty
const isValid = DIFFICULTY_LEVELS.includes(difficulty);

// Check file size
const isTooLarge = file.size > MAX_FILE_SIZES.IMAGE;

// Use error message
throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

// Use API route
fetch(API_ROUTES.AUTH.LOGIN, { method: 'POST' });
```

## 🎯 Role-Based Rendering

```typescript
import { UserRole } from '@/lib/auth/rbac-types';

{user.role === UserRole.ADMIN && (
  <AdminPanel />
)}

{[UserRole.ADMIN, UserRole.TEAM].includes(user.role) && (
  <ManagementTools />
)}
```

## 📝 Form Validation Example

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validation/schemas';

const form = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});

const onSubmit = async (data) => {
  try {
    await login(data);
    success('Logged in successfully!');
  } catch (error) {
    error('Login failed');
  }
};
```

## 🔄 Data Fetching Pattern

```typescript
import { useState, useEffect } from 'react';
import { PageLoader } from '@/components/ui/loading-states';
import { PageError } from '@/components/ui/error-states';

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} />;
  if (!data) return <EmptyState />;

  return <div>{/* Render data */}</div>;
}
```

## 📚 Documentation Links

- **Complete System**: `DASHBOARD_SYSTEM.md`
- **Quick Start**: `DASHBOARD_QUICKSTART.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **Implementation Status**: `FINAL_IMPLEMENTATION_STATUS.md`
- **Gap Analysis**: `IMPLEMENTATION_GAPS.md`

## 🐛 Debugging Tips

### Check User Role
```typescript
console.log('Current role:', user.role);
console.log('Has permission:', hasPermission(user.role, Permission.MANAGE_CONTENT));
```

### Test Validation
```typescript
const result = schema.safeParse(data);
console.log('Valid:', result.success);
console.log('Errors:', result.error?.errors);
```

### Track Analytics
```typescript
// Enable logging in development
analytics.track('test.event', { debug: true });
```

## ⚡ Performance Tips

1. **Use React.memo** for expensive components
2. **Lazy load** dashboard pages
3. **Debounce** search inputs
4. **Cache** API responses
5. **Optimize** images with Next.js Image

## 🔒 Security Checklist

- [ ] Validate all inputs with Zod
- [ ] Use error handlers consistently
- [ ] Protect all API routes
- [ ] Check permissions before rendering
- [ ] Sanitize user-generated content
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add CSRF protection

---

**Quick Tip**: Keep this file open while developing for fast reference!
