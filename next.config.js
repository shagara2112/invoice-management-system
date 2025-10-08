/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Ensure proper trailing slash handling
  trailingSlash: false,
  
  // Ensure proper asset handling
  assetPrefix: undefined,
  
  // Ensure proper output handling
  output: undefined,
};

module.exports = nextConfig;