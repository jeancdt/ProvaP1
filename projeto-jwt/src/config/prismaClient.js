const { PrismaClient } = require("@prisma/client");

/**
 * Cliente Prisma conexão
 * @type {PrismaClient}
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

module.exports = prisma;
