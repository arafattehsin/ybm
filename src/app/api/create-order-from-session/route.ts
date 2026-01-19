import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { ordersRepository, customersRepository } from '@/lib/cosmosdb';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer_details', 'shipping_details'],
    });

    if (!session.payment_intent) {
      return NextResponse.json({ error: 'No payment intent found' }, { status: 400 });
    }

    const paymentIntent = typeof session.payment_intent === 'string' 
      ? await stripe.paymentIntents.retrieve(session.payment_intent)
      : session.payment_intent;

    // Check if order already exists
    const existingOrders = await ordersRepository.getAll();
    const existingOrder = existingOrders.find(o => o.payment_intent_id === paymentIntent.id);
    
    if (existingOrder) {
      console.log('✅ Order already exists:', existingOrder.order_id);
      return NextResponse.json({ success: true, orderId: existingOrder.order_id });
    }

    // Extract customer details
    const customerEmail = session.customer_details?.email || session.customer_email || '';
    const customerName = session.customer_details?.name || 'Guest';
    const customerPhone = session.customer_details?.phone || '';
    const shippingAddress = session.shipping_details?.address;

    // Create or update customer
    let customer = await customersRepository.getByEmail(customerEmail);
    if (!customer) {
      customer = await customersRepository.create({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        addresses: shippingAddress ? [{
          street: shippingAddress.line1 || '',
          apartment: shippingAddress.line2 || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || 'NSW',
          postcode: shippingAddress.postal_code || '',
          country: shippingAddress.country || 'AU',
        }] : [],
        total_spent: session.amount_total || 0,
        total_orders: 1,
        created_at: new Date().toISOString(),
      });
    } else {
      // Update customer stats
      await customersRepository.update(customer.id, {
        total_spent: customer.total_spent + (session.amount_total || 0),
        total_orders: customer.total_orders + 1,
        last_order_date: new Date().toISOString(),
      });
    }

    // Parse items from metadata
    const metadata = session.metadata || {};
    const items = JSON.parse(metadata.order_items || '[]');

    // Generate order ID
    const orderCount = existingOrders.length;
    const orderNumber = `YBM-${String(1000 + orderCount + 1).padStart(4, '0')}`;

    // Calculate subtotal (total - delivery fee)
    const deliveryFee = parseInt(metadata.delivery_fee || '0');
    const subtotal = (session.amount_total || 0) - deliveryFee;

    // Create order
    const order = await ordersRepository.create({
      order_id: orderNumber,
      customer_id: customer.id,
      items: items,
      status: 'pending',
      payment_status: 'authorized',
      payment_intent_id: paymentIntent.id,
      delivery_method: metadata.delivery_method || 'delivery',
      delivery_address: shippingAddress ? {
        street: shippingAddress.line1 || '',
        apartment: shippingAddress.line2 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || 'NSW',
        postcode: shippingAddress.postal_code || '',
        country: shippingAddress.country || 'AU',
        name: customerName,
        phone: customerPhone,
      } : undefined,
      delivery_fee: deliveryFee,
      subtotal: subtotal,
      total: session.amount_total || 0,
      notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    console.log('✅ Order created from session:', order.order_id);

    return NextResponse.json({ 
      success: true, 
      orderId: order.order_id,
      customerId: customer.id,
    });

  } catch (error) {
    console.error('❌ Failed to create order from session:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
