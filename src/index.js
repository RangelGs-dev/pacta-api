import express from "express";
import contratosRouter from "./routes/contratosRouter.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/contratos", contratosRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}.`);
});
