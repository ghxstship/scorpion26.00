import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      bio,
      location,
      website,
      profile_visibility,
      activity_visibility
    } = body;

    // Validate visibility values
    const validVisibility = ['public', 'followers', 'private'];
    if (profile_visibility && !validVisibility.includes(profile_visibility)) {
      return NextResponse.json(
        { error: 'Invalid profile visibility' },
        { status: 400 }
      );
    }
    if (activity_visibility && !validVisibility.includes(activity_visibility)) {
      return NextResponse.json(
        { error: 'Invalid activity visibility' },
        { status: 400 }
      );
    }

    // Validate bio length
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Update profile
    const updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (profile_visibility) updateData.profile_visibility = profile_visibility;
    if (activity_visibility) updateData.activity_visibility = activity_visibility;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error in profile update route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
