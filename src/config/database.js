import "dotenv/config";
import mysql from "mysql2/promise";

const conexao = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD_DB,
  database: process.env.DB_HOST,
});

conexao.connect(function (err) {
  if (err) throw err;
  console.log("Conexão executada com sucesso.");
});

export default conexao;
