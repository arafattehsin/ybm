export type InstagramMediaItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
};

/**
 * Fetches Instagram media using Instagram Graph API (for Business/Creator accounts)
 * 
 * Requires:
 * - INSTAGRAM_USER_ID: Your Instagram Business/Creator account ID
 * - INSTAGRAM_ACCESS_TOKEN: Long-lived access token from Meta for Developers
 * 
 * @param limit - Number of posts to fetch (default: 12)
 * @returns Array of Instagram media items
 */
export async function getInstagramMedia(limit = 12): Promise<InstagramMediaItem[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  
  if (!token || !userId) {
    console.warn('Instagram credentials not found. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID.');
    return [];
  }

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "timestamp",
  ].join(",");

  // Using Instagram Graph API for Business accounts
  const url = `https://graph.instagram.com/${userId}/media?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 6 }, // Cache for 6 hours
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Instagram API error: ${res.status} ${res.statusText}`, errorText);
      return [];
    }

    const json = await res.json();
    return Array.isArray(json?.data) ? (json.data as InstagramMediaItem[]) : [];
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return [];
  }
}

