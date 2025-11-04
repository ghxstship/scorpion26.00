# 🎮 Gamification System - Quick Start Guide

## 🚀 Quick Deploy (5 Minutes)

### 1. Install Dependencies
```bash
npm install framer-motion react-confetti
```

### 2. Run Database Migrations
```bash
# Connect to your Supabase database and run:
psql $DATABASE_URL -f migrations/20251104040000_gamification_system.sql
psql $DATABASE_URL -f migrations/20251104040001_gamification_functions.sql
psql $DATABASE_URL -f migrations/20251104040002_gamification_seed_badges.sql
```

### 3. Initialize Existing Users
```sql
INSERT INTO user_stats (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
```

### 4. Test the System
Visit these pages to see the gamification in action:
- `/member/achievements` - View badges and XP
- `/member/challenges` - Browse and join challenges
- `/member/leaderboard` - See rankings

## 📊 How It Works

### After a Workout
```typescript
import { awardXP, updateStreak, checkAndAwardBadges } from '@/lib/gamification/badge-engine';

// Award XP
await awardXP(userId, 50, 'workout', workoutId);

// Update streak
await updateStreak(userId);

// Check for new badges
await checkAndAwardBadges(userId);

// Update stats
await supabase
  .from('user_stats')
  .update({
    total_workouts: total_workouts + 1,
    total_distance_km: total_distance_km + distance
  })
  .eq('user_id', userId);
```

### Create a Challenge
```typescript
import { createChallenge } from '@/lib/gamification/challenge-system';

await createChallenge({
  name: '30-Day Fitness Challenge',
  description: 'Complete 30 workouts in 30 days',
  challenge_type: 'workouts',
  goal_type: 'individual',
  goal_value: 30,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  xp_reward: 1000,
  is_active: true,
  created_by: userId
});
```

## 🎯 Key Features

### 54 Badges Across 5 Categories
- **Workout**: 1 to 2500 workouts
- **Streak**: 7 to 500 days
- **Distance**: 1km to 10,000km
- **Social**: Friends and kudos
- **Special**: Unique achievements

### XP & Leveling
- Progressive XP requirements
- Level = `floor(sqrt(xp/100)) + 1`
- XP from workouts, badges, challenges, streaks

### Challenges
- Time-bound competitions
- Real-time leaderboards
- Individual, team, and community goals

### Leaderboards
- Global XP rankings
- Workout count rankings
- All-time, monthly, weekly periods

## 📱 UI Components

### Achievements Page
```typescript
// Shows:
- Current level and XP progress
- Earned badges (54 total)
- Badge progress for locked badges
- Current streak
- Stats overview
```

### Challenges Page
```typescript
// Shows:
- Available challenges to join
- Active challenges with progress
- Completed challenges
- Time remaining
- Participant rankings
```

### Leaderboard Page
```typescript
// Shows:
- XP leaderboard
- Workouts leaderboard
- User's current rank
- Top 3 medal indicators
- Period filters
```

## 🔧 Customization

### Add New Badges
```sql
INSERT INTO badges (name, description, category, icon, requirement_type, requirement_value, rarity, xp_reward)
VALUES (
  'Marathon Master',
  'Complete 10 marathons',
  'distance',
  'trophy',
  'distance_km',
  420,
  'epic',
  5000
);
```

### Adjust XP Rewards
```sql
UPDATE badges
SET xp_reward = 100
WHERE name = 'First Steps';
```

### Create Custom Challenge
```typescript
await createChallenge({
  name: 'Weekend Warrior',
  description: 'Complete 10 workouts on weekends',
  challenge_type: 'workouts',
  goal_type: 'community',
  goal_value: 10,
  start_date: startDate,
  end_date: endDate,
  xp_reward: 500,
  is_active: true
});
```

## 📈 Monitoring

### Check Badge Distribution
```sql
SELECT 
  b.name,
  b.rarity,
  COUNT(ub.id) as earned_count
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.id, b.name, b.rarity
ORDER BY earned_count DESC;
```

### View Top Users
```sql
SELECT 
  user_id,
  level,
  total_xp,
  current_streak,
  total_workouts
FROM user_stats
ORDER BY total_xp DESC
LIMIT 10;
```

### Challenge Participation
```sql
SELECT 
  c.name,
  COUNT(cp.id) as participants,
  AVG(cp.progress) as avg_progress
FROM challenges c
LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
WHERE c.is_active = true
GROUP BY c.id, c.name;
```

## 🎨 Styling

All components use:
- Tailwind CSS for styling
- shadcn/ui components
- Atomic design patterns
- Responsive layouts
- Dark mode support

## 🐛 Troubleshooting

### Badges Not Auto-Awarding
```typescript
// Manually trigger badge check
await checkAndAwardBadges(userId);
```

### Streak Not Updating
```typescript
// Manually update streak
await updateStreak(userId, new Date());
```

### Leaderboard Not Refreshing
```sql
-- Manually refresh leaderboards
SELECT refresh_leaderboards();
```

## 📚 Full Documentation

See `/docs/GAMIFICATION_SYSTEM_COMPLETE.md` for:
- Complete feature list
- API reference
- Integration examples
- Database schema details
- Future enhancements

## ✨ That's It!

Your gamification system is ready to boost user engagement! 🚀
