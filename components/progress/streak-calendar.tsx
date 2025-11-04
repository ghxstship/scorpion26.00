'use client';

import { Card } from '@/components/ui/card';
import { StreakCalendarData } from '@/types/workout';
import { cn } from '@/lib/utils';

interface StreakCalendarProps {
  data: StreakCalendarData[];
  className?: string;
}

export function StreakCalendar({ data, className }: StreakCalendarProps) {
  // Group by week
  const weeks: StreakCalendarData[][] = [];
  let currentWeek: StreakCalendarData[] = [];
  
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const getColorClass = (count: number, type: string) => {
    if (count === 0) return 'bg-muted';
    if (type === 'both') return 'bg-purple-500';
    if (type === 'strength') return 'bg-primary';
    if (type === 'cardio') return 'bg-blue-500';
    return 'bg-muted';
  };

  const getIntensity = (count: number) => {
    if (count === 0) return '';
    return 'opacity-100';
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Activity Calendar</h3>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-muted-foreground">Strength</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-muted-foreground">Cardio</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-purple-500" />
              <span className="text-muted-foreground">Both</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-xs text-center text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    'aspect-square rounded-sm transition-all hover:ring-2 hover:ring-primary cursor-pointer',
                    getColorClass(day.count, day.type),
                    getIntensity(day.count)
                  )}
                  title={`${day.date}: ${day.count > 0 ? `${day.type} workout` : 'Rest day'}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-primary/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/60" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </div>
    </Card>
  );
}
