/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Ensure trailingSlash is properly handled
  trailingSlash: false,
  // Ensure proper output handling
  output: 'standalone',
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Ensure proper handling of dynamic routes
  experimental: {
    // Enable any experimental features needed for Next.js 15
  },
};

module.exports = nextConfig;