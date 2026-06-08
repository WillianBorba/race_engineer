const { getSystemPrompt } = require('../../../../simulators/acc/prompts');

describe('getSystemPrompt (ACC)', () => {
  const BASE_SENTENCES = [
    'You are a professional racing engineer for Assetto Corsa Competizione.',
    'Your role is to analyze driver feedback and suggest car setup changes.',
    'Base every suggestion on the conversation history and the physical reasoning behind it.',
    'Be concise and precise — drivers are in a hurry.',
  ];

  it('returns the base prompt when called with no arguments', () => {
    const prompt = getSystemPrompt();

    BASE_SENTENCES.forEach(sentence => {
      expect(prompt).toContain(sentence);
    });
  });

  it('does not include track or car lines when none are provided', () => {
    const prompt = getSystemPrompt();

    expect(prompt).not.toContain('Current track:');
    expect(prompt).not.toContain('Current car:');
  });

  it('includes the track when provided', () => {
    const prompt = getSystemPrompt({ track: 'Monza' });

    expect(prompt).toContain('Current track: Monza.');
  });

  it('includes the car when provided', () => {
    const prompt = getSystemPrompt({ car: 'Ferrari 488 GT3' });

    expect(prompt).toContain('Current car: Ferrari 488 GT3.');
  });

  it('includes both track and car when both are provided', () => {
    const prompt = getSystemPrompt({ track: 'Spa', car: 'McLaren 720S GT3' });

    expect(prompt).toContain('Current track: Spa.');
    expect(prompt).toContain('Current car: McLaren 720S GT3.');
  });

  it('returns a single string (not an array)', () => {
    expect(typeof getSystemPrompt()).toBe('string');
  });
});
