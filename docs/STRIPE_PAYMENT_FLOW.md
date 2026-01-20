# Stripe Payment Flow Architecture

## Overview
This document visualizes how payments flow through the system.

---

## Flow 1: Stripe Checkout (Hosted Page)

```
┌─────────────┐
│   Customer  │
│  Adds Items │
│   to Cart   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Cart Page (CartSummary)        │
│  - Select delivery method           │
│  - Enter delivery details           │
│  - See total amount                 │
└──────┬──────────────────────────────┘
       │
       │ Click "Proceed to Checkout"
       ▼
┌─────────────────────────────────────┐
│   POST /api/checkout                │
│  - Validates cart items             │
│  - Calculates delivery fee          │
│  - Creates Checkout Session         │
└──────┬──────────────────────────────┘
       │
       │ Returns Stripe URL
       ▼
┌─────────────────────────────────────┐
│    Stripe Checkout Page             │
│  (Hosted by Stripe)                 │
│  - Customer enters payment info     │
│  - Stripe processes payment         │
└──────┬──────────────────────────────┘
       │
       │ Payment Complete
       ▼
┌─────────────────────────────────────┐
│   Redirect to Success Page          │
│   /success?session_id=...           │
└─────────────────────────────────────┘

       │
       │ Meanwhile...
       ▼
┌─────────────────────────────────────┐
│   Stripe sends webhook              │
│   POST /api/webhook                 │
│  - checkout.session.completed       │
│  - payment_intent.succeeded         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Webhook Handler                   │
│  - Verify signature                 │
│  - Save order to DB (TODO)          │
│  - Send confirmation email (TODO)   │
│  - Update inventory (TODO)          │
└─────────────────────────────────────┘
```

---

## Flow 2: Stripe Elements (Embedded Form)

```
┌─────────────┐
│   Customer  │
│  Adds Items │
│   to Cart   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Checkout Page                     │
│   <StripeCheckout />                │
│  - Shows order summary              │
│  - Click "Proceed to Payment"       │
└──────┬──────────────────────────────┘
       │
       │ User clicks button
       ▼
┌─────────────────────────────────────┐
│   POST /api/payment-intent          │
│  - Validates cart items             │
│  - Calculates total                 │
│  - Creates PaymentIntent            │
│  - Returns client_secret            │
└──────┬──────────────────────────────┘
       │
       │ Receives client_secret
       ▼
┌─────────────────────────────────────┐
│   Stripe Elements Form Loads        │
│  (Embedded in your page)            │
│  - Customer enters card details     │
│  - Real-time validation             │
└──────┬──────────────────────────────┘
       │
       │ Customer submits form
       ▼
┌─────────────────────────────────────┐
│   stripe.confirmPayment()           │
│  - Stripe processes payment         │
│  - Handles 3D Secure if needed      │
└──────┬──────────────────────────────┘
       │
       │ Success or Error
       ▼
┌─────────────────────────────────────┐
│   onSuccess / onError Callback      │
│  - Show confirmation                │
│  - Clear cart                       │
│  - Redirect to success page         │
└─────────────────────────────────────┘

       │
       │ Meanwhile...
       ▼
┌─────────────────────────────────────┐
│   Stripe sends webhook              │
│   POST /api/webhook                 │
│  - payment_intent.succeeded         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Webhook Handler                   │
│  - Verify signature                 │
│  - Save order to DB (TODO)          │
│  - Send confirmation email (TODO)   │
└─────────────────────────────────────┘
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Client)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐    ┌──────────────────────┐       │
│  │   CartPage     │    │   CheckoutPage       │       │
│  │                │    │                      │       │
│  │  CartSummary ──┼───▶│  StripeCheckout      │       │
│  │  - Items       │    │  - Payment Form      │       │
│  │  - Delivery    │    │  - Stripe Elements   │       │
│  │  - Total       │    │  - Submit Button     │       │
│  └────────┬───────┘    └──────────┬───────────┘       │
│           │                       │                    │
└───────────┼───────────────────────┼────────────────────┘
            │                       │
            │ API Calls             │ API Calls
            ▼                       ▼
┌─────────────────────────────────────────────────────────┐
│                Backend (Server - Next.js)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   /checkout  │  │ /payment-    │  │  /webhook   │  │
│  │   route.ts   │  │  intent      │  │  route.ts   │  │
│  │              │  │  route.ts    │  │             │  │
│  │  Creates     │  │              │  │  Receives   │  │
│  │  Checkout    │  │  Creates     │  │  Stripe     │  │
│  │  Session     │  │  Payment     │  │  Events     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────▲──────┘  │
│         │                 │                  │         │
│         └────────┬────────┘                  │         │
│                  │                           │         │
│         ┌────────▼─────────┐                 │         │
│         │  stripe.ts       │                 │         │
│         │  (Utility)       │                 │         │
│         │  - Init Stripe   │                 │         │
│         │  - Formatters    │                 │         │
│         │  - Validators    │                 │         │
│         └──────────────────┘                 │         │
│                                              │         │
└──────────────────────────────────────────────┼─────────┘
                                               │
                    API Calls                  │ Webhooks
                         ▼                     │
┌─────────────────────────────────────────────▼───────────┐
│                   Stripe API                            │
├─────────────────────────────────────────────────────────┤
│  - Payment Processing                                   │
│  - Card Validation                                      │
│  - 3D Secure                                            │
│  - Event Generation                                     │
│  - PCI Compliance                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                      │
└─────────────────────────────────────────────────────────┘

1. Environment Variables
   ┌──────────────────────────┐
   │ .env.local (not in git)  │
   │ - STRIPE_SECRET_KEY      │
   │ - WEBHOOK_SECRET         │
   │ - PUBLISHABLE_KEY        │
   └──────────────────────────┘
              │
              ▼
2. Server-side Validation
   ┌──────────────────────────┐
   │ API Routes               │
   │ - Validate amounts       │
   │ - Check postcodes        │
   │ - Verify items           │
   └──────────────────────────┘
              │
              ▼
3. Stripe Processing
   ┌──────────────────────────┐
   │ Stripe Secure Payment    │
   │ - PCI Compliant          │
   │ - Encrypted              │
   │ - 3D Secure              │
   └──────────────────────────┘
              │
              ▼
4. Webhook Verification
   ┌──────────────────────────┐
   │ Signature Check          │
   │ - HMAC verification      │
   │ - Event validation       │
   │ - Replay prevention      │
   └──────────────────────────┘
```

