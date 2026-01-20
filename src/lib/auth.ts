/**
 * Authentication utilities
 * Handles password hashing, JWT tokens, and 2FA
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

/**
 * Generate 2FA secret for authenticator app
 */
export function generate2FASecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `Yum by Maryam (${email})`,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
}

/**
 * Generate QR code for 2FA setup
 */
export async function generateQRCode(otpauth_url: string): Promise<string> {
  return QRCode.toDataURL(otpauth_url);
}

/**
 * Verify 2FA token from authenticator app
 */
export function verify2FAToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps before/after
  });
}

/**
 * Generate random 6-digit code for email/SMS 2FA
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send email with OTP code
 */
export async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  try {
    // Create transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@yumbymaryam.com',
      to: email,
      subject: 'Your Admin Login Code - Yum by Maryam',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E91E63;">Admin Login Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #FCE4EC; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #E91E63; letter-spacing: 8px; border-radius: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Yum by Maryam Admin Dashboard</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}

/**
 * Send SMS with OTP code (placeholder - requires SMS service like Twilio)
 */
export async function sendOTPSMS(phone: string, code: string): Promise<boolean> {
  try {
    // TODO: Implement with Twilio or other SMS service
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);
    //
    // await client.messages.create({
    //   body: `Your Yum by Maryam admin verification code is: ${code}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });

    console.log(`SMS OTP would be sent to ${phone}: ${code}`);
    return true;
  } catch (error) {
    console.error('Failed to send OTP SMS:', error);
    return false;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
}

