'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/demo-auth';
import { UserRole } from '@/lib/auth/rbac-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, Clock, Users, Flame, Map, Dumbbell, Calendar } from 'lucide-react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { spacingClasses, gridClasses } from '@/lib/design-tokens';
import {
  getActiveChallenges,
  getUserChallenges,
  joinChallenge,
  getChallengeDetails,
  calculateChallengeProgress,
  getChallengeStatus,
  getChallengeTimeRemaining,
  getChallengeTypeLabel,
  getChallengeTypeIcon,
  type ChallengeWithParticipation
} from '@/lib/gamification/challenge-system';

const iconMap: Record<string, any> = {
  map: Map,
  dumbbell: Dumbbell,
  clock: Clock,
  flame: Flame,
  trophy: Trophy,
};

export default function MemberChallengesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChallenges, setActiveChallenges] = useState<ChallengeWithParticipation[]>([]);
  const [userChallenges, setUserChallenges] = useState<ChallengeWithParticipation[]>([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push('/login');
      return;
    }
    setUserId(user.id);
    loadData(user.id);
  }, [router]);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    
    const [activeChallengesResult, userChallengesResult] = await Promise.all([
      getActiveChallenges(),
      getUserChallenges(uid)
    ]);

    if (!activeChallengesResult.error) {
      setActiveChallenges(activeChallengesResult.challenges);
    }

    if (!userChallengesResult.error) {
      setUserChallenges(userChallengesResult.challenges);
    }

    setIsLoading(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    const result = await joinChallenge(challengeId, userId);
    if (result.success) {
      loadData(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const myChallenges = userChallenges.filter(c => c.participant);
  const completedChallenges = myChallenges.filter(c => c.participant?.completed);
  const activeMyChallenges = myChallenges.filter(c => !c.participant?.completed && getChallengeStatus(c) === 'active');

  return (
    <div className={spacingClasses.gap.lg}>
      {/* Header */}
      <div>
        <Heading level={1}>Challenges</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Join time-bound competitions and test your limits
        </Text>
      </div>

      {/* Stats Overview */}
      <div className={gridClasses.cards['4col']}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeMyChallenges.length}</div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Currently participating
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedChallenges.length}</div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Challenges finished
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeChallenges.length}</div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Open to join
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {myChallenges.length > 0 
                ? Math.min(...myChallenges.map(c => c.participant?.rank || 999))
                : '-'}
            </div>
            <Text variant="body-sm" className="text-muted-foreground mt-2">
              Highest position
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Available</TabsTrigger>
          <TabsTrigger value="my">My Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* Available Challenges */}
        <TabsContent value="active" className="mt-6">
          {activeChallenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Text variant="body-lg" className="text-muted-foreground">
                  No active challenges available
                </Text>
              </CardContent>
            </Card>
          ) : (
            <div className={gridClasses.cards['2col']}>
              {activeChallenges.map((challenge) => {
                const ChallengeIcon = iconMap[getChallengeTypeIcon(challenge.challenge_type)] || Trophy;
                const timeRemaining = getChallengeTimeRemaining(challenge);
                const isParticipating = myChallenges.some(c => c.id === challenge.id);

                return (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <ChallengeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">
                          {getChallengeTypeLabel(challenge.challenge_type)}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{challenge.name}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Goal:</span>
                        </div>
                        <span className="font-semibold">{challenge.goal_value}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Time left:</span>
                        </div>
                        <span className="font-semibold">
                          {timeRemaining.days}d {timeRemaining.hours}h
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Participants:</span>
                        </div>
                        <span className="font-semibold">{challenge.participant_count || 0}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Reward:</span>
                        </div>
                        <span className="font-semibold">{challenge.xp_reward} XP</span>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => handleJoinChallenge(challenge.id)}
                        disabled={isParticipating}
                      >
                        {isParticipating ? 'Already Joined' : 'Join Challenge'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* My Challenges */}
        <TabsContent value="my" className="mt-6">
          {activeMyChallenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Text variant="body-lg" className="text-muted-foreground mb-4">
                  You haven&apos;t joined any challenges yet
                </Text>
                <Button onClick={() => setSelectedTab('active')}>
                  Browse Challenges
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={gridClasses.cards['2col']}>
              {activeMyChallenges.map((challenge) => {
                const ChallengeIcon = iconMap[getChallengeTypeIcon(challenge.challenge_type)] || Trophy;
                const progress = challenge.participant?.progress || 0;
                const progressPercent = calculateChallengeProgress(progress, challenge.goal_value);
                const timeRemaining = getChallengeTimeRemaining(challenge);

                return (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <ChallengeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="default">
                          Rank #{challenge.participant?.rank || '-'}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{challenge.name}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            {progress} / {challenge.goal_value}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Time left:</span>
                        </div>
                        <span className="font-semibold">
                          {timeRemaining.days}d {timeRemaining.hours}h
                        </span>
                      </div>

                      <Button className="w-full" variant="outline">
                        View Leaderboard
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Completed Challenges */}
        <TabsContent value="completed" className="mt-6">
          {completedChallenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Text variant="body-lg" className="text-muted-foreground">
                  No completed challenges yet
                </Text>
              </CardContent>
            </Card>
          ) : (
            <div className={gridClasses.cards['2col']}>
              {completedChallenges.map((challenge) => {
                const ChallengeIcon = iconMap[getChallengeTypeIcon(challenge.challenge_type)] || Trophy;

                return (
                  <Card key={challenge.id} className="border-green-500/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <ChallengeIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <Badge variant="default" className="bg-green-500">
                          Completed
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{challenge.name}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Final Rank:</span>
                        <span className="font-bold text-lg">#{challenge.participant?.rank || '-'}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">XP Earned:</span>
                        <span className="font-semibold text-green-600">+{challenge.xp_reward}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Trophy className="h-4 w-4" />
                        <span className="font-medium">Challenge Completed!</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
