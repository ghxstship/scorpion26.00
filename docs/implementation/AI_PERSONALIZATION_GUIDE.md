# AI Personalization System - Complete Guide

## Overview

The AI Personalization system provides intelligent workout recommendations, custom training plans, adaptive difficulty adjustments, recovery scoring, and an AI coach chatbot powered by OpenAI GPT-4.

## Features

### 1. Recommendation Engine
**Location**: `/lib/ai/recommendation-engine.ts`

Analyzes user data with weighted scoring to generate personalized recommendations:

- **Workout History (40%)**: Frequency, completion rate, volume trends
- **Recovery Status (25%)**: Sleep, fatigue, soreness metrics
- **Goal Alignment (20%)**: Progress toward fitness goals
- **Preferences (15%)**: Workout type preferences

**Recommendation Types**:
- Rest days (when recovery score < 50)
- Deload weeks (after 3+ high-intensity weeks)
- Progressive overload (when ready to increase intensity)
- Exercise swaps
- Volume adjustments

**API Endpoint**: `GET /api/ai/recommendations`

```typescript
// Example usage
const response = await fetch('/api/ai/recommendations?type=progressive_overload');
const { recommendations, analysis } = await response.json();
```

### 2. Training Plan Generator
**Location**: `/lib/ai/plan-generator.ts`

Creates custom training plans based on:
- Fitness goal (strength, hypertrophy, endurance, etc.)
- Experience level (beginner, intermediate, advanced, elite)
- Training frequency (1-7 days/week)
- Session duration (15-180 minutes)
- Available equipment
- Limitations and preferences

**Features**:
- AI-generated plans (with OpenAI) or rule-based fallback
- Progressive overload strategies
- Automatic deload weeks (every 4th week)
- Exercise selection based on equipment
- Volume adjustment by experience level

**API Endpoints**:
- `POST /api/ai/training-plan` - Generate new plan
- `GET /api/ai/training-plan` - Get user's plans

```typescript
// Example: Generate a plan
const response = await fetch('/api/ai/training-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    goal: 'hypertrophy',
    experience_level: 'intermediate',
    duration_weeks: 12,
    training_frequency: 4,
    session_duration: 60,
    equipment_available: ['barbell', 'dumbbells', 'bench'],
    limitations: ['lower back sensitivity'],
  }),
});

const { plan, reasoning, estimated_results } = await response.json();
```

### 3. Adaptive Difficulty System
**Location**: `/lib/ai/adaptive-difficulty.ts`

Automatically adjusts workout difficulty based on performance:

**Metrics Analyzed**:
- Completion rate (% of sets completed)
- Average RPE (Rate of Perceived Exertion)
- Form quality (inferred from consistency)
- Training consistency

**Adjustment Strategies**:

**Increase Difficulty** (when performance is excellent):
- Weight: +5-10%
- Reps: +1-2 per set
- Rest: -10-15 seconds

**Decrease Difficulty** (when struggling):
- Weight: -10-15%
- Reps: -2-3 per set
- Rest: +15-30 seconds

**Criteria**:
- **Increase**: Completion ≥90%, RPE ≤7.5, Form ≥8
- **Maintain**: Moderate performance
- **Decrease**: Completion <70%, RPE >9, Form <6

```typescript
// Example: Analyze and adjust
import { AdaptiveDifficultySystem } from '@/lib/ai/adaptive-difficulty';

const system = new AdaptiveDifficultySystem();
const analysis = await system.analyzeAndAdjust(userId, workoutId, exerciseId);

// Apply adjustments
const adjustedExercise = system.applyAdjustments(exercise, analysis.adjustments);
```

### 4. Recovery Score Calculator
**Location**: `/lib/ai/recovery-score.ts`

Calculates readiness score (0-100) from daily metrics:

**Input Metrics**:
- Sleep hours (optimal: 7-9 hours)
- Sleep quality (1-10 scale)
- Fatigue level (1-10 scale)
- Soreness level (1-10 scale)
- Stress level (1-10 scale)

**Scoring Weights**:
- Sleep: 35%
- Fatigue: 30%
- Soreness: 20%
- Stress: 15%

**Readiness Status**:
- **Optimal** (85-100): High-intensity training
- **Good** (70-84): Normal training
- **Moderate** (50-69): Light session
- **Low** (30-49): Active recovery
- **Rest Needed** (0-29): Complete rest

