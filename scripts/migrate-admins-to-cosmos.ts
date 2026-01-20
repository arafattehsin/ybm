/**
 * Migrate admin users from admin-data.json to Cosmos DB
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';
import * as fs from 'fs';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

async function migrateAdmins() {
  console.log('🔄 Migrating admins to Cosmos DB...\n');

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container('admins');

  // Read admin-data.json
  const dataPath = path.join(__dirname, '..', 'admin-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  const admin = data.admins;

  try {
    // Check if admin already exists
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: admin.email }],
      })
      .fetchAll();

    if (resources.length > 0) {
      console.log(`✅ Admin ${admin.email} already exists in Cosmos DB`);
      return;
    }

    // Create admin in Cosmos DB
    await container.items.create(admin);
    console.log(`✅ Migrated admin: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
  } catch (error: any) {
    console.error(`❌ Failed to migrate admin:`, error.message);
    throw error;
  }

  console.log('\n✅ Migration complete!');
}

migrateAdmins().catch(console.error);
