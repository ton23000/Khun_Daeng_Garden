// Test script to upload a slip to a booking
// Run this with: node test-upload-slip.js

async function testSlipUpload() {
    try {
        // First, get a booking ID
        console.log('Fetching bookings...');
        const bookingsResponse = await fetch('http://localhost:3000/api/bookings');
        const bookings = await bookingsResponse.json();

        if (bookings.length === 0) {
            console.log('No bookings found to test with');
            return;
        }

        const bookingId = bookings[0].id;
        console.log('Testing with booking ID:', bookingId);
        console.log('Current slipUrl:', bookings[0].slipUrl);

        // Create a fake base64 image (1x1 red pixel PNG)
        const fakeSlip = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

        console.log('\nUploading slip...');
        const uploadResponse = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slipUrl: fakeSlip })
        });

        if (uploadResponse.ok) {
            const updatedBooking = await uploadResponse.json();
            console.log('✅ Upload successful!');
            console.log('New slipUrl length:', updatedBooking.slipUrl?.length || 0);
            console.log('Status changed to:', updatedBooking.status);
        } else {
            console.log('❌ Upload failed');
            console.log('Status:', uploadResponse.status);
            const error = await uploadResponse.text();
            console.log('Error:', error);
        }

        // Verify by fetching again
        console.log('\nVerifying...');
        const verifyResponse = await fetch('http://localhost:3000/api/bookings');
        const verifiedBookings = await verifyResponse.json();
        const verifiedBooking = verifiedBookings.find(b => b.id === bookingId);
        console.log('Verified slipUrl exists?', !!verifiedBooking.slipUrl);
        console.log('Verified status:', verifiedBooking.status);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testSlipUpload();
