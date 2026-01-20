import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ordersRepository } from '@/lib/cosmosdb';

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

    // Capture the authorized payment
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    // Update order status in Cosmos DB
    try {
      const allOrders = await ordersRepository.getAll();
      const order = allOrders.find(o => o.payment_intent_id === paymentIntentId);
      
      if (order) {
        await ordersRepository.update(order.id, {
          payment_status: 'captured',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        });
        console.log('✅ Order status updated to captured:', order.order_id);
      }
    } catch (dbError) {
      console.error('Failed to update order in Cosmos DB:', dbError);
    }

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
      },
    });
  } catch (error) {
    console.error('Payment capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    );
  }
}

