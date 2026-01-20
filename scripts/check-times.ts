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
    .query('SELECT c.order_id, c.created_at FROM c ORDER BY c.order_id DESC')
    .fetchAll();

  console.log('\n⏰ Order Times Check:\n');
  
  resources.slice(0, 10).forEach(order => {
    const date = new Date(order.created_at);
    console.log(`${order.order_id}: ${date.toLocaleString('en-AU', { 
      dateStyle: 'medium', 
      timeStyle: 'long',
      timeZone: 'Australia/Sydney'
    })}`);
  });
}

checkOrders();
