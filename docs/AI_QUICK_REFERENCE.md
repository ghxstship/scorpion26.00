# AI Personalization - Quick Reference

## 🚀 Quick Start

### 1. Install (Optional)
```bash
npm install openai
```

### 2. Environment
```env
OPENAI_API_KEY=sk-...  # Optional, works without it
```

### 3. Run Migration
```bash
supabase db push
```

## 📡 API Endpoints

### Recommendations
```typescript
GET /api/ai/recommendations
GET /api/ai/recommendations?type=progressive_overload
```

### Training Plans
```typescript
POST /api/ai/training-plan
Body: { goal, experience_level, duration_weeks, training_frequency, ... }

GET /api/ai/training-plan
```

### Chat
```typescript
POST /api/ai/chat
Body: { message, session_id? }

GET /api/ai/chat
```

### Recovery Score
```typescript
POST /api/ai/recovery-score
Body: { sleep_hours, sleep_quality, fatigue_level, soreness_level, stress_level }

GET /api/ai/recovery-score?trend=true
GET /api/ai/recovery-score?days=7
```

## 💻 Code Examples

### Generate Recommendations
```typescript
import { RecommendationEngine } from '@/lib/ai/recommendation-engine';

const engine = new RecommendationEngine();
const result = await engine.generateRecommendations({ user_id });
```

### Create Training Plan
```typescript
import { TrainingPlanGenerator } from '@/lib/ai/plan-generator';

const generator = new TrainingPlanGenerator();
const result = await generator.generatePlan({
  user_id,
  goal: 'hypertrophy',
  experience_level: 'intermediate',
  duration_weeks: 8,
  training_frequency: 4,
  session_duration: 60,
  equipment_available: ['barbell', 'dumbbells'],
});
```

### Calculate Recovery
```typescript
import { RecoveryScoreCalculator } from '@/lib/ai/recovery-score';

const calculator = new RecoveryScoreCalculator();
const result = await calculator.calculateRecoveryScore(user_id, {
  sleep_hours: 7.5,
  sleep_quality: 8,
  fatigue_level: 3,
  soreness_level: 4,
  stress_level: 5,
});
```

### Adaptive Difficulty
```typescript
import { AdaptiveDifficultySystem } from '@/lib/ai/adaptive-difficulty';

const system = new AdaptiveDifficultySystem();
const analysis = await system.analyzeAndAdjust(user_id, workout_id, exercise_id);
const adjusted = system.applyAdjustments(exercise, analysis.adjustments);
```

### AI Chat
```typescript
import { CoachChatbot } from '@/lib/ai/coach-chatbot';

const chatbot = new CoachChatbot();
const response = await chatbot.chat(user_id, {
  message: 'How do I improve my form?',
});
```

## 🗄️ Database Tables

- `user_fitness_profile` - User goals and preferences
- `ai_recommendations` - Generated recommendations
- `training_plans` - Training plans (AI and manual)
- `ai_chat_sessions` - Chat history
- `recovery_metrics` - Daily recovery data
- `adaptive_difficulty_history` - Adjustment history

## 📊 Key Metrics

### Recommendation Weights
- Workout History: 40%
- Recovery: 25%
- Goals: 20%
- Preferences: 15%

### Recovery Score Weights
- Sleep: 35%
- Fatigue: 30%
- Soreness: 20%
- Stress: 15%

### Readiness Status
- Optimal: 85-100
- Good: 70-84
- Moderate: 50-69
- Low: 30-49
- Rest Needed: 0-29

### Adaptive Adjustments
**Increase**: +5-10% weight, +1-2 reps, -10s rest
**Decrease**: -10-15% weight, -2-3 reps, +15-30s rest

## 🎯 Recommendation Types

- `rest_day` - Recovery needed
- `deload_week` - Reduce volume
- `progressive_overload` - Increase intensity
- `exercise_swap` - Alternative exercises
- `volume_adjustment` - Modify training volume

## 💰 Costs

**With OpenAI**: $50-200/month
**Without OpenAI**: $0/month (rule-based fallback)

## 📁 File Locations

```
/lib/ai/
├── recommendation-engine.ts
├── plan-generator.ts
├── adaptive-difficulty.ts
├── recovery-score.ts
└── coach-chatbot.ts

/app/api/ai/
├── recommendations/route.ts
├── training-plan/route.ts
├── chat/route.ts
└── recovery-score/route.ts

/app/member/coach/page.tsx
/types/ai.ts
/migrations/20251104090000_ai_personalization.sql
```

## 🔧 Troubleshooting

**OpenAI not working?**
- Check `OPENAI_API_KEY` is set
- System falls back to rule-based automatically

**No recommendations?**
- Ensure user has fitness profile
- Check workout history exists

**Chat not saving?**
- Verify session ID is passed
- Check RLS policies

## 📚 Documentation

- Full guide: `/docs/AI_PERSONALIZATION_GUIDE.md`
- Complete summary: `/docs/AI_PERSONALIZATION_COMPLETE.md`
- This reference: `/docs/AI_QUICK_REFERENCE.md`

## ✅ Status

**All features complete and production-ready!**
