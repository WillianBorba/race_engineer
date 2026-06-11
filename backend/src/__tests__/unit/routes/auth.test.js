jest.mock('../../../services/authService');

const request = require('supertest');
const express = require('express');
const authService = require('../../../services/authService');
const authRouter = require('../../../routes/auth');

// Minimal Express app to mount the router under test
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('POST /api/auth/register', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 201 and token when registration succeeds', async () => {
    authService.register.mockResolvedValue('signed-token');

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'pilot@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ token: 'signed-token' });
    expect(authService.register).toHaveBeenCalledWith('pilot@example.com', 'secret123');
  });

  it('returns 400 when email or password is missing', async () => {
    authService.register.mockRejectedValue({ status: 400, message: 'Email and password are required' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: '', password: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 409 when email is already registered', async () => {
    authService.register.mockRejectedValue({ status: 409, message: 'Email already registered' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'pilot@example.com', password: 'secret123' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 200 and token when login succeeds', async () => {
    authService.login.mockResolvedValue('signed-token');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pilot@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 'signed-token' });
    expect(authService.login).toHaveBeenCalledWith('pilot@example.com', 'secret123');
  });

  it('returns 401 when credentials are invalid', async () => {
    authService.login.mockRejectedValue({ status: 401, message: 'Invalid credentials' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pilot@example.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when email or password is missing', async () => {
    authService.login.mockRejectedValue({ status: 400, message: 'Email and password are required' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
