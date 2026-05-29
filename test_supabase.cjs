const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const envPath = path.join(__dirname, '.env');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    acc[key] = val;
  }
  return acc;
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log("URL:", supabaseUrl);
console.log("Key:", supabaseAnonKey ? (supabaseAnonKey.substring(0, 15) + "...") : "undefined");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    console.log("Starting Supabase connection test...");
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("Supabase SELECT Error:", error);
    } else {
      console.log("Supabase SELECT Success. Products fetched count:", data.length);
      if (data.length > 0) {
        console.log("First Product Name:", data[0].name);
      }
    }
  } catch (err) {
    console.error("Runtime exception:", err);
  }
}
run();
