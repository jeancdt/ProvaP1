const db = require("../config/database");

class EventModel {
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
      `SELECT v.name 
            FROM volunteers v 
            INNER JOIN event_volunteers ev ON v.id = ev.volunteer_id 
            WHERE ev.event_id = ?`,
      [id]
    );
    event.volunteers = volunteers.map((v) => v.name).join(", ");

    return event;
  }

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

  static async delete(id) {
    // DELETE CASCADE
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

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
