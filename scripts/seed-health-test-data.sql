-- Seed Test Data for Health Integration
-- This script creates sample health data for testing purposes
-- Run this in Supabase SQL Editor after authentication

-- Note: Replace 'YOUR_USER_ID' with an actual user ID from your profiles table

-- 1. Create a test health connection (Google Fit)
INSERT INTO health_connections (
  user_id,
  provider,
  connected_at,
  last_sync_at,
  sync_enabled,
  sync_frequency_hours,
  metadata
) VALUES (
  'YOUR_USER_ID', -- Replace with actual user ID
  'google_fit',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '1 hour',
  true,
  4,
  '{"test_data": true}'::jsonb
) ON CONFLICT (user_id, provider) DO NOTHING;

-- 2. Create daily stats for the past 7 days
INSERT INTO daily_stats (
  user_id,
  date,
  steps,
  active_calories,
  total_calories,
  distance_meters,
  active_minutes,
  exercise_minutes,
  stand_hours,
  sleep_minutes,
  deep_sleep_minutes,
  rem_sleep_minutes,
  light_sleep_minutes,
  resting_heart_rate,
  avg_heart_rate,
  max_heart_rate,
  weight_kg,
  floors_climbed,
  data_sources
)
SELECT
  'YOUR_USER_ID', -- Replace with actual user ID
  CURRENT_DATE - (n || ' days')::INTERVAL,
  8000 + (RANDOM() * 4000)::INTEGER, -- Steps: 8000-12000
  400 + (RANDOM() * 300)::INTEGER, -- Active calories: 400-700
  2000 + (RANDOM() * 500)::INTEGER, -- Total calories: 2000-2500
  5000 + (RANDOM() * 3000), -- Distance: 5-8 km
  25 + (RANDOM() * 40)::INTEGER, -- Active minutes: 25-65
  15 + (RANDOM() * 30)::INTEGER, -- Exercise minutes: 15-45
  8 + (RANDOM() * 4)::INTEGER, -- Stand hours: 8-12
  420 + (RANDOM() * 60)::INTEGER, -- Sleep: 7-8 hours
  80 + (RANDOM() * 40)::INTEGER, -- Deep sleep: 80-120 min
  90 + (RANDOM() * 30)::INTEGER, -- REM sleep: 90-120 min
  180 + (RANDOM() * 60)::INTEGER, -- Light sleep: 180-240 min
  55 + (RANDOM() * 15)::INTEGER, -- Resting HR: 55-70
  75 + (RANDOM() * 25)::INTEGER, -- Avg HR: 75-100
  140 + (RANDOM() * 40)::INTEGER, -- Max HR: 140-180
  70 + (RANDOM() * 10), -- Weight: 70-80 kg
  5 + (RANDOM() * 10)::INTEGER, -- Floors: 5-15
  ARRAY['google_fit']
FROM generate_series(0, 6) AS n
ON CONFLICT (user_id, date) DO NOTHING;

-- 3. Create heart rate data for today (hourly samples)
INSERT INTO heart_rate_data (
  user_id,
  recorded_at,
  bpm,
  source,
  zone
)
SELECT
  'YOUR_USER_ID', -- Replace with actual user ID
  CURRENT_DATE + (n || ' hours')::INTERVAL,
  CASE 
    WHEN n BETWEEN 0 AND 6 THEN 55 + (RANDOM() * 10)::INTEGER -- Night: 55-65
    WHEN n BETWEEN 7 AND 9 THEN 65 + (RANDOM() * 15)::INTEGER -- Morning: 65-80
    WHEN n BETWEEN 10 AND 17 THEN 70 + (RANDOM() * 20)::INTEGER -- Day: 70-90
    WHEN n BETWEEN 18 AND 20 THEN 80 + (RANDOM() * 30)::INTEGER -- Evening workout: 80-110
    ELSE 60 + (RANDOM() * 15)::INTEGER -- Night: 60-75
  END,
  'google_fit',
  CASE 
    WHEN n BETWEEN 18 AND 20 THEN 'cardio'
    WHEN n BETWEEN 0 AND 6 THEN 'resting'
    ELSE 'fat_burn'
  END
FROM generate_series(0, 23) AS n;

-- 4. Create sleep sessions for the past 7 nights
INSERT INTO sleep_sessions (
  user_id,
  start_time,
  end_time,
  total_minutes,
  deep_sleep_minutes,
  rem_sleep_minutes,
  light_sleep_minutes,
  awake_minutes,
  sleep_quality_score,
  avg_heart_rate,
  source
)
SELECT
  'YOUR_USER_ID', -- Replace with actual user ID
  (CURRENT_DATE - (n || ' days')::INTERVAL) + INTERVAL '22 hours', -- 10 PM
  (CURRENT_DATE - (n || ' days')::INTERVAL) + INTERVAL '30 hours', -- 6 AM next day
  420 + (RANDOM() * 60)::INTEGER, -- 7-8 hours
  80 + (RANDOM() * 40)::INTEGER, -- Deep: 80-120 min
  90 + (RANDOM() * 30)::INTEGER, -- REM: 90-120 min
  180 + (RANDOM() * 60)::INTEGER, -- Light: 180-240 min
  10 + (RANDOM() * 20)::INTEGER, -- Awake: 10-30 min
  70 + (RANDOM() * 25)::INTEGER, -- Quality: 70-95
  58 + (RANDOM() * 10)::INTEGER, -- HR: 58-68
  'google_fit'
FROM generate_series(0, 6) AS n;

-- 5. Create weight logs for the past 30 days (every 3 days)
INSERT INTO weight_logs (
  user_id,
  recorded_at,
  weight_kg,
  body_fat_percentage,
  bmi,
  source
)
SELECT
  'YOUR_USER_ID', -- Replace with actual user ID
  CURRENT_DATE - (n || ' days')::INTERVAL,
  75 + (RANDOM() * 2 - 1), -- Weight fluctuates: 74-76 kg
  18 + (RANDOM() * 4), -- Body fat: 18-22%
  22.5 + (RANDOM() * 1), -- BMI: 22.5-23.5
  'manual'
FROM generate_series(0, 30, 3) AS n;

-- 6. Create sync log entries
INSERT INTO health_data_sync (
  user_id,
  provider,
  data_type,
  sync_date,
  data,
  records_synced,
  sync_status
)
SELECT
  'YOUR_USER_ID', -- Replace with actual user ID
  'google_fit',
  'daily_stats',
  CURRENT_DATE - (n || ' days')::INTERVAL,
  '{"synced": true}'::jsonb,
  1,
  'success'
FROM generate_series(0, 6) AS n
ON CONFLICT (user_id, provider, data_type, sync_date) DO NOTHING;

-- Verify the data was created
SELECT 'Health Connections' as table_name, COUNT(*) as records FROM health_connections WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Daily Stats', COUNT(*) FROM daily_stats WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Heart Rate Data', COUNT(*) FROM heart_rate_data WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Sleep Sessions', COUNT(*) FROM sleep_sessions WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Weight Logs', COUNT(*) FROM weight_logs WHERE user_id = 'YOUR_USER_ID'
UNION ALL
SELECT 'Sync Logs', COUNT(*) FROM health_data_sync WHERE user_id = 'YOUR_USER_ID';

-- Success message
SELECT 
  '✅ Test data created successfully!' as message,
  'Navigate to /member/health to view your data' as next_step;
