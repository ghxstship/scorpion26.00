'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/demo-auth';
import { UserRole } from '@/lib/auth/rbac-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, Flame, Target, Award, Zap } from 'lucide-react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { VolumeChart } from '@/components/progress/volume-chart';
import { StreakCalendar } from '@/components/progress/streak-calendar';
import { PRTimeline } from '@/components/progress/pr-timeline';
import { ExerciseProgressChart } from '@/components/progress/exercise-progress-chart';
import { spacingClasses } from '@/lib/design-tokens';
import { useToast } from '@/hooks/use-toast';

export default function MemberProgressPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/progress/workout-stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch chart data
      const chartsRes = await fetch('/api/progress/charts?days=90');
      if (chartsRes.ok) {
        const chartsData = await chartsRes.json();
        setChartData(chartsData);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load progress data',
        variant: 'destructive',
      });
    }
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
        <Heading level={1}>My Progress</Heading>
        <Text variant="body-md" className="text-muted-foreground">
          Track your fitness journey
        </Text>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats?.total_workouts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.weeklyAverage || 0} per week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats?.current_streak_days || 0} days
            </div>
            <p className="text-xs text-muted-foreground">
              Longest: {stats?.stats?.longest_streak_days || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.stats?.total_volume_lifted || 0).toLocaleString()} lbs
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Records</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats?.prs_achieved_total || 0}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats?.stats?.prs_achieved_this_month || 0} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {chartData?.volumeOverTime && (
          <VolumeChart data={chartData.volumeOverTime} />
        )}
        
        {chartData?.exerciseProgress && (
          <ExerciseProgressChart data={chartData.exerciseProgress} />
        )}
      </div>

      {/* Streak Calendar */}
      {chartData?.streakCalendar && (
        <StreakCalendar data={chartData.streakCalendar} />
      )}

      {/* Personal Records Timeline */}
      {chartData?.prTimeline && (
        <PRTimeline data={chartData.prTimeline} />
      )}
    </div>
  );
}
