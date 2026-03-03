import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

const gerarToken = (usuario) => {
  const token = jwt.sign({ usuario: usuario }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  return token;
};

const gerarSenhaHash = async (senha) => {
  return await bcrypt.hash(senha, 10);
};

const compararSenha = async (senhaDigitada, senhaHashArmazenada) => {
  return bcrypt.compare(senhaDigitada, senhaHashArmazenada);
};

export { gerarToken, gerarSenhaHash, compararSenha };
