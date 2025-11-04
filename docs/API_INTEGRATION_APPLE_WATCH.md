# Apple Watch API Integration Guide

## Overview
Backend API integration requirements for the Apple Watch app.

## Authentication
Bearer token authentication for all API requests.

## Required Endpoints

### 1. POST /api/workouts/sessions
Upload completed workout data.

**Request**:
```json
{
  "started_at": "2025-11-04T10:00:00Z",
  "ended_at": "2025-11-04T10:30:00Z",
  "duration_minutes": 30,
  "workout_type": "running",
  "calories": 450,
  "distance_meters": 5000,
  "average_heart_rate": 145,
  "max_heart_rate": 168,
  "heart_rate_data": [120, 135, 142, ...],
  "elevation_gain": 50,
  "pace_per_km": 360,
  "rating": 4
}
```

**Response** (201):
```json
{
  "success": true,
  "workout_id": "uuid",
  "achievements_unlocked": [],
  "new_streak": 8
}
```

### 2. GET /api/workouts?platform=watch
Fetch workout library.

**Response** (200):
```json
{
  "workouts": [
    {
      "id": "uuid",
      "name": "Morning Run",
      "type": "running",
      "duration_minutes": 30,
      "difficulty": "moderate"
    }
  ]
}
```

### 3. GET /api/progress/stats
Fetch user stats and streak.

**Response** (200):
```json
{
  "current_streak": 7,
  "total_workouts": 45,
  "total_calories": 15000,
  "achievements": []
}
```

## Database Schema

```sql
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  workout_type VARCHAR(50) NOT NULL,
  calories DECIMAL(10, 2) NOT NULL,
  distance_meters DECIMAL(10, 2),
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  heart_rate_data JSONB,
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

See full implementation in backend API documentation.
