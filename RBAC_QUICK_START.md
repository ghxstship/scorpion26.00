# RBAC System - Quick Start Guide

## Demo Login Credentials

Test the RBAC system with these demo accounts:

### 🔓 Guest (Trial Access)
```
Email: guest@scorpion26.com
Password: guest123
```
**What you'll see:**
- Trial access banner with upgrade prompt
- Limited features (basic workouts, view-only community)
- Locked premium features
- 14-day trial countdown

---

### 👤 Member (Subscription Access)
```
Email: member@scorpion26.com
Password: member123
```
**What you'll see:**
- Full member dashboard
- Workout statistics and progress tracking
- Achievement badges
- Quick action buttons
- Recent activity feed
- Member discounts badge

---

### 🤝 Collaborator (3rd Party Access)
```
Email: collab@scorpion26.com
Password: collab123
```
**What you'll see:**
- Project-based dashboard
- Assigned projects (Project Alpha, Project Beta)
- Collaboration tools
- Recent contributions
- Comment and document features

---

### 💼 Team (Internal Staff)
```
Email: team@scorpion26.com
Password: team123
```
**What you'll see:**
- Team member dashboard
- Platform analytics (members, engagement)
- Content management tools
- Support queue
- Member activity feed
- Moderation tools

---

### 🛡️ Admin (Full Access)
```
Email: admin@scorpion26.com
Password: admin123
```
**What you'll see:**
- Administrator dashboard
- System health metrics
- User management
- Revenue analytics
- Security alerts
- Admin panel access (`/admin`)
- Role management (`/admin/roles`)

---

## Quick Test Flow

1. **Start with Guest**
   - Login as guest to see trial limitations
   - Notice upgrade prompts and locked features

2. **Switch to Member**
   - Logout and login as member
   - See full member features unlocked
   - Check workout stats and achievements

3. **Try Collaborator**
   - Login as collaborator
   - View project-specific access
   - Different focus than member role

4. **Test Team Access**
   - Login as team member
   - Access content management
   - View platform analytics

5. **Explore Admin Panel**
   - Login as admin
   - Visit `/admin` for admin panel
   - Check `/admin/roles` for role management
   - See all system controls

---

## Key Features to Test

### Role Badge Display
- Each dashboard shows a colored role badge in the header
- Colors: Guest (gray), Member (blue), Collaborator (purple), Team (green), Admin (red)

### Navigation Changes
- Header shows "Dashboard" button when logged in
- Replaces "Login" and "Start Free Trial" buttons
- Updates immediately on login/logout

### Access Control
- Try accessing `/admin` with non-admin roles
- See "Access Denied" message
- Automatic redirect to appropriate page

### Dashboard Variations
- Each role has completely different dashboard layout
- Content tailored to role responsibilities
- Unique quick actions per role

### Permission-Based UI
- Features show/hide based on role
- Upgrade prompts for guests
- Admin tools only for admins

---

## Testing Checklist

- [ ] Login with all 5 roles
- [ ] Verify each dashboard is unique
- [ ] Check role badge displays correctly
- [ ] Test admin panel access (admin only)
- [ ] Verify role management page (admin only)
- [ ] Test logout functionality
- [ ] Confirm navigation updates on auth change
- [ ] Try accessing protected routes with different roles

---

## Common Use Cases

### Scenario 1: New User Trial
```
Role: Guest
Goal: Explore platform before subscribing
Access: Limited trial features
```

### Scenario 2: Paying Customer
```
Role: Member
Goal: Full access to fitness programs
Access: All member features and content
```

### Scenario 3: External Trainer
```
Role: Collaborator
Goal: Work on specific client projects
Access: Assigned projects only
```

### Scenario 4: Content Manager
```
Role: Team
Goal: Manage platform content and support
Access: Content tools and analytics
```

### Scenario 5: Platform Owner
```
Role: Admin
Goal: Full system management
Access: Everything including user/role management
```

---

## Next Steps

1. **Customize Dashboards**: Edit dashboard components in `/components/dashboard/`
2. **Add Permissions**: Extend `Permission` enum in `/lib/auth/rbac-types.ts`
3. **Create New Roles**: Add to `UserRole` enum and configure permissions
4. **Protect Routes**: Use permission checks in page components
5. **Add Real Auth**: Replace demo auth with production authentication

---

## Need Help?

- See `RBAC_SYSTEM.md` for complete documentation
- Check `lib/auth/rbac-utils.ts` for utility functions
- Review `lib/auth/rbac-types.ts` for all permissions
- Look at dashboard components for implementation examples
