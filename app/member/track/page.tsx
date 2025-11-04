'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/demo-auth';
import { UserRole } from '@/lib/auth/rbac-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, MapPin, Activity, Clock, TrendingUp, Zap } from 'lucide-react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { GPSPoint, Split, ACTIVITY_TYPES } from '@/types/workout';
import { spacingClasses } from '@/lib/design-tokens';
import { useToast } from '@/hooks/use-toast';

export default function MemberTrackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activityType, setActivityType] = useState<'running' | 'cycling' | 'walking'>('running');
  
  // Tracking data
  const [routePoints, setRoutePoints] = useState<GPSPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GPSPoint | null>(null);
  const [distance, setDistance] = useState(0); // meters
  const [duration, setDuration] = useState(0); // seconds
  const [pace, setPace] = useState(0); // min/km
  const [speed, setSpeed] = useState(0); // km/h
  const [elevation, setElevation] = useState(0); // meters
  const [splits, setSplits] = useState<Split[]>([]);
  
  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== UserRole.MEMBER) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Request geolocation permission
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          toast({
            title: 'Location Permission Required',
            description: 'Please enable location access to use GPS tracking.',
            variant: 'destructive',
          });
        }
      });
    }
  }, [toast]);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Format pace (min/km)
  const formatPace = (seconds: number): string => {
    if (seconds === 0 || !isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time (HH:MM:SS)
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check for split (every 1km)
  const checkForSplit = (totalDistance: number) => {
    const kmCompleted = Math.floor(totalDistance / 1000);
    if (kmCompleted > splits.length) {
      const splitTime = duration;
      const lastSplitTime = splits.length > 0 ? splits[splits.length - 1].time_seconds : 0;
      const splitDuration = splitTime - lastSplitTime;
      const splitPace = (splitDuration / 60).toFixed(2);

      const newSplit: Split = {
        distance: kmCompleted * 1000,
        time_seconds: splitDuration,
        pace: formatPace(splitDuration / 1),
      };

      setSplits([...splits, newSplit]);

      // Audio cue
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `${kmCompleted} kilometer${kmCompleted > 1 ? 's' : ''}, pace ${splitPace}`
        );
        speechSynthesis.speak(utterance);
      }

      // Vibration
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };

  const startTracking = () => {
    if (!('geolocation' in navigator)) {
      toast({
        title: 'GPS Not Available',
        description: 'Your device does not support GPS tracking.',
        variant: 'destructive',
      });
      return;
    }

    setIsTracking(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();

    // Start GPS tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint: GPSPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          elevation: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(newPoint);

        // Calculate distance from last point
        if (routePoints.length > 0 && !isPaused) {
          const lastPoint = routePoints[routePoints.length - 1];
          const distanceIncrement = calculateDistance(
            lastPoint.lat,
            lastPoint.lng,
            newPoint.lat,
            newPoint.lng
          );

          // Only add point if moved more than 5 meters (noise filter)
          if (distanceIncrement > 5) {
            setRoutePoints((prev) => [...prev, newPoint]);
            setDistance((prev) => {
              const newDistance = prev + distanceIncrement;
              checkForSplit(newDistance);
              return newDistance;
            });

            // Update elevation
            if (newPoint.elevation && lastPoint.elevation) {
              const elevationGain = newPoint.elevation - lastPoint.elevation;
              if (elevationGain > 0) {
                setElevation((prev) => prev + elevationGain);
              }
            }
          }
        } else if (!isPaused) {
          setRoutePoints([newPoint]);
        }
      },
      (error) => {
        console.error('GPS error:', error);
        toast({
          title: 'GPS Error',
          description: 'Unable to get your location. Please check your settings.',
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Start duration timer
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setDuration((prev) => {
          const newDuration = prev + 1;
          
          // Calculate pace and speed
          if (distance > 0) {
            const paceSeconds = (newDuration / (distance / 1000)) * 60;
            setPace(paceSeconds);
            setSpeed((distance / 1000) / (newDuration / 3600));
          }
          
          return newDuration;
        });
      }
    }, 1000);

    toast({
      title: 'Tracking Started',
      description: 'GPS tracking is now active.',
    });
  };

  const pauseTracking = () => {
    setIsPaused(true);
    toast({
      title: 'Tracking Paused',
      description: 'Your activity is paused.',
    });
  };

  const resumeTracking = () => {
    setIsPaused(false);
    toast({
      title: 'Tracking Resumed',
      description: 'Continuing your activity.',
    });
  };

  const stopTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsTracking(false);

    // Save activity
    if (distance > 0 && duration > 0) {
      try {
        const response = await fetch('/api/activities/cardio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activity_type: activityType,
            duration_seconds: duration,
            distance_meters: distance,
            elevation_gain_meters: elevation,
            route_data: routePoints,
            splits: splits,
            completed_at: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error('Failed to save activity');

        toast({
          title: 'Activity Saved!',
          description: `Great ${activityType} session! ${(distance / 1000).toFixed(2)} km in ${formatTime(duration)}`,
        });

        router.push('/member/workouts');
      } catch (error) {
        console.error('Error saving activity:', error);
        toast({
          title: 'Error',
          description: 'Failed to save activity. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      // Reset without saving
      setRoutePoints([]);
      setDistance(0);
      setDuration(0);
      setSplits([]);
      setElevation(0);
    }
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
          <Heading level={1}>GPS Tracking</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Track your outdoor activities
          </Text>
        </div>
      </div>

      {/* Activity Type Selector */}
      {!isTracking && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Activity Type</label>
              <Select value={activityType} onValueChange={(v: any) => setActivityType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="walking">Walking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" onClick={startTracking} className="w-full">
              <Play className="h-5 w-5 mr-2" />
              Start Tracking
            </Button>
          </div>
        </Card>
      )}

      {/* Live Stats */}
      {isTracking && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums">{formatTime(duration)}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums">{(distance / 1000).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Distance (km)</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums">{formatPace(pace)}</div>
                  <div className="text-xs text-muted-foreground">Pace (/km)</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums">{speed.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Speed (km/h)</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Map Placeholder */}
          <Card className="p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Map visualization requires Mapbox or Google Maps integration
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {routePoints.length} GPS points recorded
                </p>
              </div>
            </div>
          </Card>

          {/* Splits */}
          {splits.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Splits</h3>
              <div className="space-y-2">
                {splits.map((split, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">KM {index + 1}</div>
                      <div className="text-sm text-muted-foreground">{split.pace} /km</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(split.time_seconds)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Controls */}
          <div className="flex gap-4">
            {!isPaused ? (
              <Button size="lg" variant="outline" onClick={pauseTracking} className="flex-1">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            ) : (
              <Button size="lg" onClick={resumeTracking} className="flex-1">
                <Play className="h-5 w-5 mr-2" />
                Resume
              </Button>
            )}
            <Button size="lg" variant="destructive" onClick={stopTracking} className="flex-1">
              <Square className="h-5 w-5 mr-2" />
              Stop & Save
            </Button>
          </div>
        </>
      )}

      {/* GPS Info */}
      {!isTracking && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">GPS Tracking Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5 text-primary" />
              <span>Real-time distance, pace, and speed tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <span>GPS route recording with elevation data</span>
            </li>
            <li className="flex items-start gap-2">
              <Activity className="h-4 w-4 mt-0.5 text-primary" />
              <span>Automatic split times every kilometer</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-primary" />
              <span>Audio cues and vibration feedback</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
