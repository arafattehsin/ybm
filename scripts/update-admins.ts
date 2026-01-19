/**
 * Update Admin Users Script
 * 
 * 1. Updates existing admin email from admin@yumbymaryam.com to maryam@yumbymaryam.com.au
 * 2. Creates new admin: arafat@yumbymaryam.com.au
 * 
 * Run with: npx tsx scripts/update-admins.ts
 */

import { adminsRepository } from '../src/lib/cosmosdb';
import bcrypt from 'bcryptjs';

async function updateAdmins() {
  console.log('🔧 Updating Admin Users...\n');

  try {
    // Get all admins
    const admins = await adminsRepository.getAll();
    console.log(`Found ${admins.length} admin(s)\n`);

    // Find existing admin
    const existingAdmin = admins.find(a => a.email === 'admin@yumbymaryam.com');
    
    if (existingAdmin) {
      console.log('📝 Updating admin@yumbymaryam.com → maryam@yumbymaryam.com.au');
      await adminsRepository.update(existingAdmin.id, {
        email: 'maryam@yumbymaryam.com.au',
        name: 'Maryam',
        updated_at: new Date().toISOString(),
      });
      console.log('✅ Updated Maryam\'s email\n');
    } else {
      console.log('⚠️  admin@yumbymaryam.com not found, skipping update\n');
    }

    // Check if Arafat admin already exists
    const arafatExists = admins.find(a => a.email === 'arafat@yumbymaryam.com.au');
    
    if (arafatExists) {
      console.log('ℹ️  arafat@yumbymaryam.com.au already exists, skipping creation\n');
    } else {
      console.log('👤 Creating new admin: arafat@yumbymaryam.com.au');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await adminsRepository.create({
        email: 'arafat@yumbymaryam.com.au',
        password: hashedPassword,
        name: 'Arafat',
        role: 'super_admin',
        two_factor_enabled: 0,
        active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      console.log('✅ Created Arafat\'s admin account\n');
    }

    // List all admins
    console.log('📋 Current admins:');
    const updatedAdmins = await adminsRepository.getAll();
    updatedAdmins.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.name}) - ${admin.role}`);
    });

    console.log('\n🎉 Admin users updated successfully!');

  } catch (error) {
    console.error('❌ Failed to update admins:', error);
    process.exit(1);
  }
}

updateAdmins();
