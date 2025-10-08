const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

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
    const existing = await UserModel.findByEmail(email);

    if (existing) {
      throw new Error("Usuário já existe");
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;

    const id = await UserModel.create(user);

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
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { token, user: { email: user.email, role: user.role } };
  }
}

module.exports = UserService;
