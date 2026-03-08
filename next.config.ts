import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'mysql://appvizac_suankhundaeng:nQqV6c5s@localhost:3306/appvizac_suankhundaeng',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://suankhundaeng.appviza.com',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-for-development-jwt-secret',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://khundaenggarden.vercel.app',
    ADMIN_EMAILS: process.env.ADMIN_EMAILS || 'fhjilyyjg@gmail.com'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'khundaenggarden.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'promptpay.io',
      },
    ],
    unoptimized: true
  },
  // Add empty turbopack config to silence the webpack conflict error
  turbopack: {},
  // Move webpack config to work with both webpack and turbopack
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
