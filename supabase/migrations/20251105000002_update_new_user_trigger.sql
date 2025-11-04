-- Update handle_new_user trigger to ensure new users start with clean slate
-- This ensures that only explicitly marked demo users get mock data

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with is_demo awareness
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_demo_user BOOLEAN;
BEGIN
  -- Check if this is a demo user email
  is_demo_user := NEW.email IN (
    'guest@scorpion26.com',
    'member@scorpion26.com',
    'collab@scorpion26.com',
    'team@scorpion26.com',
    'admin@scorpion26.com'
  );

  -- Create profile with is_demo flag
  INSERT INTO public.profiles (id, email, is_demo, created_at)
  VALUES (NEW.id, NEW.email, is_demo_user, NOW());
  
  -- Assign guest role by default for all new users
  -- Demo users will have their roles updated separately in the seed script
  INSERT INTO public.user_roles (user_id, role_id, is_active)
  VALUES (NEW.id, (SELECT id FROM public.roles WHERE name = 'guest'), TRUE);
  
  -- Create default notification preferences for all users
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  -- Initialize user engagement score for all users
  INSERT INTO public.user_engagement_scores (user_id, last_login, login_streak, total_logins)
  VALUES (NEW.id, CURRENT_DATE, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile and initial data for new users. Demo users (specific emails) are flagged as is_demo=true. All other users start with clean slate (is_demo=false).';
