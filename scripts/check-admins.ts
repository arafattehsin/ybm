/**
 * Check if admin users exist in Cosmos DB
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

async function checkAdmins() {
  console.log('🔍 Checking admins in Cosmos DB...\n');

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container('admins');

  try {
    const { resources: admins } = await container.items
      .query('SELECT * FROM c')
      .fetchAll();

    console.log(`Found ${admins.length} admin(s) in Cosmos DB:\n`);
    
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.active}`);
      console.log(`   2FA Enabled: ${admin.two_factor_enabled}`);
      console.log(`   Last Login: ${admin.last_login || 'Never'}`);
      console.log('');
    });

    if (admins.length === 0) {
      console.log('⚠️  No admins found. Run migration script to add admins.');
    }
  } catch (error: any) {
    console.error(`❌ Error checking admins:`, error.message);
    throw error;
  }
}

checkAdmins().catch(console.error);
