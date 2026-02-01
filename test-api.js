// Test script to check if slipUrl is being returned by the API
// Run this with: node test-api.js

async function testBookingsAPI() {
    try {
        console.log('Testing /api/bookings endpoint...');
        const response = await fetch('http://localhost:3000/api/bookings');
        const data = await response.json();

        console.log('\n=== API Response ===');
        console.log('Total bookings:', data.length);

        if (data.length > 0) {
            console.log('\n=== First Booking ===');
            console.log('ID:', data[0].id);
            console.log('Ref Code:', data[0].refCode);
            console.log('Status:', data[0].status);
            console.log('Has slipUrl field?', 'slipUrl' in data[0]);
            console.log('slipUrl value:', data[0].slipUrl);

            console.log('\n=== All Fields ===');
            console.log(Object.keys(data[0]));
        } else {
            console.log('No bookings found');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testBookingsAPI();
