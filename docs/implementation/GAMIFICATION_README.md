# 🎮 Gamification System

A comprehensive engagement system with badges, streaks, challenges, and leaderboards.

## 🚀 Quick Start

```bash
# 1. Install dependencies (already done)
npm install

# 2. Deploy to database
export DATABASE_URL="your_supabase_connection_string"
./scripts/deploy-gamification.sh

# 3. Visit the pages
# /member/achievements - View badges and XP
# /member/challenges - Browse challenges
# /member/leaderboard - See rankings
```

## 📊 Features

- **54 Badges** across 5 categories (Workout, Streak, Distance, Social, Special)
- **XP & Leveling** with progressive requirements
- **Streak Tracking** with daily activity monitoring
- **Time-bound Challenges** with real-time leaderboards
- **Global Leaderboards** (XP, Workouts, All-time/Monthly/Weekly)
- **Milestone Celebrations** with confetti and animations

## 📁 Key Files

### Database
- `/migrations/20251104040000_gamification_system.sql` - Schema
- `/migrations/20251104040001_gamification_functions.sql` - RPC functions
- `/migrations/20251104040002_gamification_seed_badges.sql` - Badge data

### Backend
- `/lib/gamification/badge-engine.ts` - Badge & XP system
- `/lib/gamification/challenge-system.ts` - Challenge management
- `/lib/gamification/leaderboard-system.ts` - Rankings

### Frontend
- `/app/member/achievements/page.tsx` - Achievements page
- `/app/member/challenges/page.tsx` - Challenges page
- `/app/member/leaderboard/page.tsx` - Leaderboard page
- `/components/gamification/milestone-celebration.tsx` - Celebrations

### Documentation
- `/docs/GAMIFICATION_SYSTEM_COMPLETE.md` - Full documentation
- `/docs/GAMIFICATION_QUICKSTART.md` - Quick start guide
- `/docs/GAMIFICATION_INTEGRATION_GUIDE.md` - Integration examples
- `/GAMIFICATION_DEPLOYMENT_SUMMARY.md` - Deployment summary

## 🔗 Integration Example

```typescript
import { awardXP, updateStreak, checkAndAwardBadges } from '@/lib/gamification/badge-engine';

// After workout completion
await awardXP(userId, 50, 'workout', workoutId);
await updateStreak(userId);
await checkAndAwardBadges(userId);
```

## 📈 Monitoring

```sql
-- Check badge distribution
SELECT b.rarity, COUNT(ub.id) as earned
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.rarity;

-- View top users
SELECT user_id, level, total_xp, current_streak
FROM user_stats
ORDER BY total_xp DESC
LIMIT 10;
```

## 🎯 Success Metrics

- Badges auto-award ✓
- Streaks track correctly ✓
- Challenges work ✓
- Leaderboards update ✓

## 📚 Full Documentation

See `/docs/GAMIFICATION_SYSTEM_COMPLETE.md` for complete technical documentation.

## ✨ Status

**100% Complete** - Production Ready 🚀
