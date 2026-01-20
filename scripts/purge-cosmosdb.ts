/**
 * Purge all data from Cosmos DB containers
 * WARNING: This will delete ALL data - use with caution!
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

async function purgeAllData() {
  console.log('⚠️  WARNING: This will DELETE ALL DATA from Cosmos DB!\n');
  console.log('📋 Database:', databaseId);
  console.log('📦 Containers to purge: orders, customers, admins\n');

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);

  try {
    // Purge Orders
    console.log('🗑️  Purging orders...');
    const ordersContainer = database.container('orders');
    const { resources: orders } = await ordersContainer.items.readAll().fetchAll();
    console.log(`   Found ${orders.length} orders`);
    
    for (const order of orders) {
      await ordersContainer.item(order.id, order.customer_id).delete();
    }
    console.log(`   ✅ Deleted ${orders.length} orders\n`);

    // Purge Customers
    console.log('🗑️  Purging customers...');
    const customersContainer = database.container('customers');
    const { resources: customers } = await customersContainer.items.readAll().fetchAll();
    console.log(`   Found ${customers.length} customers`);
    
    for (const customer of customers) {
      await customersContainer.item(customer.id, customer.id).delete();
    }
    console.log(`   ✅ Deleted ${customers.length} customers\n`);

    // Purge Admins (keeping them for now - you can uncomment if needed)
    // console.log('🗑️  Purging admins...');
    // const adminsContainer = database.container('admins');
    // const { resources: admins } = await adminsContainer.items.readAll().fetchAll();
    // console.log(`   Found ${admins.length} admins`);
    
    // for (const admin of admins) {
    //   await adminsContainer.item(admin.id, admin.id).delete();
    // }
    // console.log(`   ✅ Deleted ${admins.length} admins\n`);

    console.log('✅ Purge completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Orders deleted: ${orders.length}`);
    console.log(`   Customers deleted: ${customers.length}`);
    console.log('   Admins: Kept (maryam, arafat, zaid)');
    console.log('\n💡 Database is now ready for WooCommerce data import!');

  } catch (error: any) {
    console.error('❌ Purge failed:', error.message);
    process.exit(1);
  }
}

purgeAllData();
