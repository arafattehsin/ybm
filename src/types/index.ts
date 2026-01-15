// Product Types
export interface Size {
  id: string;
  name: string;
  price: number; // in cents
}

export interface Addon {
  id: string;
  name: string;
  price: number; // in cents
}

export type CategorySlug = 'cakes' | 'cupcakes' | 'cookies' | 'desserts';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  sizes: Size[];
  addons: string[]; // addon IDs
  inStock: boolean;
  featured: boolean;
  sku?: string;
  weight?: string | null;
  relatedProducts: string[];
}

// Cart Types
export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  productName: string;
  image: string;
  size: Size;
  addons: Addon[];
  quantity: number;
  unitPrice: number; // in cents
  totalPrice: number; // in cents
}

// Testimonial Types
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
}
