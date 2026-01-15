'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { generateId } from '@/lib/utils';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: generateId(),
          totalPrice: item.unitPrice * item.quantity,
        };

        // Check if same product with same size and addons exists
        const existingIndex = get().items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.size.id === item.size.id &&
            JSON.stringify(i.addons.map((a) => a.id).sort()) ===
              JSON.stringify(item.addons.map((a) => a.id).sort())
        );

        if (existingIndex > -1) {
          // Update quantity of existing item
          set((state) => ({
            items: state.items.map((i, index) =>
              index === existingIndex
                ? {
                    ...i,
                    quantity: i.quantity + item.quantity,
                    totalPrice: (i.quantity + item.quantity) * i.unitPrice,
                  }
                : i
            ),
          }));
        } else {
          // Add new item
          set((state) => ({
            items: [...state.items, newItem],
          }));
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  quantity,
                  totalPrice: quantity * i.unitPrice,
                }
              : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },
    }),
    {
      name: 'ybm-cart',
    }
  )
);
