const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true }),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET;

async function appendTurn(sessionId, turn) {
  const key = `conversations/${sessionId}.json`;
  let turns = await getTurns(sessionId);
  turns.push(turn);
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(turns),
    ContentType: 'application/json',
  }));
}

async function getTurns(sessionId) {
  const key = `conversations/${sessionId}.json`;
  try {
    const response = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const body = await response.Body.transformToString();
    return JSON.parse(body);
  } catch (err) {
    if (err.name === 'NoSuchKey') return [];
    throw err;
  }
}

module.exports = { appendTurn, getTurns };
