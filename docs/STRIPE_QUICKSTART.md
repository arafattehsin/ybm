# Quick Start: Stripe Payment Setup

## 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## 2. Update Environment Variables

Open `.env.local` and replace the placeholder values:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET  # Get this in step 3
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Set Up Webhooks (For Testing)

### Option A: Using Stripe CLI (Recommended for Local Development)

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhook

# Copy the webhook signing secret (whsec_...) and add to .env.local
```

### Option B: Manual Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter: `http://localhost:3000/api/webhook` (or use a tunnel like ngrok)
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copy the webhook signing secret to `.env.local`

## 4. Test the Integration

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Add items to cart** at http://localhost:3000/menu

3. **Go to cart** and click "Proceed to Checkout"

4. **Use test card**: `4242 4242 4242 4242`
   - CVV: any 3 digits
   - Expiry: any future date
   - ZIP: any 5 digits

5. **Complete payment** and check console for webhook events

## 5. Implementation Examples

### Using Stripe Checkout (Current Implementation)

Already integrated in `CartSummary` component - just click the checkout button!

### Using Stripe Elements (Embedded Form)

Add to any page:

```tsx
import { StripeCheckout } from '@/components/checkout';
import { useCartStore } from '@/stores/cartStore';

export default function CheckoutPage() {
  const { items } = useCartStore();
  
  return (
    <StripeCheckout
      items={items}
      deliveryMethod="pickup"
      onSuccess={(paymentIntentId) => {
        console.log('Success!', paymentIntentId);
        // Redirect to success page
      }}
      onError={(error) => {
        console.error('Error:', error);
      }}
    />
  );
}
```

## Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0025 0000 3155 | Requires 3D Secure |

## Verification Checklist

- [ ] Stripe keys added to `.env.local`
- [ ] Dev server running
- [ ] Webhook endpoint configured
- [ ] Test payment successful
- [ ] Webhook events received (check console)

## Need Help?

See full documentation: [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)

## Production Deployment

Before going live:
1. Replace test keys with live keys (`pk_live_...` and `sk_live_...`)
2. Set up production webhook endpoint
3. Update `NEXT_PUBLIC_APP_URL` to your domain
4. Test end-to-end with live keys in test mode first
