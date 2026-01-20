/**
 * Test Cosmos DB connection and admin login functionality
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { adminsRepository } from '../src/lib/cosmosdb';
import { comparePassword } from '../src/lib/auth';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function testLogin() {
  console.log('🔍 Testing login functionality...\n');

  const email = 'maryam@yumbymaryam.com.au';
  const password = 'admin123';

  try {
    // Step 1: Find admin
    console.log(`1. Looking up admin: ${email}`);
    const admin = await adminsRepository.getByEmail(email);
    
    if (!admin) {
      console.log('❌ Admin not found');
      return;
    }
    
    console.log('✅ Admin found:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.active}`);
    console.log(`   2FA: ${admin.two_factor_enabled}`);
    console.log('');

    // Step 2: Verify password
    console.log('2. Verifying password...');
    const isValid = await comparePassword(password, admin.password);
    console.log(isValid ? '✅ Password correct' : '❌ Password incorrect');
    console.log('');

    // Step 3: Check active status
    console.log('3. Checking active status...');
    console.log(admin.active ? '✅ Account is active' : '❌ Account is inactive');
    console.log('');

    console.log('✅ Login test completed successfully!');
  } catch (error: any) {
    console.error('❌ Error during login test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLogin().catch(console.error);
