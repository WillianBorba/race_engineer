const http = require('http');

async function chat({ systemPrompt, turns }) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...turns.map(t => ({ role: t.role, content: t.content })),
  ];

  const body = JSON.stringify({
    model: process.env.LLM_MODEL,
    messages,
    stream: false,
  });

  return new Promise((resolve, reject) => {
    const url = new URL(`${process.env.LLM_BASE_URL}/api/chat`);
    const req = http.request(
      { hostname: url.hostname, port: url.port, path: url.pathname, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.message?.content ?? parsed.response);
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { chat };
