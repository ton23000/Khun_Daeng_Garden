const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// FTP Server Credentials
const config = {
  host: "ftp.appviza.com",
  port: 2002,
  user: "suankhundaeng@appviza.com",
  password: "nQqV6c5s",
};

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log("Connecting to FTP server...");
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: false,
    });

    console.log("Connected! Preparing deployment...");

    // Check if output directory exists (.next)
    const localDir = path.join(__dirname, ".next");
    if (!fs.existsSync(localDir)) {
      throw new Error(
        `Build directory not found: ${localDir}. Please run 'npm run build' first.`,
      );
    }

    // Go to public_html
    const remoteDir = "/public_html";
    await client.cd(remoteDir);

    // Delete the placeholder index.html if it exists
    console.log("Removing default index.html if exists...");
    try {
      await client.remove("index.html");
      console.log("Removed placeholder index.html");
    } catch (e) {
      console.log(
        "No placeholder index.html found or error removing it (safe to ignore).",
      );
    }

    // Because this is a Next.js app (Node.js backend),
    // simply uploading files to public_html might not work if the host only supports PHP/Static HTML
    // But let's upload the necessary files anyway.

    console.log(
      "Note: Next.js SSR apps require a Node.js server to run on the hosting.",
    );
    console.log("Uploading files... (This may take a while)");

    // Next.js needs package.json, public folder, and .next folder
    // We will upload them one by one

    // 1. package.json
    if (fs.existsSync(path.join(__dirname, "package.json"))) {
      await client.uploadFrom(
        path.join(__dirname, "package.json"),
        "package.json",
      );
    }

    // 2. next.config.ts
    if (fs.existsSync(path.join(__dirname, "next.config.ts"))) {
      await client.uploadFrom(
        path.join(__dirname, "next.config.ts"),
        "next.config.ts",
      );
    }

    // 3. .env (optional but needed for DB connection)
    if (fs.existsSync(path.join(__dirname, ".env"))) {
      await client.uploadFrom(path.join(__dirname, ".env"), ".env");
    }

    // 4. public folder
    const publicDir = path.join(__dirname, "public");
    if (fs.existsSync(publicDir)) {
      await client.ensureDir("public");
      await client.uploadFromDir(publicDir);
      await client.cd(remoteDir); // go back to root
    }

    // 5. .next folder
    const nextDir = path.join(__dirname, ".next");
    if (fs.existsSync(nextDir)) {
      await client.ensureDir(".next");
      await client.uploadFromDir(nextDir);
      await client.cd(remoteDir); // go back to root
    }

    console.log("Deployment uploaded successfully!");
    console.log(
      "IMPORTANT: You must SSH into the server and run `npm install` and `npm start` to run the Next.js app.",
    );
  } catch (err) {
    console.error("Deployment failed:", err);
  } finally {
    client.close();
  }
}

deploy();
