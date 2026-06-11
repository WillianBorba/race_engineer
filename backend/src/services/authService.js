const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');

function buildError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.message = message;
  return err;
}

async function register(email, password) {
  if (!email || !password) {
    throw buildError(400, 'Email and password are required');
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw buildError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await userModel.create({ id, email, password: hashedPassword });

  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function login(email, password) {
  if (!email || !password) {
    throw buildError(400, 'Email and password are required');
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw buildError(401, 'Invalid credentials');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw buildError(401, 'Invalid credentials');
  }

  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { register, login };
