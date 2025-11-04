declare module '@capacitor-community/health' {
  export interface HealthPlugin {
    isAvailable(): Promise<{ available: boolean }>;
    requestAuthorization(options: any): Promise<void>;
    queryHKitSampleType(options: any): Promise<any>;
    multipleQueryHKitSampleType(options: any): Promise<any>;
    queryWorkouts(options: any): Promise<any>;
    querySteps(options: any): Promise<any>;
    queryDistance(options: any): Promise<any>;
    queryCalories(options: any): Promise<any>;
    queryHeartRate(options: any): Promise<any>;
    queryActiveEnergyBurned(options: any): Promise<any>;
    queryWeight(options: any): Promise<any>;
    queryBodyFatPercentage(options: any): Promise<any>;
    queryLeanBodyMass(options: any): Promise<any>;
    queryVO2Max(options: any): Promise<any>;
    queryRestingHeartRate(options: any): Promise<any>;
    queryHeartRateVariability(options: any): Promise<any>;
    writeWorkout(options: any): Promise<void>;
  }

  export const Health: HealthPlugin;
}
