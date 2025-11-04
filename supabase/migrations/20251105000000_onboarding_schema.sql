-- Onboarding Workflow Schema
-- Tracks user onboarding progress and preferences

-- ============================================================================
-- ONBOARDING PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_step INTEGER DEFAULT 1,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  
  -- Fitness Assessment
  fitness_level VARCHAR(20), -- beginner, intermediate, advanced
  experience_level VARCHAR(20), -- never_exercised, some_experience, regular_exerciser, athlete
  physical_limitations TEXT[],
  
  -- Goal Setting
  primary_goal VARCHAR(50), -- weight_loss, muscle_gain, endurance, flexibility, general_fitness
  secondary_goals TEXT[],
  target_timeline VARCHAR(20), -- 30_days, 90_days, 6_months, 1_year
  target_weight DECIMAL(5,2),
  target_body_fat DECIMAL(4,2),
  
  -- Preferences
  workout_frequency INTEGER, -- workouts per week
  preferred_workout_types TEXT[], -- strength, cardio, yoga, hiit, etc.
  preferred_workout_duration INTEGER, -- minutes
  available_equipment TEXT[], -- dumbbells, barbell, resistance_bands, etc.
  workout_time_preference VARCHAR(20), -- morning, afternoon, evening, flexible
  
  -- Health Profile
  health_conditions TEXT[],
  injuries TEXT[],
  dietary_restrictions TEXT[],
  medications TEXT[],
  
  -- Completion
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  skipped BOOLEAN DEFAULT FALSE,
  skipped_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_onboarding_user_id ON public.onboarding_progress(user_id);
CREATE INDEX idx_onboarding_completed ON public.onboarding_progress(completed);

-- RLS Policies
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Users can only view and update their own onboarding progress
CREATE POLICY "Users can view own onboarding progress"
  ON public.onboarding_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding progress"
  ON public.onboarding_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
  ON public.onboarding_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all onboarding progress
CREATE POLICY "Admins can view all onboarding progress"
  ON public.onboarding_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
      AND ur.is_active = true
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER onboarding_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

-- ============================================================================
-- ONBOARDING ANALYTICS TABLE (Optional - for tracking drop-off)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.onboarding_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name VARCHAR(50) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,
  abandoned BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_onboarding_analytics_user ON public.onboarding_analytics(user_id);
CREATE INDEX idx_onboarding_analytics_step ON public.onboarding_analytics(step_number);

-- RLS for analytics
ALTER TABLE public.onboarding_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding analytics"
  ON public.onboarding_analytics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding analytics"
  ON public.onboarding_analytics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all analytics
CREATE POLICY "Admins can view all onboarding analytics"
  ON public.onboarding_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
      AND ur.is_active = true
    )
  );
