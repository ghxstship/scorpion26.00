'use client';

import { useState } from 'react';
import { Play, Pause, Save, X, Activity, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ACTIVITY_TYPES, CardioActivity } from '@/types/workout';
import { cn } from '@/lib/utils';

interface CardioLoggerProps {
  onSave?: (activity: Partial<CardioActivity>) => Promise<void>;
  onCancel?: () => void;
  enableGPS?: boolean;
  className?: string;
}

export function CardioLogger({
  onSave,
  onCancel,
  enableGPS = false,
  className,
}: CardioLoggerProps) {
  const [activityType, setActivityType] = useState<CardioActivity['activity_type']>('running');
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [avgHeartRate, setAvgHeartRate] = useState<number>(0);
  const [maxHeartRate, setMaxHeartRate] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const activity: Partial<CardioActivity> = {
        activity_type: activityType,
        duration_seconds: durationMinutes * 60,
        distance_meters: distanceKm * 1000,
        calories_burned: caloriesBurned || undefined,
        avg_heart_rate: avgHeartRate || undefined,
        max_heart_rate: maxHeartRate || undefined,
        notes: notes || undefined,
        completed_at: new Date().toISOString(),
      };

      await onSave?.(activity);
    } catch (error) {
      console.error('Failed to save cardio activity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculatePace = () => {
    if (durationMinutes > 0 && distanceKm > 0) {
      const paceMinPerKm = durationMinutes / distanceKm;
      const mins = Math.floor(paceMinPerKm);
      const secs = Math.round((paceMinPerKm - mins) * 60);
      return `${mins}:${secs.toString().padStart(2, '0')} /km`;
    }
    return '--:-- /km';
  };

  const calculateSpeed = () => {
    if (durationMinutes > 0 && distanceKm > 0) {
      const speedKmh = (distanceKm / durationMinutes) * 60;
      return `${speedKmh.toFixed(1)} km/h`;
    }
    return '-- km/h';
  };

  const isValid = durationMinutes > 0 && (distanceKm > 0 || caloriesBurned > 0);

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Log Cardio Activity
          </h3>
          <p className="text-sm text-muted-foreground">
            {enableGPS ? 'Track with GPS or log manually' : 'Manually log your cardio session'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !isValid}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Activity'}
          </Button>
        </div>
      </div>

      {/* Activity Type */}
      <div className="space-y-2">
        <Label>Activity Type</Label>
        <Select value={activityType} onValueChange={(value: any) => setActivityType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTIVITY_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* GPS Tracking Option */}
      {enableGPS && (
        <Button variant="outline" className="w-full" size="lg">
          <MapPin className="h-5 w-5 mr-2" />
          Track with GPS
        </Button>
      )}

      {/* Manual Entry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            placeholder="30"
            value={durationMinutes || ''}
            onChange={(e) => setDurationMinutes(parseFloat(e.target.value) || 0)}
            min="0"
            step="1"
          />
        </div>

        {/* Distance */}
        <div className="space-y-2">
          <Label htmlFor="distance">Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            placeholder="5.0"
            value={distanceKm || ''}
            onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
          />
        </div>

        {/* Calories */}
        <div className="space-y-2">
          <Label htmlFor="calories">Calories Burned</Label>
          <Input
            id="calories"
            type="number"
            placeholder="300"
            value={caloriesBurned || ''}
            onChange={(e) => setCaloriesBurned(parseInt(e.target.value) || 0)}
            min="0"
            step="10"
          />
        </div>

        {/* Avg Heart Rate */}
        <div className="space-y-2">
          <Label htmlFor="avgHR">Avg Heart Rate (bpm)</Label>
          <Input
            id="avgHR"
            type="number"
            placeholder="145"
            value={avgHeartRate || ''}
            onChange={(e) => setAvgHeartRate(parseInt(e.target.value) || 0)}
            min="0"
            max="220"
          />
        </div>

        {/* Max Heart Rate */}
        <div className="space-y-2">
          <Label htmlFor="maxHR">Max Heart Rate (bpm)</Label>
          <Input
            id="maxHR"
            type="number"
            placeholder="175"
            value={maxHeartRate || ''}
            onChange={(e) => setMaxHeartRate(parseInt(e.target.value) || 0)}
            min="0"
            max="220"
          />
        </div>
      </div>

      {/* Calculated Stats */}
      {durationMinutes > 0 && distanceKm > 0 && (
        <Card className="p-4 bg-muted/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{calculatePace()}</div>
              <div className="text-xs text-muted-foreground">Pace</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{calculateSpeed()}</div>
              <div className="text-xs text-muted-foreground">Speed</div>
            </div>
          </div>
        </Card>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="How did you feel? Any observations?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
    </Card>
  );
}
