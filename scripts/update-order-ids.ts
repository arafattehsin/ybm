/**
 * Migration script to update all existing orders with sequential order IDs
 * Format: YBM-01, YBM-02, YBM-03, etc.
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

interface Order {
  id: string;
  orderNumber?: string;
  order_id?: string;
  customerId?: string;
  customer_id?: string;
  createdAt?: string;
  created_at?: string;
  [key: string]: unknown;
}

async function updateOrderIds() {
  try {
    console.log('🔄 Fetching all orders...');

    // Fetch all orders
    const { resources: orders } = await ordersContainer.items
      .query<Order>({
        query: 'SELECT * FROM c',
      })
      .fetchAll();

    console.log(`📦 Found ${orders.length} orders`);

    if (orders.length === 0) {
      console.log('✅ No orders to update');
      return;
    }

    // Sort orders by creation date to maintain chronological order
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      return dateA.getTime() - dateB.getTime();
    });

    console.log('🔄 Updating order IDs to sequential format...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const newOrderNumber = `YBM-${String(i + 1).padStart(2, '0')}`;
      const oldOrderId = order.orderNumber || order.order_id || 'unknown';

      try {
        // Update both orderNumber and order_id for compatibility
        const updatedOrder = {
          ...order,
          orderNumber: newOrderNumber,
          order_id: newOrderNumber,
          updatedAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Get customer_id for partition key
        const customerId = order.customerId || order.customer_id;
        if (!customerId) {
          console.error(`⚠️  Order ${order.id} has no customerId, skipping...`);
          errorCount++;
          continue;
        }

        await ordersContainer.item(order.id, customerId).replace(updatedOrder);
        
        console.log(`✅ Updated: ${oldOrderId} → ${newOrderNumber} (Created: ${order.createdAt || order.created_at})`);
        successCount++;
      } catch (error: unknown) {
        console.error(`❌ Failed to update order ${oldOrderId}:`, error instanceof Error ? error.message : String(error));
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully updated: ${successCount} orders`);
    if (errorCount > 0) {
      console.log(`❌ Failed to update: ${errorCount} orders`);
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
console.log('🚀 Starting Order ID Migration');
console.log('='.repeat(60));
updateOrderIds()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
