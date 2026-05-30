import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';
import { User, Session } from '@supabase/supabase-js';

export interface RegisterParams {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

export const authService = {
  /**
   * Registers a new user with Supabase Auth
   */
  async register({ email, password, fullName, phone, avatarUrl }: RegisterParams): Promise<ServiceResponse<{ user: User | null; session: Session | null }>> {
    console.log("Auth start: register", email);
    try {
      if (!password) {
        throw new Error("Password is required for registration.");
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || '',
            avatar_url: avatarUrl || ''
          }
        }
      });
      if (error) throw error;
      console.log("Auth complete: register success");
      return { data, error: null };
    } catch (err: any) {
      console.error("Fetch error: register failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Log in user using email and password
   */
  async login(email: string, password?: string): Promise<ServiceResponse<{ user: User | null; session: Session | null }>> {
    console.log("Auth start: login", email);
    try {
      if (!password) {
        throw new Error("Password is required.");
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      console.log("Auth complete: login success");
      return { data, error: null };
    } catch (err: any) {
      console.error("Fetch error: login failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Logs out the current user session
   */
  async logout(): Promise<ServiceResponse<void>> {
    console.log("Auth start: logout");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Auth complete: logout success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: logout failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Gets the currently active session
   */
  async getSession(): Promise<ServiceResponse<Session | null>> {
    console.log("Fetch start: getSession");
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      console.log("Fetch complete: getSession success");
      return { data: session, error: null };
    } catch (err: any) {
      console.error("Fetch error: getSession failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Gets the currently authenticated user
   */
  async getCurrentUser(): Promise<ServiceResponse<User | null>> {
    console.log("Fetch start: getCurrentUser");
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      console.log("Fetch complete: getCurrentUser success");
      return { data: user, error: null };
    } catch (err: any) {
      console.error("Fetch error: getCurrentUser failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Sends a password reset email
   */
  async forgotPassword(email: string, redirectTo: string): Promise<ServiceResponse<void>> {
    console.log("Auth start: forgotPassword", email);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });
      if (error) throw error;
      console.log("Auth complete: forgotPassword success");
      return { data: null, error: null };
    } catch (err: any) {
      console.error("Fetch error: forgotPassword failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Updates user credentials (e.g. password)
   */
  async updatePassword(password: string): Promise<ServiceResponse<User | null>> {
    console.log("Auth start: updatePassword");
    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        password
      });
      if (error) throw error;
      console.log("Auth complete: updatePassword success");
      return { data: user, error: null };
    } catch (err: any) {
      console.error("Fetch error: updatePassword failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Subscribes to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      callback(event, session);
    });
    return subscription;
  }
};
