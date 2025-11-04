-- Seed Demo Users and Their Mock Data
-- This migration creates demo users and populates them with mock data
-- Real users created through normal signup will NOT have this data

-- ============================================================================
-- CREATE DEMO USERS IN AUTH.USERS
-- ============================================================================
-- Note: In production, you should create these users through Supabase Auth API
-- This is a placeholder showing the structure. Actual user creation should be done via:
-- 1. Supabase Dashboard > Authentication > Users > Add User
-- 2. Or via Supabase Auth API with proper password hashing

-- Demo user IDs (these should match the IDs you create in Supabase Auth)
-- guest@scorpion26.com     -> user-guest-001
-- member@scorpion26.com    -> user-member-001
-- collab@scorpion26.com    -> user-collab-001
-- team@scorpion26.com      -> user-team-001
-- admin@scorpion26.com     -> user-admin-001

-- ============================================================================
-- MARK DEMO USERS IN PROFILES
-- ============================================================================
-- Update profiles to mark demo users (assumes they already exist in auth.users)
UPDATE public.profiles 
SET is_demo = TRUE
WHERE email IN (
  'guest@scorpion26.com',
  'member@scorpion26.com',
  'collab@scorpion26.com',
  'team@scorpion26.com',
  'admin@scorpion26.com'
);

-- ============================================================================
-- SEED MOCK DATA FOR DEMO USERS ONLY
-- ============================================================================

-- Get demo user IDs for reference
DO $$
DECLARE
  demo_guest_id UUID;
  demo_member_id UUID;
  demo_collab_id UUID;
  demo_team_id UUID;
  demo_admin_id UUID;
  sample_program_id UUID;
  sample_workout_id UUID;
BEGIN
  -- Get demo user IDs
  SELECT id INTO demo_guest_id FROM auth.users WHERE email = 'guest@scorpion26.com';
  SELECT id INTO demo_member_id FROM auth.users WHERE email = 'member@scorpion26.com';
  SELECT id INTO demo_collab_id FROM auth.users WHERE email = 'collab@scorpion26.com';
  SELECT id INTO demo_team_id FROM auth.users WHERE email = 'team@scorpion26.com';
  SELECT id INTO demo_admin_id FROM auth.users WHERE email = 'admin@scorpion26.com';

  -- Only proceed if demo users exist
  IF demo_member_id IS NOT NULL THEN
    
    -- Create sample program for demo users
    INSERT INTO public.programs (id, title, description, duration, difficulty, category, is_published, created_by)
    VALUES (
      gen_random_uuid(),
      'Demo 30-Day Transformation',
      'A comprehensive 30-day program designed to kickstart your fitness journey',
      '30 days',
      'intermediate',
      'strength',
      TRUE,
      demo_admin_id
    )
    RETURNING id INTO sample_program_id;

    -- Create sample workouts for the program
    INSERT INTO public.workouts (id, program_id, title, description, duration_minutes, difficulty, is_published, created_by)
    VALUES 
      (gen_random_uuid(), sample_program_id, 'Day 1: Full Body Blast', 'Start strong with a full body workout', 45, 'intermediate', TRUE, demo_admin_id),
      (gen_random_uuid(), sample_program_id, 'Day 2: Upper Body Focus', 'Target your upper body muscles', 40, 'intermediate', TRUE, demo_admin_id),
      (gen_random_uuid(), sample_program_id, 'Day 3: Lower Body Power', 'Build leg strength and power', 50, 'intermediate', TRUE, demo_admin_id)
    RETURNING id INTO sample_workout_id;

    -- Add program enrollment for demo member
    INSERT INTO public.program_enrollments (user_id, program_id, enrolled_at, started_at, progress_percentage)
    VALUES (demo_member_id, sample_program_id, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 35);

    -- Add workout logs for demo member (showing progress)
    INSERT INTO public.workout_logs (user_id, workout_id, started_at, completed_at, duration_minutes, calories_burned, difficulty_rating, notes)
    VALUES 
      (demo_member_id, sample_workout_id, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', 45, 320, 7, 'Great first workout! Felt challenging but doable.'),
      (demo_member_id, sample_workout_id, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', 42, 310, 6, 'Getting easier. Form is improving.'),
      (demo_member_id, sample_workout_id, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 48, 340, 8, 'Pushed harder today. Feeling stronger!');

    -- Add body measurements for demo member
    INSERT INTO public.body_measurements (user_id, date, weight, body_fat_percentage, notes)
    VALUES 
      (demo_member_id, CURRENT_DATE - INTERVAL '30 days', 180.5, 22.5, 'Starting measurements'),
      (demo_member_id, CURRENT_DATE - INTERVAL '15 days', 178.2, 21.8, 'Good progress!'),
      (demo_member_id, CURRENT_DATE - INTERVAL '7 days', 176.8, 21.2, 'Feeling great');

    -- Add achievements for demo member
    INSERT INTO public.user_achievements (user_id, achievement_id, earned_at, progress)
    SELECT demo_member_id, id, NOW() - INTERVAL '5 days', 100
    FROM public.achievements 
    WHERE name = 'First Workout'
    LIMIT 1;

    -- Add community posts for demo member
    INSERT INTO public.posts (user_id, content, post_type, visibility, likes_count, comments_count)
    VALUES 
      (demo_member_id, 'Just completed my first week of the 30-Day Transformation! Feeling amazing! 💪', 'update', 'public', 12, 3),
      (demo_member_id, 'Progress update: Down 4 lbs and feeling stronger every day! This program is incredible.', 'update', 'public', 24, 7);

    -- Add notifications for demo member
    INSERT INTO public.notifications (user_id, title, message, type, is_read)
    VALUES 
      (demo_member_id, 'Achievement Unlocked! 🏆', 'You earned the "First Workout" achievement!', 'achievement', TRUE),
      (demo_member_id, 'New Program Available', 'Check out the Advanced Strength Training program', 'program', FALSE),
      (demo_member_id, 'Weekly Progress Report', 'Great work this week! You completed 3 workouts.', 'progress', FALSE);

    -- Add subscription for demo member
    INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
    SELECT demo_member_id, id, 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days'
    FROM public.subscription_plans 
    WHERE name = 'Monthly Membership'
    LIMIT 1;

    -- Add content submission for demo collaborator (if exists)
    IF demo_collab_id IS NOT NULL THEN
      INSERT INTO public.content_submissions (collaborator_id, title, description, content_type, status)
      VALUES 
        (demo_collab_id, 'New HIIT Workout Routine', 'High-intensity interval training for fat loss', 'workout', 'approved'),
        (demo_collab_id, 'Nutrition Guide for Athletes', 'Comprehensive guide to sports nutrition', 'article', 'pending');
    END IF;

    -- Add support ticket for demo guest (if exists)
    IF demo_guest_id IS NOT NULL THEN
      INSERT INTO public.support_tickets (user_id, subject, description, status, priority)
      VALUES 
        (demo_guest_id, 'Question about trial period', 'How long is the trial period and what features are included?', 'resolved', 'normal');
    END IF;

  END IF;
END $$;

-- ============================================================================
-- ADD COMMENTS
-- ============================================================================
COMMENT ON TABLE public.profiles IS 'User profiles. Demo users (is_demo=true) have pre-populated mock data. Real users start clean.';
