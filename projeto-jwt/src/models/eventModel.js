const db = require("../config/database");

/**
 * Model de eventos
 * @class EventModel
 */
class EventModel {
  /**
   * Busca todos os eventos ordenados por data de início
   * Inclui os nomes dos voluntários
   * @returns {Promise<Array>} Lista de eventos com voluntários
   */
  static async findAll() {
    const [events] = await db.query(
      "SELECT id, title, description, location, start_date, end_date FROM events ORDER BY start_date ASC"
    );

    for (let event of events) {
      const [volunteers] = await db.query(
        `SELECT v.name 
                FROM volunteers v 
                INNER JOIN event_volunteers ev ON v.id = ev.volunteer_id 
                WHERE ev.event_id = ?`,
        [event.id]
      );
      event.volunteers = volunteers.map((v) => v.name).join(", ");
    }

    return events;
  }

  /**
   * Busca um evento por ID
   * Inclui os nomes e IDs dos voluntários
   * @param {number} id - ID
   * @returns {Promise<Object|null>} Objeto ou null se não encontrado
   */
  static async findById(id) {
    const [events] = await db.query(
      "SELECT id, title, description, location, start_date, end_date FROM events WHERE id = ?",
      [id]
    );

    if (events.length === 0) {
      return null;
    }

    const event = events[0];

    const [volunteers] = await db.query(
      `SELECT v.id, v.name 
            FROM volunteers v 
            INNER JOIN event_volunteers ev ON v.id = ev.volunteer_id 
            WHERE ev.event_id = ?`,
      [id]
    );

    event.volunteers = volunteers.map((v) => v.name).join(", ");
    event.volunteer_ids = volunteers.map((v) => v.id);

    return event;
  }

  /**
   * Cria um novo evento
   * Associa os voluntários ao evento criado
   * @param {Object} eventData - Dados do evento
   * @param {string} eventData.title - Título
   * @param {string} eventData.description - Descrição
   * @param {string} eventData.location - Local
   * @param {string} eventData.start_date - Data de início
   * @param {string} eventData.end_date - Data de término
   * @param {Array<number>} eventData.volunteer_ids - IDs dos voluntários
   * @returns {Promise<Object>} Evento criado com todos
   */
  static async create(eventData) {
    const { title, description, location, start_date, end_date, volunteer_ids } = eventData;

    const [result] = await db.query(
      "INSERT INTO events (title, description, location, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
      [title, description, location, start_date, end_date]
    );

    const eventId = result.insertId;

    if (volunteer_ids && volunteer_ids.length > 0) {
      const values = volunteer_ids.map((volunteerId) => [eventId, volunteerId]);
      await db.query("INSERT INTO event_volunteers (event_id, volunteer_id) VALUES ?", [values]);
    }

    return await this.findById(eventId);
  }

  /**
   * Atualiza evento existente
   * Remove e recria as associações com voluntários
   * @param {number} id - ID
   * @param {Object} eventData - Dados atualizados
   * @param {string} eventData.title - Título
   * @param {string} eventData.description - Descrição
   * @param {string} eventData.location - Local
   * @param {string} eventData.start_date - Data de início
   * @param {string} eventData.end_date - Data de término
   * @param {Array<number>} eventData.volunteer_ids - IDs dos voluntários
   * @returns {Promise<Object>} Evento atualizado com todos os dados
   */
  static async update(id, eventData) {
    const { title, description, location, start_date, end_date, volunteer_ids } = eventData;

    await db.query(
      "UPDATE events SET title = ?, description = ?, location = ?, start_date = ?, end_date = ? WHERE id = ?",
      [title, description, location, start_date, end_date, id]
    );

    if (volunteer_ids !== undefined) {
      await db.query("DELETE FROM event_volunteers WHERE event_id = ?", [id]);

      if (volunteer_ids.length > 0) {
        const values = volunteer_ids.map((volunteerId) => [id, volunteerId]);
        await db.query("INSERT INTO event_volunteers (event_id, volunteer_id) VALUES ?", [values]);
      }
    }

    return await this.findById(id);
  }

  /**
   * Exclui um evento
   * As associações com voluntários são removidas automaticamente (CASCADE)
   * @param {number} id - ID
   * @returns {Promise<boolean>} true se o evento foi excluído
   */
  static async delete(id) {
    // DELETE CASCADE
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  /**
   * Verifica quais voluntários existem
   * @param {Array<number>} volunteerIds - Lista de IDs de voluntários
   * @returns {Promise<Array<number>>} Lista de IDs que existem
   */
  static async verifyVolunteersExist(volunteerIds) {
    if (!volunteerIds || volunteerIds.length === 0) {
      return [];
    }

    const placeholders = volunteerIds.map(() => "?").join(",");
    const [volunteers] = await db.query(`SELECT id FROM volunteers WHERE id IN (${placeholders})`, volunteerIds);

    return volunteers.map((v) => v.id);
  }
}

module.exports = EventModel;
