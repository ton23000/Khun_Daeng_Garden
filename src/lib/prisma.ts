import { PrismaClient } from '@prisma/client'

// Load environment variables
if (typeof window === 'undefined') {
  require('dotenv').config();
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