**API Endpoints**:
- `POST /api/ai/recovery-score` - Calculate score
- `GET /api/ai/recovery-score?trend=true` - Get 7-day trend
- `GET /api/ai/recovery-score?days=7` - Get average score

```typescript
// Example: Calculate recovery score
const response = await fetch('/api/ai/recovery-score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sleep_hours: 7.5,
    sleep_quality: 8,
    fatigue_level: 3,
    soreness_level: 4,
    stress_level: 5,
  }),
});

const { score, status, recommendation, workout_intensity } = await response.json();
```

### 5. AI Coach Chatbot
**Location**: `/lib/ai/coach-chatbot.ts`

ChatGPT-style interface for fitness coaching:

**Capabilities**:
- Form and technique advice
- Exercise modifications and alternatives
- Nutrition guidance (protein, calories, meal timing)
- Recovery strategies
- Progress tracking advice
- Custom workout generation

**Features**:
- Context-aware responses (uses user profile and workout history)
- Conversation history
- Suggested follow-up questions
- Rule-based fallback (when OpenAI unavailable)

**API Endpoints**:
- `POST /api/ai/chat` - Send message
- `GET /api/ai/chat` - Get chat sessions

**UI**: `/app/member/coach/page.tsx`

```typescript
// Example: Chat with AI coach
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: sessionId, // Optional, creates new if not provided
    message: 'How do I improve my squat form?',
  }),
});

const { session_id, message, suggestions } = await response.json();
```

## Database Schema

### Tables Created

1. **user_fitness_profile**: User goals, experience, preferences
2. **ai_recommendations**: Generated recommendations
3. **training_plans**: User training plans (AI and manual)
4. **ai_chat_sessions**: Chatbot conversation history
5. **recovery_metrics**: Daily recovery data
6. **adaptive_difficulty_history**: Adjustment history

**Migration**: `/migrations/20251104090000_ai_personalization.sql`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install openai
```

### 2. Environment Variables

Add to `.env.local`:

```env
# OpenAI API Key (required for AI features)
OPENAI_API_KEY=sk-...

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 3. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply migration manually in Supabase dashboard
```

### 4. Create User Fitness Profile

Users need a fitness profile for personalization:

```typescript
const { data, error } = await supabase
  .from('user_fitness_profile')
  .insert({
    user_id: userId,
    fitness_goal: 'hypertrophy',
    experience_level: 'intermediate',
    equipment_available: ['barbell', 'dumbbells', 'bench'],
    preferred_workout_types: ['strength', 'hypertrophy'],
    training_frequency: 4,
    session_duration: 60,
  });
```

## Usage Examples

### Generate Recommendations

```typescript
import { RecommendationEngine } from '@/lib/ai/recommendation-engine';

const engine = new RecommendationEngine();
const result = await engine.generateRecommendations({
  user_id: userId,
});

console.log('Recommendations:', result.recommendations);
console.log('Analysis:', result.analysis);
```

### Create Training Plan

```typescript
import { TrainingPlanGenerator } from '@/lib/ai/plan-generator';

const generator = new TrainingPlanGenerator();
const result = await generator.generatePlan({
  user_id: userId,
  goal: 'strength',
  experience_level: 'intermediate',
  duration_weeks: 8,
  training_frequency: 3,
  session_duration: 60,
  equipment_available: ['barbell', 'dumbbells'],
});

console.log('Plan:', result.plan);
console.log('Reasoning:', result.reasoning);
```

### Calculate Recovery Score

```typescript
import { RecoveryScoreCalculator } from '@/lib/ai/recovery-score';

const calculator = new RecoveryScoreCalculator();
const result = await calculator.calculateRecoveryScore(userId, {
  sleep_hours: 7.5,
  sleep_quality: 8,
  fatigue_level: 3,
  soreness_level: 4,
  stress_level: 5,
});

console.log('Score:', result.score);
console.log('Status:', result.status);
console.log('Recommendation:', result.recommendation);
```

### Adaptive Difficulty

```typescript
import { AdaptiveDifficultySystem } from '@/lib/ai/adaptive-difficulty';

