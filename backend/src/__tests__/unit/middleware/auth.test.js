const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('when Authorization header is missing', () => {
    it('returns 401 with error message', () => {
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when Authorization header does not start with "Bearer "', () => {
    it('returns 401 with error message', () => {
      req.headers.authorization = 'Basic sometoken';

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when token is invalid or expired', () => {
    it('returns 401 with error message', () => {
      req.headers.authorization = 'Bearer bad.token.here';
      jwt.verify.mockImplementation(() => { throw new Error('jwt expired'); });

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when token is valid', () => {
    it('sets req.user and calls next()', () => {
      const payload = { id: 'user-1', email: 'pilot@example.com' };
      req.headers.authorization = 'Bearer valid.token.here';
      jwt.verify.mockReturnValue(payload);

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', 'test-secret');
      expect(req.user).toEqual(payload);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
