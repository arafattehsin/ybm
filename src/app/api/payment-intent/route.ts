import { NextRequest, NextResponse } from 'next/server';
import { stripe, isValidAmount, calculateOrderTotal, CURRENCY } from '@/lib/stripe';
import { getDeliveryFeeByPostcode } from '@/lib/postcodes';
import type { CartItem, DeliveryAddress } from '@/types';

interface CreatePaymentIntentRequest {
  items: CartItem[];
  deliveryMethod: 'pickup' | 'delivery';
  deliveryPostcode?: string;
  customerEmail?: string;
  customerName?: string;
  deliveryAddress?: DeliveryAddress;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePaymentIntentRequest;
    const { items, deliveryMethod, deliveryPostcode, customerEmail, customerName, deliveryAddress } = body;

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Calculate subtotal from cart items
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    // Validate and calculate delivery fee
    let deliveryFee = 0;
    if (deliveryMethod === 'delivery') {
      if (!deliveryPostcode) {
        return NextResponse.json(
          { error: 'Postcode required for delivery' },
          { status: 400 }
        );
      }

      const fee = getDeliveryFeeByPostcode(deliveryPostcode);
      if (fee === null) {
        return NextResponse.json(
          { error: 'Delivery not available for this postcode' },
          { status: 400 }
        );
      }

      deliveryFee = fee;
    }

    // Calculate total amount
    const total = calculateOrderTotal(subtotal, deliveryFee);

    // Validate amount
    if (!isValidAmount(total)) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Create metadata for tracking
    const metadata: Record<string, string> = {
      delivery_method: deliveryMethod,
      delivery_postcode: deliveryPostcode || 'pickup',
      delivery_fee: deliveryFee.toString(),
      subtotal: subtotal.toString(),
      items_count: items.length.toString(),
      // Store simplified items data
      items: JSON.stringify(
        items.map((item) => ({
          id: item.productId,
          name: item.productName,
          size: item.size.name,
          quantity: item.quantity,
          price: item.totalPrice,
        }))
      ),
    };

    if (customerEmail) {
      metadata.customer_email = customerEmail;
    }

    if (customerName) {
      metadata.customer_name = customerName;
    }

    if (deliveryAddress) {
      metadata.delivery_address = JSON.stringify(deliveryAddress);
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: CURRENCY,
      metadata,
      // Automatically capture payment when authorized
      capture_method: 'automatic',
      // Enable common payment methods
      payment_method_types: ['card'],
      // Optional: Add shipping details if delivery
      ...(deliveryAddress && {
        shipping: {
          name: customerName || 'Customer',
          address: {
            line1: deliveryAddress.line1,
            line2: deliveryAddress.line2 || undefined,
            city: deliveryAddress.city,
            postal_code: deliveryAddress.postcode,
            country: deliveryAddress.country,
          },
        },
      }),
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment Intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve PaymentIntent status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Payment Intent retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment intent' },
      { status: 500 }
    );
  }
}

