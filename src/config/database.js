// Carrega dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}

import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "",
};

let conexao;
try {
  conexao = await mysql.createConnection(config);
} catch (error) {
  console.error("Erro ao conectar no banco de dados:", error.message);
  throw error;
}

export default conexao;
