import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, successUrl, cancelUrl, metadata } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items' },
        { status: 400 }
      );
    }

    const session = await createStripeCheckoutSession(
      items,
      successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/shop/success`,
      cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/shop/cart`,
      metadata
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
