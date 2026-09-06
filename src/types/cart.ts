import type { CartItem as GuestCartItem } from "@/store/cart";

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  variantName: string;
  variantColor: string | null;
  thumbnailUrl: string | null;
  price: string;
  compareAtPrice: string | null;
  quantity: number;
  stock: number;
  lineTotal: string;
  dimensions: string | null;
  materials: string | null;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: string;
}

export interface AddToCartInput {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export type CartLineItem = GuestCartItem;
