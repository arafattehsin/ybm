import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = new CosmosClient({ 
  endpoint: process.env.COSMOS_DB_ENDPOINT!, 
  key: process.env.COSMOS_DB_KEY! 
});

const container = client.database('ybm-production').container('orders');

async function checkDuplicates() {
  const { resources } = await container.items.query('SELECT c.order_id FROM c').fetchAll();

  const orderCounts: Record<string, number> = {};
  resources.forEach(order => {
    orderCounts[order.order_id] = (orderCounts[order.order_id] || 0) + 1;
  });

  console.log('\n📊 Order Count Check:\n');
  console.log(`Total orders in DB: ${resources.length}`);

  const duplicates = Object.entries(orderCounts).filter(([_, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`\n⚠️  DUPLICATES FOUND: ${duplicates.length} order IDs\n`);
    duplicates.forEach(([orderId, count]) => {
      console.log(`  ${orderId}: ${count} copies`);
    });
  } else {
    console.log('\n✅ No duplicates - all orders are unique');
  }
}

checkDuplicates();
