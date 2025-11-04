'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Moon, 
  Weight, 
  Flame,
  Footprints,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { DailyStats, WeeklyStatsResponse, HealthConnection } from '@/types/health';
import { 
  formatDuration, 
  formatDistance, 
  formatWeight, 
  formatCalories,
  calculateGoalProgress,
  getActivityLevel 
} from '@/lib/health/health-utils';
import { HealthStatsWidget } from '@/components/health/health-stats-widget';
import { HeartRateChart } from '@/components/health/heart-rate-chart';
import { WeeklyActivityChart } from '@/components/health/weekly-activity-chart';
import { SyncStatus } from '@/components/health/sync-status';

export default function HealthDashboard() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatsResponse | null>(null);
  const [connections, setConnections] = useState<HealthConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);

      const [todayRes, weeklyRes, connectionsRes] = await Promise.all([
        fetch('/api/health/stats/daily'),
        fetch('/api/health/stats/weekly'),
        fetch('/api/health/connections'),
      ]);

      if (todayRes.ok) {
        const data = await todayRes.json();
        setTodayStats(data.stats);
      }

      if (weeklyRes.ok) {
        const data = await weeklyRes.json();
        setWeeklyStats(data.summary);
      }

      if (connectionsRes.ok) {
        const data = await connectionsRes.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/health/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        await loadHealthData();
      }
    } catch (error) {
      console.error('Failed to sync health data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const stepsGoal = 10000;
  const caloriesGoal = 500;
  const activeMinutesGoal = 30;
  const sleepGoal = 480; // 8 hours

  const stepsProgress = todayStats ? calculateGoalProgress(todayStats.steps, stepsGoal) : null;
  const caloriesProgress = todayStats ? calculateGoalProgress(todayStats.active_calories, caloriesGoal) : null;
  const activeProgress = todayStats ? calculateGoalProgress(todayStats.active_minutes, activeMinutesGoal) : null;
  const sleepProgress = todayStats ? calculateGoalProgress(todayStats.sleep_minutes, sleepGoal) : null;

  const activityLevel = todayStats ? getActivityLevel(todayStats.active_minutes) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground">Track your fitness and wellness data</p>
        </div>
        <div className="flex items-center gap-4">
          <SyncStatus connections={connections} />
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Connected Devices */}
      {connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {connections.map((conn) => (
                <Badge key={conn.id} variant="secondary" className="text-sm">
                  {conn.provider.replace('_', ' ').toUpperCase()}
                  {conn.sync_enabled && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HealthStatsWidget
          title="Steps"
          value={todayStats?.steps || 0}
          goal={stepsGoal}
          icon={<Footprints className="h-4 w-4" />}
          progress={stepsProgress}
          color="blue"
        />
        <HealthStatsWidget
          title="Active Calories"
          value={todayStats?.active_calories || 0}
          goal={caloriesGoal}
          icon={<Flame className="h-4 w-4" />}
          progress={caloriesProgress}
          color="orange"
          suffix=" cal"
        />
        <HealthStatsWidget
          title="Active Minutes"
          value={todayStats?.active_minutes || 0}
          goal={activeMinutesGoal}
          icon={<Activity className="h-4 w-4" />}
          progress={activeProgress}
          color="green"
          suffix=" min"
        />
        <HealthStatsWidget
          title="Sleep"
          value={todayStats?.sleep_minutes || 0}
          goal={sleepGoal}
          icon={<Moon className="h-4 w-4" />}
          progress={sleepProgress}
          color="purple"
          formatter={formatDuration}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayStats ? formatDistance(todayStats.distance_meters) : '0 km'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {todayStats?.resting_heart_rate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resting</span>
                  <span className="text-lg font-semibold">{todayStats.resting_heart_rate} bpm</span>
                </div>
              )}
              {todayStats?.avg_heart_rate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average</span>
                  <span className="text-lg font-semibold">{todayStats.avg_heart_rate} bpm</span>
                </div>
              )}
              {!todayStats?.resting_heart_rate && !todayStats?.avg_heart_rate && (
                <div className="text-2xl font-bold text-muted-foreground">--</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Activity Level</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLevel ? (
              <div>
                <div className="text-2xl font-bold mb-1">{activityLevel.label}</div>
                <div 
                  className="h-2 rounded-full" 
                  style={{ backgroundColor: activityLevel.color }}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <WeeklyActivityChart data={weeklyStats} />
        </TabsContent>

        <TabsContent value="heart-rate" className="space-y-4">
          <HeartRateChart />
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Tracking</CardTitle>
              <CardDescription>Your sleep patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyStats && (
                <div className="space-y-4">
                  {weeklyStats.dates.map((date, index) => {
                    const sleepMinutes = weeklyStats.sleep_minutes[index];
                    const sleepHours = sleepMinutes / 60;
                    const quality = sleepHours >= 7 && sleepHours <= 9 ? 'good' : sleepHours < 6 ? 'poor' : 'fair';
                    
                    return (
                      <div key={date} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{formatDuration(sleepMinutes)}</span>
                          <Badge variant={quality === 'good' ? 'default' : quality === 'fair' ? 'secondary' : 'destructive'}>
                            {quality}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
              <CardDescription>Your weight trend over time</CardDescription>
            </CardHeader>
            <CardContent>
              {todayStats?.weight_kg ? (
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {formatWeight(todayStats.weight_kg)}
                  </div>
                  {todayStats.body_fat_percentage && (
                    <div className="text-sm text-muted-foreground">
                      Body Fat: {todayStats.body_fat_percentage.toFixed(1)}%
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No weight data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
