import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://mjtrohewvwvvgmpldoay.supabase.co';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/supabase-api': {
          target: supabaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/supabase-api/, ''),
        }
      }
    }
  };
})
