# AGENTS.md - AI Agent Context for YUM by Maryam

This file provides essential context and instructions for AI agents working on the YUM by Maryam e-commerce website project.

## Project Overview

**Project Name:** YUM by Maryam  
**Type:** E-commerce bakery website  
**Tech Stack:** Next.js 16.1.1, TypeScript, React 19, Tailwind CSS, Zustand  
**Deployment:** Azure App Service (Basic B1)  
**Business:** Custom cake and dessert bakery based in Carlingford, Sydney (NSW 2118)

## Azure Infrastructure Details

**IMPORTANT:** Always use these credentials when connecting to Azure resources:

```
Tenant ID: 125bd290-a3b3-429d-b123-59dec98013ac
Subscription ID: 1e9eacda-6d42-49ed-bd87-ea08f12d2fcf

Cosmos DB Account: ybm-cosmos-db
Cosmos DB Endpoint: https://ybm-cosmos-db.documents.azure.com:443/
Cosmos DB Key: [Stored in .env.local - see environment variables section]
```

### Azure Resources

- **Cosmos DB:** NoSQL (Core SQL API), Serverless mode, Australia East region
- **App Service:** Basic B1 plan, Node.js 20 LTS, Australia East region
- **Location:** Australia East (Sydney) for lowest latency
- **Production URL:** https://ybm-production.azurewebsites.net

## Project Structure

```
ybm-website/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/               # Admin panel (orders, customers, analytics)
│   │   │   ├── auth/login/      # Admin authentication
│   │   │   ├── orders/          # Order management
│   │   │   ├── customers/       # Customer management
│   │   │   ├── analytics/       # Business analytics
│   │   │   └── settings/        # Admin settings
│   │   ├── api/                 # API routes
│   │   │   ├── checkout/        # Stripe checkout session creation
│   │   │   ├── webhook/         # Stripe webhook handler
│   │   │   ├── payments/        # Payment capture/cancel
│   │   │   └── admin/           # Admin API endpoints
│   │   ├── cart/                # Shopping cart page
│   │   ├── menu/                # Product menu
│   │   ├── success/             # Order success page
│   │   └── page.tsx             # Homepage
│   ├── components/
│   │   ├── cart/                # Cart components (CartItem, CartSummary)
│   │   ├── home/                # Homepage sections (Hero, Instagram, etc.)
│   │   ├── layout/              # Layout components (Header, Footer)
│   │   ├── products/            # Product display components
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── constants.ts         # Business constants, pricing utilities
│   │   ├── db.ts                # Database access layer (JSON-based, migrating to Cosmos DB)
│   │   ├── instagram.ts         # Instagram Graph API integration
│   │   ├── postcodes.ts         # Delivery zone and pricing logic
│   │   └── utils.ts             # Utility functions
│   ├── stores/
│   │   └── cartStore.ts         # Zustand cart state management
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── data/                    # Static JSON data (products, categories, etc.)
├── docs/
│   ├── INSTAGRAM_SETUP.md       # Instagram API setup guide
│   ├── STRIPE_SETUP.md          # Stripe payment setup guide
│   └── running-docs/            # Deployment and migration docs
├── scripts/
│   └── instagram-token.mjs      # Instagram token generation utility
├── public/
│   └── images/                  # Static images
├── .env.local                   # Environment variables (NOT in git)
└── admin-data.json              # Local JSON database (migrating to Cosmos DB)
```

## Core Features

### 1. E-Commerce Functionality

- **Product Catalog:** Custom cakes with sizes and add-ons
- **Shopping Cart:** Zustand-powered state management
- **Checkout:** Stripe integration with manual capture (authorize first, charge after confirmation)
- **Delivery Zones:** 11 custom zones (A-K) for Greater Sydney with dynamic pricing

### 2. Delivery System

**Base Location:** Carlingford, NSW 2118 (Zone A - FREE delivery)

**Delivery Zones:**

