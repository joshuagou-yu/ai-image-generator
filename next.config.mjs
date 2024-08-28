/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    domains: ['image.omostai.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aianimeartgenerator.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
