import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ProductDetailWrapper } from '@/components/products/ProductDetailWrapper';
import productsData from '@/data/products.json';
import addonsData from '@/data/addons.json';
import type { Product, Addon } from '@/types';

const products = productsData.products as Product[];
const addons = addonsData.addons as Addon[];

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | YUM by Maryam',
    };
  }

  return {
    title: `${product.name} | YUM by Maryam`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProductIds = product.relatedProducts || [];
  const relatedProducts = products.filter((p) =>
    relatedProductIds.includes(p.id)
  );

  // Get all addons for product - filter by IDs in product
  const productAddons = addons.filter((addon) =>
    product.addons.includes(addon.id)
  );

  // Product JSON-LD structured data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `https://yumbymaryam.com.au${product.images[0]}`,
    brand: {
      '@type': 'Brand',
      name: 'YUM by Maryam',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...product.sizes.map(s => s.price)) / 100,
      highPrice: Math.max(...product.sizes.map(s => s.price)) / 100,
      priceCurrency: 'AUD',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'YUM by Maryam',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Sarah M.',
        },
        reviewBody: 'Absolutely delicious! The cakes are always fresh and beautifully decorated.',
        datePublished: '2025-12-15',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Michael T.',
        },
        reviewBody: 'Best custom cakes in Sydney! Highly recommend for special occasions.',
        datePublished: '2025-11-28',
      },
    ],
    category: product.category,
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://yumbymaryam.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Menu',
        item: 'https://yumbymaryam.com.au/menu',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://yumbymaryam.com.au/menu/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailWrapper 
        product={product} 
        addons={productAddons} 
        relatedProducts={relatedProducts}
      />
    </>
  );
}
