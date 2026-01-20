import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = new CosmosClient({ 
  endpoint: process.env.COSMOS_DB_ENDPOINT!, 
  key: process.env.COSMOS_DB_KEY! 
});

const container = client.database('ybm-production').container('orders');

async function checkOrders() {
  const { resources } = await container.items
    .query('SELECT c.order_id, c.status, c.payment_status, c.total FROM c ORDER BY c.order_id DESC')
    .fetchAll();

  console.log('\n📊 Order Status Summary:\n');

  const statusCounts: Record<string, number> = {};
  resources.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  console.log('Status breakdown:');
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });

  console.log(`\nTotal orders: ${resources.length}\n`);

  console.log('Sample orders by status:');
  
  const deliveredOrders = resources.filter(o => o.status === 'delivered');
  if (deliveredOrders.length > 0) {
    console.log('\nDelivered orders:');
    deliveredOrders.slice(0, 5).forEach(o => {
      console.log(`  ${o.order_id} - $${(o.total / 100).toFixed(2)}`);
    });
  }

  const cancelledOrders = resources.filter(o => o.status === 'cancelled');
  if (cancelledOrders.length > 0) {
    console.log('\nCancelled orders:');
    cancelledOrders.slice(0, 5).forEach(o => {
      console.log(`  ${o.order_id} - $${(o.total / 100).toFixed(2)}`);
    });
  }
}

checkOrders();
