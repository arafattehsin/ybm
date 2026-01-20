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

// Payment Types
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CheckoutData {
  items: CartItem[];
  subtotal: number; // in cents
  delivery: number; // in cents
  total: number; // in cents
  customerEmail?: string;
  customerName?: string;
  deliveryAddress?: DeliveryAddress;
}

export interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface PaymentStatus {
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export interface OrderData {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  items: CartItem[];
  customerEmail?: string;
  customerName?: string;
  deliveryAddress?: DeliveryAddress;
  createdAt: string;
}

