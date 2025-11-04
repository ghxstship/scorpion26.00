# ⚡ QUICK DEPLOY - Gamification System

## 🎯 Deploy in 15 Minutes

### Step 1: Open Supabase SQL Editor (2 min)
🔗 https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/sql

### Step 2: Run Migration 1 - Tables (5 min)
1. Open file: `/migrations/20251104040000_gamification_system.sql`
2. Copy all contents (Cmd+A, Cmd+C)
3. Paste into SQL Editor
4. Click "Run" button
5. Wait for "Success" message

### Step 3: Run Migration 2 - Functions (3 min)
1. Open file: `/migrations/20251104040001_gamification_functions.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click "Run"
5. Wait for "Success"

### Step 4: Run Migration 3 - Badges (3 min)
1. Open file: `/migrations/20251104040002_gamification_seed_badges.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click "Run"
5. Wait for "Success"

### Step 5: Initialize Users (2 min)
Paste and run in SQL Editor:
```sql
INSERT INTO user_stats (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
```

## ✅ Verify (2 min)

Run these quick checks:

```sql
-- Should return 9
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name IN ('badges', 'user_badges', 'user_stats', 'challenges', 
'challenge_participants', 'leaderboard_entries', 'xp_transactions', 
'streak_history', 'milestones');

-- Should return 54
SELECT COUNT(*) FROM badges;
```

## 🎉 Test (3 min)

```bash
npm run dev
```

Visit:
- http://localhost:3000/member/achievements
- http://localhost:3000/member/challenges
- http://localhost:3000/member/leaderboard

## 🚀 Done!

Your gamification system is live! 🎮

**Next**: See `/docs/GAMIFICATION_INTEGRATION_GUIDE.md` to integrate with workouts.
