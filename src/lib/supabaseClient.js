import { createClient } from '@supabase/supabase-js';

const supabaseUrlReal = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Real URL:", supabaseUrlReal);
console.log("KEY:", supabaseAnonKey);

if (!supabaseUrlReal || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables (.env or Vercel dashboard).');
}

// In development, use a local proxy to bypass browser-level outbound request blocks / extension intercepts
const supabaseUrl = import.meta.env.DEV 
  ? `${window.location.origin}/supabase-api` 
  : supabaseUrlReal;

console.log("Resolved Client URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


