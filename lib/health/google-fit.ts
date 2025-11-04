import { GoogleFitDataPoint, GoogleFitSession, DailyStats } from '@/types/health';

/**
 * Google Fit Integration Service
 * 
 * Uses Google Fit REST API with OAuth 2.0
 * 
 * Required Scopes:
 * - https://www.googleapis.com/auth/fitness.activity.read
 * - https://www.googleapis.com/auth/fitness.activity.write
 * - https://www.googleapis.com/auth/fitness.body.read
 * - https://www.googleapis.com/auth/fitness.location.read
 * - https://www.googleapis.com/auth/fitness.heart_rate.read
 * - https://www.googleapis.com/auth/fitness.sleep.read
 */

const GOOGLE_FIT_API_BASE = 'https://www.googleapis.com/fitness/v1/users/me';

export class GoogleFitService {
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || null;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Google Fit access token not set');
    }

    const response = await fetch(`${GOOGLE_FIT_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Google Fit API error: ${response.status}`);
    }

    return response.json();
  }

  private toNanos(date: Date): string {
    return (date.getTime() * 1000000).toString();
  }

  private fromNanos(nanos: string): Date {
    return new Date(parseInt(nanos) / 1000000);
  }

  async getSteps(startDate: Date, endDate: Date): Promise<number> {
    try {
      const data = await this.makeRequest('/dataset:aggregate', {
        method: 'POST',
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: endDate.getTime() - startDate.getTime() },
          startTimeMillis: startDate.getTime(),
          endTimeMillis: endDate.getTime(),
        }),
      });

      let totalSteps = 0;
      data.bucket?.forEach((bucket: any) => {
        bucket.dataset?.forEach((dataset: any) => {
          dataset.point?.forEach((point: any) => {
            totalSteps += point.value?.[0]?.intVal || 0;
          });
        });
      });

      return totalSteps;
    } catch (error) {
      console.error('Failed to get steps from Google Fit:', error);
      return 0;
    }
  }

  async getCalories(startDate: Date, endDate: Date): Promise<{ active: number; total: number }> {
    try {
      const data = await this.makeRequest('/dataset:aggregate', {
        method: 'POST',
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.calories.expended',
              dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
            },
            {
              dataTypeName: 'com.google.active_minutes',
              dataSourceId: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes'
            }
          ],
          bucketByTime: { durationMillis: endDate.getTime() - startDate.getTime() },
          startTimeMillis: startDate.getTime(),
          endTimeMillis: endDate.getTime(),
        }),
      });

      let totalCalories = 0;
      let activeMinutes = 0;

      data.bucket?.forEach((bucket: any) => {
        bucket.dataset?.forEach((dataset: any) => {
          dataset.point?.forEach((point: any) => {
            if (dataset.dataSourceId.includes('calories')) {
              totalCalories += point.value?.[0]?.fpVal || 0;
            } else if (dataset.dataSourceId.includes('active_minutes')) {
              activeMinutes += point.value?.[0]?.intVal || 0;
            }
          });
        });
      });

      // Estimate active calories (rough approximation)
      const activeCalories = Math.round(totalCalories * 0.3);

      return { active: activeCalories, total: Math.round(totalCalories) };
    } catch (error) {
      console.error('Failed to get calories from Google Fit:', error);
      return { active: 0, total: 0 };
    }
  }

  async getDistance(startDate: Date, endDate: Date): Promise<number> {
    try {
      const data = await this.makeRequest('/dataset:aggregate', {
        method: 'POST',
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.distance.delta',
            dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta'
          }],
          bucketByTime: { durationMillis: endDate.getTime() - startDate.getTime() },
          startTimeMillis: startDate.getTime(),
          endTimeMillis: endDate.getTime(),
        }),
      });

      let totalDistance = 0;
      data.bucket?.forEach((bucket: any) => {
        bucket.dataset?.forEach((dataset: any) => {
          dataset.point?.forEach((point: any) => {
            totalDistance += point.value?.[0]?.fpVal || 0;
          });
        });
      });

      return totalDistance;
    } catch (error) {
      console.error('Failed to get distance from Google Fit:', error);
      return 0;
    }
  }

  async getHeartRate(startDate: Date, endDate: Date): Promise<GoogleFitDataPoint[]> {
    try {
      const data = await this.makeRequest(
        `/dataSources/derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm/datasets/${this.toNanos(startDate)}-${this.toNanos(endDate)}`
      );

      return (data.point || []).map((point: any) => ({
        dataTypeName: 'com.google.heart_rate.bpm',
        startTimeNanos: point.startTimeNanos,
        endTimeNanos: point.endTimeNanos,
        value: point.value,
        originDataSourceId: point.originDataSourceId,
      }));
    } catch (error) {
      console.error('Failed to get heart rate from Google Fit:', error);
      return [];
    }
  }

  async getSessions(startDate: Date, endDate: Date): Promise<GoogleFitSession[]> {
    try {
      const data = await this.makeRequest(
        `/sessions?startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}`
      );

      return (data.session || []).map((session: any) => ({
        id: session.id,
        name: session.name,
        description: session.description,
        startTimeMillis: session.startTimeMillis,
        endTimeMillis: session.endTimeMillis,
        activityType: session.activityType,
        application: session.application,
      }));
    } catch (error) {
      console.error('Failed to get sessions from Google Fit:', error);
      return [];
    }
  }

  async getSleep(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const data = await this.makeRequest(
        `/dataSources/derived:com.google.sleep.segment:com.google.android.gms:merged/datasets/${this.toNanos(startDate)}-${this.toNanos(endDate)}`
      );

      return data.point || [];
    } catch (error) {
      console.error('Failed to get sleep from Google Fit:', error);
      return [];
    }
  }

  async getWeight(startDate: Date, endDate: Date): Promise<GoogleFitDataPoint[]> {
    try {
      const data = await this.makeRequest(
        `/dataSources/derived:com.google.weight:com.google.android.gms:merge_weight/datasets/${this.toNanos(startDate)}-${this.toNanos(endDate)}`
      );

      return (data.point || []).map((point: any) => ({
        dataTypeName: 'com.google.weight',
        startTimeNanos: point.startTimeNanos,
        endTimeNanos: point.endTimeNanos,
        value: point.value,
        originDataSourceId: point.originDataSourceId,
      }));
    } catch (error) {
      console.error('Failed to get weight from Google Fit:', error);
      return [];
    }
  }

  async getActiveMinutes(startDate: Date, endDate: Date): Promise<number> {
    try {
      const data = await this.makeRequest('/dataset:aggregate', {
        method: 'POST',
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.active_minutes',
            dataSourceId: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes'
          }],
          bucketByTime: { durationMillis: endDate.getTime() - startDate.getTime() },
          startTimeMillis: startDate.getTime(),
          endTimeMillis: endDate.getTime(),
        }),
      });

      let totalMinutes = 0;
      data.bucket?.forEach((bucket: any) => {
        bucket.dataset?.forEach((dataset: any) => {
          dataset.point?.forEach((point: any) => {
            totalMinutes += point.value?.[0]?.intVal || 0;
          });
        });
      });

      return totalMinutes;
    } catch (error) {
      console.error('Failed to get active minutes from Google Fit:', error);
      return 0;
    }
  }

  async getDailyStats(date: Date): Promise<Partial<DailyStats>> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const [steps, calories, distance, activeMinutes] = await Promise.all([
      this.getSteps(startDate, endDate),
      this.getCalories(startDate, endDate),
      this.getDistance(startDate, endDate),
      this.getActiveMinutes(startDate, endDate),
    ]);

    return {
      steps,
      active_calories: calories.active,
      total_calories: calories.total,
      distance_meters: distance,
      active_minutes: activeMinutes,
      data_sources: ['google_fit'],
    };
  }

  async writeWorkout(workout: {
    name: string;
    activityType: number;
    startTime: Date;
    endTime: Date;
    calories?: number;
    distance?: number;
  }): Promise<boolean> {
    try {
      await this.makeRequest('/sessions', {
        method: 'PUT',
        body: JSON.stringify({
          id: `${Date.now()}`,
          name: workout.name,
          startTimeMillis: workout.startTime.getTime(),
          endTimeMillis: workout.endTime.getTime(),
          activityType: workout.activityType,
          application: {
            packageName: 'com.yourapp.package',
          },
        }),
      });

      return true;
    } catch (error) {
      console.error('Failed to write workout to Google Fit:', error);
      return false;
    }
  }

  async writeWeight(weight: number, date: Date): Promise<boolean> {
    try {
      const dataSourceId = 'raw:com.google.weight:com.yourapp.package:weight';
      
      await this.makeRequest(`/dataSources/${dataSourceId}/datasets/${this.toNanos(date)}-${this.toNanos(date)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          dataSourceId,
          maxEndTimeNs: this.toNanos(date),
          minStartTimeNs: this.toNanos(date),
          point: [{
            dataTypeName: 'com.google.weight',
            startTimeNanos: this.toNanos(date),
            endTimeNanos: this.toNanos(date),
            value: [{
              fpVal: weight,
            }],
          }],
        }),
      });

      return true;
    } catch (error) {
      console.error('Failed to write weight to Google Fit:', error);
      return false;
    }
  }

  // Activity Type Constants
  static readonly ActivityTypes = {
    AEROBICS: 9,
    BIKING: 1,
    BOXING: 10,
    CALISTHENICS: 11,
    CIRCUIT_TRAINING: 12,
    DANCING: 13,
    ELLIPTICAL: 14,
    HIKING: 35,
    HOCKEY: 36,
    HORSEBACK_RIDING: 37,
    MARTIAL_ARTS: 47,
    PILATES: 56,
    ROCK_CLIMBING: 62,
    ROWING: 63,
    RUNNING: 8,
    SKIING: 67,
    SNOWBOARDING: 69,
    SOCCER: 70,
    STAIR_CLIMBING: 72,
    STRENGTH_TRAINING: 7,
    SWIMMING: 82,
    TENNIS: 83,
    VOLLEYBALL: 89,
    WALKING: 7,
    WATER_POLO: 90,
    WEIGHTLIFTING: 97,
    YOGA: 104,
  };
}

export function createGoogleFitService(accessToken: string): GoogleFitService {
  return new GoogleFitService(accessToken);
}
