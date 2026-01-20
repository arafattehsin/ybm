/**
 * Script to clean up customers with 0 orders
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
const customersContainer = database.container('customers');

interface Customer {
  id: string;
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
  [key: string]: unknown;
}

async function cleanupCustomers() {
  try {
    console.log('🧹 Starting customer cleanup process...\n');

    // Fetch all customers
    const { resources: customers } = await customersContainer.items
      .query<Customer>({
        query: 'SELECT * FROM c',
      })
      .fetchAll();

    console.log(`📊 Total customers: ${customers.length}\n`);

    // Find customers with 0 orders and 0 spent
    const customersToDelete = customers.filter(
      c => (c.total_orders === 0 || !c.total_orders) && (c.total_spent === 0 || !c.total_spent)
    );

    if (customersToDelete.length === 0) {
      console.log('✅ No customers to clean up');
      return;
    }

    console.log(`🗑️  Found ${customersToDelete.length} customers with no orders:\n`);

    for (const customer of customersToDelete) {
      console.log(`  - ${customer.name} (${customer.email})`);
      console.log(`    Orders: ${customer.total_orders}, Spent: $${(customer.total_spent / 100).toFixed(2)}`);
      
      try {
        await customersContainer.item(customer.id, customer.id).delete();
        console.log(`    ✅ Deleted customer\n`);
      } catch (error: unknown) {
        console.error(`    ❌ Failed to delete:`, error instanceof Error ? error.message : String(error));
      }
    }

    console.log('='.repeat(60));
    console.log(`✅ Cleanup completed - Removed ${customersToDelete.length} customers`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

console.log('🚀 Starting Customer Cleanup Script');
console.log('='.repeat(60));
cleanupCustomers()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
