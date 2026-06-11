import { render, screen } from '@testing-library/react';
import Navbar from '../../../components/landing/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Navbar', () => {
  it('renders the "Race Engineer" logo text', () => {
    const { container } = render(<Navbar />);
    // The logo link renders "Race" + "Engineer" in a span, both within an <a href="/">
    const logoLink = container.querySelector('a[href="/"]');
    expect(logoLink).not.toBeNull();
    expect(logoLink.textContent).toMatch(/race/i);
    expect(logoLink.textContent).toMatch(/engineer/i);
  });

  it('the "Entrar" link points to "/login"', () => {
    render(<Navbar />);
    // There are two "Entrar" links: desktop nav + mobile menu
    const entrarLinks = screen.getAllByText('Entrar');
    expect(entrarLinks.length).toBeGreaterThanOrEqual(1);
    entrarLinks.forEach((link) => {
      expect(link.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  it('the "Começar Agora" button/link is present', () => {
    render(<Navbar />);
    const startButtons = screen.getAllByText('Começar Agora');
    expect(startButtons.length).toBeGreaterThanOrEqual(1);
  });
});
