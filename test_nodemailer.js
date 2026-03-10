require("dotenv").config({ path: ".env.local" });
const { sendPasswordResetEmail } = require("./src/lib/email.ts");

async function testEmail() {
  try {
    console.log("Testing email with user:", process.env.EMAIL_USER);

    await sendPasswordResetEmail({
      email: "fhjilyyjg@gmail.com", // Sending to yourself to test
      resetLink: "http://localhost:3000/test-reset-link",
      userName: "Test User",
    });

    console.log("Test successfully completed.");
  } catch (e) {
    console.error("Test failed:", e);
  }
}

testEmail();
