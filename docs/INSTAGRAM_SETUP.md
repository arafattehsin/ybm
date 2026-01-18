# Instagram Integration Setup (2026 Update)

This project uses the **Instagram Graph API** to display real Instagram posts from your **@yumbymaryam** business account.

> **Note:** As of 2026, Meta requires Business apps for Instagram Business/Creator accounts. The older Basic Display API is deprecated.

## Prerequisites

- Instagram Business or Creator account (@yumbymaryam)
- The Instagram account must be connected to a Facebook Page

## Quick Setup

### 1. Create a Facebook Business App

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. **Important:** Choose **"Business"** as app type (NOT Consumer)
4. Fill in app details:
   - App Name: `YUM by Maryam Website`
   - App Contact Email: your email
5. Click "Create App"

### 2. Add Instagram Product

1. In your app dashboard, you'll see "Add products to your app"
2. Find **"Instagram"** in the product list
3. Click **"Set up"** on the Instagram product
4. This will add Instagram Graph API capabilities to your app

### 3. Configure Instagram Settings

1. In the left sidebar, go to **Instagram → Basic Display** (or Instagram settings)
2. Add your Instagram Business Account as a tester:
   - Scroll to "Instagram Testers" section
   - Click "Add Instagram Testers"
   - Enter your Instagram username: `yumbymaryam`
   - Click "Submit"
3. **Accept the invite on Instagram:**
   - Open Instagram app
   - Go to Settings → Apps and Websites → Tester Invites
   - Accept the invitation

### 4. Get Your Credentials

#### Get Instagram User ID:

1. In your app dashboard, go to **Instagram → Basic Display**
2. Scroll to "User Token Generator" section
3. Click "Generate Token" next to your Instagram account
4. Authorize the app
5. Copy the **User ID** and **Access Token** shown

Alternatively, you can get your User ID from Facebook Page settings connected to your Instagram account.

### 5. Add Environment Variables

Create or update `.env.local` in your project root:

```bash
INSTAGRAM_USER_ID="your_instagram_user_id"
INSTAGRAM_ACCESS_TOKEN="your_long_lived_access_token"
```

**That's it!** The token from the dashboard is already long-lived (60 days).

### 6. Verify Installation

Start your development server:

```bash
npm run dev
```

Visit the homepage. The Instagram section should now display the 6 most recent posts from @yumbymaryam.

## Token Expiration

Long-lived Instagram access tokens expire after approximately **60 days**.

Start your development server:

```bash
npm run dev
```

Visit the homepage. The Instagram section should now display the 6 most recent posts from @yumbymaryam.

## Token Expiration

Long-lived Instagram access tokens expire after approximately **60 days**.

**To refresh your token:**

1. Go back to your Meta app dashboard
2. Navigate to Instagram → Basic Display → User Token Generator
3. Click "Generate Token" again
4. Copy the new token to `.env.local`
5. Restart your development server

## Troubleshooting

### No posts showing up?

1. Check that both `INSTAGRAM_USER_ID` and `INSTAGRAM_ACCESS_TOKEN` are in your `.env.local` file
2. Verify the token hasn't expired (check server logs for API errors)
3. Ensure your Instagram account is added as a tester and you accepted the invite
4. Make sure the Instagram account has at least 6 posts
5. Verify your Instagram account is a Business or Creator account

### "Invalid OAuth access token"

Your token has expired or is invalid. Generate a new token from the Meta dashboard.

### "Unsupported get request"

Your Instagram account might not be a Business/Creator account, or you're using the wrong User ID.

### Posts not updating?

The Instagram feed is cached for 6 hours. To force refresh:

- Clear your Next.js cache: `rm -rf .next`
- Restart the dev server

## API Rate Limits

Instagram Graph API has the following limits:

- 200 requests per hour per user
- Standard rate limits apply

With 6-hour caching, you'll be well within these limits.

## Production Deployment

1. Add environment variables to your production environment:
   - `INSTAGRAM_USER_ID`
   - `INSTAGRAM_ACCESS_TOKEN`
2. Deploy as normal
3. The Instagram feed will work automatically

**Important:** Keep your access token secret. Never commit `.env.local` to git. Add it to `.gitignore`.

## Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Instagram Basic Display](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Access Tokens Guide](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)
