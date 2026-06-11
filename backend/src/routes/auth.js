const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.register(email, password);
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;
