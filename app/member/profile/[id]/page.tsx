import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ProfileClient } from './profile-client';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch profile data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/social/users/${params.id}/profile`,
    {
      headers: {
        Cookie: `sb-access-token=${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    notFound();
  }

  const data = await response.json();

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <ProfileClient
        profile={data.profile}
        stats={data.stats}
        recentPosts={data.recent_posts}
        badges={data.badges}
        currentUserId={session.user.id}
      />
    </div>
  );
}
