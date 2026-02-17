import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export function gerarToken(user) {
  return jwt.sign({ userId: user.id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}
