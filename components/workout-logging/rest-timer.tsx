'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { REST_TIMER_PRESETS } from '@/types/workout';
import { cn } from '@/lib/utils';

interface RestTimerProps {
  onComplete?: () => void;
  exerciseName?: string;
  setNumber?: number;
  defaultDuration?: number;
  className?: string;
}

export function RestTimer({
  onComplete,
  exerciseName,
  setNumber,
  defaultDuration = 90,
  className,
}: RestTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultDuration);
  const [totalSeconds, setTotalSeconds] = useState(defaultDuration);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    
    // Play audio notification
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Rest Timer Complete!', {
        body: exerciseName 
          ? `Time to start set ${(setNumber || 0) + 1} of ${exerciseName}`
          : 'Rest period is over. Ready for next set!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'rest-timer',
        requireInteraction: false,
      });
    }

    onComplete?.();
  }, [exerciseName, setNumber, onComplete]);

  // Timer logic
  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, remainingSeconds, handleTimerComplete]);

  const startTimer = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setRemainingSeconds(totalSeconds);
  };

  const adjustTime = (seconds: number) => {
    const newTime = Math.max(0, remainingSeconds + seconds);
    setRemainingSeconds(newTime);
    if (newTime > totalSeconds) {
      setTotalSeconds(newTime);
    }
  };

  const setPresetTime = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  if (isMinimized) {
    return (
      <div className={cn('fixed bottom-4 right-4 z-50', className)}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-16 w-16 shadow-lg"
          variant={isActive ? 'default' : 'outline'}
        >
          <div className="text-center">
            <div className="text-xs font-semibold">{formatTime(remainingSeconds)}</div>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card className={cn('p-6 space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Rest Timer</h3>
            {exerciseName && (
              <p className="text-sm text-muted-foreground">
                {exerciseName} - Set {setNumber}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Timer Display */}
        <div className="relative">
          <div className="flex items-center justify-center h-48">
            <div className="relative">
              {/* Progress Circle */}
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                  className={cn(
                    'transition-all duration-1000',
                    remainingSeconds <= 10 ? 'text-red-500' : 'text-primary'
                  )}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn(
                    'text-4xl font-bold tabular-nums',
                    remainingSeconds <= 10 && 'text-red-500 animate-pulse'
                  )}>
                    {formatTime(remainingSeconds)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    of {formatTime(totalSeconds)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => adjustTime(-15)}
            disabled={remainingSeconds === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            onClick={isActive ? pauseTimer : startTimer}
            className="w-24"
          >
            {isActive ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => adjustTime(15)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {REST_TIMER_PRESETS.map((preset) => (
            <Button
              key={preset}
              variant={totalSeconds === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPresetTime(preset)}
              className="text-xs"
            >
              {preset < 60 ? `${preset}s` : `${preset / 60}m`}
            </Button>
          ))}
        </div>
      </Card>

      {/* Hidden audio element for notification sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGAg+ltryxnMnBSl+zPLaizsIGGS57OihUBELTKXh8bllHAU2jtXzyn0vBSd6yfDckTsKE1yw6O6nVhQLRp/g8r5sIQUxh9Hz04IzBh5uwO/jmUUND1as5++wXRgIPpba8sZzJwUpfszy2os7CBhkuezooVARCw=="
        preload="auto"
      />
    </>
  );
}
