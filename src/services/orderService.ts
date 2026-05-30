import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';
import { Product } from './productService';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  products?: Product;
}

export interface Order {
  id: number;
  user_id: string;
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface CreateOrderParams {
  userId: string;
  total: number;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  userEmail?: string | null;
  userName?: string | null;
}

export const orderService = {
  /**
   * Places a new order and inserts all related order items
   */
  async createOrder({ userId, total, items, userEmail, userName }: CreateOrderParams): Promise<ServiceResponse<Order>> {
    console.log("Fetch start: createOrder for user", userId, "total", total);
    try {
      const orderNumber = `BC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Insert the main order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          total: total,
          status: 'Pending',
          payment_status: 'Unpaid',
          user_email: userEmail || null,
          user_name: userName || null
        })
        .select('*')
        .single();

      if (orderError) throw orderError;
      const order = orderData as Order;

      // 2. Insert order items
      const orderItemsToInsert = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)
        .select('*, products:product_id(*)');

      if (itemsError) throw itemsError;

      // Attach items to returned order object
      order.order_items = itemsData as OrderItem[];

      console.log("Fetch complete: createOrder success. Order Number:", orderNumber);
      return { data: order, error: null };
    } catch (err: any) {
      console.error("Fetch error: createOrder failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches order history for a specific user
   */
  async getUserOrders(userId: string): Promise<ServiceResponse<Order[]>> {
    console.log("Fetch start: getUserOrders for user", userId);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items:order_items(*, products:product_id(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Fetch complete: getUserOrders success. Count:", data?.length);
      return { data: data as Order[], error: null };
    } catch (err: any) {
      console.error("Fetch error: getUserOrders failed", err);
      return { data: null, error: err };
    }
  }
};
