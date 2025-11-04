'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp } from 'lucide-react';
import { PRTimelineData } from '@/types/workout';
import { cn } from '@/lib/utils';

interface PRTimelineProps {
  data: PRTimelineData[];
  className?: string;
}

export function PRTimeline({ data, className }: PRTimelineProps) {
  if (data.length === 0) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold mb-2">No Personal Records Yet</h3>
          <p className="text-sm text-muted-foreground">
            Keep training to set your first PR!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Personal Records</h3>
          <Badge variant="secondary" className="ml-auto">
            {data.length} PRs
          </Badge>
        </div>

        <div className="space-y-3">
          {data.map((pr, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{pr.exercise}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(pr.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg">
                  {pr.value} {pr.unit}
                </div>
                {pr.improvement > 0 && (
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{pr.improvement.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
