import { GarminActivity, GarminDailySummary, DailyStats } from '@/types/health';

/**
 * Garmin Integration Service
 * 
 * Uses Garmin Health API
 * Note: Requires partnership agreement with Garmin
 * 
 * API Documentation: https://developer.garmin.com/health-api/overview/
 */

const GARMIN_API_BASE = 'https://apis.garmin.com/wellness-api/rest';

export class GarminService {
  private consumerKey: string;
  private consumerSecret: string;
  private accessToken: string | null = null;
  private accessTokenSecret: string | null = null;

  constructor(config: {
    consumerKey: string;
    consumerSecret: string;
    accessToken?: string;
    accessTokenSecret?: string;
  }) {
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
    this.accessToken = config.accessToken || null;
    this.accessTokenSecret = config.accessTokenSecret || null;
  }

  setTokens(accessToken: string, accessTokenSecret: string): void {
    this.accessToken = accessToken;
    this.accessTokenSecret = accessTokenSecret;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken || !this.accessTokenSecret) {
      throw new Error('Garmin access tokens not set');
    }

    // Note: Garmin uses OAuth 1.0a which requires signing requests
    // In production, use a library like 'oauth-1.0a' for proper signing
    const response = await fetch(`${GARMIN_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Garmin API error: ${response.status}`);
    }

    return response.json();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async getDailySummary(date: Date): Promise<GarminDailySummary | null> {
    try {
      const data = await this.makeRequest(
        `/dailies/${this.formatDate(date)}`
      );

      if (!data || data.length === 0) return null;

      const summary = data[0];
      
      return {
        calendarDate: summary.calendarDate,
        steps: summary.totalSteps || 0,
        distanceInMeters: summary.totalDistanceMeters || 0,
        activeKilocalories: summary.activeKilocalories || 0,
        bmrKilocalories: summary.bmrKilocalories || 0,
        moderateIntensityMinutes: summary.moderateIntensityMinutes || 0,
        vigorousIntensityMinutes: summary.vigorousIntensityMinutes || 0,
        floorsAscended: summary.floorsAscended,
        restingHeartRate: summary.restingHeartRate,
      };
    } catch (error) {
      console.error('Failed to get daily summary from Garmin:', error);
      return null;
    }
  }

  async getActivities(startDate: Date, endDate: Date): Promise<GarminActivity[]> {
    try {
      const data = await this.makeRequest(
        `/activities?uploadStartTimeInSeconds=${Math.floor(startDate.getTime() / 1000)}&uploadEndTimeInSeconds=${Math.floor(endDate.getTime() / 1000)}`
      );

      return (data || []).map((activity: any) => ({
        activityId: activity.activityId,
        activityName: activity.activityName,
        activityType: activity.activityType?.typeKey || 'other',
        startTimeGMT: activity.startTimeGMT,
        duration: activity.duration || 0,
        distance: activity.distance || 0,
        calories: activity.calories || 0,
        averageHR: activity.averageHR,
        maxHR: activity.maxHR,
      }));
    } catch (error) {
      console.error('Failed to get activities from Garmin:', error);
      return [];
    }
  }

  async getHeartRates(date: Date): Promise<Array<{ timestamp: string; bpm: number }>> {
    try {
      const data = await this.makeRequest(
        `/heartrates/${this.formatDate(date)}`
      );

      if (!data || !data.heartRateValues) return [];

      return data.heartRateValues.map((hr: any) => ({
        timestamp: hr.timestamp,
        bpm: hr.heartRate,
      }));
    } catch (error) {
      console.error('Failed to get heart rates from Garmin:', error);
      return [];
    }
  }

  async getSleep(date: Date): Promise<any> {
    try {
      const data = await this.makeRequest(
        `/sleeps/${this.formatDate(date)}`
      );

      return data || null;
    } catch (error) {
      console.error('Failed to get sleep from Garmin:', error);
      return null;
    }
  }

  async getStressData(date: Date): Promise<Array<{ timestamp: string; stressLevel: number }>> {
    try {
      const data = await this.makeRequest(
        `/stress/${this.formatDate(date)}`
      );

      if (!data || !data.stressValuesArray) return [];

      return data.stressValuesArray.map((stress: any) => ({
        timestamp: stress.timestamp,
        stressLevel: stress.stressLevel,
      }));
    } catch (error) {
      console.error('Failed to get stress data from Garmin:', error);
      return [];
    }
  }

  async getBodyComposition(date: Date): Promise<any> {
    try {
      const data = await this.makeRequest(
        `/bodycomps/${this.formatDate(date)}`
      );

      return data || null;
    } catch (error) {
      console.error('Failed to get body composition from Garmin:', error);
      return null;
    }
  }

  async getPulseOx(date: Date): Promise<Array<{ timestamp: string; spo2: number }>> {
    try {
      const data = await this.makeRequest(
        `/pulseox/${this.formatDate(date)}`
      );

      if (!data || !data.pulseOxReadings) return [];

      return data.pulseOxReadings.map((reading: any) => ({
        timestamp: reading.timestamp,
        spo2: reading.spo2Value,
      }));
    } catch (error) {
      console.error('Failed to get pulse ox from Garmin:', error);
      return [];
    }
  }

  async getRespirationData(date: Date): Promise<any> {
    try {
      const data = await this.makeRequest(
        `/respiration/${this.formatDate(date)}`
      );

      return data || null;
    } catch (error) {
      console.error('Failed to get respiration data from Garmin:', error);
      return null;
    }
  }

  async getDailyStats(date: Date): Promise<Partial<DailyStats>> {
    const summary = await this.getDailySummary(date);

    if (!summary) {
      return { data_sources: ['garmin'] };
    }

    const totalCalories = summary.activeKilocalories + summary.bmrKilocalories;
    const activeMinutes = summary.moderateIntensityMinutes + (summary.vigorousIntensityMinutes * 2);

    return {
      steps: summary.steps,
      active_calories: summary.activeKilocalories,
      total_calories: totalCalories,
      distance_meters: summary.distanceInMeters,
      active_minutes: activeMinutes,
      exercise_minutes: summary.vigorousIntensityMinutes,
      floors_climbed: summary.floorsAscended || undefined,
      resting_heart_rate: summary.restingHeartRate || undefined,
      data_sources: ['garmin'],
    };
  }

  // Activity Type Mapping
  static readonly ActivityTypes = {
    RUNNING: 'running',
    CYCLING: 'cycling',
    SWIMMING: 'swimming',
    WALKING: 'walking',
    HIKING: 'hiking',
    STRENGTH_TRAINING: 'strength_training',
    CARDIO: 'cardio',
    YOGA: 'yoga',
    ELLIPTICAL: 'elliptical',
    ROWING: 'rowing',
    STAIR_CLIMBING: 'stair_climbing',
    SKIING: 'skiing',
    SNOWBOARDING: 'snowboarding',
    TENNIS: 'tennis',
    GOLF: 'golf',
    BASKETBALL: 'basketball',
    SOCCER: 'soccer',
    VOLLEYBALL: 'volleyball',
    BOXING: 'boxing',
    MARTIAL_ARTS: 'martial_arts',
  };
}

export function createGarminService(config: {
  consumerKey: string;
  consumerSecret: string;
  accessToken?: string;
  accessTokenSecret?: string;
}): GarminService {
  return new GarminService(config);
}
