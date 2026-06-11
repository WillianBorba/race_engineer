const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routes (added as features are built)
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/sessions', require('./routes/sessions'));
// app.use('/api/chat', require('./routes/chat'));

module.exports = app;
