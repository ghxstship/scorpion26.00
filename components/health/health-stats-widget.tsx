import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HealthStatsWidgetProps {
  title: string;
  value: number;
  goal: number;
  icon: React.ReactNode;
  progress: { percentage: number; remaining: number; achieved: boolean } | null;
  color: 'blue' | 'orange' | 'green' | 'purple';
  suffix?: string;
  formatter?: (value: number) => string;
}

const colorClasses = {
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
};

const progressColorClasses = {
  blue: '[&>div]:bg-blue-600',
  orange: '[&>div]:bg-orange-600',
  green: '[&>div]:bg-green-600',
  purple: '[&>div]:bg-purple-600',
};

export function HealthStatsWidget({
  title,
  value,
  goal,
  icon,
  progress,
  color,
  suffix = '',
  formatter,
}: HealthStatsWidgetProps) {
  const displayValue = formatter ? formatter(value) : `${value.toLocaleString()}${suffix}`;
  const displayGoal = formatter ? formatter(goal) : `${goal.toLocaleString()}${suffix}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg bg-muted', colorClasses[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{displayValue}</div>
            <div className="text-xs text-muted-foreground">/ {displayGoal}</div>
          </div>
          
          {progress && (
            <>
              <Progress 
                value={progress.percentage} 
                className={cn('h-2', progressColorClasses[color])}
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {progress.percentage.toFixed(0)}% complete
                </span>
                {progress.achieved ? (
                  <span className="text-green-600 font-medium">Goal reached! 🎉</span>
                ) : (
                  <span className="text-muted-foreground">
                    {formatter ? formatter(progress.remaining) : `${progress.remaining.toLocaleString()}${suffix}`} to go
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
