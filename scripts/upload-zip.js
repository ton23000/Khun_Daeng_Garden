const fs = require("fs");
const basicFtp = require("basic-ftp");

async function uploadZip() {
  const client = new basicFtp.Client();
  client.ftp.verbose = true;

  try {
    console.log("Connecting to FTP...");
    await client.access({
      host: "ftp.appviza.com",
      port: 2002,
      user: "suankhundaeng@appviza.com",
      password: "nQqV6c5s",
    });

    console.log("Connected! Uploading website.zip...");

    // อัปโหลดไฟล์ zip
    await client.uploadFrom("website.zip", "public_html/website.zip");

    console.log("Upload completed!");
    console.log("Now you need to:");
    console.log("1. Login to DirectAdmin: https://ns85.hostinglotus.net:2222");
    console.log("2. Go to File Manager");
    console.log("3. Extract website.zip in public_html folder");
  } catch (err) {
    console.error("FTP Error:", err);
  } finally {
    client.close();
  }
}

uploadZip();
