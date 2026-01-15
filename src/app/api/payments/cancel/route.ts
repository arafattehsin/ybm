import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID required' },
        { status: 400 }
      );
    }

    // Cancel the authorized payment
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    console.error('Payment cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel payment' },
      { status: 500 }
    );
  }
}
