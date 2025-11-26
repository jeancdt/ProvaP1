const UserService = require("../services/userService");
const logger = require("../config/logger.config");

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
      const { email, role } = req.body;
      logger.info(`Tentativa de registro - Email: ${email}, Role: ${role}`);

      const result = await UserService.registerUser(req.body);

      logger.info(`Usuário registrado com sucesso - Email: ${email}`);
      return res.status(201).json(result);
    } catch (error) {
      logger.error(`Erro ao registrar usuário - Email: ${req.body.email} - ${error.message}`, { stack: error.stack });
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
      const { email } = req.body;
      logger.info(`Tentativa de login - Email: ${email}`);

      const result = await UserService.loginUser(req.body);

      logger.info(`Login realizado com sucesso - Email: ${email}`);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === "Usuário não encontrado" || error.message === "Senha inválida" ? 401 : 500;

      logger.warn(`Falha no login - Email: ${req.body.email} - Motivo: ${error.message}`);

      if (status === 500) {
        logger.error(`Erro interno no login - Email: ${req.body.email}`, { stack: error.stack });
      }

      return res.status(status).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
