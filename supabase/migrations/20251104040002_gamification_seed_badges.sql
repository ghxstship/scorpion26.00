-- =====================================================
-- GAMIFICATION SEED DATA: 50+ BADGES
-- =====================================================

INSERT INTO badges (name, description, category, icon, requirement_type, requirement_value, rarity, xp_reward) VALUES
-- Workout Milestones (8 badges)
('First Steps', 'Complete your first workout', 'workout', 'footprints', 'workout_count', 1, 'common', 10),
('Getting Started', 'Complete 10 workouts', 'workout', 'dumbbell', 'workout_count', 10, 'common', 50),
('Committed', 'Complete 50 workouts', 'workout', 'target', 'workout_count', 50, 'rare', 200),
('Century Club', 'Complete 100 workouts', 'workout', 'trophy', 'workout_count', 100, 'rare', 500),
('Dedicated', 'Complete 250 workouts', 'workout', 'medal', 'workout_count', 250, 'epic', 1000),
('Elite Athlete', 'Complete 500 workouts', 'workout', 'crown', 'workout_count', 500, 'epic', 2500),
('Legendary', 'Complete 1000 workouts', 'workout', 'star', 'workout_count', 1000, 'legendary', 5000),
('Unstoppable', 'Complete 2500 workouts', 'workout', 'zap', 'workout_count', 2500, 'legendary', 10000),

-- Streak Achievements (8 badges)
('On Fire', 'Maintain a 7 day streak', 'streak', 'flame', 'streak_days', 7, 'common', 100),
('Consistent', 'Maintain a 14 day streak', 'streak', 'fire', 'streak_days', 14, 'common', 200),
('Dedicated Streaker', 'Maintain a 30 day streak', 'streak', 'trending-up', 'streak_days', 30, 'rare', 500),
('Committed Streaker', 'Maintain a 60 day streak', 'streak', 'activity', 'streak_days', 60, 'rare', 1000),
('Unstoppable Streak', 'Maintain a 100 day streak', 'streak', 'zap', 'streak_days', 100, 'epic', 2000),
('Iron Will', 'Maintain a 180 day streak', 'streak', 'shield', 'streak_days', 180, 'epic', 3500),
('Year Warrior', 'Maintain a 365 day streak', 'streak', 'award', 'streak_days', 365, 'legendary', 7500),
('Eternal Flame', 'Maintain a 500 day streak', 'streak', 'infinity', 'streak_days', 500, 'legendary', 12500),

-- Distance Goals (8 badges)
('First Mile', 'Run 1km total', 'distance', 'map-pin', 'distance_km', 1, 'common', 10),
('Marathon Ready', 'Run 42km total', 'distance', 'map', 'distance_km', 42, 'common', 100),
('Century Runner', 'Run 100km total', 'distance', 'navigation', 'distance_km', 100, 'rare', 250),
('Ultra Runner', 'Run 250km total', 'distance', 'compass', 'distance_km', 250, 'rare', 500),
('Distance Demon', 'Run 500km total', 'distance', 'globe', 'distance_km', 500, 'epic', 1000),
('World Traveler', 'Run 1000km total', 'distance', 'plane', 'distance_km', 1000, 'epic', 2500),
('Around the World', 'Run 5000km total', 'distance', 'earth', 'distance_km', 5000, 'legendary', 10000),
('To the Moon', 'Run 10000km total', 'distance', 'rocket', 'distance_km', 10000, 'legendary', 25000),

