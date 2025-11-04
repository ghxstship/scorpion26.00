-- Add is_demo flag to profiles table
-- This migration adds a flag to identify demo users vs real users

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Create index for faster demo user queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_demo ON public.profiles(is_demo);

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.is_demo IS 'Flag to identify demo/test users. Demo users have pre-populated mock data. Real users start with clean slate.';
