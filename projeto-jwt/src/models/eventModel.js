const db = require('../config/database');

class EventModel {
    static async findAll() {
        const [rows] = await db.query(
            'SELECT id, title, description, location, start_date, end_date FROM events ORDER BY start_date ASC'
        );
        return rows;
    }

    static async create(eventData) {
        const { title, description, location, start_date, end_date } = eventData;
        const [result] = await db.query(
            'INSERT INTO events (title, description, location, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [title, description, location, start_date, end_date]
        );
        return {
            id: result.insertId,
            title,
            description,
            location,
            start_date,
            end_date
        };
    }
}

module.exports = EventModel; 