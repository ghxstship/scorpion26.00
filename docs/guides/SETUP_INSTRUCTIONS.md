# Setup Instructions - Apply Migrations and Create Demo Users

## Prerequisites

You need your Supabase project credentials. Get them from:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the following:
   - Project URL
   - Project API Key (anon/public)
   - Service Role Key (for admin operations)

## Step 1: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration (optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## Step 2: Apply Migrations

### Option A: Via Supabase Dashboard (Recommended for Remote Projects)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of each migration file in order:

   **Migration 1: Add is_demo flag**
   ```bash
   # Copy contents from:
   supabase/migrations/20251105000000_add_demo_user_flag.sql
   ```
   
   **Migration 2: Seed demo users**
   ```bash
   # Copy contents from:
   supabase/migrations/20251105000001_seed_demo_users.sql
   ```
   
   **Migration 3: Update trigger**
   ```bash
   # Copy contents from:
   supabase/migrations/20251105000002_update_new_user_trigger.sql
   ```

5. Run each query by clicking **Run**

### Option B: Via Supabase CLI (For Local Development)

If you want to use the CLI with a remote project:

```bash
# Link to your remote project
npx supabase link --project-ref your-project-ref

# Apply all pending migrations
npx supabase db push

# Or apply migrations manually
npx supabase db execute -f supabase/migrations/20251105000000_add_demo_user_flag.sql
npx supabase db execute -f supabase/migrations/20251105000001_seed_demo_users.sql
npx supabase db execute -f supabase/migrations/20251105000002_update_new_user_trigger.sql
```

## Step 3: Create Demo Users

Go to your Supabase Dashboard and create the demo users:

1. Navigate to **Authentication > Users**
2. Click **Add User** (or **Invite User**)
3. Create each demo user:

### Demo User 1: Guest
- **Email**: `guest@scorpion26.com`
- **Password**: `guest123`
- **Auto Confirm User**: ✅ Yes

### Demo User 2: Member
- **Email**: `member@scorpion26.com`
- **Password**: `member123`
- **Auto Confirm User**: ✅ Yes

### Demo User 3: Collaborator
- **Email**: `collab@scorpion26.com`
- **Password**: `collab123`
- **Auto Confirm User**: ✅ Yes

### Demo User 4: Team
- **Email**: `team@scorpion26.com`
- **Password**: `team123`
- **Auto Confirm User**: ✅ Yes

### Demo User 5: Admin
- **Email**: `admin@scorpion26.com`
- **Password**: `admin123`
- **Auto Confirm User**: ✅ Yes

**Important**: Make sure to check "Auto Confirm User" so they can log in immediately without email verification.

## Step 4: Seed Demo Data

### Option A: Via Supabase Dashboard SQL Editor

1. Go to **SQL Editor** in your Supabase Dashboard
2. Click **New Query**
3. Copy the entire contents of `scripts/seed-demo-data.sql`
4. Paste into the SQL Editor
5. Click **Run**
6. You should see success messages in the output

### Option B: Via CLI (if linked)

```bash
npx supabase db execute -f scripts/seed-demo-data.sql
```

## Step 5: Verify Setup

### Check Demo Users Were Created

Run this query in SQL Editor:

```sql
-- List all demo users
SELECT id, email, is_demo, created_at 
FROM public.profiles 
WHERE is_demo = true
ORDER BY email;
```

You should see all 5 demo users with `is_demo = true`.

### Check Demo Data Was Seeded

```sql
-- Count demo member's data
SELECT 
  (SELECT COUNT(*) FROM workout_logs WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as workout_logs,
  (SELECT COUNT(*) FROM body_measurements WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as measurements,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as achievements,
  (SELECT COUNT(*) FROM posts WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as posts,
  (SELECT COUNT(*) FROM notifications WHERE user_id IN (SELECT id FROM profiles WHERE email = 'member@scorpion26.com')) as notifications;
```

Expected results:
- workout_logs: 3
- measurements: 4
- achievements: 2
- posts: 2
- notifications: 3

### Test Demo Login

1. Start your Next.js app: `npm run dev`
2. Go to the login page
3. Try logging in with demo credentials:
   - Email: `member@scorpion26.com`
   - Password: `member123`
4. You should see the member dashboard with mock data

### Test New User Signup

1. Create a new user through your signup flow
2. Check their profile:
   ```sql
   SELECT id, email, is_demo FROM profiles WHERE email = 'your-test-email@example.com';
   ```
3. Should show `is_demo = false`
4. Verify they have no mock data:
   ```sql
   SELECT COUNT(*) FROM workout_logs WHERE user_id = 'their-user-id';
   ```
5. Should return 0

## Troubleshooting

### Migration Errors

If you get errors about existing columns or functions:

```sql
-- Check if is_demo column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'is_demo';

-- If it exists, you can skip migration 1
```

### Demo Users Not Marked as Demo

```sql
-- Manually mark demo users
UPDATE public.profiles 
SET is_demo = TRUE
WHERE email IN (
  'guest@scorpion26.com',
  'member@scorpion26.com',
  'collab@scorpion26.com',
  'team@scorpion26.com',
  'admin@scorpion26.com'
);
```

### No Mock Data

Re-run the seed script:
```sql
-- In SQL Editor, paste and run:
-- Contents of scripts/seed-demo-data.sql
```

### CLI Connection Issues

If CLI can't connect to remote project:

1. Make sure you're logged in:
   ```bash
   npx supabase login
   ```

2. Link your project:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```

3. Get your project ref from: Dashboard > Settings > General > Reference ID

## Quick Command Reference

```bash
# Install Supabase CLI locally
npm install supabase --save-dev

# Login to Supabase
npx supabase login

# Link to remote project
npx supabase link --project-ref your-project-ref

# Check status
npx supabase status

# Apply migrations
npx supabase db push

# Execute SQL file
npx supabase db execute -f path/to/file.sql

# Start local dev server
npm run dev
```

## Next Steps

After completing setup:

1. ✅ Test all demo user logins
2. ✅ Verify mock data appears correctly
3. ✅ Test new user signup (should have clean slate)
4. ✅ Review `docs/guides/DEMO_DATA_SETUP.md` for maintenance
5. ✅ See `DEMO_DATA_IMPLEMENTATION_SUMMARY.md` for overview

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- Project docs: `docs/guides/DEMO_DATA_SETUP.md`
