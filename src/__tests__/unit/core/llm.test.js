const http = require('http');
const { EventEmitter } = require('events');

jest.mock('http');

// Builds a fake http.request that replies with `responseBody`
function mockHttpRequest(responseBody) {
  const res = new EventEmitter();
  const req = new EventEmitter();
  req.write = jest.fn();
  req.end = jest.fn(() => {
    // Emit response data asynchronously (next tick)
    process.nextTick(() => {
      res.emit('data', responseBody);
      res.emit('end');
    });
  });

  http.request.mockImplementation((_options, callback) => {
    callback(res);
    return req;
  });

  return req;
}

describe('chat (LLM)', () => {
  let chat;

  beforeAll(() => {
    process.env.LLM_BASE_URL = 'http://localhost:11434';
    process.env.LLM_MODEL = 'llama3';
    chat = require('../../../core/llm').chat;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('resolves with message.content when the LLM returns the chat format', async () => {
    mockHttpRequest(JSON.stringify({ message: { content: 'Reduce rear wing by 2 clicks.' } }));

    const result = await chat({
      systemPrompt: 'You are a racing engineer.',
      turns: [{ role: 'user', content: 'Car is loose in slow corners.' }],
    });

    expect(result).toBe('Reduce rear wing by 2 clicks.');
  });

  it('resolves with response field when the LLM returns the generate format', async () => {
    mockHttpRequest(JSON.stringify({ response: 'Add 0.5 degrees of rear camber.' }));

    const result = await chat({
      systemPrompt: 'You are a racing engineer.',
      turns: [],
    });

    expect(result).toBe('Add 0.5 degrees of rear camber.');
  });

  it('sends the system prompt as the first message in the payload', async () => {
    mockHttpRequest(JSON.stringify({ message: { content: 'ok' } }));
    const req = { write: jest.fn(), end: jest.fn(), on: jest.fn() };
    http.request.mockReturnValue(req);

    // Redefine to capture written body
    let writtenBody = '';
    const fakeRes = new EventEmitter();
    const fakeReq = new EventEmitter();
    fakeReq.write = jest.fn(data => { writtenBody = data; });
    fakeReq.end = jest.fn(() => {
      process.nextTick(() => {
        fakeRes.emit('data', JSON.stringify({ message: { content: 'ok' } }));
        fakeRes.emit('end');
      });
    });
    http.request.mockImplementation((_opts, cb) => { cb(fakeRes); return fakeReq; });

    await chat({ systemPrompt: 'Be precise.', turns: [{ role: 'user', content: 'Hello' }] });

    const payload = JSON.parse(writtenBody);
    expect(payload.messages[0]).toEqual({ role: 'system', content: 'Be precise.' });
    expect(payload.messages[1]).toEqual({ role: 'user', content: 'Hello' });
    expect(payload.model).toBe('llama3');
    expect(payload.stream).toBe(false);
  });

  it('rejects when the HTTP request emits an error', async () => {
    const fakeReq = new EventEmitter();
    fakeReq.write = jest.fn();
    fakeReq.end = jest.fn(() => {
      process.nextTick(() => fakeReq.emit('error', new Error('ECONNREFUSED')));
    });
    http.request.mockImplementation(() => fakeReq);

    await expect(chat({ systemPrompt: 'sys', turns: [] })).rejects.toThrow('ECONNREFUSED');
  });

  it('rejects when the response body is not valid JSON', async () => {
    mockHttpRequest('not-json{{');

    await expect(chat({ systemPrompt: 'sys', turns: [] })).rejects.toThrow();
  });
});
