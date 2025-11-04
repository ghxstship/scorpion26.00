'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExerciseProgressData } from '@/types/workout';

interface ExerciseProgressChartProps {
  data: Record<string, ExerciseProgressData[]>;
  className?: string;
}

export function ExerciseProgressChart({ data, className }: ExerciseProgressChartProps) {
  const exercises = Object.keys(data);
  const [selectedExercise, setSelectedExercise] = useState(exercises[0] || '');

  if (exercises.length === 0) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No exercise data available yet</p>
        </div>
      </Card>
    );
  }

  const chartData = data[selectedExercise] || [];

  return (
    <Card className={className}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Exercise Progress</h3>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise} value={exercise}>
                  {exercise}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis yAxisId="left" className="text-xs" />
            <YAxis yAxisId="right" orientation="right" className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Max Weight (lbs)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="volume" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-2))' }}
              name="Total Volume (lbs)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
