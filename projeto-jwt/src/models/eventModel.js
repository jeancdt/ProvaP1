const db = require('../config/database');

class EventModel {
    static async findAll() {
        const [rows] = await db.query(
            'SELECT id, title, description, location, start_date, end_date FROM events ORDER BY start_date ASC'
        );
        return rows;
    }
}

module.exports = EventModel; 