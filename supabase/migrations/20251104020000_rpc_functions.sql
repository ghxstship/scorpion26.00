-- RPC Functions for Supabase
-- Run this migration to add all required stored procedures

-- ============================================================================
-- ENGAGEMENT & ANALYTICS FUNCTIONS
-- ============================================================================

-- Function to increment workout count
CREATE OR REPLACE FUNCTION increment_workout_count(user_id_param UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_engagement_scores (user_id, workouts_completed, last_login, updated_at)
  VALUES (user_id_param, 1, CURRENT_DATE, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    workouts_completed = user_engagement_scores.workouts_completed + 1,
    last_login = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update login streak
CREATE OR REPLACE FUNCTION update_login_streak(user_id_param UUID)
RETURNS void AS $$
DECLARE
  last_login_date DATE;
  current_streak INTEGER;
BEGIN
  SELECT last_login, login_streak INTO last_login_date, current_streak
  FROM public.user_engagement_scores
  WHERE user_id = user_id_param;

  IF last_login_date IS NULL THEN
    -- First login
    INSERT INTO public.user_engagement_scores (user_id, last_login, login_streak, total_logins, updated_at)
    VALUES (user_id_param, CURRENT_DATE, 1, 1, NOW());
  ELSIF last_login_date = CURRENT_DATE THEN
    -- Already logged in today, do nothing
    RETURN;
  ELSIF last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE public.user_engagement_scores
    SET 
      last_login = CURRENT_DATE,
      login_streak = login_streak + 1,
      total_logins = total_logins + 1,
      updated_at = NOW()
    WHERE user_id = user_id_param;
  ELSE
    -- Streak broken, reset to 1
    UPDATE public.user_engagement_scores
    SET 
      last_login = CURRENT_DATE,
      login_streak = 1,
      total_logins = total_logins + 1,
      updated_at = NOW()
    WHERE user_id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post likes count
CREATE OR REPLACE FUNCTION increment_post_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET likes_count = likes_count + 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement post likes count
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comments count
CREATE OR REPLACE FUNCTION increment_comments_count(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET comments_count = comments_count + 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement comments count
CREATE OR REPLACE FUNCTION decrement_comments_count(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USER STATISTICS FUNCTIONS
-- ============================================================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param UUID)
RETURNS TABLE (
  total_workouts BIGINT,
  total_programs INTEGER,
  current_streak INTEGER,
  total_achievements INTEGER,
  engagement_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT wl.id)::BIGINT as total_workouts,
    COUNT(DISTINCT pe.program_id)::INTEGER as total_programs,
    COALESCE(ues.login_streak, 0) as current_streak,
    COUNT(DISTINCT ua.achievement_id)::INTEGER as total_achievements,
    COALESCE(ues.engagement_score, 0) as engagement_score
  FROM auth.users u
  LEFT JOIN public.workout_logs wl ON wl.user_id = u.id
  LEFT JOIN public.program_enrollments pe ON pe.user_id = u.id
  LEFT JOIN public.user_achievements ua ON ua.user_id = u.id
  LEFT JOIN public.user_engagement_scores ues ON ues.user_id = u.id
  WHERE u.id = user_id_param
  GROUP BY u.id, ues.login_streak, ues.engagement_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(user_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  score DECIMAL := 0;
  workout_count INTEGER;
  post_count INTEGER;
  streak INTEGER;
  days_since_signup INTEGER;
BEGIN
  SELECT 
    COALESCE(workouts_completed, 0),
    COALESCE(community_posts, 0),
    COALESCE(login_streak, 0)
  INTO workout_count, post_count, streak
  FROM public.user_engagement_scores
  WHERE user_id = user_id_param;

  SELECT EXTRACT(DAY FROM NOW() - created_at)::INTEGER
  INTO days_since_signup
  FROM public.profiles
  WHERE id = user_id_param;

  -- Calculate score based on various factors
  score := (workout_count * 2.0) + (post_count * 1.5) + (streak * 3.0);
  
  -- Normalize by days since signup
  IF days_since_signup > 0 THEN
    score := score / days_since_signup * 100;
  END IF;

  RETURN LEAST(score, 100.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PROGRAM PROGRESS FUNCTIONS
-- ============================================================================

-- Function to update program progress
CREATE OR REPLACE FUNCTION update_program_progress(
  user_id_param UUID,
  program_id_param UUID
)
RETURNS void AS $$
DECLARE
  total_workouts INTEGER;
  completed_workouts INTEGER;
  progress_pct INTEGER;
BEGIN
  -- Count total workouts in program
  SELECT COUNT(*) INTO total_workouts
  FROM public.workouts
  WHERE program_id = program_id_param AND is_published = true;

  -- Count completed workouts
  SELECT COUNT(DISTINCT wl.workout_id) INTO completed_workouts
  FROM public.workout_logs wl
  JOIN public.workouts w ON w.id = wl.workout_id
  WHERE wl.user_id = user_id_param 
    AND w.program_id = program_id_param;

  -- Calculate progress percentage
  IF total_workouts > 0 THEN
    progress_pct := (completed_workouts * 100 / total_workouts);
  ELSE
    progress_pct := 0;
  END IF;

  -- Update enrollment
  UPDATE public.program_enrollments
  SET 
    progress_percentage = progress_pct,
    completed_at = CASE WHEN progress_pct >= 100 THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE user_id = user_id_param AND program_id = program_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEARCH FUNCTIONS
-- ============================================================================

-- Function to search programs
CREATE OR REPLACE FUNCTION search_programs(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  difficulty VARCHAR,
  category VARCHAR,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.difficulty,
    p.category,
    ts_rank(
      to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM public.programs p
  WHERE 
    p.is_published = true
    AND (
      to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')) 
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- LEADERBOARD FUNCTIONS
-- ============================================================================

-- Function to get workout leaderboard
CREATE OR REPLACE FUNCTION get_workout_leaderboard(
  time_period VARCHAR DEFAULT 'month',
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  user_id UUID,
  first_name VARCHAR,
  last_name VARCHAR,
  avatar_url TEXT,
  workout_count BIGINT,
  rank INTEGER
) AS $$
DECLARE
  start_date TIMESTAMPTZ;
BEGIN
  -- Determine start date based on period
  CASE time_period
    WHEN 'week' THEN start_date := NOW() - INTERVAL '7 days';
    WHEN 'month' THEN start_date := NOW() - INTERVAL '30 days';
    WHEN 'year' THEN start_date := NOW() - INTERVAL '365 days';
    ELSE start_date := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    COUNT(wl.id)::BIGINT as workout_count,
    ROW_NUMBER() OVER (ORDER BY COUNT(wl.id) DESC)::INTEGER as rank
  FROM public.profiles p
  JOIN public.workout_logs wl ON wl.user_id = p.id
  WHERE wl.completed_at >= start_date
  GROUP BY p.id, p.first_name, p.last_name, p.avatar_url
  ORDER BY workout_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CLEANUP FUNCTIONS
-- ============================================================================

-- Function to cleanup old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION increment_workout_count TO authenticated;
GRANT EXECUTE ON FUNCTION update_login_streak TO authenticated;
GRANT EXECUTE ON FUNCTION increment_post_likes TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_post_likes TO authenticated;
GRANT EXECUTE ON FUNCTION increment_comments_count TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_comments_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_engagement_score TO authenticated;
GRANT EXECUTE ON FUNCTION update_program_progress TO authenticated;
GRANT EXECUTE ON FUNCTION search_programs TO authenticated;
GRANT EXECUTE ON FUNCTION get_workout_leaderboard TO authenticated;
