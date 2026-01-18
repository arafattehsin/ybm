import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

  return (
    <ProductDetailWrapper 
      product={product} 
      addons={productAddons} 
      relatedProducts={relatedProducts}
    />
  );
}
