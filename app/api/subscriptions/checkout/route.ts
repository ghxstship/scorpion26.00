import { NextRequest } from 'next/server';
import { withAuth, successResponse, errorResponse } from '@/lib/api/auth-middleware';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

// POST /api/subscriptions/checkout - Create checkout session
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    if (!stripe) {
      return errorResponse('CONFIG_ERROR', 'Stripe not configured', 500);
    }

    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return errorResponse('VALIDATION_ERROR', 'Price ID required', 400);
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/member/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/programs`,
      metadata: {
        user_id: user.id,
      },
    });

    return successResponse({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout POST error:', error);
    return errorResponse('INTERNAL_ERROR', error.message, 500);
  }
});
