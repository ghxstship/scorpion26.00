import { FitbitActivity, FitbitHeartRate, FitbitSleep, DailyStats } from '@/types/health';

/**
 * Fitbit Integration Service
 * 
 * Uses Fitbit Web API with OAuth 2.0
 * API Rate Limits: 150 requests per hour per user
 * 
 * Required Scopes:
 * - activity
 * - heartrate
 * - sleep
 * - weight
 * - profile
 */

const FITBIT_API_BASE = 'https://api.fitbit.com/1/user/-';

export class FitbitService {
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || null;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Fitbit access token not set');
    }

    const response = await fetch(`${FITBIT_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.errors?.[0]?.message || `Fitbit API error: ${response.status}`);
    }

    return response.json();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async getActivities(date: Date): Promise<FitbitActivity[]> {
    try {
      const data = await this.makeRequest(`/activities/date/${this.formatDate(date)}.json`);
      
      return (data.activities || []).map((activity: any) => ({
        activityId: activity.activityId,
        activityName: activity.activityName,
        calories: activity.calories,
        duration: activity.duration,
        distance: activity.distance || 0,
        startTime: activity.startTime,
        steps: activity.steps,
        averageHeartRate: activity.averageHeartRate,
      }));
    } catch (error) {
      console.error('Failed to get activities from Fitbit:', error);
      return [];
    }
  }

  async getSteps(date: Date): Promise<number> {
    try {
      const data = await this.makeRequest(`/activities/date/${this.formatDate(date)}.json`);
      return data.summary?.steps || 0;
    } catch (error) {
      console.error('Failed to get steps from Fitbit:', error);
      return 0;
    }
  }

  async getCalories(date: Date): Promise<{ active: number; total: number }> {
    try {
      const data = await this.makeRequest(`/activities/date/${this.formatDate(date)}.json`);
      
      return {
        active: data.summary?.activityCalories || 0,
        total: data.summary?.caloriesOut || 0,
      };
    } catch (error) {
      console.error('Failed to get calories from Fitbit:', error);
      return { active: 0, total: 0 };
    }
  }

  async getDistance(date: Date): Promise<number> {
    try {
      const data = await this.makeRequest(`/activities/date/${this.formatDate(date)}.json`);
      
      // Fitbit returns distance in km or miles depending on user settings
      // Convert to meters
      const distances = data.summary?.distances || [];
      const totalDistance = distances.find((d: any) => d.activity === 'total');
      
      return totalDistance ? totalDistance.distance * 1000 : 0;
    } catch (error) {
      console.error('Failed to get distance from Fitbit:', error);
      return 0;
    }
  }

  async getActiveMinutes(date: Date): Promise<number> {
    try {
      const data = await this.makeRequest(`/activities/date/${this.formatDate(date)}.json`);
      
      const fairlyActive = data.summary?.fairlyActiveMinutes || 0;
      const veryActive = data.summary?.veryActiveMinutes || 0;
      
      return fairlyActive + veryActive;
    } catch (error) {
      console.error('Failed to get active minutes from Fitbit:', error);
      return 0;
    }
  }

  async getFloorsClimbed(date: Date): Promise<number> {
    try {
      const data = await this.makeRequest(`/activities/date/${this.formatDate(date)}.json`);
      return data.summary?.floors || 0;
    } catch (error) {
      console.error('Failed to get floors from Fitbit:', error);
      return 0;
    }
  }

  async getHeartRate(date: Date): Promise<FitbitHeartRate[]> {
    try {
      const data = await this.makeRequest(
        `/activities/heart/date/${this.formatDate(date)}/1d/1sec.json`
      );
      
      const intraday = data['activities-heart-intraday']?.dataset || [];
      
      return intraday.map((point: any) => ({
        dateTime: `${this.formatDate(date)}T${point.time}`,
        value: {
          bpm: point.value,
          confidence: 1.0, // Fitbit doesn't provide confidence scores
        },
      }));
    } catch (error) {
      console.error('Failed to get heart rate from Fitbit:', error);
      return [];
    }
  }

  async getRestingHeartRate(date: Date): Promise<number | null> {
    try {
      const data = await this.makeRequest(`/activities/heart/date/${this.formatDate(date)}/1d.json`);
      
      const heartRateData = data['activities-heart']?.[0];
      return heartRateData?.value?.restingHeartRate || null;
    } catch (error) {
      console.error('Failed to get resting heart rate from Fitbit:', error);
      return null;
    }
  }

  async getSleep(date: Date): Promise<FitbitSleep[]> {
    try {
      const data = await this.makeRequest(`/sleep/date/${this.formatDate(date)}.json`);
      
      return (data.sleep || []).map((sleep: any) => ({
        dateOfSleep: sleep.dateOfSleep,
        duration: sleep.duration,
        efficiency: sleep.efficiency,
        startTime: sleep.startTime,
        endTime: sleep.endTime,
        minutesAsleep: sleep.minutesAsleep,
        minutesAwake: sleep.minutesAwake,
        levels: {
          summary: {
            deep: sleep.levels?.summary?.deep,
            light: sleep.levels?.summary?.light,
            rem: sleep.levels?.summary?.rem,
            wake: sleep.levels?.summary?.wake,
          },
        },
      }));
    } catch (error) {
      console.error('Failed to get sleep from Fitbit:', error);
      return [];
    }
  }

  async getWeight(startDate: Date, endDate: Date): Promise<Array<{ date: string; weight: number; bmi?: number; fat?: number }>> {
    try {
      const data = await this.makeRequest(
        `/body/log/weight/date/${this.formatDate(startDate)}/${this.formatDate(endDate)}.json`
      );
      
      return (data.weight || []).map((entry: any) => ({
        date: entry.date,
        weight: entry.weight,
        bmi: entry.bmi,
        fat: entry.fat,
      }));
    } catch (error) {
      console.error('Failed to get weight from Fitbit:', error);
      return [];
    }
  }

  async getDailyStats(date: Date): Promise<Partial<DailyStats>> {
    const [steps, calories, distance, activeMinutes, floors, restingHeartRate, sleepData] = await Promise.all([
      this.getSteps(date),
      this.getCalories(date),
      this.getDistance(date),
      this.getActiveMinutes(date),
      this.getFloorsClimbed(date),
      this.getRestingHeartRate(date),
      this.getSleep(date),
    ]);

    const mainSleep = sleepData.find(s => s.duration === Math.max(...sleepData.map(s => s.duration)));

    return {
      steps,
      active_calories: calories.active,
      total_calories: calories.total,
      distance_meters: distance,
      active_minutes: activeMinutes,
      floors_climbed: floors,
      resting_heart_rate: restingHeartRate || undefined,
      sleep_minutes: mainSleep ? Math.round(mainSleep.duration / 60000) : undefined,
      deep_sleep_minutes: mainSleep?.levels?.summary?.deep?.minutes,
      rem_sleep_minutes: mainSleep?.levels?.summary?.rem?.minutes,
      light_sleep_minutes: mainSleep?.levels?.summary?.light?.minutes,
      data_sources: ['fitbit'],
    };
  }

  async logActivity(activity: {
    activityId: number;
    startTime: string;
    durationMillis: number;
    distance?: number;
    distanceUnit?: 'km' | 'mi';
  }): Promise<boolean> {
    try {
      await this.makeRequest('/activities.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          activityId: activity.activityId.toString(),
          startTime: activity.startTime,
          durationMillis: activity.durationMillis.toString(),
          ...(activity.distance && {
            distance: activity.distance.toString(),
            distanceUnit: activity.distanceUnit || 'km',
          }),
        }).toString(),
      });

      return true;
    } catch (error) {
      console.error('Failed to log activity to Fitbit:', error);
      return false;
    }
  }

  async logWeight(weight: number, date: Date, fat?: number): Promise<boolean> {
    try {
      await this.makeRequest('/body/log/weight.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          weight: weight.toString(),
          date: this.formatDate(date),
          ...(fat && { fat: fat.toString() }),
        }).toString(),
      });

      return true;
    } catch (error) {
      console.error('Failed to log weight to Fitbit:', error);
      return false;
    }
  }

  // Activity Type IDs
  static readonly ActivityTypes = {
    AEROBICS: 15000,
    BIKING: 1071,
    BOXING: 15100,
    CIRCUIT_TRAINING: 15103,
    DANCING: 15170,
    ELLIPTICAL: 15200,
    HIKING: 15240,
    MARTIAL_ARTS: 15420,
    PILATES: 15480,
    ROCK_CLIMBING: 15520,
    ROWING: 15530,
    RUNNING: 90009,
    SKIING: 15590,
    SNOWBOARDING: 15600,
    SOCCER: 15610,
    STAIR_CLIMBING: 15650,
    STRENGTH_TRAINING: 15670,
    SWIMMING: 15700,
    TENNIS: 15730,
    VOLLEYBALL: 15790,
    WALKING: 90013,
    WEIGHTLIFTING: 15820,
    YOGA: 15870,
  };
}

export function createFitbitService(accessToken: string): FitbitService {
  return new FitbitService(accessToken);
}
