const { S3Client } = require('@aws-sdk/client-s3');

// Mock the entire AWS SDK module before importing s3.js
jest.mock('@aws-sdk/client-s3', () => {
  const sendMock = jest.fn();
  return {
    S3Client: jest.fn().mockImplementation(() => ({ send: sendMock })),
    PutObjectCommand: jest.fn().mockImplementation(input => ({ _input: input })),
    GetObjectCommand: jest.fn().mockImplementation(input => ({ _input: input })),
    __sendMock: sendMock,
  };
});

// Helper to get the shared send mock
const getSend = () => require('@aws-sdk/client-s3').__sendMock;

// Re-require storage after mock is in place
let storage;
beforeAll(() => {
  process.env.S3_BUCKET = 'test-bucket';
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_ACCESS_KEY_ID = 'test';
  process.env.AWS_SECRET_ACCESS_KEY = 'test';
  storage = require('../../../storage/s3');
});

afterEach(() => {
  getSend().mockReset();
});

describe('getTurns', () => {
  it('returns an empty array when the key does not exist in S3', async () => {
    const err = new Error('Not found');
    err.name = 'NoSuchKey';
    getSend().mockRejectedValue(err);

    const turns = await storage.getTurns('session-abc');

    expect(turns).toEqual([]);
  });

  it('returns parsed turns when the key exists', async () => {
    const existing = [
      { role: 'user', content: 'Car is understeering in fast corners' },
      { role: 'assistant', content: 'Reduce front wing angle by 1 click.' },
    ];
    getSend().mockResolvedValue({
      Body: { transformToString: async () => JSON.stringify(existing) },
    });

    const turns = await storage.getTurns('session-abc');

    expect(turns).toEqual(existing);
  });

  it('re-throws errors that are not NoSuchKey', async () => {
    const err = new Error('Access denied');
    err.name = 'AccessDenied';
    getSend().mockRejectedValue(err);

    await expect(storage.getTurns('session-abc')).rejects.toThrow('Access denied');
  });
});

describe('appendTurn', () => {
  it('appends the turn to an empty conversation and calls PutObject', async () => {
    // First send (GetObject) → NoSuchKey; second send (PutObject) → success
    const noSuchKey = new Error('Not found');
    noSuchKey.name = 'NoSuchKey';
    getSend()
      .mockRejectedValueOnce(noSuchKey)
      .mockResolvedValueOnce({});

    const newTurn = { role: 'user', content: 'Too much oversteer' };
    await storage.appendTurn('session-abc', newTurn);

    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const putCall = PutObjectCommand.mock.calls[0][0];

    expect(putCall.Bucket).toBe('test-bucket');
    expect(putCall.Key).toBe('conversations/session-abc.json');
    expect(JSON.parse(putCall.Body)).toEqual([newTurn]);
  });

  it('appends to existing turns and preserves previous history', async () => {
    const existing = [{ role: 'user', content: 'First message' }];
    getSend()
      .mockResolvedValueOnce({
        Body: { transformToString: async () => JSON.stringify(existing) },
      })
      .mockResolvedValueOnce({});

    const newTurn = { role: 'assistant', content: 'My response' };
    await storage.appendTurn('session-xyz', newTurn);

    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const putCall = PutObjectCommand.mock.calls[0][0];

    expect(JSON.parse(putCall.Body)).toEqual([...existing, newTurn]);
  });
});
