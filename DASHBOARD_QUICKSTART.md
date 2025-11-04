# Dashboard System Quick Start Guide

Get up and running with the multi-role dashboard system in 5 minutes.

## 🚀 Quick Start

### 1. Test the Dashboard (2 minutes)

Visit the login page and try different roles:

```
URL: http://localhost:3000/login

Demo Credentials:
┌─────────────┬──────────────────────────┬─────────────┐
│ Role        │ Email                    │ Password    │
├─────────────┼──────────────────────────┼─────────────┤
│ Guest       │ guest@scorpion26.com     │ guest123    │
│ Member      │ member@scorpion26.com    │ member123   │
│ Collaborator│ collab@scorpion26.com    │ collab123   │
│ Team        │ team@scorpion26.com      │ team123     │
│ Admin       │ admin@scorpion26.com     │ admin123    │
└─────────────┴──────────────────────────┴─────────────┘
```

### 2. Explore Role-Specific Features (3 minutes)

**As Guest**:
- See trial countdown
- Limited workout access
- Upgrade prompts

**As Member**:
- Full workout library
- Progress tracking
- Community features
- Achievements

**As Team**:
- Content management
- Support tickets
- Member queries
- Team analytics

**As Admin**:
- User management
- System health
- Revenue metrics
- All permissions

## 📋 Common Tasks

### Add a New Navigation Item

Edit `lib/navigation/navigation-config.ts`:

```typescript
[UserRole.MEMBER]: [
  {
    section: "Training",
    items: [
      // Add your new item here
      { 
        label: "Nutrition Plans", 
        icon: "Apple", 
        path: "/member/nutrition" 
      },
    ],
  },
]
```

### Create a Custom Widget

1. Create widget component:

```typescript
// components/widgets/my-widget.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyWidget({ title, data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your content */}
      </CardContent>
    </Card>
  );
}
```

2. Use in dashboard:

```typescript
// components/dashboard/member-dashboard.tsx
import MyWidget from "@/components/widgets/my-widget";

<MyWidget title="My Data" data={myData} />
```

### Protect an API Route

```typescript
// app/api/my-route/route.ts
import { requireRole } from "@/lib/api/middleware";
import { UserRole } from "@/lib/auth/rbac-types";

export const GET = requireRole(UserRole.MEMBER)(async (request) => {
  // Only members and above can access
  return NextResponse.json({ data: "protected" });
});
```

### Check Permission in Component

```typescript
import { hasPermission } from "@/lib/auth/rbac-utils";
import { Permission } from "@/lib/auth/rbac-types";

const user = getCurrentUser();

if (hasPermission(user.role, Permission.MANAGE_CONTENT)) {
  return <ContentEditor />;
}

return <ContentViewer />;
```

## 🎯 Key Files to Know

```
lib/auth/rbac-types.ts        → Add permissions here
lib/navigation/navigation-config.ts → Add navigation items
lib/api/middleware.ts         → API protection utilities
components/layouts/dashboard-layout.tsx → Main layout
components/dashboard/         → Role-specific dashboards
```

## 🔧 Customization Checklist

- [ ] Update brand colors in `tailwind.config.ts`
- [ ] Replace logo in `DashboardLayout` component
- [ ] Customize navigation for your use case
- [ ] Add your own widgets
- [ ] Configure permissions for your needs
- [ ] Update demo credentials
- [ ] Add your API routes with middleware

## 🚨 Before Production

### Must Do:
1. ✅ Replace demo authentication with real auth (NextAuth, Supabase, etc.)
2. ✅ Add database for users, roles, permissions
3. ✅ Implement JWT token validation
4. ✅ Add rate limiting (Redis)
5. ✅ Set up audit logging
6. ✅ Configure environment variables
7. ✅ Add input validation (Zod)
8. ✅ Implement CSRF protection
9. ✅ Set up error tracking (Sentry)
10. ✅ Add comprehensive tests

### Security Checklist:
- [ ] All API routes protected with middleware
- [ ] JWT tokens validated server-side
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced in production
- [ ] Rate limiting per role
- [ ] Input sanitization on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens on state-changing operations

## 📖 Next Steps

1. **Read Full Documentation**: [DASHBOARD_SYSTEM.md](./DASHBOARD_SYSTEM.md)
2. **Understand RBAC**: [RBAC_SYSTEM.md](./RBAC_SYSTEM.md)
3. **Review Examples**: Check `app/api/example/` for API patterns
4. **Customize**: Adapt to your specific requirements
5. **Test**: Try all roles and permissions
6. **Deploy**: Follow production checklist

## 💡 Tips

- **Start Simple**: Begin with existing widgets, customize later
- **Test Each Role**: Log in as each role to verify permissions
- **Use TypeScript**: Leverage type safety for permissions
- **Follow Patterns**: Use existing API routes as templates
- **Mobile First**: Test on mobile devices early

## 🆘 Troubleshooting

**Dashboard not loading?**
- Check if user is authenticated
- Verify role is valid
- Check browser console for errors

**Navigation not showing?**
- Verify role in `navigation-config.ts`
- Check path matches route structure

**API route returning 403?**
- Verify user has required permission
- Check middleware configuration
- Test with admin role first

**Widgets not displaying?**
- Check component imports
- Verify data structure
- Review browser console

## 📞 Getting Help

1. Check [DASHBOARD_SYSTEM.md](./DASHBOARD_SYSTEM.md) for detailed docs
2. Review example implementations in `app/api/example/`
3. Test with demo credentials to isolate issues
4. Verify permissions in `rbac-types.ts`

---

**Ready to build?** Start by logging in with different roles and exploring the features! 🚀
