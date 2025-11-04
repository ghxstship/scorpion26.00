import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import { sendEmail, emailTemplates } from '@/lib/email/send';

// GET /api/support/tickets - List user's tickets
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabase = await createClient();

    let query = supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    console.error('Tickets GET error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch tickets', 500);
  }
});

// POST /api/support/tickets - Create ticket
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject: body.subject,
        description: body.description,
        priority: body.priority || 'medium',
        category: body.category,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      return errorResponse('DATABASE_ERROR', error.message, 500);
    }

    // Send notification to support team
    try {
      const supportEmail = process.env.SUPPORT_EMAIL || 'support@scorpion26.com';
      const template = emailTemplates.supportTicketNotification(
        data.id,
        user.email || 'Unknown User',
        user.email || '',
        body.subject,
        body.description,
        body.priority || 'medium'
      );
      
      await sendEmail({
        to: supportEmail,
        subject: template.subject,
        html: template.html,
        replyTo: user.email,
      });
    } catch (emailError) {
      console.error('Failed to send support ticket notification:', emailError);
      // Don't fail the request if email fails
    }

    return successResponse(data);
  } catch (error: any) {
    console.error('Tickets POST error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to create ticket', 500);
  }
});
