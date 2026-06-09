const db = require('../db/connection');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] ?? null;
}

async function create({ id, email, password }) {
  await db.query('INSERT INTO users (id, email, password) VALUES (?, ?, ?)', [id, email, password]);
}

module.exports = { findByEmail, create };
