'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/demo-auth';
import { UserRole } from '@/lib/auth/rbac-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, TrendingUp, Users, Zap, Dumbbell } from 'lucide-react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { spacingClasses } from '@/lib/design-tokens';
import {
  getGlobalXPLeaderboard,
  getGlobalWorkoutsLeaderboard,
  getUserRank,
  getLeaderboardAroundUser,
  formatRank,
  getRankColor,
  getPeriodLabel,
  type LeaderboardEntryWithUser
} from '@/lib/gamification/leaderboard-system';

export default function MemberLeaderboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [xpLeaderboard, setXpLeaderboard] = useState<LeaderboardEntryWithUser[]>([]);
  const [workoutsLeaderboard, setWorkoutsLeaderboard] = useState<LeaderboardEntryWithUser[]>([]);
  const [userXpRank, setUserXpRank] = useState<number | null>(null);
  const [userWorkoutsRank, setUserWorkoutsRank] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'all_time' | 'monthly' | 'weekly'>('all_time');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push('/login');
      return;
    }
    setUserId(user.id);
    loadData(user.id, selectedPeriod);
  }, [router, selectedPeriod]);

  const loadData = async (uid: string, period: 'all_time' | 'monthly' | 'weekly') => {
    setIsLoading(true);
    
    const [xpResult, workoutsResult, xpRankResult, workoutsRankResult] = await Promise.all([
      getGlobalXPLeaderboard(period, 50),
      getGlobalWorkoutsLeaderboard(period, 50),
      getUserRank(uid, 'global_xp', period),
      getUserRank(uid, 'global_workouts', period)
    ]);

    if (!xpResult.error) {
      setXpLeaderboard(xpResult.leaderboard);
    }

    if (!workoutsResult.error) {
      setWorkoutsLeaderboard(workoutsResult.leaderboard);
    }

    if (!xpRankResult.error) {
      setUserXpRank(xpRankResult.rank);
    }

    if (!workoutsRankResult.error) {
      setUserWorkoutsRank(workoutsRankResult.rank);
    }

    setIsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={spacingClasses.gap.lg}>
      {/* Header */}
      <div>
        <Heading level={1}>Leaderboard</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          See how you rank against the community
        </Text>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Your XP Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userXpRank ? formatRank(userXpRank) : '-'}
            </div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              {getPeriodLabel(selectedPeriod)}
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Your Workouts Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userWorkoutsRank ? formatRank(userWorkoutsRank) : '-'}
            </div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              {getPeriodLabel(selectedPeriod)}
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        <Badge 
          variant={selectedPeriod === 'all_time' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedPeriod('all_time')}
        >
          All Time
        </Badge>
        <Badge 
          variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedPeriod('monthly')}
        >
          This Month
        </Badge>
        <Badge 
          variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedPeriod('weekly')}
        >
          This Week
        </Badge>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="xp" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="xp">
            <Zap className="h-4 w-4 mr-2" />
            XP Leaderboard
          </TabsTrigger>
          <TabsTrigger value="workouts">
            <Dumbbell className="h-4 w-4 mr-2" />
            Workouts Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* XP Leaderboard */}
        <TabsContent value="xp" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top XP Earners
              </CardTitle>
            </CardHeader>
            <CardContent>
              {xpLeaderboard.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <Text variant="body-lg" className="text-muted-foreground">
                    No leaderboard data available
                  </Text>
                </div>
              ) : (
                <div className="space-y-2">
                  {xpLeaderboard.map((entry) => {
                    const isCurrentUser = entry.user_id === userId;
                    const rankIcon = getRankIcon(entry.rank);

                    return (
                      <div 
                        key={entry.id} 
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          isCurrentUser ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 flex justify-center items-center">
                            {rankIcon || (
                              <span className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
                                #{entry.rank}
                              </span>
                            )}
                          </div>
                          <Avatar>
                            <AvatarFallback>{getInitials(entry.user_id)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {isCurrentUser ? 'You' : `User ${entry.user_id.substring(0, 8)}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.score.toLocaleString()} XP
                            </p>
                          </div>
                        </div>
                        {entry.rank <= 3 && (
                          <Badge variant="secondary" className="ml-auto">
                            Top {entry.rank}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workouts Leaderboard */}
        <TabsContent value="workouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Most Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workoutsLeaderboard.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <Text variant="body-lg" className="text-muted-foreground">
                    No leaderboard data available
                  </Text>
                </div>
              ) : (
                <div className="space-y-2">
                  {workoutsLeaderboard.map((entry) => {
                    const isCurrentUser = entry.user_id === userId;
                    const rankIcon = getRankIcon(entry.rank);

                    return (
                      <div 
                        key={entry.id} 
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          isCurrentUser ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 flex justify-center items-center">
                            {rankIcon || (
                              <span className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
                                #{entry.rank}
                              </span>
                            )}
                          </div>
                          <Avatar>
                            <AvatarFallback>{getInitials(entry.user_id)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {isCurrentUser ? 'You' : `User ${entry.user_id.substring(0, 8)}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.score} workouts
                            </p>
                          </div>
                        </div>
                        {entry.rank <= 3 && (
                          <Badge variant="secondary" className="ml-auto">
                            Top {entry.rank}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
