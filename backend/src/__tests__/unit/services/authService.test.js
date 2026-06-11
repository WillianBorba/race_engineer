jest.mock('../../../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('uuid');

const userModel = require('../../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const authService = require('../../../services/authService');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  // ─── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('returns a signed JWT when registration succeeds', async () => {
      uuidv4.mockReturnValue('generated-uuid');
      userModel.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed-password');
      jwt.sign.mockReturnValue('signed-token');

      const token = await authService.register('pilot@example.com', 'secret123');

      expect(userModel.findByEmail).toHaveBeenCalledWith('pilot@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
      expect(userModel.create).toHaveBeenCalledWith({
        id: 'generated-uuid',
        email: 'pilot@example.com',
        password: 'hashed-password',
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'generated-uuid', email: 'pilot@example.com' },
        'test-secret',
        { expiresIn: '7d' },
      );
      expect(token).toBe('signed-token');
    });

    it('throws 409 when email is already registered', async () => {
      userModel.findByEmail.mockResolvedValue({ id: 'u-1', email: 'pilot@example.com' });

      await expect(authService.register('pilot@example.com', 'secret123')).rejects.toMatchObject({
        status: 409,
        message: expect.any(String),
      });

      expect(userModel.create).not.toHaveBeenCalled();
    });

    it('throws 400 when email is missing', async () => {
      await expect(authService.register('', 'secret123')).rejects.toMatchObject({
        status: 400,
        message: expect.any(String),
      });

      expect(userModel.findByEmail).not.toHaveBeenCalled();
    });

    it('throws 400 when password is missing', async () => {
      await expect(authService.register('pilot@example.com', '')).rejects.toMatchObject({
        status: 400,
        message: expect.any(String),
      });

      expect(userModel.findByEmail).not.toHaveBeenCalled();
    });

    it('throws 400 when both email and password are missing', async () => {
      await expect(authService.register(undefined, undefined)).rejects.toMatchObject({
        status: 400,
        message: expect.any(String),
      });
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns a signed JWT when credentials are correct', async () => {
      const user = { id: 'u-1', email: 'pilot@example.com', password: 'hashed-password' };
      userModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('signed-token');

      const token = await authService.login('pilot@example.com', 'secret123');

      expect(userModel.findByEmail).toHaveBeenCalledWith('pilot@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('secret123', 'hashed-password');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'u-1', email: 'pilot@example.com' },
        'test-secret',
        { expiresIn: '7d' },
      );
      expect(token).toBe('signed-token');
    });

    it('throws 401 when user is not found', async () => {
      userModel.findByEmail.mockResolvedValue(null);

      await expect(authService.login('unknown@example.com', 'secret123')).rejects.toMatchObject({
        status: 401,
        message: expect.any(String),
      });

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('throws 401 when password is incorrect', async () => {
      const user = { id: 'u-1', email: 'pilot@example.com', password: 'hashed-password' };
      userModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('pilot@example.com', 'wrong-password')).rejects.toMatchObject({
        status: 401,
        message: expect.any(String),
      });
    });

    it('throws 400 when email is missing', async () => {
      await expect(authService.login('', 'secret123')).rejects.toMatchObject({
        status: 400,
        message: expect.any(String),
      });

      expect(userModel.findByEmail).not.toHaveBeenCalled();
    });

    it('throws 400 when password is missing', async () => {
      await expect(authService.login('pilot@example.com', '')).rejects.toMatchObject({
        status: 400,
        message: expect.any(String),
      });

      expect(userModel.findByEmail).not.toHaveBeenCalled();
    });
  });
});
