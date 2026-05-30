import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';
import { Product } from './productService';

export interface Favorite {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
  products?: Product;
}

export const favoriteService = {
  /**
   * Fetches all favorites for a specific user
   */
  async getFavorites(userId: string): Promise<ServiceResponse<Favorite[]>> {
    console.log("Fetch start: getFavorites for user", userId);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, products:product_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Fetch complete: getFavorites success. Count:", data?.length);
      return { data: data as Favorite[], error: null };
    } catch (err: any) {
      console.error("Fetch error: getFavorites failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Adds a product to the user's favorites
   */
  async addFavorite(userId: string, productId: number): Promise<ServiceResponse<Favorite>> {
    console.log("Fetch start: addFavorite product", productId);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          product_id: productId
        })
        .select('*, products:product_id(*)')
        .single();

      if (error) throw error;

      console.log("Fetch complete: addFavorite success");
      return { data: data as Favorite, error: null };
    } catch (err: any) {
      console.error("Fetch error: addFavorite failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Removes a product from the user's favorites by user_id and product_id
   */
  async removeFavorite(userId: string, productId: number): Promise<ServiceResponse<void>> {
    console.log("Fetch start: removeFavorite product", productId);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;

      console.log("Fetch complete: removeFavorite success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: removeFavorite failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Removes a favorite by its individual ID
   */
  async removeFavoriteById(favoriteId: number): Promise<ServiceResponse<void>> {
    console.log("Fetch start: removeFavoriteById favorite", favoriteId);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      console.log("Fetch complete: removeFavoriteById success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: removeFavoriteById failed", err);
      return { data: null, error: err };
    }
  }
};
