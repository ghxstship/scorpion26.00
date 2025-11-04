# Apple Watch Backend Requirements

## Database Migration

Add to Supabase migrations:

```sql
-- Create workout_sessions table
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  workout_type VARCHAR(50) NOT NULL,
  calories DECIMAL(10, 2) NOT NULL CHECK (calories >= 0),
  distance_meters DECIMAL(10, 2) DEFAULT 0 CHECK (distance_meters >= 0),
  average_heart_rate INTEGER CHECK (average_heart_rate > 0 AND average_heart_rate < 250),
  max_heart_rate INTEGER CHECK (max_heart_rate > 0 AND max_heart_rate < 250),
  heart_rate_data JSONB,
  elevation_gain DECIMAL(10, 2) DEFAULT 0,
  pace_per_km DECIMAL(10, 2) DEFAULT 0,
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  device VARCHAR(100),
  watchos_version VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_started_at ON workout_sessions(started_at DESC);
CREATE INDEX idx_workout_sessions_type ON workout_sessions(workout_type);

-- RLS Policies
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);
```

## API Routes

### 1. Upload Workout
File: `app/api/workouts/sessions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      ...body
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, workout_id: data.id }, { status: 201 });
}
```

### 2. Get Workout Library
File: `app/api/workouts/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('id, name, type, duration_minutes, difficulty, description')
    .eq('platform', platform || 'all')
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ workouts: data });
}
```

### 3. Get User Stats
File: `app/api/progress/stats/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get workout stats
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', user.id);

  const stats = {
    current_streak: calculateStreak(workouts),
    total_workouts: workouts?.length || 0,
    total_calories: workouts?.reduce((sum, w) => sum + w.calories, 0) || 0,
    total_distance: workouts?.reduce((sum, w) => sum + w.distance_meters, 0) || 0,
    achievements: []
  };

  return NextResponse.json(stats);
}
```

## Implementation Steps

1. **Add Migration** (5 min)
   - Create new migration file in `supabase/migrations/`
   - Run: `supabase db push`

2. **Create API Routes** (30 min)
   - Create `app/api/workouts/sessions/route.ts`
   - Create `app/api/workouts/route.ts`
   - Create `app/api/progress/stats/route.ts`

3. **Test Endpoints** (15 min)
   - Use Postman or curl
   - Verify authentication
   - Verify data saves correctly

4. **Update Watch App** (5 min)
   - Set API URL in `APIManager.swift`
   - Test from watch

## Testing

```bash
# Test workout upload
curl -X POST https://your-api.com/api/workouts/sessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "started_at": "2025-11-04T10:00:00Z",
    "ended_at": "2025-11-04T10:30:00Z",
    "duration_minutes": 30,
    "workout_type": "running",
    "calories": 450
  }'

# Test workout library
curl https://your-api.com/api/workouts?platform=watch \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test stats
curl https://your-api.com/api/progress/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Estimated Time
- Database setup: 10 minutes
- API routes: 45 minutes
- Testing: 20 minutes
- **Total: ~75 minutes**
