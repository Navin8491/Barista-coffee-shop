import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export const contactService = {
  /**
   * Submits a new contact message
   */
  async submitMessage(message: ContactMessage): Promise<ServiceResponse<ContactMessage>> {
    console.log("Fetch start: submitContactMessage");
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || '',
          message: message.message
        });

      if (error) throw error;

      console.log("Fetch complete: submitContactMessage success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: submitContactMessage failed", err);
      return { data: null, error: err };
    }
  }
};
