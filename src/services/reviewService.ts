import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';

export interface ReviewProfile {
  full_name: string | null;
  avatar_url: string | null;
}

export interface Review {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  review: string;
  created_at: string;
  profiles?: ReviewProfile; // User profile relation
}

export interface CreateReviewParams {
  userId: string;
  productId: number;
  rating: number;
  review: string;
}

export const reviewService = {
  /**
   * Fetches reviews for a specific product
   */
  async getReviewsForProduct(productId: number): Promise<ServiceResponse<Review[]>> {
    console.log("Fetch start: getReviewsForProduct", productId);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Fetch complete: getReviewsForProduct success. Count:", data?.length);
      return { data: data as Review[], error: null };
    } catch (err: any) {
      console.error("Fetch error: getReviewsForProduct failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Inserts a new review for a product
   */
  async createReview({ userId, productId, rating, review }: CreateReviewParams): Promise<ServiceResponse<Review>> {
    console.log("Fetch start: createReview by user", userId, "rating", rating);
    try {
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5 stars.");
      }
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          product_id: productId,
          rating,
          review
        })
        .select('*, profiles:user_id(full_name, avatar_url)')
        .single();

      if (error) throw error;

      console.log("Fetch complete: createReview success");
      return { data: data as Review, error: null };
    } catch (err: any) {
      console.error("Fetch error: createReview failed", err);
      return { data: null, error: err };
    }
  }
};
