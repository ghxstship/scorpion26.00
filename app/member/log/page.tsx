'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/demo-auth';
import { UserRole } from '@/lib/auth/rbac-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Activity, Clock, TrendingUp } from 'lucide-react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { StrengthLogger } from '@/components/workout-logging/strength-logger';
import { CardioLogger } from '@/components/workout-logging/cardio-logger';
import { ExerciseLog, CardioActivity } from '@/types/workout';
import { spacingClasses } from '@/lib/design-tokens';
import { useToast } from '@/hooks/use-toast';

export default function MemberLogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'strength' | 'cardio'>('strength');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleStartWorkout = async () => {
    try {
      const response = await fetch('/api/workouts/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          started_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to start workout');

      const session = await response.json();
      setCurrentSessionId(session.id);
      
      toast({
        title: 'Workout Started',
        description: 'Time to get to work!',
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to start workout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveStrengthWorkout = async (exercises: ExerciseLog[]) => {
    if (!currentSessionId) return;

    try {
      // Save each exercise
      for (const exercise of exercises) {
        await fetch(`/api/workouts/sessions/${currentSessionId}/exercises`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exercise),
        });
      }

      // Calculate total duration
      const startTime = new Date();
      const duration = Math.round((Date.now() - startTime.getTime()) / 60000);

      // Calculate total volume
      const totalVolume = exercises.reduce((sum, ex) => {
        return (
          sum +
          (ex.sets?.reduce((exSum, set) => {
            if (set.completed && !set.is_warmup) {
              return exSum + set.reps * set.weight;
            }
            return exSum;
          }, 0) || 0)
        );
      }, 0);

      // Complete the session
      await fetch(`/api/workouts/sessions/${currentSessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed_at: new Date().toISOString(),
          duration_minutes: duration,
          total_volume: totalVolume,
        }),
      });

      toast({
        title: 'Workout Saved!',
        description: `Great work! You completed ${exercises.length} exercises.`,
      });

      setCurrentSessionId(null);
      router.push('/member/workouts');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to save workout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCardioActivity = async (activity: Partial<CardioActivity>) => {
    try {
      const response = await fetch('/api/activities/cardio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });

      if (!response.ok) throw new Error('Failed to save cardio activity');

      toast({
        title: 'Activity Saved!',
        description: `Great ${activity.activity_type} session!`,
      });

      router.push('/member/workouts');
    } catch (error) {
      console.error('Error saving cardio activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to save activity. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setCurrentSessionId(null);
    router.push('/member/workouts');
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
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Log Workout</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Track your training session
          </Text>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">Exercises</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">Sets</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">Volume (lbs)</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Workout Logger */}
      {!currentSessionId ? (
        <Card className="p-8 text-center">
          <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Ready to Train?</h3>
          <p className="text-muted-foreground mb-6">
            Start a new workout session to begin logging your exercises
          </p>
          <Button size="lg" onClick={handleStartWorkout}>
            Start Workout
          </Button>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="strength">
              <Dumbbell className="h-4 w-4 mr-2" />
              Strength Training
            </TabsTrigger>
            <TabsTrigger value="cardio">
              <Activity className="h-4 w-4 mr-2" />
              Cardio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strength" className="mt-6">
            <StrengthLogger
              sessionId={currentSessionId}
              onSave={handleSaveStrengthWorkout}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="cardio" className="mt-6">
            <CardioLogger
              onSave={handleSaveCardioActivity}
              onCancel={handleCancel}
              enableGPS={false}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
