# 🔗 Gamification Integration Guide

## Integration Points for Existing Features

### 1. Workout Completion Integration

**Location**: After workout is saved/completed

```typescript
// In your workout completion handler
import { 
  awardXP, 
  updateStreak, 
  checkAndAwardBadges 
} from '@/lib/gamification/badge-engine';
import { 
  getUserChallenges, 
  updateChallengeProgress 
} from '@/lib/gamification/challenge-system';

async function handleWorkoutComplete(userId: string, workout: Workout) {
  // 1. Award XP for completing workout
  const xpAmount = calculateWorkoutXP(workout); // Base: 50 XP
  await awardXP(userId, xpAmount, 'workout', workout.id, 'Completed workout');
  
  // 2. Update daily streak
  const streakResult = await updateStreak(userId);
  if (streakResult.isNewRecord) {
    // Show celebration for new streak record
    console.log(`New streak record: ${streakResult.longestStreak} days!`);
  }
  
  // 3. Update user stats
  await supabase
    .from('user_stats')
    .update({
      total_workouts: supabase.raw('total_workouts + 1'),
      total_distance_km: supabase.raw(`total_distance_km + ${workout.distance || 0}`),
      total_duration_minutes: supabase.raw(`total_duration_minutes + ${workout.duration || 0}`)
    })
    .eq('user_id', userId);
  
  // 4. Check for new badges
  const badgeResult = await checkAndAwardBadges(userId);
  if (badgeResult.newBadges.length > 0) {
    // Show badge earned celebration
    console.log(`Earned ${badgeResult.newBadges.length} new badges!`);
  }
  
  // 5. Update challenge progress
  const challenges = await getUserChallenges(userId);
  for (const challenge of challenges.challenges) {
    if (!challenge.participant?.completed) {
      if (challenge.challenge_type === 'workouts') {
        await updateChallengeProgress(challenge.id, userId, 1);
      } else if (challenge.challenge_type === 'distance') {
        await updateChallengeProgress(challenge.id, userId, workout.distance || 0);
      } else if (challenge.challenge_type === 'duration') {
        await updateChallengeProgress(challenge.id, userId, workout.duration || 0);
      }
    }
  }
}

// Calculate XP based on workout
function calculateWorkoutXP(workout: Workout): number {
  let xp = 50; // Base XP
  
  // Bonus for distance
  if (workout.distance) {
    xp += Math.floor(workout.distance / 1000) * 10; // 10 XP per km
  }
  
  // Bonus for duration
  if (workout.duration) {
    xp += Math.floor(workout.duration / 60) * 5; // 5 XP per hour
  }
  
  // Bonus for intensity
  if (workout.intensity === 'high') {
    xp += 25;
  } else if (workout.intensity === 'medium') {
    xp += 10;
  }
  
  return xp;
}
```

### 2. Social Features Integration

**Location**: When user gives kudos or makes friends

```typescript
import { checkAndAwardBadges } from '@/lib/gamification/badge-engine';

// When user gives kudos
async function handleGiveKudos(userId: string, recipientId: string) {
  // Update kudos stats
  await supabase
    .from('user_stats')
    .update({ kudos_given: supabase.raw('kudos_given + 1') })
    .eq('user_id', userId);
  
  await supabase
    .from('user_stats')
    .update({ kudos_received: supabase.raw('kudos_received + 1') })
    .eq('user_id', recipientId);
  
  // Check for social badges
  await checkAndAwardBadges(userId);
  
  // Award small XP for social engagement
  await awardXP(userId, 5, 'social', null, 'Gave kudos');
}

// When user adds a friend
async function handleAddFriend(userId: string, friendId: string) {
  // Update friends count
  await supabase
    .from('user_stats')
    .update({ friends_count: supabase.raw('friends_count + 1') })
    .eq('user_id', userId);
  
  await supabase
    .from('user_stats')
    .update({ friends_count: supabase.raw('friends_count + 1') })
    .eq('user_id', friendId);
  
  // Check for social badges
  await checkAndAwardBadges(userId);
  await checkAndAwardBadges(friendId);
  
  // Award XP for making connections
  await awardXP(userId, 25, 'social', null, 'Made a new friend');
  await awardXP(friendId, 25, 'social', null, 'Made a new friend');
}
```

### 3. Dashboard Integration

**Location**: Member dashboard

