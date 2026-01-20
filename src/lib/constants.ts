// Business Information
export const BUSINESS = {
  name: 'YUM by Maryam',
  tagline: 'Homemade desserts with love',
  abn: '93 560 851 560',
  location: 'Greater Sydney region, NSW',
  email: 'hello@yumbymaryam.com.au',
  social: {
    facebook: 'https://fb.com/yumbymaryam',
    instagram: 'https://instagram.com/yumbymaryam',
    twitter: 'https://twitter.com/arafattehsin',
    linkedin: 'https://www.linkedin.com/company/yumbymaryam/',
  },
} as const;

// Design Tokens - extracted from live site
export const COLORS = {
  // Primary colors
  primary: '#212121', // Dark text
  primaryLight: '#424242',
  
  // Accent colors (warm brown/gold tones from dessert theme)
  accent: '#C9A86C', // Gold accent
  accentDark: '#8B7355',
  
  // Neutral colors
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  lightGray: '#F5F5F5',
  gray: '#9E9E9E',
  darkGray: '#616161',
  
  // Semantic colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  
  // Background
  background: '#FFFFFF',
  backgroundAlt: '#F8F8F8',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// Typography
export const FONTS = {
  heading: '"Playfair Display", Georgia, serif',
  body: '"Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

// Announcement Banner
export const ANNOUNCEMENT = {
  message: "We're taking orders for pick-ups 🛻 and deliveries across the Greater Sydney region 🚚",
  dismissible: true,
} as const;

// Currency
export const CURRENCY = {
  code: 'AUD',
  symbol: '$',
  locale: 'en-AU',
} as const;

// Format price from cents to display string
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
  }).format(cents / 100);
}

// Format price range
export function formatPriceRange(sizes: { price: number }[]): string {
  if (sizes.length === 0) return '';
  if (sizes.length === 1) return formatPrice(sizes[0].price);
  
  const prices = sizes.map(s => s.price).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

