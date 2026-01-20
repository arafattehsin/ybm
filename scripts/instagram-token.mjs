#!/usr/bin/env node

/**
 * Instagram Token Generation Script
 *
 * This script helps you obtain a long-lived Instagram access token (60 days).
 *
 * Setup:
 * 1. Create a Facebook App at https://developers.facebook.com
 * 2. Add "Instagram Basic Display" product
 * 3. Configure OAuth Redirect URIs (e.g., http://localhost:3000/)
 * 4. Set environment variables:
 *    - INSTAGRAM_APP_ID
 *    - INSTAGRAM_APP_SECRET
 *    - INSTAGRAM_REDIRECT_URI
 *
 * Usage:
 *
 * Step 1 - Get authorization URL:
 *   node scripts/instagram-token.mjs
 *
 * Step 2 - After visiting the URL and authorizing, you'll get a code:
 *   node scripts/instagram-token.mjs --code YOUR_AUTH_CODE --write-env
 *
 * The token will be written to .env.local as INSTAGRAM_ACCESS_TOKEN
 */

import { writeFileSync, appendFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const APP_ID = process.env.INSTAGRAM_APP_ID;
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI =
  process.env.INSTAGRAM_REDIRECT_URI || "http://localhost:3000/";

async function getShortLivedToken(code) {
  const url = `https://api.instagram.com/oauth/access_token`;

  const formData = new URLSearchParams({
    client_id: APP_ID,
    client_secret: APP_SECRET,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code: code,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get short-lived token: ${error}`);
  }

  return await response.json();
}

async function getLongLivedToken(shortToken) {
  const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get long-lived token: ${error}`);
  }

  return await response.json();
}

function writeToEnvFile(token) {
  const envPath = join(__dirname, "..", ".env.local");
  const tokenLine = `INSTAGRAM_ACCESS_TOKEN=${token}\n`;

  try {
    let content = "";
    try {
      content = readFileSync(envPath, "utf8");
    } catch (err) {
      // File doesn't exist, will create it
    }

    if (content.includes("INSTAGRAM_ACCESS_TOKEN=")) {
      // Replace existing token
      const lines = content.split("\n");
      const newLines = lines.map((line) =>
        line.startsWith("INSTAGRAM_ACCESS_TOKEN=")
          ? `INSTAGRAM_ACCESS_TOKEN=${token}`
          : line,
      );
      writeFileSync(envPath, newLines.join("\n"));
      console.log("\n✅ Updated INSTAGRAM_ACCESS_TOKEN in .env.local");
    } else {
      // Append new token
      appendFileSync(envPath, `\n${tokenLine}`);
      console.log("\n✅ Added INSTAGRAM_ACCESS_TOKEN to .env.local");
    }
  } catch (err) {
    console.error("Error writing to .env.local:", err.message);
    console.log("\nAdd this to your .env.local file manually:");
    console.log(tokenLine);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const codeIndex = args.indexOf("--code");
  const writeEnv = args.includes("--write-env");

  if (!APP_ID || !APP_SECRET) {
    console.error("❌ Error: Missing required environment variables");
    console.log("\nPlease set:");
    console.log("  INSTAGRAM_APP_ID");
    console.log("  INSTAGRAM_APP_SECRET");
    console.log(
      "  INSTAGRAM_REDIRECT_URI (optional, defaults to http://localhost:3000/)",
    );
    process.exit(1);
  }

  if (codeIndex === -1) {
    // Step 1: Show authorization URL
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;

    console.log("\n📱 Instagram Token Setup - Step 1");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n1. Visit this URL in your browser:");
    console.log(`\n   ${authUrl}\n`);
    console.log("2. Log in with your Instagram account");
    console.log("3. Authorize the app");
    console.log('4. Copy the "code" parameter from the redirect URL');
    console.log("\n5. Run this script again with the code:");
    console.log(
      `\n   node scripts/instagram-token.mjs --code YOUR_CODE --write-env\n`,
    );
    return;
  }

  // Step 2: Exchange code for tokens
  const code = args[codeIndex + 1];

  if (!code) {
    console.error("❌ Error: No authorization code provided");
    console.log(
      "\nUsage: node scripts/instagram-token.mjs --code YOUR_CODE --write-env",
    );
    process.exit(1);
  }

  console.log("\n🔄 Exchanging authorization code for tokens...\n");

  try {
    // Get short-lived token
    const shortTokenData = await getShortLivedToken(code);
    console.log("✓ Short-lived token obtained");

    // Exchange for long-lived token
    const longTokenData = await getLongLivedToken(shortTokenData.access_token);
    console.log("✓ Long-lived token obtained");

    console.log("\n📋 Token Information:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`User ID: ${shortTokenData.user_id}`);
    console.log(
      `Expires in: ${longTokenData.expires_in} seconds (~${Math.round(longTokenData.expires_in / 86400)} days)`,
    );
    console.log(
      `\nAccess Token: ${longTokenData.access_token.substring(0, 50)}...`,
    );

    if (writeEnv) {
      writeToEnvFile(longTokenData.access_token);
    } else {
      console.log(
        "\n💡 To write this token to .env.local, run with --write-env flag",
      );
    }

    console.log("\n✅ Success! Your Instagram feed is ready to use.");
    console.log("\n⚠️  Remember: Long-lived tokens expire after ~60 days.");
    console.log("    Run this script again before expiration to refresh.\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\nTroubleshooting:");
    console.log("  • Make sure your Facebook App is properly configured");
    console.log("  • Verify the redirect URI matches your app settings");
    console.log(
      "  • Check that the authorization code hasn't expired (use it immediately)",
    );
    console.log(
      "  • Ensure Instagram Basic Display product is added to your app\n",
    );
    process.exit(1);
  }
}

main();
