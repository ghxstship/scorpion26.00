-- Utility Script: Seed Demo Data for Demo Users Only
-- This script can be run to populate demo users with mock data
-- Run this AFTER creating demo users in Supabase Auth

-- ============================================================================
-- INSTRUCTIONS
-- ============================================================================
-- 1. First, create demo users in Supabase Dashboard:
--    - Go to Authentication > Users > Add User
--    - Create users with these emails:
--      * guest@scorpion26.com (password: guest123)
--      * member@scorpion26.com (password: member123)
--      * collab@scorpion26.com (password: collab123)
--      * team@scorpion26.com (password: team123)
--      * admin@scorpion26.com (password: admin123)
--
-- 2. Run this script in Supabase SQL Editor
--
-- 3. Demo users will be populated with mock data
--    New users created through normal signup will NOT have this data
-- ============================================================================

-- Function to seed demo data (can be called multiple times safely)
CREATE OR REPLACE FUNCTION seed_demo_data()
RETURNS void AS $$
DECLARE
  demo_guest_id UUID;
  demo_member_id UUID;
  demo_collab_id UUID;
  demo_team_id UUID;
  demo_admin_id UUID;
  sample_program_id UUID;
  sample_workout_1_id UUID;
  sample_workout_2_id UUID;
  sample_workout_3_id UUID;
