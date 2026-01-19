/**
 * Fix 2FA method for existing admins with TOTP enabled
 */

import { adminsRepository } from '../src/lib/cosmosdb';

async function fixTwoFactorMethod() {
  console.log('🔧 Fixing 2FA method for admins...\n');

  try {
    const admins = await adminsRepository.getAll();

    for (const admin of admins) {
      if (admin.two_factor_enabled && !admin.two_factor_method) {
        console.log(`📝 Updating ${admin.email} to use 'totp' method`);
        await adminsRepository.update(admin.id, {
          two_factor_method: 'totp',
          updated_at: new Date().toISOString(),
        });
        console.log(`✅ Updated ${admin.email}`);
      }
    }

    console.log('\n🎉 2FA method fixed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTwoFactorMethod();
