const jwt = require("jsonwebtoken");
const logger = require("../config/logger.config");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Tentativa de acesso sem token");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn(`Token inválido ou expirado - ${err.message}`);
      return res.sendStatus(403);
    }
    logger.debug(`Token validado com sucesso - User: ${user.email}`);
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      logger.warn(`Acesso negado - User: ${req.user.email}, Role esperado: ${role}, Role atual: ${req.user.role}`);
      return res.status(403).json({ message: "Acesso negado" });
    }
    logger.debug(`Autorização de role bem-sucedida - User: ${req.user.email}, Role: ${role}`);
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
