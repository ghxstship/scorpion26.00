'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartRateData, HeartRateZoneSummary } from '@/types/health';
import { getHeartRateZoneColor } from '@/lib/health/health-utils';

export function HeartRateChart() {
  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);
  const [zoneSummary, setZoneSummary] = useState<HeartRateZoneSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeartRateData();
  }, []);

  const loadHeartRateData = async () => {
    try {
      setLoading(true);
      
      // Get today's heart rate data
      const startTime = new Date();
      startTime.setHours(0, 0, 0, 0);
      const endTime = new Date();
      endTime.setHours(23, 59, 59, 999);

      const response = await fetch(
        `/api/health/heart-rate?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}&limit=100`
      );

      if (response.ok) {
        const data = await response.json();
        setHeartRateData(data.heart_rate_data || []);
        setZoneSummary(data.zone_summary);
      }
    } catch (error) {
      console.error('Failed to load heart rate data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate</CardTitle>
          <CardDescription>Your heart rate throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading heart rate data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (heartRateData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate</CardTitle>
          <CardDescription>Your heart rate throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No heart rate data available for today
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const bpmValues = heartRateData.map(hr => hr.bpm);
  const avgBpm = Math.round(bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length);
  const minBpm = Math.min(...bpmValues);
  const maxBpm = Math.max(...bpmValues);

  // Group data by hour for visualization
  const hourlyData = new Array(24).fill(0).map((_, hour) => {
    const hourData = heartRateData.filter(hr => {
      const hrHour = new Date(hr.recorded_at).getHours();
      return hrHour === hour;
    });

    if (hourData.length === 0) return null;

    const hourBpms = hourData.map(hr => hr.bpm);
    return {
      hour,
      avg: Math.round(hourBpms.reduce((a, b) => a + b, 0) / hourBpms.length),
      min: Math.min(...hourBpms),
      max: Math.max(...hourBpms),
    };
  });

  const maxChartBpm = Math.max(...bpmValues, 180);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart Rate</CardTitle>
        <CardDescription>Your heart rate throughout the day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{avgBpm}</div>
            <div className="text-xs text-muted-foreground">Average BPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{minBpm}</div>
            <div className="text-xs text-muted-foreground">Min BPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{maxBpm}</div>
            <div className="text-xs text-muted-foreground">Max BPM</div>
          </div>
        </div>

        {/* Hourly Chart */}
        <div>
          <h4 className="text-sm font-medium mb-4">Hourly Average</h4>
          <div className="space-y-1">
            {hourlyData.map((data, hour) => {
              if (!data) return null;

              const percentage = (data.avg / maxChartBpm) * 100;
              const zone = data.avg >= 150 ? 'peak' : data.avg >= 120 ? 'cardio' : data.avg >= 90 ? 'fat_burn' : 'resting';
              const color = getHeartRateZoneColor(zone);

              return (
                <div key={hour} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end px-2 transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    >
                      <span className="text-xs font-medium text-white">
                        {data.avg}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone Summary */}
        {zoneSummary && zoneSummary.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Time in Zones</h4>
            <div className="space-y-2">
              {zoneSummary.map((zone) => (
                <div key={zone.zone} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getHeartRateZoneColor(zone.zone) }}
                    />
                    <span className="text-sm capitalize">{zone.zone.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{zone.minutes} min</span>
                    <Badge variant="secondary" className="text-xs">
                      {zone.avg_bpm} bpm avg
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Source */}
        {heartRateData[0]?.source && (
          <div className="text-xs text-muted-foreground text-center">
            Data from {heartRateData[0].source.replace('_', ' ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