```typescript
import { getUserStats, getUserBadges } from '@/lib/gamification/badge-engine';
import { getUserChallenges } from '@/lib/gamification/challenge-system';
import { getUserRank } from '@/lib/gamification/leaderboard-system';

async function loadDashboardGamification(userId: string) {
  const [stats, badges, challenges, xpRank] = await Promise.all([
    getUserStats(userId),
    getUserBadges(userId),
    getUserChallenges(userId),
    getUserRank(userId, 'global_xp', 'all_time')
  ]);
  
  return {
    level: stats.stats?.level || 1,
    xp: stats.stats?.total_xp || 0,
    currentStreak: stats.stats?.current_streak || 0,
    badgeCount: badges.badges.length,
    activeChallenges: challenges.challenges.filter(c => !c.participant?.completed).length,
    globalRank: xpRank.rank
  };
}

// Display in dashboard
<div className="grid grid-cols-3 gap-4">
  <Card>
    <CardContent>
      <div className="text-2xl font-bold">Level {level}</div>
      <div className="text-sm text-muted-foreground">{xp} XP</div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent>
      <div className="text-2xl font-bold">{currentStreak} 🔥</div>
      <div className="text-sm text-muted-foreground">Day Streak</div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent>
      <div className="text-2xl font-bold">{badgeCount}</div>
      <div className="text-sm text-muted-foreground">Badges Earned</div>
    </CardContent>
  </Card>
</div>
```

### 4. Profile Page Integration

**Location**: User profile page

```typescript
import { getUserBadges, getUserStats } from '@/lib/gamification/badge-engine';

async function loadProfileGamification(userId: string) {
  const [badges, stats] = await Promise.all([
    getUserBadges(userId),
    getUserStats(userId)
  ]);
  
  // Get top 3 rarest badges
  const topBadges = badges.badges
    .sort((a, b) => {
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
      return rarityOrder[b.badge.rarity] - rarityOrder[a.badge.rarity];
    })
    .slice(0, 3);
  
  return {
    topBadges,
    stats: stats.stats
  };
}

// Display in profile
<div className="profile-badges">
  <h3>Top Achievements</h3>
  <div className="flex gap-4">
    {topBadges.map(badge => (
      <div key={badge.id} className="badge-showcase">
        <BadgeIcon badge={badge.badge} />
        <span>{badge.badge.name}</span>
      </div>
    ))}
  </div>
</div>
```

### 5. Notification Integration

**Location**: Notification system

```typescript
import { createClient } from '@/lib/supabase/client';

// Subscribe to new milestones
async function subscribeToMilestones(userId: string, onMilestone: (milestone: any) => void) {
  const supabase = createClient();
  
  const subscription = supabase
    .channel('milestones')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'milestones',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        onMilestone(payload.new);
      }
    )
    .subscribe();
  
  return subscription;
}

// In your app layout or notification provider
useEffect(() => {
  const subscription = subscribeToMilestones(userId, (milestone) => {
    // Show toast notification
    toast({
      title: milestone.title,
      description: milestone.description,
      icon: milestone.icon
    });
  });
  
  return () => {
    subscription.unsubscribe();
  };
}, [userId]);
```

### 6. Admin Panel Integration

**Location**: Admin dashboard

```typescript
import { refreshLeaderboards } from '@/lib/gamification/leaderboard-system';
import { createChallenge } from '@/lib/gamification/challenge-system';

// Admin: Create new challenge
async function adminCreateChallenge(data: ChallengeData) {
  const result = await createChallenge({
    name: data.name,
    description: data.description,
    challenge_type: data.type,
    goal_type: 'community',
    goal_value: data.goalValue,
    start_date: data.startDate,
    end_date: data.endDate,
    xp_reward: data.xpReward,
    is_active: true,
    created_by: adminUserId
  });
  
  return result;
}

// Admin: Manually refresh leaderboards
async function adminRefreshLeaderboards() {
  const result = await refreshLeaderboards();
  return result;
}

// Admin: View gamification stats
async function getGamificationStats() {
  const supabase = createClient();
  
  const [badgeStats, challengeStats, userStats] = await Promise.all([
    supabase.from('user_badges').select('badge_id', { count: 'exact' }),
    supabase.from('challenge_participants').select('challenge_id', { count: 'exact' }),
    supabase.from('user_stats').select('level, total_xp')
  ]);
  
  return {
    totalBadgesEarned: badgeStats.count,
    totalChallengeParticipants: challengeStats.count,
    averageLevel: userStats.data?.reduce((sum, u) => sum + u.level, 0) / userStats.data?.length || 0,
    averageXP: userStats.data?.reduce((sum, u) => sum + u.total_xp, 0) / userStats.data?.length || 0
  };
}
```

## Automated Background Jobs

### Daily Streak Check (Recommended)

```typescript
// Run daily to check for broken streaks
async function checkStreaks() {
  const supabase = createClient();
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Get users who didn't work out yesterday
  const { data: users } = await supabase
    .from('user_stats')
    .select('user_id, current_streak')
    .gt('current_streak', 0);
  
  for (const user of users || []) {
    const { data: activity } = await supabase
      .from('streak_history')
      .select('*')
      .eq('user_id', user.user_id)
      .eq('streak_date', yesterdayStr)
      .single();
    
    if (!activity) {
      // Reset streak
      await supabase
        .from('user_stats')
        .update({ current_streak: 0 })
        .eq('user_id', user.user_id);
    }
  }
}
```

