# YUM by Maryam - Deployment Guide

## Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Stripe:**

   - Copy `.env.example` to `.env.local`
   - Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Update `.env.local` with your keys:
     ```
     STRIPE_SECRET_KEY=sk_test_YOUR_KEY
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Stripe Setup

### Payment Flow

The site uses **Stripe Checkout** - customers are redirected to Stripe's hosted checkout page for payment.

### Required Steps:

1. **Get Stripe Keys:**

   - Sign up at [stripe.com](https://stripe.com)
   - Get Test API keys from Dashboard → Developers → API keys
   - For production: Switch to Live mode and get Live keys

2. **Configure Webhook (for order tracking):**

   ```bash
   # Test locally with Stripe CLI
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   This will give you a webhook secret starting with `whsec_...`

   Add it to `.env.local`:

   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   ```

3. **Production Webhook:**
   - In Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com.au/api/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the signing secret to your production environment variables

### Shipping Options

Configured in `src/app/api/checkout/route.ts`:

- **Pickup (Free)** - 1-2 business days
- **Local Delivery ($15)** - 1-3 business days

## Deploy to Azure Static Web Apps

### Prerequisites

- Azure account with credits
- Azure Static Web Apps Free tier ($0/month)

### Deployment Steps:

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Azure Static Web App:**

   - Go to [Azure Portal](https://portal.azure.com)
   - Create Resource → Static Web Apps
   - Link your GitHub repository
   - Build preset: **Next.js**
   - App location: `/`
   - Output location: `.next`

3. **Configure Environment Variables:**
   In Azure Portal → Your Static Web App → Configuration:

   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_SECRET
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com.au
   ```

4. **Configure Custom Domain:**
   - In Azure Portal → Custom domains
   - Add `yumbymaryam.com.au`
   - Update DNS records with your domain registrar
   - Enable free SSL certificate

### GitHub Actions Workflow

Azure automatically creates a workflow file. The build happens automatically on every push to main.

## Update Products

Products are stored in `src/data/products.json`. To add/edit:

1. Edit the JSON file directly
2. Commit and push to GitHub
3. Azure will rebuild and deploy automatically (~2 minutes)

No database needed! All product data is bundled at build time.

## Post-Deployment Tasks

1. **Test Stripe in Production:**

   - Place a test order
   - Verify checkout works
   - Check webhook events in Stripe Dashboard

2. **Monitor Errors:**

   - Check Azure Application Insights
   - Review Stripe Dashboard for payment issues

3. **Update Content:**
   - Products: Edit `src/data/products.json`
   - Categories: Edit `src/data/categories.json`
   - Add-ons: Edit `src/data/addons.json`
   - Testimonials: Edit `src/data/testimonials.json`

## Cost Breakdown

- **Azure Static Web Apps:** $0/month (Free tier)
- **Stripe Fees:** 1.75% + 30¢ per successful charge (standard Australian rates)
- **Domain (existing):** Already owned
- **Total monthly cost:** $0 hosting + Stripe transaction fees only

## Support

For Stripe issues: [stripe.com/support](https://stripe.com/support)
For Azure issues: [Azure Support](https://azure.microsoft.com/support)
