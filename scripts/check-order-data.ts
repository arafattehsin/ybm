/**
 * Script to check order data structure for debugging
 */

import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const cosmosEndpoint = process.env.COSMOS_DB_ENDPOINT;
const cosmosKey = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

if (!cosmosEndpoint || !cosmosKey) {
  console.error('❌ Missing COSMOS_DB_ENDPOINT or COSMOS_DB_KEY');
  process.exit(1);
}

const client = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
const database = client.database(databaseId);
const ordersContainer = database.container('orders');

async function checkOrderData() {
  try {
    console.log('🔍 Fetching order YBM-01, YBM-02, YBM-03...\n');

    const { resources: orders } = await ordersContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.orderNumber IN ('YBM-01', 'YBM-02', 'YBM-03')",
      })
      .fetchAll();

    if (orders.length === 0) {
      console.log('❌ No orders found');
      return;
    }

    orders.forEach((order) => {
      console.log('='.repeat(80));
      console.log(`📦 Order: ${order.orderNumber || order.order_id}`);
      console.log('='.repeat(80));
      
      console.log('\n📧 Email Fields:');
      console.log('  customerEmail:', order.customerEmail);
      console.log('  customer_email:', order.customer_email);
      console.log('  email:', order.email);
      
      console.log('\n👤 Customer Fields:');
      console.log('  customerName:', order.customerName);
      console.log('  customer_name:', order.customer_name);
      console.log('  customerPhone:', order.customerPhone);
      console.log('  customer_phone:', order.customer_phone);
      console.log('  customerId:', order.customerId);
      console.log('  customer_id:', order.customer_id);
      
      console.log('\n📍 Address Fields:');
      console.log('  shippingAddress:', JSON.stringify(order.shippingAddress, null, 2));
      console.log('  shipping_address:', JSON.stringify(order.shipping_address, null, 2));
      console.log('  delivery_address:', JSON.stringify(order.delivery_address, null, 2));
      
      console.log('\n💰 Price Fields:');
      console.log('  subtotal:', order.subtotal);
      console.log('  deliveryFee:', order.deliveryFee);
      console.log('  delivery_fee:', order.delivery_fee);
      console.log('  total:', order.total);
      
      console.log('\n📦 Items:');
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any, idx: number) => {
          console.log(`  Item ${idx + 1}:`);
          console.log('    name:', item.name);
          console.log('    productName:', item.productName);
          console.log('    price:', item.price);
          console.log('    unitPrice:', item.unitPrice);
          console.log('    totalPrice:', item.totalPrice);
          console.log('    quantity:', item.quantity);
        });
      }
      
      console.log('\n');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkOrderData()
  .then(() => {
    console.log('✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
