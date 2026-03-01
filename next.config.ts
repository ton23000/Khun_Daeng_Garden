import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'mysql://appvizac_suankhundaeng:nQqV6c5s@localhost:3306/appvizac_suankhundaeng',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://suankhundaeng.appviza.com'
  }
};

export default nextConfig;