### Leaderboard Refresh (Recommended)

```typescript
// Run daily or weekly
async function scheduledLeaderboardRefresh() {
  await refreshLeaderboards();
  console.log('Leaderboards refreshed successfully');
}
```

### Challenge Completion Check (Recommended)

```typescript
// Run hourly to check for completed challenges
async function checkChallengeCompletions() {
  const supabase = createClient();
  
  const now = new Date().toISOString();
  
  // Get ended challenges
  const { data: challenges } = await supabase
    .from('challenges')
    .select('id')
    .eq('is_active', true)
    .lt('end_date', now);
  
  for (const challenge of challenges || []) {
    // Mark as inactive
    await supabase
      .from('challenges')
      .update({ is_active: false })
      .eq('id', challenge.id);
    
    // Award rewards to top participants
    const { data: participants } = await supabase
      .from('challenge_participants')
      .select('user_id, rank')
      .eq('challenge_id', challenge.id)
      .eq('completed', true)
      .lte('rank', 10); // Top 10
    
    for (const participant of participants || []) {
      let bonusXP = 0;
      if (participant.rank === 1) bonusXP = 500;
      else if (participant.rank === 2) bonusXP = 300;
      else if (participant.rank === 3) bonusXP = 200;
      else bonusXP = 100;
      
      await awardXP(
        participant.user_id,
        bonusXP,
        'challenge',
        challenge.id,
        `Ranked #${participant.rank} in challenge`
      );
    }
  }
}
```

## Testing Integration

```typescript
// Test workout completion flow
describe('Gamification Integration', () => {
  it('should award XP and update stats on workout completion', async () => {
    const userId = 'test-user-id';
    const workout = { id: 'workout-1', distance: 5000, duration: 30 };
    
    await handleWorkoutComplete(userId, workout);
    
    const stats = await getUserStats(userId);
    expect(stats.stats?.total_workouts).toBeGreaterThan(0);
    expect(stats.stats?.total_xp).toBeGreaterThan(0);
  });
  
  it('should award badges when requirements are met', async () => {
    const userId = 'test-user-id';
    
    // Complete 10 workouts
    for (let i = 0; i < 10; i++) {
      await handleWorkoutComplete(userId, { id: `workout-${i}` });
    }
    
    const badges = await getUserBadges(userId);
    const gettingStartedBadge = badges.badges.find(b => b.badge.name === 'Getting Started');
    expect(gettingStartedBadge).toBeDefined();
  });
});
```

## Performance Considerations

1. **Batch Operations**: When updating multiple users, use batch updates
2. **Caching**: Cache user stats and badges for frequently accessed data
3. **Async Processing**: Run badge checks and leaderboard updates asynchronously
4. **Indexing**: Ensure all database indexes are created (included in migrations)
5. **Rate Limiting**: Limit how often users can trigger gamification events

## Monitoring

```typescript
// Track gamification engagement
async function getEngagementMetrics() {
  const supabase = createClient();
  
  const [
    dailyActiveUsers,
    badgesEarnedToday,
    challengesJoinedToday,
    xpEarnedToday
  ] = await Promise.all([
    supabase.from('streak_history')
      .select('user_id', { count: 'exact', head: true })
      .eq('streak_date', new Date().toISOString().split('T')[0]),
    
    supabase.from('user_badges')
      .select('id', { count: 'exact', head: true })
      .gte('earned_at', new Date().toISOString().split('T')[0]),
    
    supabase.from('challenge_participants')
      .select('id', { count: 'exact', head: true })
      .gte('joined_at', new Date().toISOString().split('T')[0]),
    
    supabase.from('xp_transactions')
      .select('amount')
      .gte('created_at', new Date().toISOString().split('T')[0])
  ]);
  
  return {
    dailyActiveUsers: dailyActiveUsers.count,
    badgesEarnedToday: badgesEarnedToday.count,
    challengesJoinedToday: challengesJoinedToday.count,
    totalXPEarnedToday: xpEarnedToday.data?.reduce((sum, t) => sum + t.amount, 0) || 0
  };
}
```

## Complete Integration Checklist

- [ ] Workout completion triggers XP award
- [ ] Workout completion updates streak
- [ ] Workout completion checks badges
- [ ] Workout completion updates challenges
- [ ] Social actions award XP
- [ ] Social actions update stats
- [ ] Dashboard displays gamification stats
- [ ] Profile shows top badges
- [ ] Notifications for milestones
- [ ] Admin panel for challenge management
- [ ] Daily streak check job scheduled
- [ ] Leaderboard refresh job scheduled
- [ ] Challenge completion job scheduled
- [ ] Monitoring dashboard created
- [ ] Performance optimizations applied

Your gamification system is now fully integrated! 🎉
