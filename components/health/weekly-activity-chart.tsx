'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyStatsResponse } from '@/types/health';
import { formatCalories } from '@/lib/health/health-utils';

interface WeeklyActivityChartProps {
  data: WeeklyStatsResponse | null;
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Your activity over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No activity data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxSteps = Math.max(...data.steps, 10000);
  const maxCalories = Math.max(...data.active_calories, 500);
  const maxMinutes = Math.max(...data.active_minutes, 60);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
        <CardDescription>Your activity over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Steps Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Steps</h4>
            <span className="text-sm text-muted-foreground">
              Total: {data.steps.reduce((a, b) => a + b, 0).toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            {data.dates.map((date, index) => {
              const steps = data.steps[index];
              const percentage = (steps / maxSteps) * 100;
              const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{dayName}</span>
                  <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-blue-600 flex items-center justify-end px-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    >
                      {steps > 0 && (
                        <span className="text-xs font-medium text-white">
                          {steps.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calories Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Active Calories</h4>
            <span className="text-sm text-muted-foreground">
              Total: {formatCalories(data.active_calories.reduce((a, b) => a + b, 0))}
            </span>
          </div>
          <div className="space-y-2">
            {data.dates.map((date, index) => {
              const calories = data.active_calories[index];
              const percentage = (calories / maxCalories) * 100;
              const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{dayName}</span>
                  <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-orange-600 flex items-center justify-end px-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    >
                      {calories > 0 && (
                        <span className="text-xs font-medium text-white">
                          {calories.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Minutes Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Active Minutes</h4>
            <span className="text-sm text-muted-foreground">
              Total: {data.active_minutes.reduce((a, b) => a + b, 0)} min
            </span>
          </div>
          <div className="space-y-2">
            {data.dates.map((date, index) => {
              const minutes = data.active_minutes[index];
              const percentage = (minutes / maxMinutes) * 100;
              const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{dayName}</span>
                  <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-green-600 flex items-center justify-end px-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    >
                      {minutes > 0 && (
                        <span className="text-xs font-medium text-white">
                          {minutes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
