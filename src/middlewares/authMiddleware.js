import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).send("Acesso negado. Nenhum token fornecido.");

  try {
    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDecodificado)
      return res.status(403).json({ message: "Token Invalido" });

    req.usuario = tokenDecodificado;
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token.");
  }
}