---

## Data Flow

### Order Metadata Flow

```
Cart Items (Frontend)
    └─> CartItem[]
         │
         ▼
API Validation (Backend)
    └─> Validated + Calculated
         │
         ▼
Stripe PaymentIntent/Checkout Session
    └─> metadata: {
         items: JSON,
         delivery_method: string,
         delivery_postcode: string,
         delivery_fee: string,
         customer_email: string,
         ...
        }
         │
         ▼
Webhook Event (Backend)
    └─> Extract metadata
         │
         ▼
Database (TODO)
    └─> Save order with full details
```

---

## Error Handling Flow

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
   ┌──────────┐
   │ Try...   │
   └────┬─────┘
        │
        ▼
┌──────────────────┐
│ API Call         │
└────┬─────────┬───┘
     │         │
Success       Error
     │         │
     ▼         ▼
┌─────────┐ ┌──────────────┐
│ Process │ │ Catch Block  │
│ Payment │ │ - Log error  │
└─────────┘ │ - Show user  │
            │ - Rollback   │
            └──────────────┘
```

---

## Webhook Event Timeline

```
T+0ms    Payment Initiated
         └─> Customer submits form

T+100ms  Payment Processing
         └─> Stripe validates card

T+500ms  Payment Authorized
         └─> webhook: payment_intent.processing

T+2s     Payment Captured
         └─> webhook: payment_intent.succeeded

T+2.1s   Charge Created
         └─> webhook: charge.succeeded

T+3s     Checkout Complete (if using Checkout)
         └─> webhook: checkout.session.completed

T+3.5s   Your Backend Processes
         └─> Save to DB
         └─> Send email
         └─> Update inventory
```

---

## Testing Flow

```
Development                Production
    │                          │
    ▼                          ▼
┌──────────┐             ┌──────────┐
│ Test     │             │ Live     │
│ Keys     │             │ Keys     │
│ pk_test_ │             │ pk_live_ │
│ sk_test_ │             │ sk_live_ │
└────┬─────┘             └────┬─────┘
     │                        │
     ▼                        ▼
┌──────────┐             ┌──────────┐
│ Stripe   │             │ Stripe   │
│ CLI      │             │ Webhook  │
│ Forward  │             │ Endpoint │
└────┬─────┘             └────┬─────┘
     │                        │
     ▼                        ▼
┌──────────┐             ┌──────────┐
│ Local    │             │ Prod     │
│ Webhook  │             │ Webhook  │
│ :3000    │             │ Domain   │
└──────────┘             └──────────┘
```

---

## Key Takeaways

1. **Two Payment Methods Available**:
   - Stripe Checkout: Redirect to Stripe-hosted page (current)
   - Stripe Elements: Embedded form (new option)

2. **Security First**:
   - All sensitive data handled server-side
   - Webhook signature verification
   - PCI compliance through Stripe

3. **Webhooks Are Critical**:
   - Ensure payment confirmation
   - Handle async events
   - Reliable even if user closes browser

4. **Metadata Tracking**:
   - All order info stored in PaymentIntent
   - Accessible in webhooks
   - No database required initially

5. **Error Handling**:
   - Graceful failures
   - User-friendly messages
   - Comprehensive logging

---

**For implementation details, see**: `STRIPE_INTEGRATION.md`
**For quick setup, see**: `STRIPE_QUICKSTART.md`
