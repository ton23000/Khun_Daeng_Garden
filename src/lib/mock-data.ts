export const MOCK_TREES = [
  {
    id: 'mock-1',
    name: 'ต้นยางอินเดีย (Mock)',
    price: 350,
    originalPrice: 500,
    description: 'ต้นไม้ฟอกอากาศยอดนิยม ใบสีเขียวเข้มเป็นมันเงา เลี้ยงง่าย เหมาะสำหรับปลูกในบ้าน',
    images: JSON.stringify(['/placeholder-tree.jpg']),
    category: 'ไม้ฟอกอากาศ',
    status: 'AVAILABLE',
    stock: 10,
    reserved: 0,
    sold: 10,
    rating: 4.8,
    reviewCount: 12,
    isPromotion: true,
    promotionName: 'ลดล้างสต็อก',
    promotionEndDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
    tags: 'ฟอกอากาศ,ในร่ม,แนะนำ',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-2',
    name: 'ไทรใบสัก (Mock)',
    price: 450,
    originalPrice: null,
    description: 'ไม้ประดับใบสวย ทรงพุ่มสง่า เหมาะสำหรับตกแต่งห้องนั่งเล่นหรือมุมทำงาน',
    images: JSON.stringify(['/placeholder-tree.jpg']),
    category: 'ไม้ประดับ',
    status: 'AVAILABLE',
    stock: 5,
    reserved: 0,
    sold: 2,
    rating: 4.5,
    reviewCount: 5,
    isPromotion: false,
    promotionName: null,
    promotionEndDate: null,
    tags: 'ตกแต่ง,ใบสวย',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-3',
    name: 'มอนสเตอร่า (Mock)',
    price: 290,
    originalPrice: 390,
    description: 'ราชินีแห่งไม้ใบ ใบแฉกสวยงาม เป็นเอกลักษณ์ เลี้ยงในร่มได้ดี',
    images: JSON.stringify(['/placeholder-tree.jpg']),
    category: 'ไม้ฟอกอากาศ',
    status: 'AVAILABLE',
    stock: 8,
    reserved: 0,
    sold: 15,
    rating: 4.9,
    reviewCount: 20,
    isPromotion: true,
    promotionName: 'Flash Sale',
    promotionEndDate: null,
    tags: 'ฟอกอากาศ,ฮิต',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-4',
    name: 'กวักมรกต (Mock)',
    price: 150,
    originalPrice: null,
    description: 'ไม้มงคลเชื่อว่าเรียกทรัพย์ เลี้ยงง่ายมาก ไม่ต้องรดน้ำบ่อย',
    images: JSON.stringify(['/placeholder-tree.jpg']),
    category: 'ไม้มงคล',
    status: 'AVAILABLE',
    stock: 20,
    reserved: 0,
    sold: 8,
    rating: 4.2,
    reviewCount: 3,
    isPromotion: false,
    promotionName: null,
    promotionEndDate: null,
    tags: 'มงคล,ทนทาน',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'mock-rev-1',
    rating: 5,
    comment: 'ต้นไม้สวยมากครับ แพ็คมาดีไม่มีช้ำเลย (Mock Review)',
    userId: 'mock-user-1',
    treeId: 'mock-1',
    createdAt: new Date(),
    isFeatured: true,
    hidden: false,
    user: {
      firstName: 'สมชาย',
      lastName: 'รักต้นไม้'
    }
  },
  {
    id: 'mock-rev-2',
    rating: 4,
    comment: 'ส่งไวมากครับ แอดมินตอบคำถามดี (Mock Review)',
    userId: 'mock-user-2',
    treeId: 'mock-2',
    createdAt: new Date(),
    isFeatured: true,
    hidden: false,
    user: {
      firstName: 'วิภา',
      lastName: 'ใจดี'
    }
  }
];

export const MOCK_SITE_SETTINGS = {
  hero_title: 'สวนสวยเริ่มต้นที่ สวนคุณแดง (Demo Mode)',
  hero_subtitle: 'ขณะนี้เว็บไซต์กำลังแสดงผลในโหมดตัวอย่าง (Demo) เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูลได้',
  hero_tag: '#MockDataMode',
  top_bar_text: 'ระบบกำลังทำงานในโหมด Demo'
};