- Zone A (2118): FREE
- Zone B: $15 (12 postcodes)
- Zone C: $20 (2 postcodes)
- Zone D: $22 (17 postcodes)
- Zone E: $25 (33 postcodes)
- Zone F: $25 (38 postcodes)
- Zone G: $30 (47 postcodes)
- Zone H: $32 (26 postcodes)
- Zone I: $35 (22 postcodes)
- Zone J: $37 (9 postcodes)
- Zone K: $40 (16 postcodes)

**Delivery Times:**

- Pickup: 3-4 business days
- Delivery: 4-5 business days
- Delivery Window: 5 PM - 9 PM

**Key Rules:**

- 4 business days advance notice required
- Contact via WhatsApp only: +61422918748
- No SMS or calls for delivery coordination

### 3. Admin Panel

**Location:** `/admin`

**Features:**

- Dashboard with stats, charts, recent orders
- Order management with status tracking
- Customer database
- Analytics and reporting
- Settings management
- 2FA authentication (TOTP)

**Default Credentials (Development):**

- Email: admin@yumbymaryam.com
- Password: admin123
- 2FA: Not yet configured

### 4. Instagram Integration

**Account:** @yumbymaryam  
**API:** Instagram Graph API (Business App)  
**Features:** Display 6 latest posts on homepage

**Configuration:**

- App ID: 1410491010429610
- User ID: 17841439510792089
- Access Token: Long-lived (60-day expiry)

### 5. Payment Processing

**Provider:** Stripe  
**Mode:** Live Mode (production)  
**Strategy:** Manual capture (authorize on checkout, charge after order confirmation)
**Key Type:** Restricted key (enhanced security)

## Database Schema

### Current: JSON File (`admin-data.json`)

Migrating to Cosmos DB with the following containers:

### Container 1: `orders`

**Partition Key:** `/customer_id`

```typescript
interface Order {
  id: string; // Unique order ID
  order_id: string; // Display order number (e.g., YBM-1001)
  customer_id: string; // Reference to customer
  items: OrderItem[]; // Products ordered
  status: string; // pending | confirmed | preparing | out_for_delivery | delivered | cancelled
  payment_status: string; // authorized | captured | refunded | failed
  payment_intent_id?: string; // Stripe Payment Intent ID
  delivery_method: string; // pickup | delivery
  delivery_address?: Address; // Customer address (if delivery)
  delivery_fee: number; // Delivery cost in cents
  subtotal: number; // Order subtotal in cents
  total: number; // Total amount in cents
  notes?: string; // Order notes
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  assigned_to?: string; // Admin assigned
}
```

### Container 2: `customers`

**Partition Key:** `/id`

```typescript
interface Customer {
  id: string; // Unique customer ID
  name: string; // Full name
  email: string; // Email address
  phone: string; // Phone number
  addresses: Address[]; // Saved addresses
  total_spent: number; // Lifetime value in cents
  total_orders: number; // Number of orders
  last_order_date?: string; // ISO timestamp
  created_at: string; // ISO timestamp
}
```

### Container 3: `admins`

**Partition Key:** `/id`

```typescript
interface Admin {
  id: string; // Unique admin ID
  email: string; // Login email
  password: string; // Bcrypt hashed password
  name: string; // Full name
  role: string; // super_admin | admin | manager
  two_factor_enabled: number; // 0 | 1
  two_factor_method?: string; // totp | email
  two_factor_secret?: string; // TOTP secret (base32)
  last_login?: string; // ISO timestamp
  active: number; // 0 | 1
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
```

## Environment Variables

**Location:** `.env.local` (NEVER commit to git)

**Required Variables:**

```env
# Instagram API
INSTAGRAM_APP_ID=1410491010429610
INSTAGRAM_USER_ID=17841439510792089
INSTAGRAM_ACCESS_TOKEN=[60-day long-lived token]

# Stripe (Live Mode)
STRIPE_SECRET_KEY=rk_live_[restricted_key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[publishable_key]

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cosmos DB (add when migrating)
COSMOS_DB_CONNECTION_STRING=[connection string above]
COSMOS_DB_DATABASE_NAME=ybm-production
```

