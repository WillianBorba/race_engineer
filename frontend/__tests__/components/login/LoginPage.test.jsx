import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../app/login/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Helpers — plain objects because jsdom does not expose the Response constructor
function successResponse(status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve({ ok: true }),
  });
}

function errorResponse(status, message) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe('LoginPage', () => {
  describe('initial render — login mode', () => {
    it('renders email and password fields', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    });

    it('renders the Race Engineer logo', () => {
      render(<LoginPage />);
      expect(screen.getByText(/race/i)).toBeInTheDocument();
      expect(screen.getByText(/engineer/i)).toBeInTheDocument();
    });

    it('renders the submit button with "Entrar" label', () => {
      render(<LoginPage />);
      expect(screen.getByRole('button', { name: /^entrar$/i })).toBeInTheDocument();
    });

    it('renders the toggle link "Criar conta"', () => {
      render(<LoginPage />);
      expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
    });
  });

  describe('mode toggle', () => {
    it('switches to register mode when toggle link is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(screen.getByRole('button', { name: /criar conta/i }));

      // Submit button should now say "Criar conta"
      expect(screen.getByRole('button', { name: /^criar conta$/i })).toBeInTheDocument();
      // Toggle link should now say "Entrar"
      expect(screen.getByRole('button', { name: /^entrar$/i })).toBeInTheDocument();
    });

    it('switches back to login mode when toggle link is clicked again', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.click(screen.getByRole('button', { name: /criar conta/i }));
      await user.click(screen.getByRole('button', { name: /^entrar$/i }));

      // Back to login: submit button says "Entrar"
      const buttons = screen.getAllByRole('button', { name: /^entrar$/i });
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('form submission — login mode', () => {
    it('calls /api/auth/login with email and password on submit', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(successResponse(200));

      render(<LoginPage />);

      await user.type(screen.getByLabelText(/e-mail/i), 'pilot@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'secret123');
      await user.click(screen.getByRole('button', { name: /^entrar$/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: 'pilot@example.com', password: 'secret123' }),
          })
        );
      });
    });

    it('redirects to /chat on successful login', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(successResponse(200));

      render(<LoginPage />);

      await user.type(screen.getByLabelText(/e-mail/i), 'pilot@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'secret123');
      await user.click(screen.getByRole('button', { name: /^entrar$/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/chat');
      });
    });
  });

  describe('form submission — register mode', () => {
    it('calls /api/auth/register with email and password on submit', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(successResponse(201));

      render(<LoginPage />);

      // Switch to register mode
      await user.click(screen.getByRole('button', { name: /criar conta/i }));

      await user.type(screen.getByLabelText(/e-mail/i), 'newpilot@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'newpass456');
      await user.click(screen.getByRole('button', { name: /^criar conta$/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: 'newpilot@example.com', password: 'newpass456' }),
          })
        );
      });
    });

    it('redirects to /chat on successful register', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(successResponse(201));

      render(<LoginPage />);

      await user.click(screen.getByRole('button', { name: /criar conta/i }));

      await user.type(screen.getByLabelText(/e-mail/i), 'newpilot@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'newpass456');
      await user.click(screen.getByRole('button', { name: /^criar conta$/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/chat');
      });
    });
  });

  describe('error handling', () => {
    it('displays the error message returned by the API on login failure', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(errorResponse(401, 'Credenciais inválidas.'));

      render(<LoginPage />);

      await user.type(screen.getByLabelText(/e-mail/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /^entrar$/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas.');
      });
    });

    it('displays the error message returned by the API on register failure', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(errorResponse(409, 'E-mail já cadastrado.'));

      render(<LoginPage />);

      await user.click(screen.getByRole('button', { name: /criar conta/i }));

      await user.type(screen.getByLabelText(/e-mail/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'somepass');
      await user.click(screen.getByRole('button', { name: /^criar conta$/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('E-mail já cadastrado.');
      });
    });

    it('does not redirect when the API returns an error', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(errorResponse(401, 'Credenciais inválidas.'));

      render(<LoginPage />);

      await user.type(screen.getByLabelText(/e-mail/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /^entrar$/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('clears a previous error when switching mode', async () => {
      const user = userEvent.setup();
      global.fetch.mockReturnValue(errorResponse(401, 'Credenciais inválidas.'));

      render(<LoginPage />);

      await user.type(screen.getByLabelText(/e-mail/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /^entrar$/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /criar conta/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
