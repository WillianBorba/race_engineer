// Mock lucide-react icons for Jest — returns a simple function component per icon
const React = require('react');

const createMockIcon = (name) => {
  function MockIcon({ size = 24, ...props }) {
    return React.createElement('svg', {
      'data-testid': `icon-${name}`,
      width: size,
      height: size,
      'aria-hidden': 'true',
      ...props,
    });
  }
  MockIcon.displayName = name;
  return MockIcon;
};

module.exports = new Proxy(
  { __esModule: true },
  {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return createMockIcon(String(prop));
    },
  }
);
