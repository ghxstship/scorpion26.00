import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SocialClient } from './social-client';

export default async function SocialPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <SocialClient currentUserId={session.user.id} />
    </div>
  );
}
