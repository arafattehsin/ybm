/**
 * Script to delete specific orders and update related data
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
const customersContainer = database.container('customers');

interface Order {
  id: string;
  orderNumber?: string;
  order_id?: string;
  customerId?: string;
  customer_id?: string;
  total: number;
  [key: string]: unknown;
}

interface Customer {
  id: string;
  total_orders: number;
  total_spent: number;
  [key: string]: unknown;
}

const ORDER_IDS_TO_DELETE = ['YBM-01', 'YBM-02', 'YBM-03'];

async function deleteOrders() {
  try {
    console.log('🗑️  Starting order deletion process...\n');

    // Fetch orders to delete
    const { resources: ordersToDelete } = await ordersContainer.items
      .query<Order>({
        query: "SELECT * FROM c WHERE c.orderNumber IN ('YBM-01', 'YBM-02', 'YBM-03') OR c.order_id IN ('YBM-01', 'YBM-02', 'YBM-03')",
      })
      .fetchAll();

    if (ordersToDelete.length === 0) {
      console.log('✅ No orders found to delete');
      return;
    }

    console.log(`📦 Found ${ordersToDelete.length} orders to delete:\n`);

    const customerUpdates = new Map<string, { orderCount: number; totalSpent: number }>();

    // Process each order
    for (const order of ordersToDelete) {
      const orderNum = order.orderNumber || order.order_id || order.id;
      const customerId = order.customerId || order.customer_id;
      const orderTotal = order.total || 0;

      console.log(`  - ${orderNum} (Customer: ${customerId}, Total: $${(orderTotal / 100).toFixed(2)})`);

      // Track customer updates
      if (customerId) {
        const existing = customerUpdates.get(customerId) || { orderCount: 0, totalSpent: 0 };
        customerUpdates.set(customerId, {
          orderCount: existing.orderCount + 1,
          totalSpent: existing.totalSpent + orderTotal,
        });
      }

      // Delete the order
      try {
        await ordersContainer.item(order.id, customerId).delete();
        console.log(`    ✅ Deleted order ${orderNum}`);
      } catch (error: unknown) {
        console.error(`    ❌ Failed to delete order ${orderNum}:`, error instanceof Error ? error.message : String(error));
      }
    }

    // Update customer records
    console.log('\n👥 Updating customer records...\n');
    for (const [customerId, updates] of customerUpdates) {
      try {
        const { resource: customer } = await customersContainer.item(customerId, customerId).read<Customer>();
        
        if (customer) {
          const updatedCustomer = {
            ...customer,
            total_orders: Math.max(0, (customer.total_orders || 0) - updates.orderCount),
            total_spent: Math.max(0, (customer.total_spent || 0) - updates.totalSpent),
          };

          await customersContainer.item(customerId, customerId).replace(updatedCustomer);
          console.log(`  ✅ Updated customer ${customerId}`);
          console.log(`     Orders: ${customer.total_orders} → ${updatedCustomer.total_orders}`);
          console.log(`     Spent: $${(customer.total_spent / 100).toFixed(2)} → $${(updatedCustomer.total_spent / 100).toFixed(2)}`);
        }
      } catch (error: unknown) {
        console.error(`  ❌ Failed to update customer ${customerId}:`, error instanceof Error ? error.message : String(error));
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Deletion process completed successfully');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Deletion failed:', error);
    process.exit(1);
  }
}

console.log('🚀 Starting Order Deletion Script');
console.log('='.repeat(60));
console.log(`Deleting orders: ${ORDER_IDS_TO_DELETE.join(', ')}`);
console.log('='.repeat(60) + '\n');

deleteOrders()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
