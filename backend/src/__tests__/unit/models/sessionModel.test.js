jest.mock('../../../db/connection');

const db = require('../../../db/connection');
const sessionModel = require('../../../models/sessionModel');

describe('sessionModel', () => {
  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('inserts a session with all fields provided', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await sessionModel.create({
        id: 's-1',
        userId: 'u-1',
        simulator: 'acc',
        track: 'Monza',
        car: 'Ferrari 488 GT3',
      });

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO sessions (id, user_id, simulator, track, car) VALUES (?, ?, ?, ?, ?)',
        ['s-1', 'u-1', 'acc', 'Monza', 'Ferrari 488 GT3'],
      );
    });

    it('inserts null for track and car when they are not provided', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await sessionModel.create({ id: 's-2', userId: 'u-1', simulator: 'acc' });

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO sessions (id, user_id, simulator, track, car) VALUES (?, ?, ?, ?, ?)',
        ['s-2', 'u-1', 'acc', null, null],
      );
    });
  });

  describe('findById', () => {
    it('returns the session when found', async () => {
      const session = { id: 's-1', user_id: 'u-1', simulator: 'acc', track: 'Spa', car: null };
      db.query.mockResolvedValue([[session]]);

      const result = await sessionModel.findById('s-1');

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM sessions WHERE id = ?',
        ['s-1'],
      );
      expect(result).toEqual(session);
    });

    it('returns null when session is not found', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await sessionModel.findById('does-not-exist');

      expect(result).toBeNull();
    });
  });

  describe('findByUser', () => {
    it('returns all sessions for the user ordered by created_at DESC', async () => {
      const sessions = [
        { id: 's-2', user_id: 'u-1', simulator: 'acc', track: 'Spa' },
        { id: 's-1', user_id: 'u-1', simulator: 'acc', track: 'Monza' },
      ];
      db.query.mockResolvedValue([sessions]);

      const result = await sessionModel.findByUser('u-1');

      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
        ['u-1'],
      );
      expect(result).toEqual(sessions);
    });

    it('returns an empty array when the user has no sessions', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await sessionModel.findByUser('u-1');

      expect(result).toEqual([]);
    });
  });
});
