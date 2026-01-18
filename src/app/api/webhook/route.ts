import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parser for webhooks (Next.js needs raw body)
export const runtime = 'nodejs';

// Webhook secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

/**
 * Handle successful payment
 * This is where you would typically:
 * 1. Save order to database
 * 2. Send confirmation email to customer
 * 3. Update inventory
 * 4. Trigger fulfillment process
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment succeeded:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customerEmail: paymentIntent.receipt_email,
    metadata: paymentIntent.metadata,
  });

  // TODO: Implement your business logic here
  // Example: Save order to database
  /*
  await db.orders.create({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'paid',
    items: JSON.parse(paymentIntent.metadata.items || '[]'),
    customerEmail: paymentIntent.metadata.customer_email,
    deliveryMethod: paymentIntent.metadata.delivery_method,
    deliveryPostcode: paymentIntent.metadata.delivery_postcode,
    createdAt: new Date(paymentIntent.created * 1000),
  });
  */

  // TODO: Send confirmation email
  /*
  await sendEmail({
    to: paymentIntent.metadata.customer_email,
    subject: 'Order Confirmation',
    template: 'order-confirmation',
    data: {
      orderId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      items: JSON.parse(paymentIntent.metadata.items || '[]'),
    },
  });
  */
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error('❌ Payment failed:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    lastPaymentError: paymentIntent.last_payment_error,
    metadata: paymentIntent.metadata,
  });

  // TODO: Implement failure handling
  // Example: Send failure notification email
  /*
  if (paymentIntent.metadata.customer_email) {
    await sendEmail({
      to: paymentIntent.metadata.customer_email,
      subject: 'Payment Failed',
      template: 'payment-failed',
      data: {
        reason: paymentIntent.last_payment_error?.message || 'Unknown error',
      },
    });
  }
  */
}

/**
 * Handle checkout session completion (for Stripe Checkout flow)
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout session completed:', {
    sessionId: session.id,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
    metadata: session.metadata,
  });

  // TODO: Similar to handlePaymentSuccess, implement your business logic
}

/**
 * Main webhook handler
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('⚠️ Webhook signature verification failed:', errorMessage);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Log the event for debugging
    console.log(`📥 Webhook received: ${event.type}`);

    // Handle the event based on type
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('⚠️ Payment canceled:', paymentIntent.id);
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('⏳ Payment processing:', paymentIntent.id);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('⏰ Checkout session expired:', session.id);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💳 Charge succeeded:', charge.id);
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        console.error('💳 Charge failed:', charge.id, charge.failure_message);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Always return a 200 response to acknowledge receipt
    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
