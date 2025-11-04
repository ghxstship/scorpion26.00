'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/demo-auth';
import { UserRole } from '@/lib/auth/rbac-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Award, Trophy, Star, Flame, Map, Users, Sparkles, Lock } from 'lucide-react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { spacingClasses, gridClasses } from '@/lib/design-tokens';
import {
  getUserBadges,
  getBadgeProgress,
  getUserStats,
  getRarityColor,
  getRarityBgColor,
  calculateLevelProgress,
  type Badge,
  type UserStats
} from '@/lib/gamification/badge-engine';

const iconMap: Record<string, any> = {
  trophy: Trophy,
  award: Award,
  star: Star,
  flame: Flame,
  map: Map,
  users: Users,
  sparkles: Sparkles,
};

export default function MemberAchievementsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push('/login');
      return;
    }
    loadData(user.id);
  }, [router]);

  const loadData = async (userId: string) => {
    setIsLoading(true);
    
    const [badgesResult, progressResult, statsResult] = await Promise.all([
      getUserBadges(userId),
      getBadgeProgress(userId),
      getUserStats(userId)
    ]);

    if (!badgesResult.error) {
      setEarnedBadges(badgesResult.badges);
    }

    if (!progressResult.error) {
      setBadgeProgress(progressResult.progress);
    }

    if (!statsResult.error && statsResult.stats) {
      setUserStats(statsResult.stats);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const levelProgress = userStats ? calculateLevelProgress(userStats.total_xp) : null;
  const categories = ['all', 'workout', 'streak', 'distance', 'social', 'special'];
  
  const filteredProgress = selectedCategory === 'all' 
    ? badgeProgress 
    : badgeProgress.filter(p => p.badge.category === selectedCategory);

  const earnedCount = filteredProgress.filter(p => p.earned).length;
  const totalCount = filteredProgress.length;

  return (
    <div className={spacingClasses.gap.lg}>
      {/* Header */}
      <div>
        <Heading level={1}>Achievements</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Your earned badges, milestones, and progress
        </Text>
      </div>

      {/* Stats Overview */}
      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.level || 1}</div>
            {levelProgress && (
              <div className="mt-2">
                <Progress value={levelProgress.progressPercentage} className="h-2" />
                <Text variant="body-sm" className="text-muted-foreground mt-1">
                  {levelProgress.progressXP} / {levelProgress.xpForNextLevel - levelProgress.xpForCurrentLevel} XP
                </Text>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.total_xp.toLocaleString() || 0}</div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Experience points
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Badges Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earnedBadges.length}</div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Out of {badgeProgress.length} total
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              {userStats?.current_streak || 0}
            </div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Days in a row
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Badge Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="streak">Streak</TabsTrigger>
          <TabsTrigger value="distance">Distance</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <Text variant="body-md" className="text-muted-foreground">
              {earnedCount} of {totalCount} badges earned
            </Text>
            <Progress value={(earnedCount / totalCount) * 100} className="w-48 h-2" />
          </div>

          <div className={gridClasses.cards['4col']}>
            {filteredProgress.map((item) => {
              const BadgeIcon = iconMap[item.badge.icon] || Trophy;
              const rarityColor = getRarityColor(item.badge.rarity);
              const rarityBg = getRarityBgColor(item.badge.rarity);

              return (
                <Card 
                  key={item.badge.id} 
                  className={`relative ${!item.earned && 'opacity-60'}`}
                >
                  <CardHeader>
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${rarityBg}`}>
                      {item.earned ? (
                        <BadgeIcon className={`h-8 w-8 ${rarityColor}`} />
                      ) : (
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="mt-4 flex items-center justify-between">
                      <span>{item.badge.name}</span>
                      <BadgeUI variant="secondary" className="text-xs">
                        {item.badge.rarity}
                      </BadgeUI>
                    </CardTitle>
                    <CardDescription>{item.badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!item.earned && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {item.progress} / {item.badge.requirement_value}
                          </span>
                        </div>
                        <Progress value={item.progressPercentage} className="h-2" />
                      </div>
                    )}
                    {item.earned && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Trophy className="h-4 w-4" />
                        <span className="font-medium">Unlocked!</span>
                        <span className="text-muted-foreground ml-auto">+{item.badge.xp_reward} XP</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
