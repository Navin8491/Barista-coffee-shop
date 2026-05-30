import { supabase } from '../lib/supabaseClient';
import { ServiceResponse } from './types';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  /**
   * Fetches the user profile by ID
   */
  async getProfile(userId: string): Promise<ServiceResponse<Profile>> {
    console.log("Fetch start: getProfile for user", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      console.log("Fetch complete: getProfile success");
      return { data: data as Profile, error: null };
    } catch (err: any) {
      console.error("Fetch error: getProfile failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Updates user profile fields
   */
  async updateProfile(userId: string, profileData: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceResponse<Profile>> {
    console.log("Fetch start: updateProfile for user", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;

      console.log("Fetch complete: updateProfile success");
      return { data: data as Profile, error: null };
    } catch (err: any) {
      console.error("Fetch error: updateProfile failed", err);
      return { data: null, error: err };
    }
  },

  /**
   * Uploads an avatar image file to Supabase Storage and returns the public URL
   */
  async uploadAvatar(userId: string, file: File): Promise<ServiceResponse<string>> {
    console.log("Fetch start: uploadAvatar for user", userId);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}_avatar.${fileExt}`;

      // 1. Upload to storage bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // 2. Retrieve the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      console.log("Fetch complete: uploadAvatar success. URL:", publicUrl);
      return { data: publicUrl, error: null };
    } catch (err: any) {
      console.error("Fetch error: uploadAvatar failed", err);
      return { data: null, error: err };
    }
  }
};
