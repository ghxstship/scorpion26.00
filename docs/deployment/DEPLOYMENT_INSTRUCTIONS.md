# 🚀 Gamification System - Deployment Instructions

## ✅ Prerequisites Complete
- ✅ Dependencies installed (`react-confetti`, `framer-motion`)
- ✅ Database migrations created
- ✅ UI pages implemented
- ✅ Documentation complete

## 📊 Database Deployment (Choose One Method)

### Method 1: Supabase SQL Editor (RECOMMENDED)

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/sql
   - Or: Dashboard → SQL Editor → New Query

2. **Run Migration 1: Gamification Tables**
   - Open file: `/migrations/20251104040000_gamification_system.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run" or press Cmd+Enter
   - Wait for completion (should see "Success")

3. **Run Migration 2: RPC Functions**
   - Open file: `/migrations/20251104040001_gamification_functions.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run"
   - Wait for completion

4. **Run Migration 3: Badge Seed Data**
   - Open file: `/migrations/20251104040002_gamification_seed_badges.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run"
   - Wait for completion

5. **Initialize User Stats** (if you have existing users)
   ```sql
   INSERT INTO user_stats (user_id)
   SELECT id FROM auth.users
   ON CONFLICT (user_id) DO NOTHING;
   ```

### Method 2: Supabase CLI (Alternative)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref bxciawidudkgtuxbonjf

# Push migrations
supabase db push
```

### Method 3: Direct PostgreSQL Connection (Advanced)

If you have PostgreSQL client installed:

```bash
# Get your connection string from Supabase Dashboard
# Settings → Database → Connection String (Direct)

# Run migrations
psql "your_connection_string" -f migrations/20251104040000_gamification_system.sql
psql "your_connection_string" -f migrations/20251104040001_gamification_functions.sql
psql "your_connection_string" -f migrations/20251104040002_gamification_seed_badges.sql
```

## ✅ Verification Steps

### 1. Check Tables Created
Run in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'badges', 'user_badges', 'user_stats', 
  'challenges', 'challenge_participants', 
  'leaderboard_entries', 'xp_transactions', 
  'streak_history', 'milestones'
);
```
**Expected**: Should return 9 rows

### 2. Check Badges Seeded
```sql
SELECT category, COUNT(*) as count 
FROM badges 
GROUP BY category;
```
**Expected**: 
- workout: 8
- streak: 8
- distance: 8
- social: 12
- special: 18

### 3. Check RPC Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'award_xp', 'update_streak', 'check_and_award_badges',
  'update_challenge_progress', 'refresh_leaderboards'
);
```
**Expected**: Should return 5 rows

### 4. Test Badge Auto-Award
```sql
-- Create a test user stat entry
INSERT INTO user_stats (user_id, total_workouts) 
VALUES ('00000000-0000-0000-0000-000000000001', 10)
ON CONFLICT (user_id) DO UPDATE SET total_workouts = 10;

-- Check for badges
SELECT * FROM check_and_award_badges('00000000-0000-0000-0000-000000000001');
```

## 🎯 Test the System

### 1. Visit Pages
- **Achievements**: http://localhost:3000/member/achievements
- **Challenges**: http://localhost:3000/member/challenges
- **Leaderboard**: http://localhost:3000/member/leaderboard

### 2. Test Badge Earning
```typescript
// In your browser console or test file
import { checkAndAwardBadges } from '@/lib/gamification/badge-engine';

// Test with your user ID
const result = await checkAndAwardBadges('your-user-id');
console.log('New badges:', result.newBadges);
```

### 3. Test XP Award
```typescript
import { awardXP } from '@/lib/gamification/badge-engine';

const result = await awardXP('your-user-id', 100, 'workout');
console.log('Level up:', result.levelUp);
console.log('New level:', result.newLevel);
```

## 🔧 Troubleshooting

### Issue: Tables Already Exist
**Solution**: Tables have `IF NOT EXISTS` clauses, so re-running is safe. If you need to reset:
```sql
-- WARNING: This deletes all gamification data
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS streak_history CASCADE;
DROP TABLE IF EXISTS xp_transactions CASCADE;
DROP TABLE IF EXISTS leaderboard_entries CASCADE;
DROP TABLE IF EXISTS challenge_participants CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

-- Then re-run migrations
```

### Issue: RLS Policies Conflict
**Solution**: Policies have unique names. If conflicts occur, drop them first:
```sql
-- Drop all gamification policies
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON badges;
DROP POLICY IF EXISTS "Users can view all badges" ON user_badges;
-- ... etc
```

### Issue: Functions Already Exist
**Solution**: Functions use `CREATE OR REPLACE`, so re-running updates them.

### Issue: Badge Seed Data Duplicates
**Solution**: Seed data uses `ON CONFLICT DO NOTHING`, so re-running is safe.

## 📈 Post-Deployment Tasks

### 1. Schedule Leaderboard Refresh (Optional)
If you have pg_cron enabled:
```sql
SELECT cron.schedule(
  'refresh-leaderboards',
  '0 0 * * *', -- Daily at midnight
  $$SELECT refresh_leaderboards()$$
);
```

### 2. Create Sample Challenge (Optional)
```sql
INSERT INTO challenges (
  name, 
  description, 
  challenge_type, 
  goal_type, 
  goal_value, 
  start_date, 
  end_date, 
  xp_reward, 
  is_active
) VALUES (
  '30-Day Fitness Challenge',
  'Complete 30 workouts in 30 days',
  'workouts',
  'individual',
  30,
  NOW(),
  NOW() + INTERVAL '30 days',
  1000,
  true
);
```

### 3. Monitor Engagement
```sql
-- Daily active users
SELECT COUNT(DISTINCT user_id) 
FROM streak_history 
WHERE streak_date = CURRENT_DATE;

-- Badges earned today
SELECT COUNT(*) 
FROM user_badges 
WHERE earned_at::date = CURRENT_DATE;

-- Active challenges
SELECT name, COUNT(cp.id) as participants
FROM challenges c
LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
WHERE c.is_active = true
GROUP BY c.id, c.name;
```

## ✅ Deployment Checklist

- [ ] Migration 1: Tables created
- [ ] Migration 2: Functions created
- [ ] Migration 3: Badges seeded
- [ ] User stats initialized
- [ ] Tables verified (9 tables)
- [ ] Badges verified (54 badges)
- [ ] Functions verified (5 functions)
- [ ] Achievements page loads
- [ ] Challenges page loads
- [ ] Leaderboard page loads
- [ ] Badge auto-award tested
- [ ] XP award tested
- [ ] Streak tracking tested

## 🎉 Success!

Once all checklist items are complete, your gamification system is live!

**Next Steps**:
1. Integrate with workout completion (see `/docs/GAMIFICATION_INTEGRATION_GUIDE.md`)
2. Monitor engagement metrics
3. Create your first challenge
4. Announce to users

## 📚 Documentation

- **Quick Start**: `/docs/GAMIFICATION_QUICKSTART.md`
- **Full Documentation**: `/docs/GAMIFICATION_SYSTEM_COMPLETE.md`
- **Integration Guide**: `/docs/GAMIFICATION_INTEGRATION_GUIDE.md`
- **API Reference**: See full documentation

## 🆘 Need Help?

1. Check documentation in `/docs/` folder
2. Review SQL migration files for table structure
3. Test functions individually in SQL Editor
4. Check Supabase logs for errors

---

**Your Supabase Project**: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf

**Status**: Ready to deploy! 🚀
