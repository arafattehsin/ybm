/**
 * Script to check customer data for old orders
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

async function checkCustomerData() {
  try {
    const customerIds = [
      '62609b62-476e-438f-9fc2-251ebaa5520b', // YBM-01, YBM-02
      'ba733ce1-f3cf-4158-9e7a-984f8300906f'  // YBM-03
    ];

    for (const customerId of customerIds) {
      console.log('='.repeat(80));
      console.log(`👤 Customer ID: ${customerId}`);
      console.log('='.repeat(80));
      
      try {
        const { resource: customer } = await customersContainer.item(customerId, customerId).read();
        
        if (customer) {
          console.log('\n📧 Email:', customer.email);
          console.log('👤 Name:', customer.name);
          console.log('📞 Phone:', customer.phone);
          console.log('📍 Address:', JSON.stringify(customer.address, null, 2));
          console.log('🏠 Addresses:', JSON.stringify(customer.addresses, null, 2));
        } else {
          console.log('❌ Customer not found');
        }
      } catch (error: unknown) {
        console.log('❌ Error fetching customer:', error instanceof Error ? error.message : String(error));
      }
      
      console.log('\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCustomerData()
  .then(() => {
    console.log('✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
