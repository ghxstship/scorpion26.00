// Analytics Tracking Utilities
// Centralized analytics event tracking

export type AnalyticsEvent = 
  // User events
  | 'user.registered'
  | 'user.login'
  | 'user.logout'
  | 'user.role_changed'
  | 'user.subscription_started'
  | 'user.subscription_cancelled'
  | 'user.trial_started'
  | 'user.trial_converted'
  | 'user.trial_expired'
  // Content events
  | 'workout.started'
  | 'workout.completed'
  | 'workout.abandoned'
  | 'program.enrolled'
  | 'program.completed'
  | 'video.played'
  | 'video.completed'
  | 'download.initiated'
  // Engagement events
  | 'comment.posted'
  | 'like.given'
  | 'share.completed'
  | 'challenge.joined'
  | 'achievement.earned'
  | 'streak.milestone'
  // Business events
  | 'payment.succeeded'
  | 'payment.failed'
  | 'refund.requested'
  | 'upgrade.completed'
  | 'downgrade.completed'
  | 'referral.completed';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

class Analytics {
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.NODE_ENV === 'production';
  }

  // Track an event
  track(event: AnalyticsEvent, properties?: Record<string, any>, userId?: string) {
    if (!this.enabled) {
      console.log('[Analytics]', event, properties);
      return;
    }

    const eventData: AnalyticsEventData = {
      event,
      userId,
      properties,
      timestamp: new Date().toISOString(),
    };

    // Send to analytics service (e.g., Mixpanel, Amplitude, Google Analytics)
    this.sendToAnalytics(eventData);
  }

  // Identify a user
  identify(userId: string, traits?: Record<string, any>) {
    if (!this.enabled) {
      console.log('[Analytics] Identify:', userId, traits);
      return;
    }

    // Send user identification to analytics service
    this.sendIdentify(userId, traits);
  }

  // Track page view
  page(pageName: string, properties?: Record<string, any>) {
    if (!this.enabled) {
      console.log('[Analytics] Page:', pageName, properties);
      return;
    }

    this.sendPageView(pageName, properties);
  }

  // Private methods to send to actual analytics services
  private sendToAnalytics(data: AnalyticsEventData) {
    // Implement actual analytics service integration here
    // Example: Mixpanel, Amplitude, Google Analytics, etc.
    
    // For now, just log in development
    if (typeof window !== 'undefined') {
      // Client-side analytics
      // window.gtag?.('event', data.event, data.properties);
      // window.mixpanel?.track(data.event, data.properties);
    }
  }

  private sendIdentify(userId: string, traits?: Record<string, any>) {
    if (typeof window !== 'undefined') {
      // window.mixpanel?.identify(userId);
      // window.mixpanel?.people.set(traits);
    }
  }

  private sendPageView(pageName: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined') {
      // window.gtag?.('config', 'GA_MEASUREMENT_ID', {
      //   page_path: pageName,
      //   ...properties,
      // });
    }
  }
}

// Singleton instance
export const analytics = new Analytics();

// Convenience functions for common events
export const trackUserEvent = {
  registered: (userId: string, method: string) => 
    analytics.track('user.registered', { method }, userId),
  
  login: (userId: string, method: string) => 
    analytics.track('user.login', { method }, userId),
  
  logout: (userId: string) => 
    analytics.track('user.logout', {}, userId),
  
  subscriptionStarted: (userId: string, planId: string, amount: number) => 
    analytics.track('user.subscription_started', { planId, amount }, userId),
  
  trialStarted: (userId: string, trialDays: number) => 
    analytics.track('user.trial_started', { trialDays }, userId),
};

export const trackWorkoutEvent = {
  started: (userId: string, workoutId: string, workoutTitle: string) => 
    analytics.track('workout.started', { workoutId, workoutTitle }, userId),
  
  completed: (userId: string, workoutId: string, duration: number) => 
    analytics.track('workout.completed', { workoutId, duration }, userId),
  
  abandoned: (userId: string, workoutId: string, timeSpent: number) => 
    analytics.track('workout.abandoned', { workoutId, timeSpent }, userId),
};

export const trackEngagementEvent = {
  commentPosted: (userId: string, postId: string) => 
    analytics.track('comment.posted', { postId }, userId),
  
  likeGiven: (userId: string, targetType: string, targetId: string) => 
    analytics.track('like.given', { targetType, targetId }, userId),
  
  challengeJoined: (userId: string, challengeId: string) => 
    analytics.track('challenge.joined', { challengeId }, userId),
  
  achievementEarned: (userId: string, achievementId: string, achievementName: string) => 
    analytics.track('achievement.earned', { achievementId, achievementName }, userId),
};

export const trackBusinessEvent = {
  paymentSucceeded: (userId: string, amount: number, planId: string) => 
    analytics.track('payment.succeeded', { amount, planId }, userId),
  
  paymentFailed: (userId: string, amount: number, reason: string) => 
    analytics.track('payment.failed', { amount, reason }, userId),
  
  upgradeCompleted: (userId: string, fromPlan: string, toPlan: string) => 
    analytics.track('upgrade.completed', { fromPlan, toPlan }, userId),
};
