# Stripe Setup Guide

## Testing Before Real Payments

Stripe has **two modes**: Test Mode and Live Mode. You can test everything without processing real payments.

### 1. Get Your Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test Mode** (toggle in the top right corner - it should say "Test mode")
3. Go to **Developers** → **API keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

### 2. Add Keys to Your .env.local File

Add these to your `.env.local` file:

```env
# Stripe Test Keys (for testing - no real payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

### 3. Test Card Numbers

When in Test Mode, use these test card numbers:

**Successful Payment:**

- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any valid postcode

**Declined Payment:**

- Card: `4000 0000 0000 0002`
- This will simulate a declined card

**Other Test Scenarios:**

- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 9987` - Lost card
- Full list: https://stripe.com/docs/testing

### 4. What Happens in Test Mode?

✅ **Safe Testing:**

- No real money is charged
- You can test the entire checkout flow
- See orders in your Stripe Dashboard (Test Mode)
- Test webhooks and order confirmations
- Everything works exactly like production

✅ **Benefits:**

- Test different card scenarios (success, decline, errors)
- Verify your order flow
- Check email confirmations
- Debug any issues

### 5. Going Live (When Ready)

When you're ready for real payments:

1. Complete Stripe account verification (identity, business info, bank account)
2. Toggle to **Live Mode** in Stripe Dashboard
3. Get your **Live Keys** (starts with `pk_live_` and `sk_live_`)
4. Update `.env.local` with live keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   ```
5. Never commit `.env.local` to git!

### 6. Current Error Fix

The error "There was an error processing your order" means:

- Your Stripe secret key is missing or invalid
- Add the test key to `.env.local` as shown above
- Restart your dev server: `npm run dev`

### 7. Webhook Setup (Optional for Testing)

If you want to test webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhook`

This is optional for basic testing.

## Summary

**For Testing Now:**

1. Get `sk_test_...` key from Stripe Dashboard (Test Mode)
2. Add to `.env.local`
3. Restart server
4. Use test card `4242 4242 4242 4242`
5. Test your checkout flow - no real money involved! ✅

**For Production Later:**

1. Complete Stripe verification
2. Switch to Live Mode
3. Use live keys
4. Start accepting real payments
