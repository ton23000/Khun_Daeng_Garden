const https = require("https");

const testImages = [
  "https://khundaenggarden.vercel.app/images/products/phin-nak-dang.jpg",
  "https://khundaenggarden.vercel.app/images/products/moradok-lok.jpg",
  "https://khundaenggarden.vercel.app/images/products/ngoen-na.jpg",
  "https://khundaenggarden.vercel.app/images/products/nueng-nai-jakrawan.jpg",
  "https://khundaenggarden.vercel.app/images/products/som-prattana-premium.jpg",
  "https://khundaenggarden.vercel.app/images/products/kradum-thong.jpg",
  "https://khundaenggarden.vercel.app/images/products/ruesi-phasom.jpg",
  "https://khundaenggarden.vercel.app/images/products/khum-phai.jpg",
  "https://khundaenggarden.vercel.app/images/products/kwak-phra-phrom.jpg",
  "https://khundaenggarden.vercel.app/images/products/udom-chok.jpg",
  "https://khundaenggarden.vercel.app/images/products/donya-queen-sirikit.jpg",
  "https://khundaenggarden.vercel.app/placeholder-tree.jpg",
];

function checkImage(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        url: url,
        status: response.statusCode,
        success: response.statusCode === 200,
      });
    });

    request.on("error", () => {
      resolve({
        url: url,
        status: "ERROR",
        success: false,
      });
    });

    request.setTimeout(5000, () => {
      request.destroy();
      resolve({
        url: url,
        status: "TIMEOUT",
        success: false,
      });
    });
  });
}

async function testAllImages() {
  console.log("Testing image availability on Vercel...\n");

  const results = await Promise.all(testImages.map(checkImage));

  console.log("=== Results ===");
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n✅ Successful: ${successful.length}`);
  successful.forEach((r) => console.log(`   ${r.url}`));

  console.log(`\n❌ Failed: ${failed.length}`);
  failed.forEach((r) => console.log(`   ${r.url} - Status: ${r.status}`));

  if (failed.length > 0) {
    console.log(
      "\n⚠️  Some images are still not available. Vercel deployment may still be in progress.",
    );
  } else {
    console.log("\n🎉 All images are available!");
  }
}

testAllImages();
