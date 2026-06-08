const { getAdapter } = require('../../../simulators');

describe('getAdapter', () => {
  it('returns the ACC adapter for "acc"', () => {
    const adapter = getAdapter('acc');

    expect(adapter).toBeDefined();
    expect(adapter.slug).toBe('acc');
    expect(typeof adapter.getSystemPrompt).toBe('function');
  });

  it('throws an error for an unknown simulator', () => {
    expect(() => getAdapter('iracing')).toThrow('Unknown simulator: iracing');
  });

  it('throws an error when simulator is undefined', () => {
    expect(() => getAdapter(undefined)).toThrow('Unknown simulator: undefined');
  });

  it('throws an error when simulator is an empty string', () => {
    expect(() => getAdapter('')).toThrow('Unknown simulator: ');
  });
});
