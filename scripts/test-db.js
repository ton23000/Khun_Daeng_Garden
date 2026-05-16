const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "ns85.hostinglotus.net",
      user: "appvizac_suankhundaeng",
      password: "nQqV6c5s",
      database: "appvizac_suankhundaeng",
      port: 3306,
    });
    console.log("Successfully connected to the database!");
    await connection.end();
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

testConnection();
