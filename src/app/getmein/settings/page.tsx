'use client';

import { useState, useEffect } from 'react';
import { Shield, Copy, Check, Key, Download, Settings as SettingsIcon } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [password, setPassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  async function fetchAdminProfile() {
    try {
      const response = await fetch('/api/getmein/auth/me');
      if (response.ok) {
        const data = await response.json();
        setTwoFactorEnabled(!!data.admin.twoFactorEnabled);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetup2FA() {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/getmein/auth/setup-2fa', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setSuccess(data.message);
      } else {
        setError(data.error || 'Failed to setup 2FA');
      }
    } catch (error) {
      setError('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable2FA() {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/getmein/auth/enable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setBackupCodes(data.backupCodes);
        setTwoFactorEnabled(true);
        setQrCode('');
        setSecret('');
        setVerificationCode('');
        setSuccess(data.message);
      } else {
        setError(data.error || 'Failed to enable 2FA');
      }
    } catch (error) {
      setError('Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable2FA() {
    if (!password || !disableCode) {
      setError('Please enter your password and current 2FA code');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/getmein/auth/disable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code: disableCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setTwoFactorEnabled(false);
        setPassword('');
        setDisableCode('');
        setBackupCodes([]);
        setSuccess(data.message);
      } else {
        setError(data.error || 'Failed to disable 2FA');
      }
    } catch (error) {
      setError('Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  }

  function copySecret() {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  }

  function copyBackupCodes() {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  }

  function downloadBackupCodes() {
    const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ybm-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your admin preferences and security settings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* 2FA Status Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Shield className={`w-5 h-5 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled ? 'Your account is protected with 2FA' : 'Secure your account with 2FA'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
          </span>
        </div>

        {!twoFactorEnabled && !qrCode && (
          <button
            onClick={handleSetup2FA}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
          </button>
        )}
      </div>

      {/* QR Code Setup */}
      {qrCode && !twoFactorEnabled && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Authenticator App</h3>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Step 1:</strong> Install Google Authenticator or Microsoft Authenticator on your phone
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Step 2:</strong> Scan this QR code with your authenticator app:
              </p>
              <div className="flex justify-center bg-gray-50 p-6 rounded-lg mb-4">
                <Image src={qrCode} alt="2FA QR Code" width={200} height={200} />
              </div>
              <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-4 py-2 rounded font-mono text-sm break-all">{secret}</code>
                <button
                  onClick={copySecret}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition shrink-0"
                  title="Copy secret"
                >
                  {copiedSecret ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Step 3:</strong> Enter the 6-digit code from your authenticator app:
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest font-mono mb-4"
              />
              <button
                onClick={handleEnable2FA}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Codes */}
      {backupCodes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <Key className="text-amber-600 mt-1 shrink-0" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Save Your Backup Codes</h3>
              <p className="text-sm text-gray-600">
                These codes can be used if you lose access to your authenticator app. Each code can only be used once.
                Store them somewhere safe!
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="px-2 py-1 bg-gray-50 rounded text-center">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyBackupCodes}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              {copiedCodes ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              {copiedCodes ? 'Copied!' : 'Copy Codes'}
            </button>
            <button
              onClick={downloadBackupCodes}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Disable 2FA */}
      {twoFactorEnabled && !qrCode && backupCodes.length === 0 && (
        <div className="bg-white rounded-xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disable Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600 mb-4">
            To disable 2FA, enter your password and a current verification code from your authenticator app.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-xl tracking-widest font-mono"
              />
            </div>
            <button
              onClick={handleDisable2FA}
              disabled={loading || !password || disableCode.length !== 6}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
            </button>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">System Information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Version</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Database</span>
            <span className="font-medium text-gray-900">Azure Cosmos DB</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Environment</span>
            <span className="font-medium text-gray-900">Development</span>
          </div>
        </div>
      </div>
    </div>
  );
}

