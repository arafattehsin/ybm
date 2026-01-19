/**
 * Test TOTP verification
 */

import { adminsRepository } from '../src/lib/cosmosdb';
import speakeasy from 'speakeasy';

async function testTOTP() {
  console.log('🔐 Testing TOTP verification...\n');

  try {
    const admin = await adminsRepository.getByEmail('arafat@yumbymaryam.com.au');

    if (!admin) {
      console.error('Admin not found');
      return;
    }

    console.log('Admin:', admin.email);
    console.log('2FA Enabled:', admin.two_factor_enabled);
    console.log('Secret:', admin.two_factor_secret);
    console.log('Secret length:', admin.two_factor_secret?.length);

    // Generate a valid token for this secret
    const token = speakeasy.totp({
      secret: admin.two_factor_secret!,
      encoding: 'base32',
    });

    console.log('\n✅ Current valid TOTP code:', token);

    // Verify it works
    const isValid = speakeasy.totp.verify({
      secret: admin.two_factor_secret!,
      encoding: 'base32',
      token,
      window: 2,
    });

    console.log('✅ Verification result:', isValid);

    if (admin.two_factor_backup_codes) {
      const codes = JSON.parse(admin.two_factor_backup_codes);
      console.log('\n📝 Backup codes:', codes);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testTOTP();
