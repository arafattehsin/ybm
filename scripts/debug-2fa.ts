/**
 * Debug 2FA setup for admin
 */

import { adminsRepository } from '../src/lib/cosmosdb';

async function debugTwoFactor() {
  console.log('🔍 Debugging 2FA setup...\n');

  try {
    const admins = await adminsRepository.getAll();

    for (const admin of admins) {
      console.log(`\n📋 Admin: ${admin.email}`);
      console.log(`   2FA Enabled: ${admin.two_factor_enabled ? 'YES' : 'NO'}`);
      console.log(`   2FA Method: ${admin.two_factor_method || 'Not set'}`);
      console.log(`   Secret exists: ${admin.two_factor_secret ? 'YES' : 'NO'}`);
      console.log(`   Secret length: ${admin.two_factor_secret?.length || 0}`);
      console.log(`   Backup codes: ${admin.two_factor_backup_codes ? JSON.parse(admin.two_factor_backup_codes).length : 0} codes`);
    }

    console.log('\n✅ Debug complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugTwoFactor();