## Key Business Logic

### Postcode Validation & Delivery Fee Calculation

**File:** `src/lib/postcodes.ts`

```typescript
// Check if postcode is deliverable
const fee = getDeliveryFeeByPostcode(postcode);
if (fee === null) {
  // Postcode not in delivery range
}

// Returns fee in cents (0 for Zone A, 1500 for Zone B, etc.)
```

### Cart Management

**File:** `src/stores/cartStore.ts`

Uses Zustand for state management:

- Add/remove items
- Update quantities
- Calculate totals
- Persist to localStorage

### Order Workflow

1. **Customer adds items to cart**
2. **Selects delivery method** (pickup/delivery)
3. **If delivery:** Enters address, postcode auto-validates
4. **Clicks "Proceed to Checkout"**
5. **Stripe Checkout Session created** (authorize payment)
6. **Customer completes payment** in Stripe
7. **Webhook receives `payment_intent.succeeded`**
8. **Order saved to database** with status "pending"
9. **Admin reviews order** in admin panel
10. **Admin captures payment** (charges card)
11. **Order status updated** to "confirmed" → "preparing" → "out_for_delivery" → "delivered"

## API Routes

### Public APIs

**POST `/api/checkout`**

- Creates Stripe Checkout Session
- Validates delivery postcode
- Sets manual capture mode
- Returns checkout URL

**POST `/api/webhook`**

- Receives Stripe events
- Validates webhook signature
- Saves orders to database
- Updates payment status

**POST `/api/payments/capture`**

- Captures authorized payment
- Requires admin authentication

**POST `/api/payments/cancel`**

- Cancels authorized payment
- Refunds customer

### Admin APIs (Protected)

**GET `/api/admin/orders`**

- Lists all orders
- Filters by status, date range
- Pagination support

**GET `/api/admin/orders/[id]`**

- Get single order details

**PUT `/api/admin/orders/[id]`**

- Update order status
- Add notes

**GET `/api/admin/customers`**

- List all customers
- Search by name/email

**GET `/api/admin/analytics`**

- Business metrics
- Revenue stats
- Order trends

**POST `/api/admin/auth/login`**

- Admin login
- Returns JWT token

**POST `/api/admin/auth/verify-2fa`**

- Verify TOTP code
- Complete login

## Development Guidelines

### When Working with Orders

1. **Always validate postcodes** before allowing checkout
2. **Use manual capture** - never auto-charge
3. **Save delivery address** from Stripe checkout form
4. **Store payment_intent_id** for future capture/refund
5. **Update order status** through admin panel only

### When Working with Admin Panel

1. **Check authentication** on all admin routes
2. **Validate 2FA** when enabled
3. **Use Cosmos DB** for all data operations (once migrated)
4. **Log all admin actions** (future feature)

### When Working with Payments

1. **Use restricted Stripe keys** for enhanced security
2. **Verify webhook signature** always (critical for production)
3. **Handle failed payments** gracefully
4. **Support refunds** for cancelled orders
5. **Monitor Stripe Dashboard** for payment issues

### Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier with default config
- **Linting:** ESLint with Next.js rules
- **Components:** Functional components with hooks
- **State:** Zustand for global state, useState for local
- **Styling:** Tailwind CSS utility classes

## Migration Tasks (Upcoming)

### 1. Cosmos DB Migration

- [ ] Install `@azure/cosmos` package
- [ ] Create database client in `src/lib/cosmosdb.ts`
- [ ] Create containers: orders, customers, admins
- [ ] Migrate data from `admin-data.json`
- [ ] Update all API routes to use Cosmos DB
- [ ] Test CRUD operations
- [ ] Remove JSON file dependency

### 2. Webhook Integration

