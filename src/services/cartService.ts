import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';
import { Product } from './productService';

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  user_name?: string | null;
  user_email?: string | null;
  products?: Product; // Nested relation from Supabase JOIN
}

export const cartService = {
  /**
   * Fetches cart items for a specific user
   */
  async getCart(userId: string): Promise<ServiceResponse<CartItem[]>> {
    console.log("Fetch start: getCart for user", userId);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products:product_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log("Fetch complete: getCart success. Count:", data?.length);
      return { data: data as CartItem[], error: null };
    } catch (err: any) {
      console.error("Fetch error: getCart failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Adds an item to the user's cart (or increments quantity if already exists)
   */
  async addToCart(
    userId: string, 
    productId: number, 
    quantity: number = 1, 
    userEmail?: string | null, 
    userName?: string | null
  ): Promise<ServiceResponse<CartItem>> {
    console.log("Fetch start: addToCart product", productId, "quantity", quantity);
    try {
      // 1. Check if the item already exists in the cart
      const { data: existingItems, error: selectError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (selectError) throw selectError;

      if (existingItems && existingItems.length > 0) {
        // 2. If exists, update quantity, email, and name
        const newQuantity = existingItems[0].quantity + quantity;
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            user_email: userEmail || null,
            user_name: userName || null
          })
          .eq('id', existingItems[0].id)
          .select('*, products:product_id(*)')
          .single();

        if (error) throw error;
        console.log("Fetch complete: addToCart update success");
        return { data: data as CartItem, error: null };
      } else {
        // 3. Otherwise, insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: quantity,
            user_email: userEmail || null,
            user_name: userName || null
          })
          .select('*, products:product_id(*)')
          .single();

        if (error) throw error;
        console.log("Fetch complete: addToCart insert success");
        return { data: data as CartItem, error: null };
      }
    } catch (err: any) {
      console.error("Fetch error: addToCart failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Updates quantity of a specific cart item
   */
  async updateQuantity(cartItemId: number, quantity: number): Promise<ServiceResponse<CartItem>> {
    console.log("Fetch start: updateQuantity item", cartItemId, "to", quantity);
    try {
      if (quantity <= 0) {
        // Delete item if quantity is zero or less
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', cartItemId);

        if (error) throw error;
        console.log("Fetch complete: updateQuantity deleted item");
        return { data: null, error: null };
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select('*, products:product_id(*)')
        .single();

      if (error) throw error;

      console.log("Fetch complete: updateQuantity success");
      return { data: data as CartItem, error: null };
    } catch (err: any) {
      console.error("Fetch error: updateQuantity failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Removes an item from the cart
   */
  async removeFromCart(cartItemId: number): Promise<ServiceResponse<void>> {
    console.log("Fetch start: removeFromCart item", cartItemId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      console.log("Fetch complete: removeFromCart success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: removeFromCart failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Clears the user's cart (e.g. after order placement)
   */
  async clearCart(userId: string): Promise<ServiceResponse<void>> {
    console.log("Fetch start: clearCart for user", userId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      console.log("Fetch complete: clearCart success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: clearCart failed", err);
      return { data: null, error: err };
    }
  }
};
