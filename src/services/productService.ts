import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  featured: boolean;
  available: boolean;
  created_at: string;
}

export const productService = {
  /**
   * Fetches all products
   */
  async getProducts(): Promise<ServiceResponse<Product[]>> {
    console.log("Fetch start: products");
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      console.log("Fetch complete: products. Count:", data?.length);
      return { data: data as Product[], error: null };
    } catch (err: any) {
      console.error("Fetch error: products failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches featured products
   */
  async getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    console.log("Fetch start: featured products");
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('available', true)
        .order('id', { ascending: true });

      if (error) throw error;

      console.log("Fetch complete: featured products");
      return { data: data as Product[], error: null };
    } catch (err: any) {
      console.error("Fetch error: featured products failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches products by category
   */
  async getProductsByCategory(category: string): Promise<ServiceResponse<Product[]>> {
    console.log("Fetch start: products by category", category);
    try {
      let query = supabase.from('products').select('*');
      if (category && category.toLowerCase() !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query.order('id', { ascending: true });

      if (error) throw error;

      console.log("Fetch complete: products by category success");
      return { data: data as Product[], error: null };
    } catch (err: any) {
      console.error("Fetch error: products by category failed", err);
      return { data: null, error: err };
    }
  }
};
