/**
 * Test Cosmos DB connection
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { CosmosClient } from '@azure/cosmos';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function testConnection() {
  console.log('🔍 Testing Cosmos DB connection...\n');

  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;
  const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'ybm-production';

  console.log('📋 Configuration:');
  console.log(`   Endpoint: ${endpoint}`);
  console.log(`   Key: ${key ? '***' + key.slice(-4) : 'NOT SET'}`);
  console.log(`   Database: ${databaseId}\n`);

  if (!endpoint || !key) {
    console.error('❌ Missing environment variables!');
    console.error('Make sure COSMOS_DB_ENDPOINT and COSMOS_DB_KEY are set in .env.local');
    process.exit(1);
  }

  try {
    const client = new CosmosClient({ endpoint, key });
    
    // Test connection by listing databases
    const { databases } = await client.databases.readAll().fetchAll();
    
    console.log('✅ Successfully connected to Cosmos DB!');
    console.log(`\n📋 Found ${databases.length} database(s):`);
    databases.forEach(db => {
      console.log(`   - ${db.id}`);
    });

    // Test accessing our database
    const database = client.database('ybm-production');
    const { containers } = await database.containers.readAll().fetchAll();
    
    console.log(`\n📦 Found ${containers.length} container(s) in ybm-production:`);
    containers.forEach(container => {
      console.log(`   - ${container.id}`);
    });

    console.log('\n✅ All connection tests passed!');
  } catch (error: any) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. IP address not added to firewall (check Azure Portal → Networking)');
    console.error('2. Firewall changes take 1-2 minutes to propagate');
    console.error('3. Wrong credentials in .env.local');
    console.error('4. Network connectivity issues');
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
