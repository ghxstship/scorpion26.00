-- Quick check to see if demo users exist
-- Run this before seeding to verify all 5 users are created

SELECT 
  au.email,
  au.created_at as user_created,
  p.is_demo,
  r.name as current_role
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id AND ur.is_active = true
LEFT JOIN public.roles r ON r.id = ur.role_id
WHERE au.email IN (
  'guest@scorpion26.com',
  'member@scorpion26.com',
  'collab@scorpion26.com',
  'team@scorpion26.com',
  'admin@scorpion26.com'
)
ORDER BY au.email;

-- Expected: 5 rows returned
-- If you see fewer than 5 rows, create the missing users in Supabase Dashboard
