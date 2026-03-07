import express from "express";
import {
  gerarToken,
  gerarSenhaHash,
  compararSenha,
} from "../services/auth.service.js";
import pool from "../config/database.js";

const router = express.Router();

router.post("/registro", async (req, res) => {
  try {
    const { nome, email, senha, permissao } = req.body;
    if (!senha) {
      return res
        .status(400)
        .json({ erro: "Campo de senha ausente ou invalido" });
    }

    const senhaHash = await gerarSenhaHash(senha);

    const dadosInsert = [nome, email, senhaHash, permissao];

    const [result] = await pool.query(
      `INSERT INTO usuarios(nome, email, senha_hash, role) VALUES(?, ?, ?, ?)`,
      dadosInsert,
    );

    return res.status(201).json("Usuario registrado com sucesso");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao registrar o usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    if (!email || !senha) {
      return res.status(400).json({ error: "Email ou senha invalidos" });
    }

    const [result] = await pool.query(
      `Select * FROM usuarios WHERE email = ?`,
      [email],
    );

    let usuario = result[0];

    if (!usuario || !(await compararSenha(senha, usuario.senha_hash)))
      return res.status(400).json({ message: "Usuario não encontrado" });

    const token = gerarToken(usuario);

    res.status(200).json({ token: token });
  } catch (error) {
    // res.status(500).json({ error: "Erro ao fazer login" });
    res.status(500).json({ error: error.message });
  }
});

export default router;
