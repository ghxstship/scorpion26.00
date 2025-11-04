# Demo Data Setup Guide

This guide explains how demo users and mock data are managed in the Scorpion26 application.

## Overview

The application uses a **dual-user system**:

1. **Demo Users** (`is_demo=true`): Special accounts with pre-populated mock data for testing and demonstration
2. **Real Users** (`is_demo=false`): Regular users who start with a clean slate

## Key Principles

- ✅ Demo users have pre-populated mock data (workouts, progress, subscriptions, etc.)
- ✅ New users created through normal signup start with **zero mock data**
- ✅ Demo users are identified by the `is_demo` flag in the `profiles` table
- ✅ All demo data is associated only with specific demo user accounts

## Demo User Accounts

The following demo accounts exist for testing different user roles:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| `guest@scorpion26.com` | `guest123` | Guest | Trial user with limited access |
| `member@scorpion26.com` | `member123` | Member | Paid member with full access |
| `collab@scorpion26.com` | `collab123` | Collaborator | External contributor |
| `team@scorpion26.com` | `team123` | Team | Internal team member |
| `admin@scorpion26.com` | `admin123` | Admin | System administrator |

## Database Schema

### `profiles` Table

The `profiles` table includes an `is_demo` column:

```sql
ALTER TABLE public.profiles 
ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
```

- `is_demo = true`: Demo user with mock data
- `is_demo = false`: Real user with clean slate (default)

### New User Trigger

The `handle_new_user()` trigger automatically:

1. Creates a profile for new users
2. Sets `is_demo = true` only for demo email addresses
3. Sets `is_demo = false` for all other users (default)
4. Assigns guest role by default
5. Creates default notification preferences
6. Initializes engagement score

## Setup Instructions

### 1. Run Migrations

Apply the migrations in order:

```bash
# Add is_demo flag to profiles
supabase migration up 20251105000000_add_demo_user_flag.sql

# Seed demo users with mock data
supabase migration up 20251105000001_seed_demo_users.sql

# Update new user trigger
supabase migration up 20251105000002_update_new_user_trigger.sql
```

### 2. Create Demo Users in Supabase

**Option A: Via Supabase Dashboard**

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User"
3. Create each demo user with their email and password
4. Repeat for all 5 demo accounts

**Option B: Via Supabase Auth API**

```javascript
const { data, error } = await supabase.auth.admin.createUser({
  email: 'member@scorpion26.com',
  password: 'member123',
  email_confirm: true
});
```

### 3. Seed Demo Data

Run the seeding script to populate demo users with mock data:

```bash
# Via Supabase SQL Editor
# Copy and paste the contents of scripts/seed-demo-data.sql
# Or run via CLI:
supabase db execute -f scripts/seed-demo-data.sql
```

This script will:
- Mark demo users with `is_demo = true`
- Assign proper roles to demo users
- Create sample programs and workouts
- Add workout logs, body measurements, achievements
- Create community posts and notifications
- Set up subscriptions for demo member

## Mock Data Included for Demo Users

### Demo Member (`member@scorpion26.com`)

- ✅ Active subscription (Monthly Membership)
- ✅ Enrolled in "Demo 30-Day Transformation" program
- ✅ 3 completed workout logs with notes
- ✅ Body measurements over 30 days showing progress
- ✅ 2 achievements earned
- ✅ 2 community posts
- ✅ 3 notifications (1 read, 2 unread)
- ✅ Engagement score and activity metrics

### Demo Collaborator (`collab@scorpion26.com`)

- ✅ 2 content submissions (1 approved, 1 pending)

### Demo Guest (`guest@scorpion26.com`)

- ✅ 1 support ticket (resolved)

### Demo Admin/Team

- ✅ Created sample programs and workouts
- ✅ Can access all admin features

## Verification

### Check Demo Users

```sql
-- List all demo users
SELECT id, email, is_demo, created_at 
FROM public.profiles 
WHERE is_demo = true;

-- Count mock data for demo member
SELECT 
  (SELECT COUNT(*) FROM workout_logs WHERE user_id = 'DEMO_MEMBER_ID') as workout_logs,
  (SELECT COUNT(*) FROM body_measurements WHERE user_id = 'DEMO_MEMBER_ID') as measurements,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id = 'DEMO_MEMBER_ID') as achievements,
  (SELECT COUNT(*) FROM posts WHERE user_id = 'DEMO_MEMBER_ID') as posts;
```

### Test New User Creation

```sql
-- Create a test user (via Supabase Auth)
-- Then check their profile
SELECT id, email, is_demo, created_at 
FROM public.profiles 
WHERE email = 'testuser@example.com';

-- Should return is_demo = false

-- Verify they have no mock data
SELECT COUNT(*) FROM workout_logs WHERE user_id = 'TEST_USER_ID';
-- Should return 0
```

## Important Notes

### For Development

- Demo users are perfect for testing features
- Use demo credentials to explore different user roles
- Mock data is realistic and comprehensive

### For Production

- Demo users should be disabled or removed in production
- Consider using feature flags to hide demo login credentials
- Regular users will never see or access demo data
- Each user's data is isolated via Row Level Security (RLS)

### Data Isolation

- RLS policies ensure users can only access their own data
- Demo users cannot access real user data
- Real users cannot access demo user data
- Admin users have elevated permissions

## Maintenance

### Re-seed Demo Data

To refresh demo data (useful after testing):

```bash
# Run the seed script again
supabase db execute -f scripts/seed-demo-data.sql
```

The script is idempotent and will:
- Delete existing demo data
- Re-create fresh mock data
- Preserve demo user accounts

### Clean Up Demo Data

To remove all demo data but keep users:

```sql
-- Delete demo user data
DELETE FROM workout_logs WHERE user_id IN (
  SELECT id FROM profiles WHERE is_demo = true
);
DELETE FROM body_measurements WHERE user_id IN (
  SELECT id FROM profiles WHERE is_demo = true
);
-- ... repeat for other tables
```

### Remove Demo Users

To completely remove demo users:

```sql
-- This will cascade delete all their data
DELETE FROM auth.users WHERE email IN (
  'guest@scorpion26.com',
  'member@scorpion26.com',
  'collab@scorpion26.com',
  'team@scorpion26.com',
  'admin@scorpion26.com'
);
```

## Troubleshooting

### Demo users don't have mock data

1. Verify users exist in `auth.users`
2. Check `is_demo` flag in `profiles` table
3. Run the seed script: `scripts/seed-demo-data.sql`

### New users are getting mock data

1. Check the `handle_new_user()` trigger
2. Verify `is_demo` is set to `false` for new users
3. Ensure email is not in the demo user list

### Mock data appears in wrong user account

1. Check RLS policies are enabled
2. Verify user_id associations in data tables
3. Review the seed script for correct user_id references

## Related Files

- `/supabase/migrations/20251105000000_add_demo_user_flag.sql` - Adds is_demo column
- `/supabase/migrations/20251105000001_seed_demo_users.sql` - Seeds demo data
- `/supabase/migrations/20251105000002_update_new_user_trigger.sql` - Updates signup trigger
- `/scripts/seed-demo-data.sql` - Utility script to re-seed demo data
- `/lib/auth/demo-auth.ts` - Demo user credentials and authentication

## Support

For questions or issues with demo data setup, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Project README](../../README.md)
- [Database Schema](../../supabase-schema.sql)
