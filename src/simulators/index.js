const acc = require('./acc');

const adapters = {
  acc,
};

function getAdapter(simulator) {
  const adapter = adapters[simulator];
  if (!adapter) throw new Error(`Unknown simulator: ${simulator}`);
  return adapter;
}

module.exports = { getAdapter };
