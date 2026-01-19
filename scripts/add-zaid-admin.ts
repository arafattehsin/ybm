/**
 * Add Zaid admin user
 */

import { adminsRepository } from '../src/lib/cosmosdb';
import { hashPassword } from '../src/lib/auth';

async function addZaidAdmin() {
  console.log('👤 Adding Zaid admin user...\n');

  try {
    // Check if user already exists
    const existing = await adminsRepository.getByEmail('zaid@yumbymaryam.com.au');
    
    if (existing) {
      console.log('⚠️  User already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword('admin123');

    // Create admin user
    const newAdmin = {
      email: 'zaid@yumbymaryam.com.au',
      password: hashedPassword,
      name: 'Zaid',
      role: 'super_admin',
      two_factor_enabled: 0,
      active: 1,
    };

    await adminsRepository.create(newAdmin);

    console.log('✅ Created Zaid admin account');
    console.log('\n📋 Login credentials:');
    console.log('   Email: zaid@yumbymaryam.com.au');
    console.log('   Password: admin123');
    console.log('\n🎉 Admin user added successfully!');

    // List all admins
    const allAdmins = await adminsRepository.getAll();
    console.log('\n📋 Current admins:');
    allAdmins.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.name}) - ${admin.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addZaidAdmin();
