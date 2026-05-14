import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Creating demo accounts for presentation...')

    // ─── Demo User 1 ───────────────────────────────────────────────
    const userPassword = await bcrypt.hash('user1234', 10)

    const demoUser = await prisma.user.upsert({
        where: { phone: '0812345678' },
        update: {
            password: userPassword,
            verified: true,
        },
        create: {
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            phone: '0812345678',
            email: 'demo.user@example.com',
            password: userPassword,
            role: 'USER',
            verified: true,
        },
    })
    console.log(`✅ Demo User  → phone: 0812345678  |  password: user1234  |  id: ${demoUser.id}`)

    // ─── Demo User 2 (สำรอง) ────────────────────────────────────────
    const user2Password = await bcrypt.hash('demo5678', 10)

    const demoUser2 = await prisma.user.upsert({
        where: { phone: '0898765432' },
        update: {
            password: user2Password,
            verified: true,
        },
        create: {
            firstName: 'มาลี',
            lastName: 'รักต้นไม้',
            phone: '0898765432',
            email: 'demo.user2@example.com',
            password: user2Password,
            role: 'USER',
            verified: true,
        },
    })
    console.log(`✅ Demo User2 → phone: 0898765432  |  password: demo5678  |  id: ${demoUser2.id}`)

    console.log('')
    console.log('─────────────────────────────────────────────────────────')
    console.log('📋 ข้อมูลบัญชีสำหรับนำเสนอ')
    console.log('─────────────────────────────────────────────────────────')
    console.log('')
    console.log('👑 Admin (ไม่ใช้ฐานข้อมูล — ใช้ค่าจาก .env.local):')
    console.log('   Email    : fhjilyyjg@gmail.com')
    console.log('   Password : admin1234')
    console.log('   เข้าสู่  : /admin')
    console.log('')
    console.log('👤 User 1:')
    console.log('   ชื่อ     : สมชาย ใจดี')
    console.log('   Phone    : 0812345678')
    console.log('   Password : user1234')
    console.log('   เข้าสู่  : /login')
    console.log('')
    console.log('👤 User 2 (สำรอง):')
    console.log('   ชื่อ     : มาลี รักต้นไม้')
    console.log('   Phone    : 0898765432')
    console.log('   Password : demo5678')
    console.log('   เข้าสู่  : /login')
    console.log('─────────────────────────────────────────────────────────')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
