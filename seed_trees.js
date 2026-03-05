const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mock_trees = [
    {
        name: 'อุดมโชค',
        description: 'เสริมโชคลาภ เงินทองไหลมาเทมา',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/udom-chok.jpg']),
        tags: 'ไม้มงคล,โชคลาภ',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'หนึ่งในจักวาล',
        description: 'ไม้มงคลงามสง่า เสริมบารมี',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/nueng-jakawan.jpg']),
        tags: 'ไม้มงคล,ยอดนิยม',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'สมปรารถนา',
        description: 'ชื่อมงคล ปลูกแล้วสมหวังดั่งใจ',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/som-prattana.jpg']),
        tags: 'ไม้มงคล',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'ฤาษีผสม',
        description: 'ไม้ใบสวยงาม มีสีสันหลากหลาย เลี้ยงง่าย',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/ruesi-phasom.jpg']),
        tags: 'ไม้ใบ,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'รวยทรัพย์',
        description: 'เสริมด้านความมั่งคั่งและความรุ่งเรือง',
        price: 350,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/ruay-sap.jpg']),
        tags: 'ไม้มงคล,โชคลาภ',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'มรดกโลก',
        description: 'ไม้หายากระดับตำนาน ควรค่าแก่การครอบครอง',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/moradok-lok.jpg']),
        tags: 'ไม้มงคล,ไม้สะสม,หายาก',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'พญาคล้าทอง',
        description: 'ไม้ใบสวย มีลวดลายเป็นเอกลักษณ์',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/phaya-kla-thong.jpg']),
        tags: 'ไม้มงคล,ไม้ใบ',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'ปริหางกระจอก',
        description: 'ไม้มงคลสวยงาม นิยมปลูกเพื่อความเป็นสิริมงคล',
        price: 100,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/prihang-krajok.jpg']),
        tags: 'ไม้มงคล',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'ดาวเรือง',
        description: 'ดอกไม้มงคล สีเหลืองอร่าม นิยมปลูกเพื่อความสวยงามและบูชาพระ',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/dao-rueang.jpg']),
        tags: 'ไม้ดอก,มงคล,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'ดอกเก็ดตะหวา',
        description: 'ดอกไม้สวยงาม มีสีสันสดใส',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/dok-get-thawa.jpg']),
        tags: 'ไม้ดอก,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'ชวนชม',
        description: 'ไม้อวบน้ำ ดอกสวย ทนแล้งดี',
        price: 150,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/chuan-chom.jpg']),
        tags: 'ไม้มงคล,ทนแล้ง',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'คุ้มภัย',
        description: 'ไม้มงคลใบสวย ช่วยคุ้มครองภัย',
        price: 50,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/khum-phai.jpg']),
        tags: 'ไม้ใบ,มงคล,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'กวักพระพรหม',
        description: 'ไม้มงคลหายาก เสริมสิริมงคล',
        price: 350,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/kwak-phra-phrom.jpg']),
        tags: 'ไม้มงคล,หายาก',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'กระดุมทอง',
        description: 'ไม้ดอกสีเหลืองสดใส ปลูกง่าย โตไว เหมาะสำหรับประดับสวน',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/kradum-thong.jpg']),
        tags: 'ไม้ดอก,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'ไทรหัวใจด่าง',
        description: 'ไม้ใบสวยงาม มีลายด่างเป็นเอกลักษณ์',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/thai-huai-jai-dang.jpg']),
        tags: 'ไม้ใบ,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'เตยทอง',
        description: 'ไม้ประดับสวยงาม ใบสีเขียวอร่าม',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/toei-thong.jpg']),
        tags: 'ไม้ใบ,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'เงินหนา',
        description: 'ใบหนาสวย คล้ายเหรียญเงิน เสริมความมั่งคั่ง',
        price: 600,
        category: 'ไม้พรีเมียม',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/ngern-na.jpg']),
        tags: 'ไม้พรีเมียม,ไม้สะสม,โชคลาภ',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    },
    {
        name: 'พุดซ้อน',
        description: 'ไม้ดอกสวยงาม มีดอกหลายสี',
        price: 35,
        category: 'ไม้ราคาประหยัด',
        status: 'AVAILABLE',
        images: JSON.stringify(['/images/products/pud-son.jpg']),
        tags: 'ไม้ดอก,ราคาประหยัด',
        growthTime: '1–2 อาทิตย์',
        stock: 50
    }
];

async function main() {
    console.log('Start seeding to Next.js Database...');
    let count = 0;

    for (const tree of mock_trees) {
        // use upsert to avoid duplicates by name
        const existing = await prisma.tree.findFirst({
            where: { name: tree.name }
        });

        if (!existing) {
            await prisma.tree.create({
                data: tree
            });
            console.log(`Added ${tree.name}`);
            count++;
        } else {
            // Update instead
            await prisma.tree.update({
                where: { id: existing.id },
                data: tree
            });
            console.log(`Updated ${tree.name} (already exists)`);
            count++;
        }
    }
    console.log(`Done! Uploaded ${count} trees to Database.`);
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
