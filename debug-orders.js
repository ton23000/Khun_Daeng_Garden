// Debug script to check orders page
// Run this with: node debug-orders.js

async function debugOrders() {
    try {
        console.log('=== Debugging Orders Page ===\n');

        // 1. Check if we can fetch bookings
        console.log('1. Fetching all bookings...');
        const allBookings = await fetch('http://localhost:3000/api/bookings');
        const allData = await allBookings.json();
        console.log('   Total bookings:', allData.length);

        if (allData.length > 0) {
            console.log('\n2. Sample booking:');
            const sample = allData[0];
            console.log('   ID:', sample.id);
            console.log('   User ID:', sample.userId);
            console.log('   Status:', sample.status);
            console.log('   Has slipUrl?', !!sample.slipUrl);
            console.log('   Ref Code:', sample.refCode);

            // 3. Try to fetch with userId filter
            console.log('\n3. Testing userId filter...');
            const filtered = await fetch(`http://localhost:3000/api/bookings?userId=${sample.userId}`);
            const filteredData = await filtered.json();
            console.log('   Filtered results:', filteredData.length);

            // 4. Check PENDING orders
            console.log('\n4. Checking PENDING orders...');
            const pending = allData.filter(b => b.status === 'PENDING');
            console.log('   PENDING orders:', pending.length);
            if (pending.length > 0) {
                console.log('   First PENDING order:');
                console.log('     - ID:', pending[0].id);
                console.log('     - User ID:', pending[0].userId);
                console.log('     - Has slipUrl?', !!pending[0].slipUrl);
            }
        } else {
            console.log('   ⚠️ No bookings found in database');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugOrders();
