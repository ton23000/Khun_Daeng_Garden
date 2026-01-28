import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MOCK_TREES = [
    {
        name: 'กระดุมทอง',
        description: 'ไม้ดอกสีเหลืองสดใส ปลูกง่าย โตไว เหมาะสำหรับประดับสวน',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้ดอก,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'ดาวเรือง',
        description: 'ดอกไม้มงคล สีเหลืองอร่าม นิยมปลูกเพื่อความสวยงามและบูชาพระ',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้ดอก,มงคล,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'ฤาษีผสม',
        description: 'ไม้ใบสวยงาม มีสีสันหลากหลาย เลี้ยงง่าย',
        price: 50,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้ใบ,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'หนึ่งจักรวาล',
        description: 'ไม้มงคลงามสง่า เสริมบารมี',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล,ยอดนิยม',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'ดอนญ่าควีนสิริกิติ์',
        description: 'ดอกสวยงาม สีชมพูอ่อนหวาน',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล,ไม้ดอก',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'ชวนชม',
        description: 'ไม้อวบน้ำ ดอกสวย ทนแล้งดี',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล,ทนแล้ง',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'สมปรารถนา',
        description: 'ชื่อมงคล ปลูกแล้วสมหวังดั่งใจ',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'อุดมโชค',
        description: 'เสริมโชคลาภ เงินทองไหลมาเทมา',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล,โชคลาภ',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'พญาคล้าทอง',
        description: 'ไม้ใบสวย มีลวดลายเป็นเอกลักษณ์',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล,ไม้ใบ',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'กวักพระพรหม',
        description: 'ไม้มงคลหายาก เสริมสิริมงคล',
        price: 350,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้มงคล,หายาก',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'สมปรารถนา (พรีเมียม)',
        description: 'ฟอร์มสวย คัดพิเศษ สำหรับนักสะสม',
        price: 350,
        category: 'ไม้พรีเมียม',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้พรีเมียม,ไม้สะสม',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'เทพราชา',
        description: 'ราชาแห่งไม้สะสม สง่างาม ทรงคุณค่า',
        price: 650,
        category: 'ไม้พรีเมียม',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้พรีเมียม,ไม้สะสม',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'เงินหนา',
        description: 'ใบหนาสวย คล้ายเหรียญเงิน เสริมความมั่งคั่ง',
        price: 990,
        category: 'ไม้พรีเมียม',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้พรีเมียม,ไม้สะสม,โชคลาภ',
        growthTime: '1–2 อาทิตย์'
    },
    {
        name: 'มรดกโลก',
        description: 'ไม้หายากระดับตำนาน ควรค่าแก่การครอบครอง',
        price: 1500,
        category: 'ไม้พรีเมียม',
        status: 'AVAILABLE',
        images: JSON.stringify(['/placeholder-tree.jpg']),
        tags: 'ไม้พรีเมียม,ไม้สะสม,หายาก',
        growthTime: '1–2 อาทิตย์'
    }
]

async function main() {
    console.log('Start seeding...')

    // Clear existing data (optional, be careful in prod)
    // await prisma.tree.deleteMany()

    for (const tree of MOCK_TREES) {
        await prisma.tree.create({
            data: tree,
        })
    }
    console.log(`Seeded ${MOCK_TREES.length} trees`)
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
