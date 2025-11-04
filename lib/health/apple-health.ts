import { AppleHealthWorkout, AppleHealthSample, DailyStats } from '@/types/health';

/**
 * Apple Health Integration Service
 * 
 * Note: This requires the @capacitor-community/health plugin
 * and will only work in a native iOS environment.
 * 
 * Installation:
 * npm install @capacitor-community/health
 * 
 * iOS Configuration (Info.plist):
 * - NSHealthShareUsageDescription
 * - NSHealthUpdateUsageDescription
 */

// Type definitions for optional Capacitor Health plugin
type HealthPlugin = {
  isAvailable: () => Promise<{ available: boolean }>;
  requestAuthorization: (options: any) => Promise<void>;
  queryHKitSampleType: (options: any) => Promise<any>;
  multipleQueryHKitSampleType: (options: any) => Promise<any>;
  queryWorkouts: (options: any) => Promise<any>;
  querySteps: (options: any) => Promise<any>;
  queryDistance: (options: any) => Promise<any>;
  queryCalories: (options: any) => Promise<any>;
  queryHeartRate: (options: any) => Promise<any>;
  queryActiveEnergyBurned: (options: any) => Promise<any>;
  queryWeight: (options: any) => Promise<any>;
  queryBodyFatPercentage: (options: any) => Promise<any>;
  queryLeanBodyMass: (options: any) => Promise<any>;
  queryVO2Max: (options: any) => Promise<any>;
  queryRestingHeartRate: (options: any) => Promise<any>;
  queryHeartRateVariability: (options: any) => Promise<any>;
  writeWorkout: (options: any) => Promise<void>;
};

