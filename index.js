require("dotenv").config();
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ MySQL connected successfully");
    const userCount = await prisma.user.count();
    const treeCount = await prisma.tree.count();
    console.log(`   Users: ${userCount}, Trees: ${treeCount}`);
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function start() {
  // Skip database connection test for now - use mock data
  console.log(
    "🔄 Skipping database connection test - using mock data with real images",
  );
  await app.prepare();

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${dev ? "development" : "production"}`);
    });
}

process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

start();
