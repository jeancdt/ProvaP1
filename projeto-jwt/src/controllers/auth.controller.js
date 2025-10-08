const UserService = require("../services/userService");

/**
 * Controller de autenticação
 * @class AuthController
 */
class AuthController {
  /**
   * Registra novo usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.email - Email
   * @param {string} req.body.password - Senha
   * @param {string} req.body.role - Papel (user ou admin)
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<Object>} JSON com mensagem de sucesso
   */
  static async register(req, res) {
    try {
      const result = await UserService.registerUser(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(409).json({ message: error.message });
    }
  }

  /**
   * Realiza login de usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.email - Email
   * @param {string} req.body.password - Senha
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<Object>} JSON com token JWT e dados do usuário
   */
  static async login(req, res) {
    try {
      const result = await UserService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === "Usuário não encontrado" || error.message === "Senha inválida" ? 401 : 500;
      return res.status(status).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
