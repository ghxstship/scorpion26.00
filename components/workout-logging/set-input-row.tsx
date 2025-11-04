'use client';

import { useState } from 'react';
import { Check, X, Flame, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { WorkoutSet, RPE_SCALE } from '@/types/workout';
import { cn } from '@/lib/utils';

interface SetInputRowProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onComplete: () => void;
  previousSet?: WorkoutSet;
  isActive?: boolean;
  className?: string;
}

export function SetInputRow({
  set,
  setNumber,
  onUpdate,
  onComplete,
  previousSet,
  isActive = false,
  className,
}: SetInputRowProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [showRPE, setShowRPE] = useState(false);

  const handleInputChange = (field: keyof WorkoutSet, value: string | number | boolean) => {
    onUpdate({ [field]: value });
  };

  const handleComplete = () => {
    if (set.reps && set.weight) {
      onUpdate({ completed: true });
      onComplete();
    }
  };

  const handleUncomplete = () => {
    onUpdate({ completed: false });
  };

  const getRPEColor = (rpe: number) => {
    const scale = RPE_SCALE.find((s) => s.value === rpe);
    return scale?.color || '#6b7280';
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg border transition-all',
        isActive && 'ring-2 ring-primary border-primary',
        set.completed && 'bg-muted/50',
        set.is_warmup && 'border-dashed',
        className
      )}
    >
      {/* Set Number */}
      <div className="flex items-center gap-2 min-w-15">
        <Badge variant={set.is_warmup ? 'outline' : 'secondary'} className="text-xs">
          {set.is_warmup ? 'W' : setNumber}
        </Badge>
        {set.is_dropset && (
          <Badge variant="outline" className="text-xs">
            Drop
          </Badge>
        )}
      </div>

      {/* Previous Set Reference */}
      {previousSet && !set.completed && (
        <div className="text-xs text-muted-foreground min-w-180 hidden sm:block">
          {previousSet.weight}×{previousSet.reps}
        </div>
      )}

      {/* Weight Input */}
      <div className="flex-1 min-w-180">
        <Input
          type="number"
          placeholder="Weight"
          value={set.weight || ''}
          onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
          disabled={set.completed}
          className="h-9"
          step="2.5"
        />
      </div>

      {/* Reps Input */}
      <div className="flex-1 min-w-180">
        <Input
          type="number"
          placeholder="Reps"
          value={set.reps || ''}
          onChange={(e) => handleInputChange('reps', parseInt(e.target.value) || 0)}
          disabled={set.completed}
          className="h-9"
        />
      </div>

      {/* RPE Selector */}
      <Popover open={showRPE} onOpenChange={setShowRPE}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-9 w-12',
              set.rpe && 'border-2'
            )}
            style={set.rpe ? { borderColor: getRPEColor(set.rpe) } : undefined}
            disabled={set.completed}
          >
            {set.rpe || <Flame className="h-4 w-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-11-2">
          <div className="space-y-1">
            <p className="text-xs font-medium mb-2">Rate of Perceived Exertion</p>
            {RPE_SCALE.map((scale) => (
              <Button
                key={scale.value}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  handleInputChange('rpe', scale.value);
                  setShowRPE(false);
                }}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: scale.color }}
                />
                <span className="font-medium mr-2">{scale.value}</span>
                <span className="text-muted-foreground">{scale.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Notes */}
      <Popover open={showNotes} onOpenChange={setShowNotes}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('h-9 w-9', set.notes && 'text-primary')}
            disabled={set.completed}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <label className="text-sm font-medium">Set Notes</label>
            <Textarea
              placeholder="Add notes about this set..."
              value={set.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
            <Button size="sm" onClick={() => setShowNotes(false)} className="w-full">
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Failure Indicator */}
      <Button
        variant={set.is_failure ? 'destructive' : 'outline'}
        size="sm"
        className="h-9 w-9"
        onClick={() => handleInputChange('is_failure', !set.is_failure)}
        disabled={set.completed}
        title="Failure"
      >
        <Flame className="h-4 w-4" />
      </Button>

      {/* Complete/Uncomplete */}
      {set.completed ? (
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9"
          onClick={handleUncomplete}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="h-9 w-9"
          onClick={handleComplete}
          disabled={!set.reps || !set.weight}
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
