import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import conexao from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await conexao.query("SELECT * FROM contratos");

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Não foi possivel obter uma lista de contratos." });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao obter a lista de contratos." });
  }
});

router.post("/create", async (req, res) => {
  try {
    const {
      nome,
      setorContratante,
      tipoPessoa,
      razaoSocial,
      valorContrato,
      cnpjFornecedor,
    } = req.body;

    if (
      !nome ||
      !setorContratante ||
      !tipoPessoa ||
      !razaoSocial ||
      !valorContrato ||
      !cnpjFornecedor
    ) {
      return res.status(422).json({ message: "Campo obrigatório ausente." });
    }

    const dadosInsert = [
      nome,
      setorContratante,
      tipoPessoa,
      razaoSocial,
      valorContrato,
      cnpjFornecedor,
    ];
    const [result] = await conexao.query(
      "INSERT INTO `contratos`(nome, setor_contratante, tipo_pessoa, razao_social, valor_contrato, cnpj_fornecedor ) VALUES (?, ?, ?, ?, ?, ?)",
      dadosInsert,
    );

    return res.status(201).json({
      message: "Contrato criado com sucesso",
      contratoId: result.insertId,
    });
  } catch (err) {
    console.log(err);
  }

  res.end();
});

async function validaContrato(req, res, next) {
  try {
    const idContrato = req.params.id;

    if (!idContrato) {
      return res.status(400).json({ error: "Contrato inválido" });
    }

    const [rows] = await conexao.query(
      "SELECT contrato_id FROM contratos WHERE contrato_id = ?",
      [idContrato],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Contrato não encontrado" });
    }

    const uploadPath = path.resolve(
      "public",
      "uploads",
      "contratos",
      idContrato,
    );

    await fs.mkdir(uploadPath, { recursive: true });

    req.urlPath = uploadPath;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao validar contrato" });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer destination - req.urlPath:", req.urlPath);
    cb(null, req.urlPath);
  },
  filename: function (req, file, cb) {
    const extArquivo = path.extname(file.originalname);
    const nomeBase = path.basename(file.originalname, extArquivo);
    cb(null, `${nomeBase}_${Date.now()}${extArquivo}`);
  },
});

const upload = multer({ storage });

router.post(
  "/:id/upload",
  validaContrato,
  upload.single("arquivo"),
  async (req, res) => {
    const idContrato = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        error: "Nenhum arquivo foi enviado ou o campo não se chama 'arquivo'",
      });
    }

    const arquivoUrl = `/uploads/contratos/${idContrato}/${req.file.filename}`;

    try {
      await conexao.query(
        `UPDATE contratos SET arquivo_url = ? WHERE contrato_id = ?`,
        [arquivoUrl, idContrato],
      );

      res.status(200).json({
        message: "Anexo salvo com sucesso.",
        url: arquivoUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `${err}` });
    }
  },
);

export default router;
