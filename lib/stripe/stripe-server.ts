import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripeServer = () => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    
    if (!key) {
      throw new Error('Stripe secret key not found');
    }
    
    stripe = new Stripe(key, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    });
  }
  
  return stripe;
};

export const createStripeCheckoutSession = async (
  items: Array<{
    priceId: string;
    quantity: number;
  }>,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) => {
  const stripe = getStripeServer();
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    billing_address_collection: 'required',
  });
  
  return session;
};

export const createStripePaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
) => {
  const stripe = getStripeServer();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  return paymentIntent;
};

export const retrieveStripeSession = async (sessionId: string) => {
  const stripe = getStripeServer();
  return await stripe.checkout.sessions.retrieve(sessionId);
};
