-- =====================================================
-- GAMIFICATION RPC FUNCTIONS
-- =====================================================

-- Function to award XP and update level
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INT,
  p_source VARCHAR,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE(new_level INT, level_up BOOLEAN, total_xp INT) AS $$
DECLARE
  v_old_level INT;
  v_new_level INT;
  v_total_xp INT;
  v_level_up BOOLEAN := false;
BEGIN
  INSERT INTO xp_transactions (user_id, amount, source, source_id, description)
  VALUES (p_user_id, p_amount, p_source, p_source_id, p_description);
  
  UPDATE user_stats
  SET 
    total_xp = total_xp + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING level, total_xp INTO v_old_level, v_total_xp;
  
  v_new_level := FLOOR(SQRT(v_total_xp / 100)) + 1;
  
  IF v_new_level > v_old_level THEN
    UPDATE user_stats
    SET level = v_new_level, updated_at = NOW()
    WHERE user_id = p_user_id;
    
    v_level_up := true;
    
    INSERT INTO milestones (user_id, milestone_type, milestone_value, title, description, icon)
    VALUES (
      p_user_id,
      'level_up',
      v_new_level,
      'Level Up!',
      'You reached level ' || v_new_level || '!',
      'trophy'
    );
  END IF;
  
  RETURN QUERY SELECT v_new_level, v_level_up, v_total_xp;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID, p_activity_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE(current_streak INT, longest_streak INT, is_new_record BOOLEAN) AS $$
DECLARE
  v_last_activity_date DATE;
  v_current_streak INT;
  v_longest_streak INT;
  v_is_new_record BOOLEAN := false;
BEGIN
  SELECT last_activity_date, user_stats.current_streak, user_stats.longest_streak
  INTO v_last_activity_date, v_current_streak, v_longest_streak
  FROM user_stats
  WHERE user_id = p_user_id;
  
  INSERT INTO streak_history (user_id, streak_date, activity_count)
  VALUES (p_user_id, p_activity_date, 1)
  ON CONFLICT (user_id, streak_date)
  DO UPDATE SET activity_count = streak_history.activity_count + 1;
  
  IF v_last_activity_date IS NULL THEN
    v_current_streak := 1;
  ELSIF p_activity_date = v_last_activity_date THEN
    v_current_streak := v_current_streak;
  ELSIF p_activity_date = v_last_activity_date + INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;
  
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
    v_is_new_record := true;
  END IF;
  
  UPDATE user_stats
  SET 
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_activity_date = p_activity_date,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  IF v_current_streak IN (7, 30, 100, 365) THEN
    INSERT INTO milestones (user_id, milestone_type, milestone_value, title, description, icon)
    VALUES (
      p_user_id,
      'streak_milestone',
      v_current_streak,
      v_current_streak || ' Day Streak!',
      'You maintained a ' || v_current_streak || ' day streak!',
      'flame'
    );
  END IF;
  
  RETURN QUERY SELECT v_current_streak, v_longest_streak, v_is_new_record;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name VARCHAR, newly_earned BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  WITH user_progress AS (
    SELECT
      p_user_id as user_id,
      us.total_workouts,
      us.current_streak,
      us.longest_streak,
      us.total_distance_km,
      us.kudos_given,
      us.friends_count
    FROM user_stats us
    WHERE us.user_id = p_user_id
  ),
  eligible_badges AS (
    SELECT
      b.id,
      b.name,
      CASE
        WHEN b.requirement_type = 'workout_count' THEN up.total_workouts >= b.requirement_value
        WHEN b.requirement_type = 'streak_days' THEN up.longest_streak >= b.requirement_value
        WHEN b.requirement_type = 'distance_km' THEN up.total_distance_km >= b.requirement_value
        WHEN b.requirement_type = 'kudos_given' THEN up.kudos_given >= b.requirement_value
        WHEN b.requirement_type = 'friends_count' THEN up.friends_count >= b.requirement_value
        ELSE false
      END as eligible
    FROM badges b
    CROSS JOIN user_progress up
    WHERE NOT EXISTS (
      SELECT 1 FROM user_badges ub
      WHERE ub.user_id = p_user_id AND ub.badge_id = b.id
    )
  )
  SELECT
    eb.id,
    eb.name,
    true as newly_earned
  FROM eligible_badges eb
  WHERE eb.eligible = true;
  
  INSERT INTO user_badges (user_id, badge_id, earned_at)
  SELECT p_user_id, eb.id, NOW()
  FROM eligible_badges eb
  WHERE eb.eligible = true
  ON CONFLICT (user_id, badge_id) DO NOTHING;
  
  INSERT INTO milestones (user_id, milestone_type, title, description, icon)
  SELECT
    p_user_id,
    'badge_earned',
    'New Badge: ' || eb.name,
    'You earned the ' || eb.name || ' badge!',
    'award'
  FROM eligible_badges eb
  WHERE eb.eligible = true;
END;
$$ LANGUAGE plpgsql;

-- Function to update challenge progress
CREATE OR REPLACE FUNCTION update_challenge_progress(
  p_challenge_id UUID,
  p_user_id UUID,
  p_progress_increment INT
)
RETURNS TABLE(new_progress INT, completed BOOLEAN, rank INT) AS $$
DECLARE
  v_new_progress INT;
  v_goal_value INT;
  v_completed BOOLEAN := false;
  v_rank INT;
BEGIN
  SELECT goal_value INTO v_goal_value
  FROM challenges
  WHERE id = p_challenge_id;
  
  UPDATE challenge_participants
  SET 
    progress = progress + p_progress_increment,
    updated_at = NOW()
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id
  RETURNING progress INTO v_new_progress;
  
  IF v_new_progress >= v_goal_value THEN
    UPDATE challenge_participants
    SET completed = true, completed_at = NOW()
    WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
    
    v_completed := true;
    
    UPDATE user_stats
    SET challenges_completed = challenges_completed + 1
    WHERE user_id = p_user_id;
    
    INSERT INTO milestones (user_id, milestone_type, title, description, icon)
    SELECT
      p_user_id,
      'challenge_completed',
      'Challenge Complete!',
      'You completed the ' || c.name || ' challenge!',
      'trophy'
    FROM challenges c
    WHERE c.id = p_challenge_id;
  END IF;
  
  SELECT COUNT(*) + 1 INTO v_rank
  FROM challenge_participants
  WHERE challenge_id = p_challenge_id AND progress > v_new_progress;
  
  UPDATE challenge_participants
  SET rank = v_rank
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
  
  RETURN QUERY SELECT v_new_progress, v_completed, v_rank;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh leaderboards
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS void AS $$
BEGIN
  INSERT INTO leaderboard_entries (user_id, leaderboard_type, period, score, rank)
  SELECT
    user_id,
    'global_xp',
    'all_time',
    total_xp,
    ROW_NUMBER() OVER (ORDER BY total_xp DESC)
  FROM user_stats
  ON CONFLICT (user_id, leaderboard_type, period, challenge_id)
  DO UPDATE SET
    score = EXCLUDED.score,
    rank = EXCLUDED.rank,
    updated_at = NOW();
  
  INSERT INTO leaderboard_entries (user_id, leaderboard_type, period, score, rank)
  SELECT
    user_id,
    'global_workouts',
    'all_time',
    total_workouts,
    ROW_NUMBER() OVER (ORDER BY total_workouts DESC)
  FROM user_stats
  ON CONFLICT (user_id, leaderboard_type, period, challenge_id)
  DO UPDATE SET
    score = EXCLUDED.score,
    rank = EXCLUDED.rank,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
