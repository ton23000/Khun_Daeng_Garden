export interface Tree {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    status: 'AVAILABLE' | 'BOOKED' | 'SOLD';
    images: string[];
    tags: string[];
}

export const MOCK_TREES: Tree[] = [
    {
        id: '1',
        name: 'ต้นสักทอง',
        description: 'ไม้เศรษฐกิจที่มีมูลค่าสูง เนื้อไม้สวยงาม ทนทาน เหมาะสำหรับปลูกเพื่อการลงทุน หรือประดับบารมี',
        price: 1500,
        category: 'ไม้มงคล',
        status: 'AVAILABLE',
        images: ['/placeholder-tree.jpg'],
        tags: ['ไม้เศรษฐกิจ', 'ไม้มงคล', 'โตเร็ว']
    },
    {
        id: '2',
        name: 'ต้นยางนา',
        description: 'ไม้ป่ายืนต้นขนาดใหญ่ ให้ร่มเงาดี ช่วยอนุรักษ์ดินและน้ำ เหมาะสำหรับสวนป่า',
        price: 800,
        category: 'ไม้ป่า',
        status: 'AVAILABLE',
        images: ['/placeholder-tree.jpg'],
        tags: ['ไม้ป่า', 'ร่มเงา']
    },
    {
        id: '3',
        name: 'ต้นกล้วยด่าง',
        description: 'ไม้ประดับยอดนิยม ลวดลายใบสวยงาม เป็นที่ต้องการของตลาด หายาก',
        price: 5000,
        category: 'ไม้ประดับ',
        status: 'BOOKED',
        images: ['/placeholder-tree.jpg'],
        tags: ['ไม้ประดับ', 'ไม้ด่าง']
    },
    {
        id: '4',
        name: 'ต้นโมกพวง',
        description: 'ดอกหอมสีขาว ออกดอกตลอดปี ปลูกทำรั้วได้ดี ดูแลรักษาง่าย',
        price: 250,
        category: 'ไม้ดอก',
        status: 'AVAILABLE',
        images: ['/placeholder-tree.jpg'],
        tags: ['ไม้ดอก', 'ทำรั้ว']
    },
    {
        id: '5',
        name: 'ต้นมะม่วงเขียวเสวย',
        description: 'ผลไม้รสชาติดี หวานมันกรอบ เป็นที่นิยม ปลูกง่าย โตไว',
        price: 350,
        category: 'ไม้ผล',
        status: 'AVAILABLE',
        images: ['/placeholder-tree.jpg'],
        tags: ['ไม้ผล', 'กินได้']
    }
];
