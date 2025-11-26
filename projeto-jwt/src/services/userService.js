const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const logger = require("../config/logger.config");

/**
 * Service de usuários e autenticação
 * @class UserService
 */
class UserService {
  /**
   * Registra novo usuário
   * Verifica se o email já existe e criptografa a senha
   * @param {Object} user - Dados do usuário
   * @param {string} user.email - Email
   * @param {string} user.password - Senha em texto plano
   * @param {string} user.role - Papel (user ou admin)
   * @returns {Promise<Object>} Mensagem de sucesso e ID
   * @throws {Error} Se o usuário já existir
   */
  static async registerUser(user) {
    const { email, password } = user;
    logger.debug(`Verificando existência de usuário - Email: ${email}`);
    const existing = await UserModel.findByEmail(email);

    if (existing) {
      logger.warn(`Tentativa de registro com email já existente - Email: ${email}`);
      throw new Error("Usuário já existe");
    }

    logger.debug("Criptografando senha");
    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;

    const id = await UserModel.create(user);
    logger.info(`Novo usuário criado no banco de dados - ID: ${id}, Email: ${email}`);

    return { message: "Usuário registrado com sucesso", id };
  }

  /**
   * Realiza login do usuário
   * Verifica as credenciais e gera um token JWT
   * @param {Object} credentials - Credenciais de login
   * @param {string} credentials.email - Email
   * @param {string} credentials.password - Senha
   * @returns {Promise<Object>} Token JWT e dados do usuário
   * @throws {Error} Se o usuário não for encontrado ou a senha for inválida
   */
  static async loginUser({ email, password }) {
    logger.debug(`Buscando usuário no banco de dados - Email: ${email}`);
    const user = await UserModel.findByEmail(email);

    if (!user) {
      logger.warn(`Tentativa de login com usuário inexistente - Email: ${email}`);
      throw new Error("Usuário não encontrado");
    }

    logger.debug(`Verificando senha - Email: ${email}`);
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      logger.warn(`Tentativa de login com senha inválida - Email: ${email}`);
      throw new Error("Senha inválida");
    }

    logger.debug(`Gerando token JWT - Email: ${email}`);
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { token, user: { email: user.email, role: user.role } };
  }
}

module.exports = UserService;
