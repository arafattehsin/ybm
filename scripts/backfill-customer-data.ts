/**
 * Migration script to backfill customer email and name for old orders
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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  [key: string]: unknown;
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

async function backfillCustomerData() {
  try {
    console.log('🔄 Fetching all orders...');

    const { resources: orders } = await ordersContainer.items
      .query<Order>({
        query: 'SELECT * FROM c',
      })
      .fetchAll();

    console.log(`📦 Found ${orders.length} orders\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const order of orders) {
      const orderNum = order.orderNumber || order.order_id || order.id;
      const customerId = order.customerId || order.customer_id;

      // Skip if already has customer email
      if (order.customerEmail || order.customer_email) {
        console.log(`⏭️  ${orderNum}: Already has customer data`);
        skipCount++;
        continue;
      }

      // Skip if no customer ID
      if (!customerId) {
        console.log(`⚠️  ${orderNum}: No customer ID`);
        skipCount++;
        continue;
      }

      try {
        // Fetch customer data
        const { resource: customer } = await customersContainer.item(customerId, customerId).read<Customer>();

        if (!customer) {
          console.log(`❌ ${orderNum}: Customer not found (${customerId})`);
          errorCount++;
          continue;
        }

        // Update order with customer data
        const updatedOrder = {
          ...order,
          customerName: customer.name || '',
          customer_name: customer.name || '',
          customerEmail: customer.email || '',
          customer_email: customer.email || '',
          customerPhone: customer.phone || '',
          customer_phone: customer.phone || '',
          updatedAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await ordersContainer.item(order.id, customerId).replace(updatedOrder);
        
        console.log(`✅ ${orderNum}: Added email=${customer.email}, name=${customer.name}`);
        successCount++;
      } catch (error: unknown) {
        console.error(`❌ ${orderNum}: Failed -`, error instanceof Error ? error.message : String(error));
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully updated: ${successCount} orders`);
    console.log(`⏭️  Skipped: ${skipCount} orders`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} orders`);
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

console.log('🚀 Starting Customer Data Backfill Migration');
console.log('='.repeat(60));
backfillCustomerData()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
