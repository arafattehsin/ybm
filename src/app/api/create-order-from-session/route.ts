import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { ordersRepository, customersRepository } from '@/lib/cosmosdb';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer_details', 'shipping_details'],
    }) as any;

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
    const customerName = session.customer_details?.name || session.shipping_details?.name || 'Guest';
    const customerPhone = session.customer_details?.phone || '';
    // shipping_details is already included in the session, no need to expand
    const shippingAddress = session.shipping_details?.address || session.customer_details?.address;

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

    // Generate simple sequential order ID (YBM-01, YBM-02, etc.)
    // Find the highest existing order number
    let maxOrderNum = 0;
    existingOrders.forEach(order => {
      const orderId = order.orderNumber || order.order_id || '';
      // Extract number from format YBM-XX
      const match = orderId.match(/YBM-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxOrderNum) {
          maxOrderNum = num;
        }
      }
    });
    
    // Increment and format with leading zeros
    const nextOrderNum = maxOrderNum + 1;
    const orderNumber = `YBM-${String(nextOrderNum).padStart(2, '0')}`;

    // Calculate subtotal (total - delivery fee)
    const deliveryFee = parseInt(metadata.delivery_fee || '0');
    const subtotal = (session.amount_total || 0) - deliveryFee;

    // Generate unique document ID for Cosmos DB
    const documentId = randomUUID();

    // Create order
    const order = await ordersRepository.create({
      id: documentId,
      orderNumber: orderNumber,
      order_id: orderNumber, // Keep for backwards compatibility
      customerId: customer.id,
      customer_id: customer.id, // Keep for backwards compatibility
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      items: items,
      status: 'pending',
      paymentStatus: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
      payment_status: paymentIntent.status === 'succeeded' ? 'captured' : 'authorized', // Keep for backwards compatibility
      paymentIntentId: paymentIntent.id,
      payment_intent_id: paymentIntent.id, // Keep for backwards compatibility
      deliveryMethod: metadata.delivery_method || 'delivery',
      delivery_method: metadata.delivery_method || 'delivery', // Keep for backwards compatibility
      shippingAddress: shippingAddress ? {
        name: customerName,
        line1: shippingAddress.line1 || '',
        line2: shippingAddress.line2 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || 'NSW',
        postal_code: shippingAddress.postal_code || '',
        country: shippingAddress.country || 'AU',
      } : undefined,
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
      deliveryInstructions: metadata.delivery_instructions || '',
      deliveryFee: deliveryFee,
      delivery_fee: deliveryFee, // Keep for backwards compatibility
      subtotal: subtotal,
      total: session.amount_total || 0,
      notes: '',
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(), // Keep for backwards compatibility
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(), // Keep for backwards compatibility
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order created'
        }
      ]
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

