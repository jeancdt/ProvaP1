const db = require("../config/database");

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
    const [rows] = await db.query("SELECT * FROM volunteers");
    return rows;
  }

  /**
   * Busca um voluntário por ID
   * @param {number} id - ID
   * @returns {Promise<Object|undefined>} Objeto do voluntário ou undefined se não encontrado
   */
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM volunteers WHERE id = ?", [id]);
    return rows[0];
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
    const [result] = await db.query("INSERT INTO volunteers (name, phone, email) VALUES (?, ?, ?)", [
      name,
      phone,
      email,
    ]);
    return { id: result.insertId, name, phone, email };
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
    const [result] = await db.query("UPDATE volunteers SET name = ?, phone = ?, email = ? WHERE id = ?", [
      name,
      phone,
      email,
      id,
    ]);
    return result.affectedRows > 0;
  }

  /**
   * Exclui um voluntário
   * @param {number} id - ID
   * @returns {Promise<boolean>} true se o voluntário foi excluído
   */
  static async delete(id) {
    const [result] = await db.query("DELETE FROM volunteers WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = VolunteerModel;
