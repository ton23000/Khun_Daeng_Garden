export const MOCK_BOOKINGS = [
    {
        id: 'BK-001',
        customer: 'คุณสมชาย ใจดี',
        phone: '081-234-5678',
        items: ['ต้นสักทอง', 'ต้นยางนา'],
        totalPrice: 2300,
        deposit: 1150,
        status: 'PENDING', // PENDING, CONFIRMED, CANCELLED
        pickupDate: '2026-03-01'
    },
    {
        id: 'BK-002',
        customer: 'คุณวิภา รักป่า',
        phone: '089-987-6543',
        items: ['ต้นกล้วยด่าง'],
        totalPrice: 5000,
        deposit: 2500,
        status: 'CONFIRMED',
        pickupDate: '2026-02-28'
    },
    {
        id: 'BK-003',
        customer: 'คุณมานะ อดทน',
        phone: '086-555-4444',
        items: ['ต้นโมกพวง', 'ต้นมะม่วงเขียวเสวย'],
        totalPrice: 600,
        deposit: 300,
        status: 'PENDING',
        pickupDate: '2026-03-10'
    }
];
