-- AI Personalization System
-- Fitness profiles, recommendations, training plans, and chat sessions

-- User Fitness Profile
CREATE TABLE user_fitness_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fitness_goal VARCHAR(50) NOT NULL CHECK (fitness_goal IN ('strength', 'hypertrophy', 'endurance', 'weight_loss', 'general_fitness', 'athletic_performance')),
  experience_level VARCHAR(20) NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  equipment_available JSONB DEFAULT '[]'::jsonb,
  preferred_workout_types JSONB DEFAULT '[]'::jsonb,
  limitations JSONB DEFAULT '[]'::jsonb,
  training_frequency INTEGER DEFAULT 3 CHECK (training_frequency BETWEEN 1 AND 7),
  session_duration INTEGER DEFAULT 60 CHECK (session_duration BETWEEN 15 AND 180),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- AI Recommendations
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('workout', 'rest_day', 'deload_week', 'progressive_overload', 'exercise_swap', 'volume_adjustment')),
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  exercise_id UUID,
  reasoning TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  metadata JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  acted_on_at TIMESTAMPTZ
);

-- Training Plans
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  plan_data JSONB NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  duration_weeks INTEGER NOT NULL CHECK (duration_weeks BETWEEN 1 AND 52),
  goal VARCHAR(50),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused', 'archived')),
  start_date DATE,
  end_date DATE,
  completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat Sessions
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  messages JSONB DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  token_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);

-- Recovery Metrics
CREATE TABLE recovery_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours BETWEEN 0 AND 24),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10),
  soreness_level INTEGER CHECK (soreness_level BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  recovery_score INTEGER CHECK (recovery_score BETWEEN 0 AND 100),
  readiness_status VARCHAR(20) CHECK (readiness_status IN ('optimal', 'good', 'moderate', 'low', 'rest_needed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Adaptive Difficulty History
CREATE TABLE adaptive_difficulty_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  exercise_id UUID,
  adjustment_type VARCHAR(30) NOT NULL CHECK (adjustment_type IN ('weight_increase', 'weight_decrease', 'rep_increase', 'rep_decrease', 'rest_increase', 'rest_decrease', 'volume_increase', 'volume_decrease')),
  previous_value DECIMAL(10,2),
  new_value DECIMAL(10,2),
  adjustment_percentage DECIMAL(5,2),
  reason TEXT NOT NULL,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_fitness_profile_user_id ON user_fitness_profile(user_id);
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX idx_ai_recommendations_created_at ON ai_recommendations(created_at DESC);
CREATE INDEX idx_training_plans_user_id ON training_plans(user_id);
CREATE INDEX idx_training_plans_status ON training_plans(status);
CREATE INDEX idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_sessions_last_message ON ai_chat_sessions(last_message_at DESC);
CREATE INDEX idx_recovery_metrics_user_date ON recovery_metrics(user_id, date DESC);
CREATE INDEX idx_adaptive_difficulty_user_id ON adaptive_difficulty_history(user_id);
CREATE INDEX idx_adaptive_difficulty_created_at ON adaptive_difficulty_history(created_at DESC);

-- RLS Policies
ALTER TABLE user_fitness_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_difficulty_history ENABLE ROW LEVEL SECURITY;

-- User Fitness Profile Policies
CREATE POLICY "Users can view own fitness profile"
  ON user_fitness_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fitness profile"
  ON user_fitness_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fitness profile"
  ON user_fitness_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- AI Recommendations Policies
CREATE POLICY "Users can view own recommendations"
  ON ai_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON ai_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- Training Plans Policies
CREATE POLICY "Users can view own training plans"
  ON training_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training plans"
  ON training_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training plans"
  ON training_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training plans"
  ON training_plans FOR DELETE
  USING (auth.uid() = user_id);

-- AI Chat Sessions Policies
CREATE POLICY "Users can view own chat sessions"
  ON ai_chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
  ON ai_chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON ai_chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Recovery Metrics Policies
CREATE POLICY "Users can view own recovery metrics"
  ON recovery_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recovery metrics"
  ON recovery_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recovery metrics"
  ON recovery_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Adaptive Difficulty History Policies
CREATE POLICY "Users can view own difficulty history"
  ON adaptive_difficulty_history FOR SELECT
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_training_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER training_plans_updated_at
  BEFORE UPDATE ON training_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_training_plan_updated_at();

CREATE OR REPLACE FUNCTION update_fitness_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fitness_profile_updated_at
  BEFORE UPDATE ON user_fitness_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_fitness_profile_updated_at();

-- Function to calculate recovery score
CREATE OR REPLACE FUNCTION calculate_recovery_score(
  p_sleep_hours DECIMAL,
  p_sleep_quality INTEGER,
  p_fatigue_level INTEGER,
  p_soreness_level INTEGER,
  p_stress_level INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER;
  v_sleep_score DECIMAL;
  v_quality_score DECIMAL;
BEGIN
  -- Sleep score (0-30 points): 7-9 hours optimal
  v_sleep_score := CASE
    WHEN p_sleep_hours >= 7 AND p_sleep_hours <= 9 THEN 30
    WHEN p_sleep_hours >= 6 AND p_sleep_hours < 7 THEN 25
    WHEN p_sleep_hours > 9 AND p_sleep_hours <= 10 THEN 25
    WHEN p_sleep_hours >= 5 AND p_sleep_hours < 6 THEN 15
    WHEN p_sleep_hours > 10 THEN 15
    ELSE 5
  END;
  
  -- Quality factors (70 points total)
  v_quality_score := 
    (p_sleep_quality * 2) +  -- 20 points max
    ((10 - p_fatigue_level) * 2) +  -- 20 points max
    ((10 - p_soreness_level) * 1.5) +  -- 15 points max
    ((10 - p_stress_level) * 1.5);  -- 15 points max
  
  v_score := ROUND(v_sleep_score + v_quality_score);
  
  -- Ensure score is between 0 and 100
  v_score := GREATEST(0, LEAST(100, v_score));
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get readiness status from score
CREATE OR REPLACE FUNCTION get_readiness_status(p_score INTEGER)
RETURNS VARCHAR AS $$
BEGIN
  RETURN CASE
    WHEN p_score >= 85 THEN 'optimal'
    WHEN p_score >= 70 THEN 'good'
    WHEN p_score >= 50 THEN 'moderate'
    WHEN p_score >= 30 THEN 'low'
    ELSE 'rest_needed'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comments
COMMENT ON TABLE user_fitness_profile IS 'User fitness goals, experience level, and preferences for AI personalization';
COMMENT ON TABLE ai_recommendations IS 'AI-generated workout and training recommendations';
COMMENT ON TABLE training_plans IS 'User training plans, both manual and AI-generated';
COMMENT ON TABLE ai_chat_sessions IS 'AI coach chatbot conversation history';
COMMENT ON TABLE recovery_metrics IS 'Daily recovery metrics for readiness assessment';
COMMENT ON TABLE adaptive_difficulty_history IS 'History of automatic difficulty adjustments';
