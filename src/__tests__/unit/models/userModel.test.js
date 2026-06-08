jest.mock('../../../db/connection');

const db = require('../../../db/connection');
const userModel = require('../../../models/userModel');

describe('userModel', () => {
  afterEach(() => jest.clearAllMocks());

  describe('findByEmail', () => {
    it('returns the user when found', async () => {
      const user = { id: 'u-1', email: 'pilot@example.com', password: 'hashed' };
      db.query.mockResolvedValue([[user]]);

      const result = await userModel.findByEmail('pilot@example.com');

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['pilot@example.com'],
      );
      expect(result).toEqual(user);
    });

    it('returns null when no user is found', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await userModel.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('executes the INSERT with the correct parameters', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await userModel.create({ id: 'u-1', email: 'pilot@example.com', password: 'hashed_pw' });

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
        ['u-1', 'pilot@example.com', 'hashed_pw'],
      );
    });
  });
});
