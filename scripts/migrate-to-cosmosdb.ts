/**
 * Cosmos DB Initialization and Data Migration Script
 * 
 * Run with: npx tsx scripts/migrate-to-cosmosdb.ts
 */

import { initializeDatabase, adminsRepository } from '../src/lib/cosmosdb';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'admin-data.json');

async function migrate() {
  console.log('🚀 Starting Cosmos DB Migration...\n');

  try {
    // Step 1: Initialize database and containers
    console.log('📦 Step 1: Initializing Cosmos DB...');
    await initializeDatabase();
    console.log('✅ Database and containers created\n');

    // Step 2: Check if admin-data.json exists
    if (!existsSync(DB_PATH)) {
      console.log('⚠️  No admin-data.json found. Creating default admin user...');
      
      // Create default admin
      const defaultAdmin = {
        id: 'admin-1',
        email: 'admin@yumbymaryam.com',
        password: '$2a$10$wbFe5N73.JxNoZtt5U0BHu5cNHl/dEiKMIhGNUI6zIJhchHb0rphi', // admin123
        name: 'Admin User',
        role: 'super_admin',
        two_factor_enabled: 0,
        active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await adminsRepository.create(defaultAdmin);
      console.log('✅ Default admin created');
      console.log('   Email: admin@yumbymaryam.com');
      console.log('   Password: admin123\n');
      
    } else {
      // Step 3: Read existing data
      console.log('📖 Step 2: Reading admin-data.json...');
      const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
      console.log(`   Found ${data.admins?.length || 0} admins`);
      console.log(`   Found ${data.customers?.length || 0} customers`);
      console.log(`   Found ${data.orders?.length || 0} orders\n`);

      // Step 4: Migrate admins
      if (data.admins && data.admins.length > 0) {
        console.log('👤 Step 3: Migrating admins...');
        for (const admin of data.admins) {
          try {
            await adminsRepository.create(admin);
            console.log(`   ✓ Migrated admin: ${admin.email}`);
          } catch (error: any) {
            if (error.code === 409) {
              console.log(`   ⚠️  Admin already exists: ${admin.email}`);
            } else {
              console.error(`   ✗ Failed to migrate admin ${admin.email}:`, error.message);
            }
          }
        }
        console.log('✅ Admins migration complete\n');
      }

      console.log('ℹ️  Note: Orders and customers will be created from live transactions\n');
    }

    // Step 5: Verify migration
    console.log('🔍 Step 4: Verifying migration...');
    const admins = await adminsRepository.getAll();
    console.log(`   Found ${admins.length} admin(s) in Cosmos DB`);
    
    admins.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.role})`);
    });

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update API routes to use Cosmos DB');
    console.log('   2. Set up Stripe webhook to save orders');
    console.log('   3. Test admin login at /admin');
    console.log('   4. Test order creation\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
