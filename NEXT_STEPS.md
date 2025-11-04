# ✅ Next Steps - Demo User Setup

## Status: Migrations Applied Successfully ✅

The following migrations have been applied to your Supabase database:
- ✅ `20251105000000_add_demo_user_flag.sql` - Added is_demo column
- ✅ `20251105000001_seed_demo_users.sql` - Demo user seeding structure
- ✅ `20251105000002_update_new_user_trigger.sql` - Updated signup trigger

## 📋 Remaining Steps

### Step 1: Create Demo Users in Supabase Dashboard

Go to: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/auth/users

Click **"Add User"** and create these 5 users:

#### User 1: Guest
- Email: `guest@scorpion26.com`
- Password: `guest123`
- ✅ Check "Auto Confirm User"

#### User 2: Member
- Email: `member@scorpion26.com`
- Password: `member123`
- ✅ Check "Auto Confirm User"

#### User 3: Collaborator
- Email: `collab@scorpion26.com`
- Password: `collab123`
- ✅ Check "Auto Confirm User"

#### User 4: Team
- Email: `team@scorpion26.com`
- Password: `team123`
- ✅ Check "Auto Confirm User"

#### User 5: Admin
- Email: `admin@scorpion26.com`
- Password: `admin123`
- ✅ Check "Auto Confirm User"

**Important**: Make sure to check "Auto Confirm User" for each one!

### Step 2: Seed Demo Data

After creating all 5 demo users, run this command:

```bash
npx supabase db execute -f scripts/seed-demo-data.sql
```

This will populate the demo users with:
- Sample workout programs
- Workout logs and progress
- Body measurements
- Achievements
- Community posts
- Notifications
- Subscriptions
- And more!

### Step 3: Verify Setup

Run this command to verify:

```bash
npx supabase db execute --sql "SELECT email, is_demo FROM profiles WHERE is_demo = true ORDER BY email;"
```

You should see all 5 demo users listed with `is_demo = true`.

### Step 4: Test Demo Login

1. Start your dev server: `npm run dev`
2. Go to the login page
3. Login with:
   - Email: `member@scorpion26.com`
   - Password: `member123`
4. You should see a dashboard with mock data!

## 🎯 Quick Commands

```bash
# Seed demo data (after creating users)
npx supabase db execute -f scripts/seed-demo-data.sql

# Verify demo users
npx supabase db execute --sql "SELECT email, is_demo FROM profiles WHERE is_demo = true;"

# Check demo member's data
npx supabase db execute --sql "SELECT COUNT(*) as workout_count FROM workout_logs WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com');"

# Start dev server
npm run dev
```

## 🔍 Verification Queries

After seeding, you can run these in Supabase SQL Editor to verify:

```sql
-- List all demo users
SELECT email, is_demo, created_at 
FROM profiles 
WHERE is_demo = true
ORDER BY email;

-- Count demo member's data
SELECT 
  (SELECT COUNT(*) FROM workout_logs WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as workout_logs,
  (SELECT COUNT(*) FROM body_measurements WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as measurements,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as achievements,
  (SELECT COUNT(*) FROM posts WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as posts,
  (SELECT COUNT(*) FROM notifications WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as notifications;
```

Expected results after seeding:
- workout_logs: 3
- measurements: 4
- achievements: 2
- posts: 2
- notifications: 3

## 📚 Documentation

- Full setup guide: `SETUP_INSTRUCTIONS.md`
- Implementation details: `DEMO_DATA_IMPLEMENTATION_SUMMARY.md`
- Maintenance guide: `docs/guides/DEMO_DATA_SETUP.md`

---

**Current Status**: ✅ Migrations applied, waiting for demo users to be created
**Next Action**: Create 5 demo users in Supabase Dashboard