BEGIN
  -- Get demo user IDs
  SELECT id INTO demo_guest_id FROM auth.users WHERE email = 'guest@scorpion26.com';
  SELECT id INTO demo_member_id FROM auth.users WHERE email = 'member@scorpion26.com';
  SELECT id INTO demo_collab_id FROM auth.users WHERE email = 'collab@scorpion26.com';
  SELECT id INTO demo_team_id FROM auth.users WHERE email = 'team@scorpion26.com';
  SELECT id INTO demo_admin_id FROM auth.users WHERE email = 'admin@scorpion26.com';

  RAISE NOTICE 'Found demo users: guest=%, member=%, collab=%, team=%, admin=%', 
    demo_guest_id, demo_member_id, demo_collab_id, demo_team_id, demo_admin_id;

  -- Only proceed if at least one demo user exists
  IF demo_member_id IS NULL AND demo_admin_id IS NULL THEN
    RAISE EXCEPTION 'No demo users found. Please create demo users first.';
  END IF;

  -- ============================================================================
  -- MARK DEMO USERS
  -- ============================================================================
  UPDATE public.profiles 
  SET is_demo = TRUE
  WHERE id IN (demo_guest_id, demo_member_id, demo_collab_id, demo_team_id, demo_admin_id)
    AND id IS NOT NULL;

  RAISE NOTICE 'Marked demo users in profiles';

  -- ============================================================================
  -- ASSIGN PROPER ROLES TO DEMO USERS
  -- ============================================================================
  IF demo_admin_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = demo_admin_id;
    INSERT INTO public.user_roles (user_id, role_id, is_active)
    VALUES (demo_admin_id, (SELECT id FROM public.roles WHERE name = 'admin'), TRUE);
  END IF;

  IF demo_team_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = demo_team_id;
    INSERT INTO public.user_roles (user_id, role_id, is_active)
    VALUES (demo_team_id, (SELECT id FROM public.roles WHERE name = 'team'), TRUE);
  END IF;

  IF demo_collab_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = demo_collab_id;
    INSERT INTO public.user_roles (user_id, role_id, is_active)
    VALUES (demo_collab_id, (SELECT id FROM public.roles WHERE name = 'collaborator'), TRUE);
  END IF;

  IF demo_member_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = demo_member_id;
    INSERT INTO public.user_roles (user_id, role_id, is_active)
    VALUES (demo_member_id, (SELECT id FROM public.roles WHERE name = 'member'), TRUE);
  END IF;

  IF demo_guest_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = demo_guest_id;
    INSERT INTO public.user_roles (user_id, role_id, is_active)
    VALUES (demo_guest_id, (SELECT id FROM public.roles WHERE name = 'guest'), TRUE);
  END IF;

  RAISE NOTICE 'Assigned roles to demo users';

  -- ============================================================================
  -- CREATE SAMPLE PROGRAM AND WORKOUTS
  -- ============================================================================
  IF demo_admin_id IS NOT NULL THEN
    -- Delete existing demo program if it exists
    DELETE FROM public.programs WHERE title = 'Demo 30-Day Transformation';

    -- Create sample program
    INSERT INTO public.programs (title, description, duration, difficulty, category, is_published, created_by)
    VALUES (
      'Demo 30-Day Transformation',
      'A comprehensive 30-day program designed to kickstart your fitness journey. Perfect for beginners and intermediate fitness enthusiasts.',
      '30 days',
      'intermediate',
      'strength',
      TRUE,
      demo_admin_id
    )
    RETURNING id INTO sample_program_id;

    -- Create sample workouts
    INSERT INTO public.workouts (program_id, title, description, duration_minutes, difficulty, is_published, created_by)
    VALUES 
      (sample_program_id, 'Day 1: Full Body Blast', 'Start strong with a full body workout targeting all major muscle groups', 45, 'intermediate', TRUE, demo_admin_id)
    RETURNING id INTO sample_workout_1_id;

    INSERT INTO public.workouts (program_id, title, description, duration_minutes, difficulty, is_published, created_by)
    VALUES 
      (sample_program_id, 'Day 2: Upper Body Focus', 'Target your upper body muscles with compound and isolation exercises', 40, 'intermediate', TRUE, demo_admin_id)
    RETURNING id INTO sample_workout_2_id;

    INSERT INTO public.workouts (program_id, title, description, duration_minutes, difficulty, is_published, created_by)
    VALUES 
      (sample_program_id, 'Day 3: Lower Body Power', 'Build leg strength and power with squats, lunges, and more', 50, 'intermediate', TRUE, demo_admin_id)
    RETURNING id INTO sample_workout_3_id;

    RAISE NOTICE 'Created sample program and workouts';
  END IF;

  -- ============================================================================
  -- SEED DATA FOR DEMO MEMBER
  -- ============================================================================
  IF demo_member_id IS NOT NULL AND sample_program_id IS NOT NULL THEN
    
    -- Program enrollment
    INSERT INTO public.program_enrollments (user_id, program_id, enrolled_at, started_at, progress_percentage)
    VALUES (demo_member_id, sample_program_id, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 35)
    ON CONFLICT (user_id, program_id) DO UPDATE SET progress_percentage = 35;

    -- Workout logs
    DELETE FROM public.workout_logs WHERE user_id = demo_member_id;
    INSERT INTO public.workout_logs (user_id, workout_id, started_at, completed_at, duration_minutes, calories_burned, difficulty_rating, notes, mood)
    VALUES 
      (demo_member_id, sample_workout_1_id, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', 45, 320, 7, 'Great first workout! Felt challenging but doable.', 'energized'),
      (demo_member_id, sample_workout_2_id, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', 42, 310, 6, 'Getting easier. Form is improving.', 'good'),
      (demo_member_id, sample_workout_3_id, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 48, 340, 8, 'Pushed harder today. Feeling stronger!', 'accomplished');

    -- Body measurements
    DELETE FROM public.body_measurements WHERE user_id = demo_member_id;
    INSERT INTO public.body_measurements (user_id, date, weight, body_fat_percentage, notes)
    VALUES 
      (demo_member_id, CURRENT_DATE - INTERVAL '30 days', 180.5, 22.5, 'Starting measurements'),
      (demo_member_id, CURRENT_DATE - INTERVAL '15 days', 178.2, 21.8, 'Good progress!'),
      (demo_member_id, CURRENT_DATE - INTERVAL '7 days', 176.8, 21.2, 'Feeling great'),
      (demo_member_id, CURRENT_DATE, 175.5, 20.8, 'Best shape yet!');

    -- Achievements
    DELETE FROM public.user_achievements WHERE user_id = demo_member_id;
    INSERT INTO public.user_achievements (user_id, achievement_id, earned_at, progress)
    SELECT demo_member_id, id, NOW() - INTERVAL '5 days', 100
    FROM public.achievements 
    WHERE name IN ('First Workout', 'Early Bird')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;

    -- Community posts
    DELETE FROM public.posts WHERE user_id = demo_member_id;
    INSERT INTO public.posts (user_id, content, post_type, visibility, likes_count, comments_count, created_at)
    VALUES 
      (demo_member_id, 'Just completed my first week of the 30-Day Transformation! Feeling amazing! 💪', 'update', 'public', 12, 3, NOW() - INTERVAL '5 days'),
      (demo_member_id, 'Progress update: Down 4 lbs and feeling stronger every day! This program is incredible.', 'update', 'public', 24, 7, NOW() - INTERVAL '2 days');

    -- Notifications
    DELETE FROM public.notifications WHERE user_id = demo_member_id;
    INSERT INTO public.notifications (user_id, title, message, type, is_read, created_at)
    VALUES 
      (demo_member_id, 'Achievement Unlocked! 🏆', 'You earned the "First Workout" achievement!', 'achievement', TRUE, NOW() - INTERVAL '5 days'),
      (demo_member_id, 'New Program Available', 'Check out the Advanced Strength Training program', 'program', FALSE, NOW() - INTERVAL '2 days'),
      (demo_member_id, 'Weekly Progress Report', 'Great work this week! You completed 3 workouts.', 'progress', FALSE, NOW() - INTERVAL '1 day');

    -- Subscription
    DELETE FROM public.subscriptions WHERE user_id = demo_member_id;
    INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
    SELECT demo_member_id, id, 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days'
    FROM public.subscription_plans 
    WHERE name = 'Monthly Membership'
    LIMIT 1;

    -- Update engagement score
    UPDATE public.user_engagement_scores
    SET 
      last_login = CURRENT_DATE,
      login_streak = 7,
      total_logins = 15,
      workouts_completed = 3,
      community_posts = 2,
      engagement_score = 85.5,
      risk_level = 'low'
    WHERE user_id = demo_member_id;

    RAISE NOTICE 'Seeded data for demo member';
  END IF;

  -- ============================================================================
  -- SEED DATA FOR DEMO COLLABORATOR
  -- ============================================================================
  IF demo_collab_id IS NOT NULL THEN
    DELETE FROM public.content_submissions WHERE collaborator_id = demo_collab_id;
    INSERT INTO public.content_submissions (collaborator_id, title, description, content_type, status, created_at)
    VALUES 
      (demo_collab_id, 'New HIIT Workout Routine', 'High-intensity interval training for fat loss and cardiovascular health', 'workout', 'approved', NOW() - INTERVAL '10 days'),
      (demo_collab_id, 'Nutrition Guide for Athletes', 'Comprehensive guide to sports nutrition and meal planning', 'article', 'pending', NOW() - INTERVAL '3 days');

    RAISE NOTICE 'Seeded data for demo collaborator';
  END IF;

  -- ============================================================================
  -- SEED DATA FOR DEMO GUEST
  -- ============================================================================
  IF demo_guest_id IS NOT NULL THEN
    DELETE FROM public.support_tickets WHERE user_id = demo_guest_id;
    INSERT INTO public.support_tickets (user_id, subject, description, status, priority, created_at)
    VALUES 
      (demo_guest_id, 'Question about trial period', 'How long is the trial period and what features are included?', 'resolved', 'normal', NOW() - INTERVAL '5 days');

    RAISE NOTICE 'Seeded data for demo guest';
  END IF;

  RAISE NOTICE 'Demo data seeding completed successfully!';
  
END;
$$ LANGUAGE plpgsql;

-- Execute the seeding function
SELECT seed_demo_data();

-- Drop the function after use (optional, comment out if you want to keep it)
-- DROP FUNCTION seed_demo_data();
