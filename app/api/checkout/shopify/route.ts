import { NextRequest, NextResponse } from 'next/server';
import { createShopifyCheckout } from '@/lib/shopify/shopify-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items' },
        { status: 400 }
      );
    }

    const checkout = await createShopifyCheckout(items);

    return NextResponse.json({
      checkoutId: checkout.id,
      url: checkout.webUrl,
    });
  } catch (error) {
    console.error('Shopify checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
