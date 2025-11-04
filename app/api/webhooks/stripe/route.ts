import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, emailTemplates } from '@/lib/email/send';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription in database
        const subData: any = subscription;
        await supabase.from('subscriptions').upsert({
          stripe_subscription_id: subscription.id,
          user_id: subscription.metadata.user_id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subData.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        });

        // If subscription is active, update user role to member
        if (subscription.status === 'active') {
          const { data: memberRole } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'member')
            .single();

          if (memberRole && subscription.metadata.user_id) {
            await supabase.from('user_roles').upsert({
              user_id: subscription.metadata.user_id,
              role_id: memberRole.id,
              is_active: true,
            });

            // Send confirmation email
            const { data: user } = await supabase
              .from('profiles')
              .select('email, first_name')
              .eq('id', subscription.metadata.user_id)
              .single();

            if (user) {
              const template = emailTemplates.subscriptionConfirmation(
                user.first_name || 'Member',
                subscription.items.data[0]?.price.nickname || 'Premium Plan',
                `$${(subscription.items.data[0]?.price.unit_amount || 0) / 100}`
              );
              
              await sendEmail({
                to: user.email,
                subject: template.subject,
                html: template.html,
              });
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        // Downgrade user to guest role
        if (subscription.metadata.user_id) {
          const { data: guestRole } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'guest')
            .single();

          if (guestRole) {
            await supabase.from('user_roles').upsert({
              user_id: subscription.metadata.user_id,
              role_id: guestRole.id,
              is_active: true,
            });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Log successful payment
        console.log('Payment succeeded:', invoice.id);
        
        // You can add additional logic here, like updating payment history
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceData: any = invoice;
        
        // Handle failed payment
        console.error('Payment failed:', invoice.id);
        
        // Update subscription status
        if (invoiceData.subscription) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoiceData.subscription as string);
        }
        
        // Send payment failed email to customer
        // You can implement this based on your needs
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Checkout completed:', session.id);
        
        // Handle one-time payments or additional logic
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
