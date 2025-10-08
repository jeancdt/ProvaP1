const VolunteerModel = require("../models/volunteerModel");

/**
 * Service de voluntários
 * Contém a lógica de negócio
 * @class VolunteerService
 */
class VolunteerService {
  /**
   * Lista todos os voluntários
   * @returns {Promise<Array>} Lista de voluntários
   */
  static async listVolunteers() {
    const volunteers = await VolunteerModel.findAll();
    return volunteers;
  }

  /**
   * Busca voluntário por ID
   * @param {number} id - ID
   * @returns {Promise<Object>} Dados do voluntário
   * @throws {Error} Se o voluntário não for encontrado
   */
  static async getVolunteerById(id) {
    const volunteer = await VolunteerModel.findById(id);
    if (!volunteer) {
      throw new Error("Voluntário não encontrado");
    }
    return volunteer;
  }

  /**
   * Cria novo voluntário
   * @param {Object} volunteerData - Dados do voluntário
   * @param {string} volunteerData.name - Nome
   * @param {string} volunteerData.phone - Telefone
   * @param {string} [volunteerData.email] - Email (opcional)
   * @returns {Promise<Object>} Voluntário criado
   */
  static async createVolunteer(volunteerData) {
    const volunteer = await VolunteerModel.create(volunteerData);
    return volunteer;
  }

  /**
   * Atualiza voluntário existente
   * @param {number} id - ID
   * @param {Object} volunteerData - Dados atualizados do voluntário
   * @param {string} volunteerData.name - Nome
   * @param {string} volunteerData.phone - Telefone
   * @param {string} [volunteerData.email] - Email (opcional)
   * @returns {Promise<Object>} Voluntário atualizado
   * @throws {Error} Se o voluntário não for encontrado
   */
  static async updateVolunteer(id, volunteerData) {
    const updated = await VolunteerModel.update(id, volunteerData);
    if (!updated) {
      throw new Error("Voluntário não encontrado");
    }
    return { id, ...volunteerData };
  }

  /**
   * Exclui voluntário
   * @param {number} id - ID
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se o voluntário não for encontrado
   */
  static async deleteVolunteer(id) {
    const deleted = await VolunteerModel.delete(id);
    if (!deleted) {
      throw new Error("Voluntário não encontrado");
    }
    return { message: "Voluntário excluído com sucesso" };
  }
}

module.exports = VolunteerService;