- [ ] Set up Stripe webhook endpoint in dashboard
- [ ] Configure webhook secret
- [ ] Handle `payment_intent.succeeded` event
- [ ] Create order in Cosmos DB on successful payment
- [ ] Create/update customer record
- [ ] Send confirmation email (future)

### 3. Email Notifications

- [ ] Sign up for Resend API
- [ ] Create email templates (customer confirmation, admin notification)
- [ ] Implement email sending in webhook handler
- [ ] Test email delivery
- [ ] Add email to admin notifications

### 4. 2FA Setup

- [ ] Install `speakeasy` and `qrcode` packages
- [ ] Implement TOTP generation
- [ ] Create QR code setup flow
- [ ] Store secrets in Cosmos DB
- [ ] Add backup codes
- [ ] Test authentication flow

## Testing Strategy

### Manual Testing Checklist

**Frontend:**

- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Apply delivery method
- [ ] Enter delivery address
- [ ] Validate postcode (valid, invalid, free delivery)
- [ ] Complete Stripe checkout
- [ ] Verify success page

**Admin Panel:**

- [ ] Login with credentials
- [ ] View dashboard stats
- [ ] List orders
- [ ] View order details
- [ ] Update order status
- [ ] Capture payment
- [ ] Cancel order
- [ ] View customers
- [ ] Check analytics

**Production Testing:**

- Use real payment cards in production
- Test postcode: 2118 (free), 2114 ($15), 2000 ($30)
- Monitor Stripe Dashboard for transactions
- Test order flow end-to-end before announcing

## Deployment

### Current Setup

- **Hosting:** Azure App Service (Basic B1)
- **Branch:** main (direct production deployment)
- **Build Command:** `npm run build`
- **Output Directory:** `.next/standalone`
- **Deployment:** GitHub Actions automated pipeline

### Environment Variables (Production)

Set in Azure App Service Configuration:

- All variables from `.env.local`
- Use production Stripe keys (rk*live*... restricted key)
- Production Cosmos DB connection string
- JWT secret for admin authentication
- Configure via Azure Portal or Azure CLI

## Common Issues & Solutions

### Issue 1: Checkout fails with "Failed to create checkout session"

**Solution:** Check that `NEXT_PUBLIC_APP_URL` is set in `.env.local`

### Issue 2: Postcode validation doesn't work

**Solution:** Ensure postcode is in postcodes.ts zones, use 4-digit format

### Issue 3: Admin panel shows no orders

**Solution:** Database not yet connected (migration pending), check Stripe Dashboard for now

### Issue 4: Instagram feed not loading

**Solution:** Access token expired (60 days), refresh token in Meta dashboard

### Issue 5: Delivery fee calculation returns null

**Solution:** Postcode not in any zone, add to appropriate zone in postcodes.ts

## Support Contacts

**Business Owner:** Maryam  
**WhatsApp:** +61422918748  
**Email:** hello@yumbymaryam.com  
**Instagram:** @yumbymaryam  
**Location:** 2 Thallon Street, Carlingford, NSW 2118

---

## Agent Instructions

When working on this project:

1. **Always reference this file** for context about architecture, Azure configuration, and business logic
2. **Use Azure credentials provided** at the top when connecting to Cosmos DB
3. **Never commit `.env.local`** or expose API keys
4. **Test with Stripe test mode** before any production deployment
5. **Validate postcodes** using the zones defined in `src/lib/postcodes.ts`
6. **Follow the order workflow** outlined above
7. **Check existing code** before adding new features - many features already exist
8. **Update this file** when making significant architectural changes

## Version History

- **v1.0** (2026-01-19): Initial AGENTS.md creation
  - Added Instagram integration
  - Configured 11 delivery zones
  - Set up Stripe checkout with manual capture
  - Built admin panel with JSON database
  - Next: Cosmos DB migration, webhook implementation, email notifications

---

**Last Updated:** January 19, 2026  
**Maintained By:** Development Team  
**For AI Agents:** This file provides complete project context for autonomous development
