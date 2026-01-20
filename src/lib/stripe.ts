import Stripe from 'stripe';

// Initialize Stripe with the secret key
// This should only be used on the server side
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Currency and formatting utilities
export const CURRENCY = 'usd' as const;
export const MIN_AMOUNT = 50; // Minimum 50 cents ($0.50)
export const MAX_AMOUNT = 999999; // Maximum $9,999.99

/**
 * Format amount from cents to dollars for display
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
  }).format(amount / 100);
}

/**
 * Validate payment amount
 */
export function isValidAmount(amount: number): boolean {
  return (
    Number.isInteger(amount) &&
    amount >= MIN_AMOUNT &&
    amount <= MAX_AMOUNT
  );
}

/**
 * Calculate order total with tax (if applicable)
 * For now, this is a simple calculation
 * You can extend this to include tax rates based on location
 */
export function calculateOrderTotal(
  subtotal: number,
  delivery: number = 0,
  taxRate: number = 0
): number {
  const beforeTax = subtotal + delivery;
  const tax = Math.round(beforeTax * taxRate);
  return beforeTax + tax;
}