export class AppleHealthService {
  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      // Check if running on iOS and if HealthKit is available
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
        const result = await Health.isAvailable();
        this.isAvailable = result.available;
      }
    } catch (error) {
      console.error('Apple Health not available:', error);
      this.isAvailable = false;
    }
  }

  async requestAuthorization(): Promise<boolean> {
    if (!this.isAvailable) {
      throw new Error('Apple Health is not available on this device');
    }

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      await Health.requestAuthorization({
        read: [
          'steps',
          'distance',
          'calories',
          'activity',
          'heart_rate',
          'sleep',
          'weight',
          'body_fat_percentage',
          'height',
          'vo2_max',
          'resting_heart_rate',
          'active_energy_burned',
          'exercise_time',
        ],
        write: [
          'steps',
          'distance',
          'calories',
          'activity',
          'heart_rate',
          'weight',
          'body_fat_percentage',
        ],
      });

      return true;
    } catch (error) {
      console.error('Failed to request Apple Health authorization:', error);
      return false;
    }
  }

  async getSteps(startDate: Date, endDate: Date): Promise<number> {
    if (!this.isAvailable) return 0;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'steps',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1000,
      });

      return result.resultData.reduce((sum: number, sample: any) => {
        return sum + (sample.value || 0);
      }, 0);
    } catch (error) {
      console.error('Failed to get steps from Apple Health:', error);
      return 0;
    }
  }

  async getActiveCalories(startDate: Date, endDate: Date): Promise<number> {
    if (!this.isAvailable) return 0;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'active_energy_burned',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1000,
      });

      return Math.round(result.resultData.reduce((sum: number, sample: any) => {
        return sum + (sample.value || 0);
      }, 0));
    } catch (error) {
      console.error('Failed to get active calories from Apple Health:', error);
      return 0;
    }
  }

  async getDistance(startDate: Date, endDate: Date): Promise<number> {
    if (!this.isAvailable) return 0;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'distance',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1000,
      });

      return result.resultData.reduce((sum: number, sample: any) => {
        return sum + (sample.value || 0);
      }, 0);
    } catch (error) {
      console.error('Failed to get distance from Apple Health:', error);
      return 0;
    }
  }

  async getHeartRate(startDate: Date, endDate: Date): Promise<AppleHealthSample[]> {
    if (!this.isAvailable) return [];

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'heart_rate',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 10000,
      });

      return result.resultData.map((sample: any) => ({
        type: 'heart_rate',
        value: sample.value,
        unit: 'bpm',
        startDate: sample.startDate,
        endDate: sample.endDate,
        metadata: sample.metadata,
      }));
    } catch (error) {
      console.error('Failed to get heart rate from Apple Health:', error);
      return [];
    }
  }

  async getRestingHeartRate(date: Date): Promise<number | null> {
    if (!this.isAvailable) return null;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const result = await Health.queryHKitSampleType({
        sampleName: 'resting_heart_rate',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1,
      });

      if (result.resultData.length > 0) {
        return Math.round(result.resultData[0].value);
      }

      return null;
    } catch (error) {
      console.error('Failed to get resting heart rate from Apple Health:', error);
      return null;
    }
  }

  async getWorkouts(startDate: Date, endDate: Date): Promise<AppleHealthWorkout[]> {
    if (!this.isAvailable) return [];

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'activity',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100,
      });

      return result.resultData.map((workout: any) => ({
        workoutActivityType: workout.workoutActivityType,
        duration: workout.duration,
        totalEnergyBurned: workout.totalEnergyBurned || 0,
        totalDistance: workout.totalDistance || 0,
        startDate: workout.startDate,
        endDate: workout.endDate,
        metadata: workout.metadata,
      }));
    } catch (error) {
      console.error('Failed to get workouts from Apple Health:', error);
      return [];
    }
  }

  async getSleep(startDate: Date, endDate: Date): Promise<any[]> {
    if (!this.isAvailable) return [];

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'sleep',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100,
      });

      return result.resultData;
    } catch (error) {
      console.error('Failed to get sleep from Apple Health:', error);
      return [];
    }
  }

  async getWeight(startDate: Date, endDate: Date): Promise<AppleHealthSample[]> {
    if (!this.isAvailable) return [];

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'weight',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100,
      });

      return result.resultData.map((sample: any) => ({
        type: 'weight',
        value: sample.value,
        unit: 'kg',
        startDate: sample.startDate,
        endDate: sample.endDate,
        metadata: sample.metadata,
      }));
    } catch (error) {
      console.error('Failed to get weight from Apple Health:', error);
      return [];
    }
  }

  async getVO2Max(startDate: Date, endDate: Date): Promise<number | null> {
    if (!this.isAvailable) return null;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      const result = await Health.queryHKitSampleType({
        sampleName: 'vo2_max',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1,
      });

      if (result.resultData.length > 0) {
        return result.resultData[0].value;
      }

      return null;
    } catch (error) {
      console.error('Failed to get VO2 Max from Apple Health:', error);
      return null;
    }
  }

  async getDailyStats(date: Date): Promise<Partial<DailyStats>> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const [steps, activeCalories, distance, restingHeartRate, vo2Max] = await Promise.all([
      this.getSteps(startDate, endDate),
      this.getActiveCalories(startDate, endDate),
      this.getDistance(startDate, endDate),
      this.getRestingHeartRate(date),
      this.getVO2Max(startDate, endDate),
    ]);

    return {
      steps,
      active_calories: activeCalories,
      distance_meters: distance,
      resting_heart_rate: restingHeartRate || undefined,
      vo2_max: vo2Max || undefined,
      data_sources: ['apple_health'],
    };
  }

  async writeWorkout(workout: {
    activityType: string;
    startDate: Date;
    endDate: Date;
    calories?: number;
    distance?: number;
  }): Promise<boolean> {
    if (!this.isAvailable) return false;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      await Health.multipleQueryHKitSampleType({
        sampleNames: ['activity'],
        startDate: workout.startDate.toISOString(),
        endDate: workout.endDate.toISOString(),
      });

      // Note: Writing workouts requires additional implementation
      // This is a placeholder for the write functionality
      return true;
    } catch (error) {
      console.error('Failed to write workout to Apple Health:', error);
      return false;
    }
  }

  async writeWeight(weight: number, date: Date): Promise<boolean> {
    if (!this.isAvailable) return false;

    try {
      const { Health } = await import('@capacitor-community/health') as { Health: HealthPlugin };
      
      // Note: Writing weight requires additional implementation
      // This is a placeholder for the write functionality
      return true;
    } catch (error) {
      console.error('Failed to write weight to Apple Health:', error);
      return false;
    }
  }

  isHealthKitAvailable(): boolean {
    return this.isAvailable;
  }
}

export const appleHealthService = new AppleHealthService();
