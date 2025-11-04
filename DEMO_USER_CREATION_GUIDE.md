# Demo User Creation & Seeding Guide

## Step 1: Create Demo Users in Supabase Dashboard

### Go to your Supabase Dashboard:
🔗 https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/auth/users

### Create 5 Users:

Click **"Add User"** for each of these:

#### 1. Guest User
- Email: `guest@scorpion26.com`
- Password: `guest123`
- ✅ **Check "Auto Confirm User"**

#### 2. Member User
- Email: `member@scorpion26.com`
- Password: `member123`
- ✅ **Check "Auto Confirm User"**

#### 3. Collaborator User
- Email: `collab@scorpion26.com`
- Password: `collab123`
- ✅ **Check "Auto Confirm User"**

#### 4. Team User
- Email: `team@scorpion26.com`
- Password: `team123`
- ✅ **Check "Auto Confirm User"**

#### 5. Admin User
- Email: `admin@scorpion26.com`
- Password: `admin123`
- ✅ **Check "Auto Confirm User"**

**IMPORTANT**: Make sure to check "Auto Confirm User" for each one so they can log in immediately!

---

## Step 2: Verify Users Were Created

### Option A: Via Supabase Dashboard SQL Editor

Go to: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/sql/new

Paste and run this query:

```sql
SELECT 
  au.email,
  au.created_at as user_created,
  p.is_demo,
  r.name as current_role
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id AND ur.is_active = true
LEFT JOIN public.roles r ON r.id = ur.role_id
WHERE au.email IN (
  'guest@scorpion26.com',
  'member@scorpion26.com',
  'collab@scorpion26.com',
  'team@scorpion26.com',
  'admin@scorpion26.com'
)
ORDER BY au.email;
```

**Expected Result**: 5 rows showing all demo users

---

## Step 3: Seed Demo Data

### Via Supabase Dashboard SQL Editor

1. Go to: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/sql/new
2. Open the file: `scripts/seed-demo-data.sql` in your editor
3. Copy the ENTIRE contents
4. Paste into the SQL Editor
5. Click **"Run"**
6. Wait for completion (should see success messages)

### What Gets Created:

The seed script will create:
- ✅ Sample workout program ("Demo 30-Day Transformation")
- ✅ 3 sample workouts
- ✅ Workout logs for demo member (3 entries)
- ✅ Body measurements (4 entries showing progress)
- ✅ Achievements (2 earned)
- ✅ Community posts (2 posts)
- ✅ Notifications (3 notifications)
- ✅ Active subscription for demo member
- ✅ Content submissions for demo collaborator
- ✅ Support ticket for demo guest
- ✅ Proper role assignments for all demo users

---

## Step 4: Verify Seeding Was Successful

Run this query in SQL Editor:

```sql
-- Count demo member's data
SELECT 
  (SELECT COUNT(*) FROM workout_logs WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as workout_logs,
  (SELECT COUNT(*) FROM body_measurements WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as measurements,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as achievements,
  (SELECT COUNT(*) FROM posts WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as posts,
  (SELECT COUNT(*) FROM notifications WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as notifications,
  (SELECT COUNT(*) FROM subscriptions WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as subscriptions;
```

**Expected Results:**
- workout_logs: 3
- measurements: 4
- achievements: 2
- posts: 2
- notifications: 3
- subscriptions: 1

---

## Step 5: Test Demo Login

### Start Your Development Server

```bash
npm run dev
```

### Test Login

1. Go to: http://localhost:3000/login
2. Use these credentials:
   - **Email**: `member@scorpion26.com`
   - **Password**: `member123`
3. Click "Login"

### What You Should See:

✅ Dashboard with workout history
✅ Progress charts with data
✅ Body measurements graph
✅ Achievements earned
✅ Community posts
✅ Notifications
✅ Active subscription status

---

## Step 6: Test New User (Clean Slate)

### Create a Test User

1. Sign up with a new email (e.g., `testuser@example.com`)
2. Complete registration

### Verify Clean Slate

Run this in SQL Editor:

```sql
-- Check new user has no demo data
SELECT 
  email, 
  is_demo,
  (SELECT COUNT(*) FROM workout_logs WHERE user_id = profiles.id) as workout_count
FROM profiles 
WHERE email = 'testuser@example.com';
```

**Expected Result:**
- is_demo: false
- workout_count: 0

---

## Troubleshooting

### Users Not Showing Up

If users don't appear after creation:
1. Refresh the Authentication > Users page
2. Check email confirmations
3. Make sure "Auto Confirm User" was checked

### Seeding Fails

If seeding fails:
1. Make sure all 5 users exist first
2. Check for error messages in SQL Editor
3. Try running the seed script again (it's idempotent)

### No Mock Data Appears

1. Verify seeding completed successfully
2. Check the verification query results
3. Make sure you're logged in as `member@scorpion26.com`
4. Clear browser cache and try again

---

## Quick Reference

### Demo User Credentials

| Email | Password | Role | Has Data |
|-------|----------|------|----------|
| `guest@scorpion26.com` | `guest123` | Guest | Minimal |
| `member@scorpion26.com` | `member123` | Member | Full |
| `collab@scorpion26.com` | `collab123` | Collaborator | Submissions |
| `team@scorpion26.com` | `team123` | Team | Access |
| `admin@scorpion26.com` | `admin123` | Admin | Full Access |

### Useful Links

- **Auth Users**: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/auth/users
- **SQL Editor**: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/editor

---

**Status**: Ready to create users and seed data!
