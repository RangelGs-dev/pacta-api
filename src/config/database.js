import "dotenv/config";
import mysql from "mysql2/promise";

const conexao = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

conexao.connect(function (err) {
  if (err) throw err;
  console.log("Conexão executada com sucesso.");
});

export default conexao;
