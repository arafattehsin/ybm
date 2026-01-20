# Stripe Payment Integration Guide

## Overview

This project now includes a complete Stripe payment integration with:
- ✅ Stripe Checkout (Hosted payment page)
- ✅ Stripe Elements (Embedded payment form)
- ✅ Secure webhook handling
- ✅ TypeScript type safety
- ✅ Production-ready security practices

## Table of Contents

1. [Setup](#setup)
2. [Backend APIs](#backend-apis)
3. [Frontend Components](#frontend-components)
4. [Webhooks](#webhooks)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)

---

## Setup

### 1. Install Dependencies

Already installed:
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Configure Environment Variables

Update your `.env.local` file with your Stripe credentials:

```bash
# Get these from https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Get this after setting up webhooks (see Webhooks section)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Security Note**: Never commit `.env.local` to version control. Only commit `.env.local.example` with placeholder values.

---

## Backend APIs

### 1. Payment Intent API (`/api/payment-intent`)

Creates a PaymentIntent for Stripe Elements.

**Endpoint**: `POST /api/payment-intent`

**Request Body**:
```typescript
{
  items: CartItem[];
  deliveryMethod: 'pickup' | 'delivery';
  deliveryPostcode?: string;
  customerEmail?: string;
  customerName?: string;
  deliveryAddress?: DeliveryAddress;
}
```

**Response**:
```typescript
{
  clientSecret: string;
  paymentIntentId: string;
}
```

**Features**:
- Validates cart items and delivery postcode
- Calculates delivery fees automatically
- Stores order metadata for tracking
- Returns client secret for frontend payment confirmation

### 2. Checkout Session API (`/api/checkout`)

Creates a Stripe Checkout Session (hosted payment page).

**Endpoint**: `POST /api/checkout`

**Request Body**:
```typescript
{
  items: CheckoutItem[];
  deliveryMethod: 'pickup' | 'delivery';
  deliveryPostcode?: string;
}
```

**Response**:
```typescript
{
  url: string; // Redirect to this URL
}
```

### 3. Webhook Handler (`/api/webhook`)

Handles Stripe webhook events securely.

**Endpoint**: `POST /api/webhook`

**Handled Events**:
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment canceled
- `checkout.session.completed` - Checkout session completed
- `charge.succeeded` - Charge succeeded
- `charge.failed` - Charge failed

---

## Frontend Components

### 1. StripeCheckout Component

Embedded payment form using Stripe Elements.

**Location**: `src/components/checkout/StripeCheckout.tsx`

**Usage**:
```tsx
import { StripeCheckout } from '@/components/checkout';
import { useCartStore } from '@/stores/cartStore';

function CheckoutPage() {
  const { items } = useCartStore();

  return (
    <StripeCheckout
      items={items}
      deliveryMethod="delivery"
      deliveryPostcode="2150"
      customerEmail="customer@example.com"
      customerName="John Doe"
      onSuccess={(paymentIntentId) => {
        console.log('Payment successful!', paymentIntentId);
        router.push('/success');
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}
```

**Features**:
- Beautiful, customizable UI
- Real-time validation
- Loading states
- Error handling
- Automatic payment confirmation

### 2. QuickCheckoutButton Component

Simple button that redirects to Stripe Checkout.

**Location**: `src/components/checkout/QuickCheckoutButton.tsx`

**Usage**:
```tsx
import { QuickCheckoutButton } from '@/components/checkout';
import { useCartStore } from '@/stores/cartStore';

function Cart() {
  const { items } = useCartStore();

  return (
    <QuickCheckoutButton
      items={items}
      deliveryMethod="pickup"
      disabled={items.length === 0}
    />
  );
}
```

**Features**:
- One-click checkout
- Automatic Stripe Checkout redirect
- Loading states
- Error handling

### 3. CartSummary Component (Updated)

The existing CartSummary component already integrates with Stripe Checkout.

**Location**: `src/components/cart/CartSummary.tsx`

**Features**:
- Delivery method selection
- Postcode validation
- Address collection
- Integrated checkout button

---

## Webhooks

Webhooks allow Stripe to notify your application about payment events.

### Setup Stripe Webhooks

#### For Local Development:

1. **Install Stripe CLI**:
   ```bash
   # Windows (using Scoop)
   scoop install stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. **Copy the webhook signing secret** displayed in the terminal and add it to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxx...
   ```

#### For Production:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `checkout.session.completed`
   - `charge.succeeded`
   - `charge.failed`
5. Copy the webhook signing secret and add it to your production environment variables

### Webhook Security

The webhook handler includes:
- ✅ **Signature verification** - Ensures requests are from Stripe
- ✅ **Error handling** - Gracefully handles failures
- ✅ **Event logging** - Tracks all webhook events
- ✅ **Idempotency** - Handles duplicate events safely

---

## Testing

### Test Cards

Use these test cards in development:

| Scenario | Card Number | Any CVV | Any Future Date |
|----------|-------------|---------|-----------------|
| Success | 4242 4242 4242 4242 | Any | Any |
| Decline | 4000 0000 0000 0002 | Any | Any |
| Require 3D Secure | 4000 0025 0000 3155 | Any | Any |

### Testing Webhooks

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **In another terminal, start Stripe CLI**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

3. **Trigger test events**:
   ```bash
   # Simulate successful payment
   stripe trigger payment_intent.succeeded
   
   # Simulate failed payment
   stripe trigger payment_intent.payment_failed
   ```

4. **Check your server logs** to see webhook events being processed.

### Test Flow

1. Add items to cart
2. Go to cart page
3. Select delivery method
4. Click "Proceed to Checkout"
5. Enter test card: `4242 4242 4242 4242`
6. Complete payment
7. Check console/logs for webhook events

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Replace test API keys with live keys
- [ ] Set up production webhooks in Stripe Dashboard
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Enable webhook signature verification
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Test payment flow end-to-end
- [ ] Review Stripe Dashboard settings

### Environment Variables for Production

```bash
# Production Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Production URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Security Best Practices

1. **API Keys**:
   - Never commit secret keys to version control
   - Use environment variables for all sensitive data
   - Rotate keys periodically
   - Use different keys for test and production

2. **Webhook Security**:
   - Always verify webhook signatures
   - Use HTTPS in production
   - Log webhook events for debugging
   - Implement rate limiting if needed

3. **Payment Flow**:
   - Validate amounts on the server side
   - Never trust client-side calculations
   - Store order data before payment
   - Handle idempotency for webhooks

4. **Error Handling**:
   - Log all errors securely
   - Show user-friendly error messages
   - Never expose sensitive data in errors
   - Monitor failed payments

---

## Stripe Utility Functions

**Location**: `src/lib/stripe.ts`

Utility functions provided:

```typescript
// Format amount for display
formatAmount(1000) // Returns "$10.00"

// Validate payment amount
isValidAmount(1000) // Returns true if valid

// Calculate order total
calculateOrderTotal(subtotal, delivery, taxRate)
```

---

## Database Integration (TODO)

The webhook handlers include commented sections for database integration:

```typescript
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // TODO: Save order to database
  /*
  await db.orders.create({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    status: 'paid',
    items: JSON.parse(paymentIntent.metadata.items || '[]'),
    customerEmail: paymentIntent.metadata.customer_email,
    createdAt: new Date(),
  });
  */
  
  // TODO: Send confirmation email
  // TODO: Update inventory
  // TODO: Trigger fulfillment
}
```

When you're ready to add database persistence:
1. Choose your database (PostgreSQL, MongoDB, etc.)
2. Create an orders table/collection
3. Uncomment and implement the database logic in webhook handlers

---

## Troubleshooting

### Common Issues

1. **"No such PaymentIntent"**
   - Ensure you're using the correct Stripe account (test vs. live)
   - Verify API keys are set correctly

2. **Webhook signature verification failed**
   - Make sure `STRIPE_WEBHOOK_SECRET` is set correctly
   - Check that the endpoint URL matches exactly
   - Ensure you're using raw request body (Next.js handles this)

3. **Payment amount validation failed**
   - Check that amounts are in cents (not dollars)
   - Ensure amount is within min/max limits

4. **CORS errors**
   - Stripe APIs don't have CORS issues
   - If seeing CORS, check your API route configuration

### Debug Mode

To see detailed Stripe logs:

```typescript
// In src/lib/stripe.ts
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  maxNetworkRetries: 2,
  // Enable request logging
  telemetry: false,
});
```

---

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)

---

## Currency Configuration

Current configuration: **USD (US Dollars)**

To change currency:
1. Update `CURRENCY` constant in `src/lib/stripe.ts`
2. Update Stripe Dashboard settings
3. Test with appropriate test cards for your region

---

## Next Steps

1. ✅ Installation complete
2. ✅ Backend APIs created
3. ✅ Frontend components ready
4. ✅ Webhook handler implemented
5. 🔄 Configure your Stripe keys
6. 🔄 Test payment flow
7. 🔄 Set up webhooks
8. 🔄 Add database integration (optional)
9. 🔄 Deploy to production

---

**Need help?** Check the inline comments in the code files for detailed explanations of each function and component.
