'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<string>('');
  const [adminId, setAdminId] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/getmein/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requires2FA) {
        setRequires2FA(true);
        setTwoFactorMethod(data.method);
        setAdminId(data.adminId);
      } else {
        router.push('/getmein');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/getmein/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, code, method: twoFactorMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      router.push('/getmein');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-cream-50 p-4">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Yum by Maryam
          </h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-pink-100">
          {!requires2FA ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-lg"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Two-Factor Authentication</h2>
              <p className="text-gray-600 text-sm mb-6">
                {twoFactorMethod === 'email'
                  ? 'Enter the 6-digit code sent to your email'
                  : 'Enter the code from your authenticator app'}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full py-3 text-lg"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setCode('');
                    setError('');
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2026 Yum by Maryam. All rights reserved.
        </p>
      </div>
    </div>
  );
}

