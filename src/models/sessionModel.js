const db = require('../db/connection');

async function create({ id, userId, simulator, track, car }) {
  await db.query(
    'INSERT INTO sessions (id, user_id, simulator, track, car) VALUES (?, ?, ?, ?, ?)',
    [id, userId, simulator, track ?? null, car ?? null],
  );
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM sessions WHERE id = ?', [id]);
  return rows[0] ?? null;
}

async function findByUser(userId) {
  const [rows] = await db.query(
    'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
  );
  return rows;
}

module.exports = { create, findById, findByUser };
