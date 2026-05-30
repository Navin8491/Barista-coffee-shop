import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService, CartItem as DbCartItem } from '../services/cartService';

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  image_url?: string | null;
  category?: string | null;
  qty: number;
  cartItemId?: number;
}

interface CartContextType {
  cartItems: CartProduct[];
  cartLoading: boolean;
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (product: { id: number; name: string; price: number; image_url?: string; category?: string }, qty?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQty: (productId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }
    setCartLoading(true);
    try {
      const { data, error } = await cartService.getCart(user.id);
      if (error) throw error;
      if (data) {
        const mapped = data.map((item: DbCartItem) => ({
          id: Number(item.product_id),
          name: item.products?.name || '',
          price: Number(item.products?.price || 0),
          image: item.products?.image_url || '',
          category: item.products?.category || '',
          qty: item.quantity,
          cartItemId: Number(item.id)
        }));
        setCartItems(mapped);
      }
    } catch (err) {
      console.error("Fetch error: cart fetch failed in context:", err);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  const addToCart = async (product: { id: number; name: string; price: number; image_url?: string; category?: string }, qty: number = 1) => {
    if (!user) {
      throw new Error("You must be logged in to add items to your cart.");
    }

    const existing = cartItems.find(i => i.id === product.id);
    const newQty = existing ? existing.qty + qty : qty;

    // Optimistic Update
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, qty: newQty } : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '',
        category: product.category || '',
        qty: qty
      }];
    });

    try {
      const { data, error } = await cartService.addToCart(user.id, product.id, qty);
      if (error) throw error;
      await fetchCart(); // Sync from DB to ensure IDs are correctly aligned
    } catch (err) {
      console.error("Error adding to cart:", err);
      await fetchCart(); // Rollback/Sync on error
      throw err;
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;
    const existing = cartItems.find(i => i.id === productId);
    if (!existing || !existing.cartItemId) return;

    // Optimistic Update
    setCartItems(prev => prev.filter(i => i.id !== productId));

    try {
      const { error } = await cartService.removeFromCart(existing.cartItemId);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
      await fetchCart();
      throw err;
    }
  };

  const updateQty = async (productId: number, qty: number) => {
    if (!user) return;
    const existing = cartItems.find(i => i.id === productId);
    if (!existing || !existing.cartItemId) return;

    // Optimistic Update
    setCartItems(prev => {
      if (qty <= 0) {
        return prev.filter(i => i.id !== productId);
      }
      return prev.map(i => i.id === productId ? { ...i, qty } : i);
    });

    try {
      const { error } = await cartService.updateQuantity(existing.cartItemId, qty);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity in cart:", err);
      await fetchCart();
      throw err;
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setCartItems([]);
    try {
      const { error } = await cartService.clearCart(user.id);
      if (error) throw error;
    } catch (err) {
      console.error("Error clearing cart:", err);
      await fetchCart();
      throw err;
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartLoading, cartCount, fetchCart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
