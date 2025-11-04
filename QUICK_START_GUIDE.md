# 🚀 Quick Start Guide - New Features

**Last Updated**: November 3, 2025

---

## 🔐 Authentication

### Login
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  }),
});

const { user, session, role } = await response.json();
```

### Register
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  }),
});
```

### Logout
```typescript
await fetch('/api/auth/logout', { method: 'POST' });
```

### Password Reset
```typescript
await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
});
```

---

## 📊 React Query

### Setup (Already Done)
The app is wrapped with QueryClientProvider in `app/providers.tsx`.

### Create a Hook
```typescript
// hooks/use-programs.ts
import { useQuery } from '@tanstack/react-query';

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await fetch('/api/programs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data.data; // Extract data from success response
    },
  });
}
```

### Use in Component
```typescript
'use client';

import { usePrograms } from '@/hooks/use-programs';

export default function ProgramsList() {
  const { data: programs, isLoading, error } = usePrograms();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {programs?.map(program => (
        <div key={program.id}>{program.title}</div>
      ))}
    </div>
  );
}
```

### Mutations
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

// In component
const createProgram = useCreateProgram();
createProgram.mutate({ title: 'New Program', description: '...' });
```

---

## 🛡️ API Middleware

### Require Authentication
```typescript
// app/api/your-route/route.ts
import { withAuth, successResponse } from '@/lib/api/auth-middleware';

export const GET = withAuth(async (request, user) => {
  // user.id, user.email, user.role are available
  return successResponse({ message: `Hello ${user.email}` });
});
```

### Require Permission
```typescript
import { withPermission } from '@/lib/api/auth-middleware';
import { Permission } from '@/lib/auth/rbac-types';

export const POST = withPermission(
  Permission.MANAGE_CONTENT,
  async (request, user) => {
    const body = await request.json();
    // User has MANAGE_CONTENT permission
    return successResponse({ created: true });
  }
);
```

### Require Role
```typescript
import { withRole } from '@/lib/api/auth-middleware';
import { UserRole } from '@/lib/auth/rbac-types';

export const DELETE = withRole(
  [UserRole.ADMIN, UserRole.TEAM],
  async (request, user) => {
    // User is either Admin or Team
    return successResponse({ deleted: true });
  }
);
```

### Require Minimum Role
```typescript
import { withMinRole } from '@/lib/api/auth-middleware';
import { UserRole } from '@/lib/auth/rbac-types';

export const GET = withMinRole(
  UserRole.MEMBER,
  async (request, user) => {
    // User is Member, Team, or Admin
    return successResponse({ data: [] });
  }
);
```

---

## 📧 Email Notifications

### Send Email
```typescript
import { sendEmail, emailTemplates } from '@/lib/email/send';

// Using template
const template = emailTemplates.welcome('John Doe', 'https://app.com/login');
await sendEmail({
  to: 'user@example.com',
  subject: template.subject,
  html: template.html,
});

// Custom email
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Hello!</h1><p>Custom content</p>',
  from: 'custom@yourdomain.com', // optional
  replyTo: 'support@yourdomain.com', // optional
});
```

### Available Templates
```typescript
// Welcome email
emailTemplates.welcome(name, loginUrl)

// Password reset
emailTemplates.passwordReset(resetUrl)

// Workout reminder
emailTemplates.workoutReminder(name, workoutName, workoutUrl)

// Subscription confirmation
emailTemplates.subscriptionConfirmation(name, planName, amount)
```

---

## 📊 Charts

### Using Recharts Widget
```typescript
import RechartsWidget from '@/components/widgets/recharts-widget';

const data = [
  { name: 'Mon', workouts: 4, calories: 2400 },
  { name: 'Tue', workouts: 3, calories: 1398 },
  { name: 'Wed', workouts: 5, calories: 3800 },
  { name: 'Thu', workouts: 2, calories: 3908 },
  { name: 'Fri', workouts: 4, calories: 4800 },
];

export default function Dashboard() {
  return (
    <RechartsWidget
      title="Weekly Activity"
      description="Your workout and calorie stats"
      data={data}
      type="line" // or 'bar' or 'area'
      dataKeys={['workouts', 'calories']}
      colors={['#8884d8', '#82ca9d']}
      height={300}
      showLegend={true}
      showGrid={true}
    />
  );
}
```

### Chart Types
- **Line Chart**: `type="line"` - Best for trends over time
- **Bar Chart**: `type="bar"` - Best for comparisons
- **Area Chart**: `type="area"` - Best for cumulative data

---

## 🔒 Rate Limiting

### Apply to Route
```typescript
import { withRateLimit, RATE_LIMITS } from '@/lib/api/rate-limit';

export const POST = withRateLimit(RATE_LIMITS.auth)(
  async (request) => {
    // This route is rate limited
    return Response.json({ success: true });
  }
);
```

### Custom Limits
```typescript
export const POST = withRateLimit({
  max: 10, // 10 requests
  interval: 60 * 1000, // per minute
})(async (request) => {
  // Custom rate limit
  return Response.json({ success: true });
});
```

---

## 🎯 Common Patterns

### Protected API Route with Validation
```typescript
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

export const POST = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    
    // Create resource
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('programs')
      .insert({ ...validated, created_by: user.id })
      .select()
      .single();
    
    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }
    
    return successResponse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, error.errors);
    }
    return errorResponse('INTERNAL_ERROR', 'Something went wrong', 500);
  }
});
```

### Paginated List with Filters
```typescript
export const GET = withAuth(async (request, user) => {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category');
  
  const supabase = await createClient();
  let query = supabase
    .from('programs')
    .select('*', { count: 'exact' });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });
  
  if (error) {
    return errorResponse('DATABASE_ERROR', error.message, 500);
  }
  
  return successResponse(data, {
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
});
```

---

## 🔧 Environment Variables

### Required
```bash
# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe (Already configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# New - Add these
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Test API Routes
```bash
# Get programs (requires auth)
curl http://localhost:3000/api/programs

# Create program (requires auth + permission)
curl -X POST http://localhost:3000/api/programs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Program","description":"Test"}'
```

---

## 📚 Additional Resources

- **React Query Docs**: https://tanstack.com/query/latest
- **Recharts Docs**: https://recharts.org/
- **Resend Docs**: https://resend.com/docs
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Supabase Auth**: https://supabase.com/docs/guides/auth

---

## 🆘 Troubleshooting

### Authentication Not Working
1. Check Supabase API keys in `.env.local`
2. Verify user exists in Supabase dashboard
3. Check browser console for errors
4. Verify cookies are enabled

### API Routes Return 401
1. Ensure user is logged in
2. Check Supabase session is valid
3. Verify middleware is applied correctly

### Emails Not Sending
1. Check RESEND_API_KEY is set
2. Verify domain is verified in Resend
3. Check EMAIL_FROM matches verified domain
4. Look for errors in server logs

### Webhooks Not Working
1. Verify STRIPE_WEBHOOK_SECRET is correct
2. Check webhook is configured in Stripe dashboard
3. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Check server logs for errors

---

**Need Help?** Check the full documentation in:
- `IMPLEMENTATION_OPPORTUNITIES.md` - Code examples
- `NEXT_STEPS_COMPLETED.md` - What was implemented
- `AUDIT_SUMMARY.md` - Overview

*Last Updated: November 3, 2025*
