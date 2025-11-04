'use client';

import { useState, useEffect } from 'react';
import { Plus, Save, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExerciseSelector } from './exercise-selector';
import { SetInputRow } from './set-input-row';
import { RestTimer } from './rest-timer';
import { WorkoutSet, ExerciseLog, ExerciseOption } from '@/types/workout';
import { cn } from '@/lib/utils';

interface StrengthLoggerProps {
  sessionId?: string;
  onSave?: (exercises: ExerciseLog[]) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export function StrengthLogger({
  sessionId,
  onSave,
  onCancel,
  className,
}: StrengthLoggerProps) {
  const [exercises, setExercises] = useState<Partial<ExerciseLog>[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(true);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [recentExercises, setRecentExercises] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load recent exercises from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentExercises');
    if (recent) {
      setRecentExercises(JSON.parse(recent));
    }
  }, []);

  const addExercise = (exercise: ExerciseOption) => {
    const newExercise: Partial<ExerciseLog> = {
      exercise_name: exercise.name,
      exercise_category: exercise.category as any,
      sets: [
        {
          set: 1,
          reps: 0,
          weight: 0,
          completed: false,
        },
      ],
      order_index: exercises.length,
      is_superset: false,
    };

    setExercises([...exercises, newExercise]);
    setCurrentExerciseIndex(exercises.length);
    setShowExerciseSelector(false);

    // Update recent exercises
    const updated = [exercise.name, ...recentExercises.filter((e) => e !== exercise.name)].slice(0, 10);
    setRecentExercises(updated);
    localStorage.setItem('recentExercises', JSON.stringify(updated));
  };

  const removeExercise = (index: number) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
    if (currentExerciseIndex === index) {
      setCurrentExerciseIndex(null);
    }
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    const exercise = updated[exerciseIndex];
    if (exercise && exercise.sets) {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      exercise.sets.push({
        set: exercise.sets.length + 1,
        reps: lastSet?.reps || 0,
        weight: lastSet?.weight || 0,
        completed: false,
      });
      setExercises(updated);
    }
  };

  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => {
    const updated = [...exercises];
    const exercise = updated[exerciseIndex];
    if (exercise && exercise.sets) {
      exercise.sets[setIndex] = { ...exercise.sets[setIndex], ...updates };
      setExercises(updated);
    }
  };

  const handleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const exercise = exercises[exerciseIndex];
    if (exercise && exercise.sets) {
      // Check if this is the last set
      const isLastSet = setIndex === exercise.sets.length - 1;
      
      if (!isLastSet) {
        // Show rest timer
        setShowRestTimer(true);
        setCurrentSetIndex(setIndex + 1);
      }
    }
  };

  const handleSave = async () => {
    if (!sessionId || exercises.length === 0) return;

    setIsSaving(true);
    try {
      // Filter out incomplete exercises
      const completedExercises = exercises.filter(
        (ex) => ex.sets && ex.sets.some((s) => s.completed)
      ) as ExerciseLog[];

      await onSave?.(completedExercises);
    } catch (error) {
      console.error('Failed to save workout:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalVolume = () => {
    return exercises.reduce((total, exercise) => {
      if (!exercise.sets) return total;
      return (
        total +
        exercise.sets.reduce((exTotal, set) => {
          if (set.completed && !set.is_warmup) {
            return exTotal + set.reps * set.weight;
          }
          return exTotal;
        }, 0)
      );
    }, 0);
  };

  const getTotalSets = () => {
    return exercises.reduce((total, exercise) => {
      if (!exercise.sets) return total;
      return total + exercise.sets.filter((s) => s.completed && !s.is_warmup).length;
    }, 0);
  };

  if (showExerciseSelector && exercises.length === 0) {
    return (
      <ExerciseSelector
        onSelect={addExercise}
        recentExercises={recentExercises}
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Workout Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Strength Training</h3>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{exercises.length} exercises</span>
              <span>{getTotalSets()} sets</span>
              <span>{getTotalVolume().toLocaleString()} lbs total</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || exercises.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Workout'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{exercise.exercise_name}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {exercise.exercise_category}
                  </Badge>
                  {exercise.is_superset && (
                    <Badge variant="outline" className="text-xs">
                      Superset
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExercise(exerciseIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Sets */}
            <div className="space-y-2">
              <div className="grid grid-cols-[60px_80px_1fr_1fr_auto_auto_auto_auto] gap-2 text-xs font-medium text-muted-foreground px-3">
                <div>Set</div>
                <div className="hidden sm:block">Previous</div>
                <div>Weight (lbs)</div>
                <div>Reps</div>
                <div>RPE</div>
                <div>Notes</div>
                <div>Fail</div>
                <div>Done</div>
              </div>

              {exercise.sets?.map((set, setIndex) => (
                <SetInputRow
                  key={setIndex}
                  set={set}
                  setNumber={set.set}
                  onUpdate={(updates) => updateSet(exerciseIndex, setIndex, updates)}
                  onComplete={() => handleSetComplete(exerciseIndex, setIndex)}
                  previousSet={setIndex > 0 ? exercise.sets![setIndex - 1] : undefined}
                  isActive={currentExerciseIndex === exerciseIndex && currentSetIndex === setIndex}
                />
              ))}
            </div>

            {/* Add Set Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSet(exerciseIndex)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>

            {/* Exercise Stats */}
            {exercise.sets && exercise.sets.some((s) => s.completed) && (
              <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    Volume:{' '}
                    {exercise.sets
                      .filter((s) => s.completed && !s.is_warmup)
                      .reduce((sum, s) => sum + s.reps * s.weight, 0)
                      .toLocaleString()}{' '}
                    lbs
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {exercise.sets.filter((s) => s.completed && !s.is_warmup).length} working sets
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Exercise Button */}
      <Button
        variant="outline"
        onClick={() => setShowExerciseSelector(true)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Exercise
      </Button>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && exercises.length > 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ExerciseSelector
              onSelect={(exercise) => {
                addExercise(exercise);
                setShowExerciseSelector(false);
              }}
              recentExercises={recentExercises}
            />
            <Button
              variant="outline"
              onClick={() => setShowExerciseSelector(false)}
              className="w-full mt-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Rest Timer */}
      {showRestTimer && (
        <div className="fixed bottom-4 right-4 z-50 w-96">
          <RestTimer
            onComplete={() => setShowRestTimer(false)}
            exerciseName={exercises[currentExerciseIndex!]?.exercise_name}
            setNumber={currentSetIndex}
          />
        </div>
      )}
    </div>
  );
}
