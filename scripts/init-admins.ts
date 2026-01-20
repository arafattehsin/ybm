/**
 * Initialize Admin Users in Cosmos DB
 * Run this script once to create initial admin accounts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

const admins = [
  {
    email: 'arafat@yumbymaryam.com.au',
    password: 'admin123', // Change this in production!
    name: 'Arafat',
    role: 'super_admin',
  },
  {
    email: 'admin@yumbymaryam.com',
    password: 'admin123', // Change this in production!
    name: 'Maryam',
    role: 'super_admin',
  },
];

async function initAdmins() {
  console.log('🔐 Initializing admin users...\n');

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);

  // Create admins container if it doesn't exist
  const { container: adminsContainer } = await database.containers.createIfNotExists({
    id: 'admins',
    partitionKey: { paths: ['/id'] },
  });

  console.log('✅ Admins container ready\n');

  for (const adminData of admins) {
    try {
      // Check if admin already exists
      const { resources } = await adminsContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.email = @email',
          parameters: [{ name: '@email', value: adminData.email }],
        })
        .fetchAll();

      if (resources.length > 0) {
        console.log(`⏭️  Admin ${adminData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Create admin
      const admin = {
        id: randomUUID(),
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: adminData.role,
        two_factor_enabled: 0,
        active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await adminsContainer.items.create(admin);
      console.log(`✅ Created admin: ${adminData.email} (${adminData.name})`);
    } catch (error: any) {
      console.error(`❌ Failed to create admin ${adminData.email}:`, error.message);
    }
  }

  console.log('\n✅ Admin initialization complete!');
  console.log('\n⚠️  IMPORTANT: Change default passwords immediately!');
}

initAdmins().catch(console.error);
