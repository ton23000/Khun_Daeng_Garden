import { PrismaClient } from '@prisma/client'
require('dotenv').config()

// Try using DIRECT_URL to bypass the connection pooler which sometimes has issues from local development
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
})

async function main() {
  const user = await prisma.user.update({
    where: { email: 'alif63341f@gmail.com' },
    data: { role: 'ADMIN' },
  })
  console.log('Successfully updated user role!')
  console.log('Email:', user.email)
  console.log('Current Role:', user.role)
}

main()
  .catch(e => {
    console.error('Failed to update user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