const system = new AdaptiveDifficultySystem();
const analysis = await system.analyzeAndAdjust(userId, workoutId, exerciseId);

if (analysis.recommendation === 'increase') {
  console.log('Ready to progress!');
  console.log('Adjustments:', analysis.adjustments);
}
```

### AI Coach Chat

```typescript
import { CoachChatbot } from '@/lib/ai/coach-chatbot';

const chatbot = new CoachChatbot();
const response = await chatbot.chat(userId, {
  message: 'How much protein should I eat?',
});

console.log('Response:', response.message);
console.log('Suggestions:', response.suggestions);
```

## Cost Estimates

### OpenAI API Usage

**With GPT-4**:
- Training plan generation: ~$0.10-0.30 per plan
- Chat messages: ~$0.01-0.05 per exchange
- Monthly estimate: $50-200 (depends on usage)

**Without OpenAI** (Rule-based fallback):
- $0 - All features work with rule-based logic
- Recommendations: Algorithm-based
- Training plans: Template-based
- Chat: Pre-programmed responses

## Performance Optimization

### Caching Strategies

```typescript
// Cache user profile for session
const profile = await getUserProfile(userId);
// Store in session or Redis

// Cache recommendations for 1 hour
const cacheKey = `recommendations:${userId}`;
// Use Redis or in-memory cache
```

### Database Indexing

All necessary indexes are created in the migration:
- User ID indexes on all tables
- Date indexes for time-based queries
- Status indexes for filtering

### Rate Limiting

Implement rate limiting for AI endpoints:

```typescript
// In API route
import { rateLimit } from '@/lib/api/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

await limiter.check(10, userId); // 10 requests per minute
```

## Testing

### Unit Tests

```typescript
// Test recommendation engine
describe('RecommendationEngine', () => {
  it('should recommend rest day when recovery is low', async () => {
    const engine = new RecommendationEngine();
    const result = await engine.generateRecommendations({
      user_id: testUserId,
    });
    
    const restRec = result.recommendations.find(
      r => r.recommendation_type === 'rest_day'
    );
    expect(restRec).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Test API endpoints
describe('AI API', () => {
  it('should generate recommendations', async () => {
    const response = await fetch('/api/ai/recommendations');
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.recommendations).toBeDefined();
  });
});
```

## Troubleshooting

### OpenAI Not Working

**Issue**: AI features falling back to rule-based
**Solution**: 
1. Check `OPENAI_API_KEY` is set correctly
2. Verify API key is valid
3. Check OpenAI account has credits

### Recommendations Not Generating

**Issue**: Empty recommendations array
**Solution**:
1. Ensure user has fitness profile
2. Check user has workout history
3. Verify recovery metrics exist

### Chat Session Not Persisting

**Issue**: Messages not saving
**Solution**:
1. Check session ID is being passed
2. Verify database permissions (RLS policies)
3. Check Supabase connection

## Future Enhancements

### Planned Features

1. **Computer Vision**: Form analysis from video
2. **Voice Interface**: Voice-controlled coaching
3. **Wearable Integration**: Real-time biometric data
4. **Social Features**: Share plans with friends
5. **Nutrition Tracking**: Meal planning and tracking
6. **Progress Photos**: AI-powered body composition analysis

### OpenAI Integration (When Installed)

```typescript
// Example GPT-4 integration
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: 'You are an expert fitness coach...',
    },
    {
      role: 'user',
      content: userMessage,
    },
  ],
  temperature: 0.7,
  max_tokens: 500,
});

const response = completion.choices[0].message.content;
```

## Support

For issues or questions:
1. Check this documentation
2. Review code comments in `/lib/ai/`
3. Check database schema in migration file
4. Test API endpoints with Postman/curl

## Summary

The AI Personalization system provides:
- ✅ Intelligent workout recommendations
- ✅ Custom training plan generation
- ✅ Adaptive difficulty adjustments
- ✅ Recovery score calculation
- ✅ AI coach chatbot
- ✅ Complete API endpoints
- ✅ Database schema and migrations
- ✅ Rule-based fallbacks (no OpenAI required)
- ✅ Type-safe TypeScript implementation

**Estimated Development Time**: 4 weeks
**Monthly Cost**: $50-200 (with OpenAI) or $0 (rule-based)
**Status**: ✅ Complete and ready for deployment
