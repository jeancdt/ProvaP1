const db = require("../config/database");

/**
 * Model de usuários
 * @class UserModel
 */
class UserModel {
  /**
   * Busca um usuário pelo email
   * @param {string} email - Email
   * @returns {Promise<Object|undefined>} Objeto ou undefined se não encontrado
   */
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  /**
   * Cria um novo usuário
   * @param {Object} user - Dados do usuário
   * @param {string} user.email - Email
   * @param {string} user.password - Senha criptografada
   * @param {string} user.role - Papel (user ou admin)
   * @returns {Promise<number>} ID criado
   */
  static async create(user) {
    const { email, password, role } = user;
    const [result] = await db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [
      email,
      password,
      role,
    ]);

    return result.insertId;
  }
}

module.exports = UserModel;
