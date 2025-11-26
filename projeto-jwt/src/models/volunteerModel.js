const prisma = require("../config/prismaClient");

/**
 * Model de voluntários
 * @class VolunteerModel
 */
class VolunteerModel {
  /**
   * Busca todos os voluntários
   * @returns {Promise<Array>} Lista de voluntários
   */
  static async findAll() {
    const volunteers = await prisma.volunteer.findMany();
    return volunteers;
  }

  /**
   * Busca um voluntário por ID
   * @param {number} id - ID
   * @returns {Promise<Object|null>} Objeto do voluntário ou null se não encontrado
   */
  static async findById(id) {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: parseInt(id) },
    });
    return volunteer;
  }

  /**
   * Cria um novo voluntário
   * @param {Object} volunteer - Dados do voluntário
   * @param {string} volunteer.name - Nome
   * @param {string} volunteer.phone - Telefone
   * @param {string} [volunteer.email] - Email (opcional)
   * @returns {Promise<Object>} Voluntário criado com ID
   */
  static async create(volunteer) {
    const { name, phone, email } = volunteer;
    const createdVolunteer = await prisma.volunteer.create({
      data: {
        name,
        phone,
        email: email || null,
      },
    });
    return createdVolunteer;
  }

  /**
   * Atualiza um voluntário existente
   * @param {number} id - ID
   * @param {Object} volunteer - Dados atualizados do voluntário
   * @param {string} volunteer.name - Nome
   * @param {string} volunteer.phone - Telefone
   * @param {string} [volunteer.email] - Email (opcional)
   * @returns {Promise<boolean>} true se o voluntário foi atualizado
   */
  static async update(id, volunteer) {
    const { name, phone, email } = volunteer;
    try {
      await prisma.volunteer.update({
        where: { id: parseInt(id) },
        data: {
          name,
          phone,
          email: email || null,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Exclui um voluntário
   * @param {number} id - ID
   * @returns {Promise<boolean>} true se o voluntário foi excluído
   */
  static async delete(id) {
    try {
      await prisma.volunteer.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = VolunteerModel;
