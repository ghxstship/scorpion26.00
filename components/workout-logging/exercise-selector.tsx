'use client';

import { useState, useMemo } from 'react';
import { Search, Dumbbell, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExerciseOption, EXERCISE_CATEGORIES } from '@/types/workout';
import { cn } from '@/lib/utils';

// Comprehensive exercise database
const EXERCISE_DATABASE: ExerciseOption[] = [
  // Chest
  { name: 'Barbell Bench Press', category: 'chest', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['chest', 'triceps', 'shoulders'] },
  { name: 'Dumbbell Bench Press', category: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', muscleGroups: ['chest', 'triceps', 'shoulders'] },
  { name: 'Incline Barbell Bench Press', category: 'chest', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['upper chest', 'shoulders', 'triceps'] },
  { name: 'Incline Dumbbell Press', category: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', muscleGroups: ['upper chest', 'shoulders'] },
  { name: 'Decline Bench Press', category: 'chest', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['lower chest', 'triceps'] },
  { name: 'Dumbbell Flyes', category: 'chest', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['chest'] },
  { name: 'Cable Flyes', category: 'chest', equipment: 'cable', difficulty: 'beginner', muscleGroups: ['chest'] },
  { name: 'Push-ups', category: 'chest', equipment: 'bodyweight', difficulty: 'beginner', muscleGroups: ['chest', 'triceps', 'core'] },
  { name: 'Dips', category: 'chest', equipment: 'bodyweight', difficulty: 'intermediate', muscleGroups: ['chest', 'triceps'] },
  
  // Back
  { name: 'Deadlift', category: 'back', equipment: 'barbell', difficulty: 'advanced', muscleGroups: ['back', 'hamstrings', 'glutes', 'core'] },
  { name: 'Barbell Row', category: 'back', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['back', 'biceps'] },
  { name: 'Dumbbell Row', category: 'back', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['back', 'biceps'] },
  { name: 'Pull-ups', category: 'back', equipment: 'bodyweight', difficulty: 'intermediate', muscleGroups: ['back', 'biceps'] },
  { name: 'Chin-ups', category: 'back', equipment: 'bodyweight', difficulty: 'intermediate', muscleGroups: ['back', 'biceps'] },
  { name: 'Lat Pulldown', category: 'back', equipment: 'cable', difficulty: 'beginner', muscleGroups: ['lats', 'biceps'] },
  { name: 'Seated Cable Row', category: 'back', equipment: 'cable', difficulty: 'beginner', muscleGroups: ['back', 'biceps'] },
  { name: 'T-Bar Row', category: 'back', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['back'] },
  { name: 'Face Pulls', category: 'back', equipment: 'cable', difficulty: 'beginner', muscleGroups: ['rear delts', 'upper back'] },
  
  // Legs
  { name: 'Barbell Squat', category: 'legs', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
  { name: 'Front Squat', category: 'legs', equipment: 'barbell', difficulty: 'advanced', muscleGroups: ['quads', 'core'] },
  { name: 'Leg Press', category: 'legs', equipment: 'machine', difficulty: 'beginner', muscleGroups: ['quads', 'glutes'] },
  { name: 'Romanian Deadlift', category: 'legs', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['hamstrings', 'glutes'] },
  { name: 'Leg Curl', category: 'legs', equipment: 'machine', difficulty: 'beginner', muscleGroups: ['hamstrings'] },
  { name: 'Leg Extension', category: 'legs', equipment: 'machine', difficulty: 'beginner', muscleGroups: ['quads'] },
  { name: 'Lunges', category: 'legs', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['quads', 'glutes'] },
  { name: 'Bulgarian Split Squat', category: 'legs', equipment: 'dumbbell', difficulty: 'intermediate', muscleGroups: ['quads', 'glutes'] },
  { name: 'Calf Raises', category: 'legs', equipment: 'machine', difficulty: 'beginner', muscleGroups: ['calves'] },
  
  // Shoulders
  { name: 'Overhead Press', category: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['shoulders', 'triceps'] },
  { name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['shoulders', 'triceps'] },
  { name: 'Lateral Raises', category: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['side delts'] },
  { name: 'Front Raises', category: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['front delts'] },
  { name: 'Rear Delt Flyes', category: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['rear delts'] },
  { name: 'Arnold Press', category: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', muscleGroups: ['shoulders'] },
  { name: 'Upright Row', category: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['shoulders', 'traps'] },
  
  // Arms
  { name: 'Barbell Curl', category: 'arms', equipment: 'barbell', difficulty: 'beginner', muscleGroups: ['biceps'] },
  { name: 'Dumbbell Curl', category: 'arms', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['biceps'] },
  { name: 'Hammer Curl', category: 'arms', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Preacher Curl', category: 'arms', equipment: 'barbell', difficulty: 'beginner', muscleGroups: ['biceps'] },
  { name: 'Tricep Dips', category: 'arms', equipment: 'bodyweight', difficulty: 'intermediate', muscleGroups: ['triceps'] },
  { name: 'Tricep Pushdown', category: 'arms', equipment: 'cable', difficulty: 'beginner', muscleGroups: ['triceps'] },
  { name: 'Overhead Tricep Extension', category: 'arms', equipment: 'dumbbell', difficulty: 'beginner', muscleGroups: ['triceps'] },
  { name: 'Skull Crushers', category: 'arms', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['triceps'] },
  { name: 'Close-Grip Bench Press', category: 'arms', equipment: 'barbell', difficulty: 'intermediate', muscleGroups: ['triceps', 'chest'] },
  
  // Core
  { name: 'Plank', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', muscleGroups: ['core'] },
  { name: 'Crunches', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', muscleGroups: ['abs'] },
  { name: 'Russian Twists', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', muscleGroups: ['obliques'] },
  { name: 'Hanging Leg Raises', category: 'core', equipment: 'bodyweight', difficulty: 'advanced', muscleGroups: ['abs'] },
  { name: 'Ab Wheel Rollout', category: 'core', equipment: 'ab wheel', difficulty: 'advanced', muscleGroups: ['core'] },
  { name: 'Cable Crunches', category: 'core', equipment: 'cable', difficulty: 'intermediate', muscleGroups: ['abs'] },
  { name: 'Mountain Climbers', category: 'core', equipment: 'bodyweight', difficulty: 'beginner', muscleGroups: ['core', 'cardio'] },
];

interface ExerciseSelectorProps {
  onSelect: (exercise: ExerciseOption) => void;
  recentExercises?: string[];
  className?: string;
}

export function ExerciseSelector({
  onSelect,
  recentExercises = [],
  className,
}: ExerciseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    let filtered = EXERCISE_DATABASE;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((ex) => ex.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.muscleGroups.some((mg) => mg.toLowerCase().includes(query)) ||
          ex.equipment?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const recentExerciseOptions = useMemo(() => {
    return EXERCISE_DATABASE.filter((ex) => recentExercises.includes(ex.name));
  }, [recentExercises]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Select Exercise
        </h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises, muscles, or equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {EXERCISE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Exercises */}
      {recentExerciseOptions.length > 0 && !searchQuery && selectedCategory === 'all' && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Recent Exercises
          </h4>
          <div className="grid gap-2">
            {recentExerciseOptions.slice(0, 3).map((exercise) => (
              <Button
                key={exercise.name}
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => onSelect(exercise)}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {exercise.category}
                    </Badge>
                    {exercise.equipment && (
                      <Badge variant="outline" className="text-xs">
                        {exercise.equipment}
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Exercise List */}
      <ScrollArea className="h-100">
        <div className="space-y-2 pr-4">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No exercises found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <Button
                key={exercise.name}
                variant="outline"
                className="justify-start h-auto py-3 w-full"
                onClick={() => onSelect(exercise)}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {exercise.category}
                    </Badge>
                    {exercise.equipment && (
                      <Badge variant="outline" className="text-xs">
                        {exercise.equipment}
                      </Badge>
                    )}
                    {exercise.difficulty && (
                      <Badge className={cn('text-xs', getDifficultyColor(exercise.difficulty))}>
                        {exercise.difficulty}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {exercise.muscleGroups.join(', ')}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
