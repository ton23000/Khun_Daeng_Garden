const http = require("http");

async function testApi() {
  const data = JSON.stringify({
    status: "COMPLETED",
    pickupDate: "2026-05-27",
  });

  try {
    // We don't know the port for sure, Next.js is usually 3000
    const res = await fetch(
      "http://localhost:3000/api/bookings/417fcb84-3c86-4329-971c-32fa1a604e97",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      },
    );

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}
testApi();
