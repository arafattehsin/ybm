/**
 * Import WooCommerce data from WordPress database to Cosmos DB
 * Transforms WooCommerce schema to YBM Cosmos DB schema
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import mysql from 'mysql2/promise';
import { CosmosClient } from '@azure/cosmos';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Cosmos DB configuration
const cosmosEndpoint = process.env.COSMOS_DB_ENDPOINT!;
const cosmosKey = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

// WordPress database configuration (add these to .env.local)
const wpConfig = {
  host: process.env.WP_DB_HOST || 'localhost',
  user: process.env.WP_DB_USER!,
  password: process.env.WP_DB_PASSWORD!,
  database: process.env.WP_DB_NAME!,
  port: parseInt(process.env.WP_DB_PORT || '3306'),
};

// WooCommerce table prefix (usually wp_)
const tablePrefix = process.env.WP_TABLE_PREFIX || 'wp_';

interface WooCommerceOrder {
  id: number;
  post_date: string;
  post_status: string;
}

interface WooCommerceOrderMeta {
  meta_key: string;
  meta_value: string;
}

interface WooCommerceOrderItem {
  order_item_id: number;
  order_item_name: string;
  order_item_type: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

async function importWooCommerceData() {
  console.log('📦 WooCommerce to Cosmos DB Import\n');

  // Validate configuration
  if (!wpConfig.user || !wpConfig.password || !wpConfig.database) {
    console.error('❌ WordPress database credentials missing!');
    console.error('Please add to .env.local:');
    console.error('  WP_DB_HOST=your-host');
    console.error('  WP_DB_USER=your-username');
    console.error('  WP_DB_PASSWORD=your-password');
    console.error('  WP_DB_NAME=your-database');
    process.exit(1);
  }

  let wpConnection: mysql.Connection | null = null;

  try {
    // Connect to WordPress database
    console.log('🔌 Connecting to WordPress database...');
    console.log(`   Host: ${wpConfig.host}`);
    console.log(`   Database: ${wpConfig.database}\n`);
    
    wpConnection = await mysql.createConnection(wpConfig);
    console.log('✅ Connected to WordPress database\n');

    // Connect to Cosmos DB
    console.log('🔌 Connecting to Cosmos DB...');
    const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
    const database = cosmosClient.database(databaseId);
    const ordersContainer = database.container('orders');
    const customersContainer = database.container('customers');
    console.log('✅ Connected to Cosmos DB\n');

    // Query WooCommerce orders
    console.log('📥 Fetching WooCommerce orders...');
    const [orders] = await wpConnection.execute<any[]>(
      `SELECT ID, post_date, post_status, post_modified 
       FROM ${tablePrefix}posts 
       WHERE post_type = 'shop_order' 
       ORDER BY post_date DESC`
    );
    console.log(`   Found ${orders.length} orders\n`);

    const customersMap = new Map<string, any>();
    let ordersImported = 0;
    let customersImported = 0;

    // Process each order
    for (const order of orders) {
      console.log(`📦 Processing Order #${order.ID}...`);

      // Get order meta data
      const [orderMeta] = await wpConnection.execute<any[]>(
        `SELECT meta_key, meta_value 
         FROM ${tablePrefix}postmeta 
         WHERE post_id = ?`,
        [order.ID]
      );

      const meta = new Map<string, string>();
      orderMeta.forEach((m: any) => {
        meta.set(m.meta_key, m.meta_value);
      });

      // Get order items
      const [orderItems] = await wpConnection.execute<any[]>(
        `SELECT order_item_id, order_item_name, order_item_type 
         FROM ${tablePrefix}woocommerce_order_items 
         WHERE order_id = ?`,
        [order.ID]
      );

      // Extract customer information
      const billingEmail = meta.get('_billing_email') || '';
      const billingFirstName = meta.get('_billing_first_name') || '';
      const billingLastName = meta.get('_billing_last_name') || '';
      const billingPhone = meta.get('_billing_phone') || '';
      const customerName = `${billingFirstName} ${billingLastName}`.trim();

      // Create or get customer
      let customerId: string;
      if (customersMap.has(billingEmail)) {
        customerId = customersMap.get(billingEmail)!.id;
      } else {
        customerId = generateId();
        const customer = {
          id: customerId,
          name: customerName || 'Guest Customer',
          email: billingEmail,
          phone: billingPhone,
          addresses: [
            {
              type: 'billing',
              line1: meta.get('_billing_address_1') || '',
              line2: meta.get('_billing_address_2') || '',
              city: meta.get('_billing_city') || '',
              state: meta.get('_billing_state') || '',
              postcode: meta.get('_billing_postcode') || '',
              country: meta.get('_billing_country') || 'AU',
            },
            {
              type: 'shipping',
              line1: meta.get('_shipping_address_1') || meta.get('_billing_address_1') || '',
              line2: meta.get('_shipping_address_2') || meta.get('_billing_address_2') || '',
              city: meta.get('_shipping_city') || meta.get('_billing_city') || '',
              state: meta.get('_shipping_state') || meta.get('_billing_state') || '',
              postcode: meta.get('_shipping_postcode') || meta.get('_billing_postcode') || '',
              country: meta.get('_shipping_country') || meta.get('_billing_country') || 'AU',
            },
          ],
          total_spent: 0,
          total_orders: 0,
          created_at: order.post_date,
        };

        customersMap.set(billingEmail, customer);
      }

      // Transform order items
      const items = [];
      let subtotal = 0;

      for (const item of orderItems) {
        if (item.order_item_type === 'line_item') {
          const [itemMeta] = await wpConnection.execute<any[]>(
            `SELECT meta_key, meta_value 
             FROM ${tablePrefix}woocommerce_order_itemmeta 
             WHERE order_item_id = ?`,
            [item.order_item_id]
          );

          const itemMetaMap = new Map<string, string>();
          itemMeta.forEach((m: any) => {
            itemMetaMap.set(m.meta_key, m.meta_value);
          });

          const quantity = parseInt(itemMetaMap.get('_qty') || '1');
          const total = parseFloat(itemMetaMap.get('_line_total') || '0');
          const unitPrice = Math.round((total / quantity) * 100); // Convert to cents

          items.push({
            product_id: itemMetaMap.get('_product_id') || '',
            name: item.order_item_name,
            size: itemMetaMap.get('pa_size') || 'Regular',
            addons: [],
            quantity: quantity,
            unit_price: unitPrice,
            total_price: Math.round(total * 100),
          });

          subtotal += Math.round(total * 100);
        }
      }

      // Map WooCommerce status to YBM status
      const statusMap: Record<string, string> = {
        'wc-pending': 'pending',
        'wc-processing': 'confirmed',
        'wc-on-hold': 'pending',
        'wc-completed': 'delivered',
        'wc-cancelled': 'cancelled',
        'wc-refunded': 'cancelled',
        'wc-failed': 'cancelled',
      };

      const paymentStatusMap: Record<string, string> = {
        'wc-pending': 'pending',
        'wc-processing': 'captured',
        'wc-on-hold': 'authorized',
        'wc-completed': 'captured',
        'wc-cancelled': 'refunded',
        'wc-refunded': 'refunded',
        'wc-failed': 'failed',
      };

      const orderTotal = parseFloat(meta.get('_order_total') || '0');
      const shippingTotal = parseFloat(meta.get('_order_shipping') || '0');
      const deliveryMethod = shippingTotal > 0 ? 'delivery' : 'pickup';
      const deliveryPostcode = meta.get('_shipping_postcode') || meta.get('_billing_postcode') || '';

      // Create Cosmos DB order
      const cosmosOrder = {
        id: generateId(),
        order_id: `YBM-${1000 + order.ID}`, // YBM-1001, YBM-1002, etc.
        customer_id: customerId,
        items: items,
        status: statusMap[order.post_status] || 'pending',
        payment_status: paymentStatusMap[order.post_status] || 'pending',
        payment_intent_id: meta.get('_transaction_id') || '',
        payment_method: meta.get('_payment_method_title') || 'Card Payment',
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === 'delivery' ? {
          line1: meta.get('_shipping_address_1') || meta.get('_billing_address_1') || '',
          line2: meta.get('_shipping_address_2') || meta.get('_billing_address_2') || '',
          city: meta.get('_shipping_city') || meta.get('_billing_city') || '',
          state: meta.get('_shipping_state') || meta.get('_billing_state') || '',
          postcode: deliveryPostcode,
          country: meta.get('_shipping_country') || meta.get('_billing_country') || 'AU',
        } : undefined,
        delivery_fee: Math.round(shippingTotal * 100),
        subtotal: subtotal,
        total: Math.round(orderTotal * 100),
        notes: meta.get('_customer_note') || '',
        created_at: order.post_date,
        updated_at: order.post_modified,
        expected_delivery_date: meta.get('_expected_delivery_date') || '',
      };

      // Save to Cosmos DB
      await ordersContainer.items.create(cosmosOrder);
      ordersImported++;
      console.log(`   ✅ Imported order ${cosmosOrder.order_id}`);

      // Update customer stats
      if (customersMap.has(billingEmail)) {
        const customer = customersMap.get(billingEmail)!;
        customer.total_spent += cosmosOrder.total;
        customer.total_orders += 1;
        customer.last_order_date = order.post_date;
      }
    }

    // Import customers
    console.log(`\n👥 Importing ${customersMap.size} customers...`);
    for (const customer of customersMap.values()) {
      await customersContainer.items.create(customer);
      customersImported++;
    }

    console.log('\n✅ Import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Orders imported: ${ordersImported}`);
    console.log(`   Customers imported: ${customersImported}`);
    console.log('\n🎉 WooCommerce data successfully migrated to Cosmos DB!');

  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (wpConnection) {
      await wpConnection.end();
      console.log('\n🔌 Disconnected from WordPress database');
    }
  }
}

importWooCommerceData();
