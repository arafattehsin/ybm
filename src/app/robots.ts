import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://yumbymaryam.com.au';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/getmein/',
          '/cart',
          '/success',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
