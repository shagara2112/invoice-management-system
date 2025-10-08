/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove serverExternalPackages for App Router
  // serverExternalPackages: ['@supabase/supabase-js'],
  
  // Ensure proper App Router configuration
  experimental: {
    // Enable any experimental features needed for Next.js 15
  },
  
  // Ensure proper asset handling
  assetPrefix: undefined,
  
  // Ensure proper handling of dynamic routes
  trailingSlash: false,
  
  // Remove output configuration for App Router
  // output: 'standalone',
  
  // Ensure proper environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;