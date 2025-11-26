const prisma = require("../config/prismaClient");

/**
 * Model de usuários
 * @class UserModel
 */
class UserModel {
  /**
   * Busca um usuário pelo email
   * @param {string} email - Email
   * @returns {Promise<Object|null>} Objeto ou null se não encontrado
   */
  static async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
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
    const createdUser = await prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });

    return createdUser.id;
  }
}

module.exports = UserModel;
