import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDeliveryFeeByPostcode } from '@/lib/postcodes';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutItem {
  productName: string;
  size: string;
  addons: string[];
  quantity: number;
  unitPrice: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  deliveryPostcode?: string;
  deliveryMethod: 'pickup' | 'delivery';
}

export async function POST(request: NextRequest) {
  try {
    const { items, deliveryPostcode, deliveryMethod } = (await request.json()) as CheckoutRequest;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Validate delivery postcode if delivery is selected
    let deliveryFee = 0;
    let deliveryOption = 'Pickup (Free)';

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
      deliveryOption = `Delivery to ${deliveryPostcode}`;
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => {
        const addonsText =
          item.addons.length > 0 ? ` + ${item.addons.join(', ')}` : '';

        return {
          price_data: {
            currency: 'aud',
            product_data: {
              name: `${item.productName} (${item.size})${addonsText}`,
            },
            unit_amount: item.unitPrice, // Already in cents
          },
          quantity: item.quantity,
        };
      }
    );

    // Add delivery fee as a line item if applicable
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: `Delivery to ${deliveryPostcode}`,
            description: 'Greater Sydney delivery',
          },
          unit_amount: deliveryFee,
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session with MANUAL CAPTURE
    // This authorizes the payment but doesn't charge until manually captured
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual', // AUTHORIZATION ONLY - must manually capture
        metadata: {
          delivery_method: deliveryMethod,
          delivery_postcode: deliveryPostcode || 'pickup',
          delivery_fee: deliveryFee.toString(),
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      shipping_address_collection: deliveryMethod === 'delivery' ? {
        allowed_countries: ['AU'],
      } : undefined,
      customer_email: undefined, // Let customer enter email
      metadata: {
        order_items: JSON.stringify(
          items.map((i) => ({
            productName: i.productName,
            size: i.size,
            addons: i.addons,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.unitPrice * i.quantity,
          }))
        ),
        delivery_method: deliveryMethod,
        delivery_postcode: deliveryPostcode || 'pickup',
        delivery_option: deliveryOption,
        delivery_fee: deliveryFee.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
