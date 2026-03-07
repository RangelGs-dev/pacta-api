// Carrega dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}

import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASS || "",
};

let pool;
try {
  pool = mysql.createPool(config);
} catch (error) {
  console.error("Erro ao conectar no banco de dados:", error.message);
  throw error;
}

export default pool;