-- Social Engagement (12 badges)
('Friendly', 'Connect with 1 friend', 'social', 'user-plus', 'friends_count', 1, 'common', 10),
('Social Butterfly', 'Connect with 10 friends', 'social', 'users', 'friends_count', 10, 'common', 100),
('Community Leader', 'Connect with 25 friends', 'social', 'user-check', 'friends_count', 25, 'rare', 250),
('Network Builder', 'Connect with 50 friends', 'social', 'share-2', 'friends_count', 50, 'rare', 500),
('Influencer', 'Connect with 100 friends', 'social', 'trending-up', 'friends_count', 100, 'epic', 1000),
('Celebrity', 'Connect with 250 friends', 'social', 'star', 'friends_count', 250, 'legendary', 2500),
('Supportive', 'Give 10 kudos', 'social', 'heart', 'kudos_given', 10, 'common', 50),
('Encourager', 'Give 50 kudos', 'social', 'thumbs-up', 'kudos_given', 50, 'common', 150),
('Motivator', 'Give 100 kudos', 'social', 'smile', 'kudos_given', 100, 'rare', 300),
('Cheerleader', 'Give 250 kudos', 'social', 'party-popper', 'kudos_given', 250, 'rare', 750),
('Inspiration', 'Give 500 kudos', 'social', 'sparkles', 'kudos_given', 500, 'epic', 1500),
('Legend of Support', 'Give 1000 kudos', 'social', 'crown', 'kudos_given', 1000, 'legendary', 3000),

-- Special Achievements (18 badges)
('Early Bird', 'Complete a workout before 6 AM', 'special', 'sunrise', 'workout_count', 1, 'rare', 100),
('Night Owl', 'Complete a workout after 10 PM', 'special', 'moon', 'workout_count', 1, 'rare', 100),
('Weekend Warrior', 'Complete 50 weekend workouts', 'special', 'calendar', 'workout_count', 50, 'epic', 500),
('Consistency King', 'Work out every day for a week', 'special', 'check-circle', 'streak_days', 7, 'rare', 200),
('Perfect Month', 'Work out every day for 30 days', 'special', 'calendar-check', 'streak_days', 30, 'legendary', 2000),
('Variety Seeker', 'Try 10 different workout types', 'special', 'shuffle', 'workout_count', 10, 'rare', 300),
('Speed Demon', 'Complete a workout in under 15 minutes', 'special', 'zap', 'workout_count', 1, 'rare', 150),
('Endurance Master', 'Complete a workout over 2 hours', 'special', 'clock', 'workout_count', 1, 'epic', 500),
('Challenge Champion', 'Win 10 challenges', 'special', 'trophy', 'workout_count', 10, 'legendary', 2500),
('Comeback Kid', 'Return after 30 day break', 'special', 'refresh-cw', 'workout_count', 1, 'rare', 200),
('Milestone Master', 'Earn 25 badges', 'special', 'award', 'workout_count', 1, 'legendary', 5000),
('XP Hunter', 'Reach level 50', 'special', 'trending-up', 'workout_count', 1, 'legendary', 10000),
('Completionist', 'Earn all workout badges', 'special', 'check-square', 'workout_count', 1, 'legendary', 15000),
('Social Superstar', 'Earn all social badges', 'special', 'users', 'workout_count', 1, 'legendary', 15000),
('Distance Legend', 'Earn all distance badges', 'special', 'map', 'workout_count', 1, 'legendary', 15000),
('Streak Survivor', 'Earn all streak badges', 'special', 'flame', 'workout_count', 1, 'legendary', 15000),
('Master of All', 'Earn 50 badges', 'special', 'gem', 'workout_count', 1, 'legendary', 25000),
('Ultimate Champion', 'Reach level 100', 'special', 'crown', 'workout_count', 1, 'legendary', 50000)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Badges: Everyone can read
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);

-- User badges: Users can view their own and others' badges
CREATE POLICY "Users can view all badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert their own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User stats: Users can view all stats, update their own
CREATE POLICY "Users can view all stats" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Challenges: Everyone can read active challenges
CREATE POLICY "Active challenges are viewable by everyone" ON challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Challenge participants: Users can view all, manage their own
CREATE POLICY "Users can view all participants" ON challenge_participants FOR SELECT USING (true);
CREATE POLICY "Users can join challenges" ON challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their progress" ON challenge_participants FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboards: Everyone can read
CREATE POLICY "Leaderboards are viewable by everyone" ON leaderboard_entries FOR SELECT USING (true);

-- XP transactions: Users can view their own
CREATE POLICY "Users can view their own XP transactions" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);

-- Streak history: Users can view their own
CREATE POLICY "Users can view their own streak history" ON streak_history FOR SELECT USING (auth.uid() = user_id);

-- Milestones: Users can view and update their own
CREATE POLICY "Users can view their own milestones" ON milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own milestones" ON milestones FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

INSERT INTO user_stats (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
