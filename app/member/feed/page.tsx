import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { FeedClient } from './feed-client';

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <FeedClient
        currentUserId={session.user.id}
        userProfile={profile || {
          full_name: session.user.email || 'User',
          avatar_url: '',
        }}
      />
    </div>
  );
}
