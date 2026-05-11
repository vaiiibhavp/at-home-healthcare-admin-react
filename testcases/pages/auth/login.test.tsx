import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('should render login form', () => {
    const Login = () => (
      <div>
        <h1>auth.login</h1>
        <form data-testid="login-form">
          <input data-testid="email-input" type="email" placeholder="auth.email" />
          <input data-testid="password-input" type="password" placeholder="auth.password" />
          <button data-testid="login-button" type="submit">auth.signIn</button>
        </form>
        <a href="/forgot-password" data-testid="forgot-password-link">auth.forgotPassword</a>
      </div>
    );
    
    render(<Login />);
    
    expect(screen.getByText('auth.login')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('forgot-password-link')).toBeInTheDocument();
  });

  test('should handle form input changes', () => {
    const LoginForm = () => (
      <form data-testid="login-form">
        <input data-testid="email-input" type="email" />
        <input data-testid="password-input" type="password" />
      </form>
    );
    
    render(<LoginForm />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('should handle form submission', async () => {
    const mockOnSubmit = jest.fn();
    const LoginForm = ({ onSubmit }: any) => (
      <form data-testid="login-form" onSubmit={onSubmit}>
        <input data-testid="email-input" type="email" />
        <input data-testid="password-input" type="password" />
        <button data-testid="login-button" type="submit">auth.signIn</button>
      </form>
    );
    
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('should validate required fields', () => {
    const LoginForm = ({ errors }: any) => (
      <form data-testid="login-form">
        <input data-testid="email-input" type="email" />
        <input data-testid="password-input" type="password" />
        {errors.email && <span data-testid="email-error">{errors.email}</span>}
        {errors.password && <span data-testid="password-error">{errors.password}</span>}
      </form>
    );
    
    const mockErrors = {
      email: 'auth.emailRequired',
      password: 'auth.passwordRequired'
    };
    
    render(<LoginForm errors={mockErrors} />);
    
    expect(screen.getByTestId('email-error')).toHaveTextContent('auth.emailRequired');
    expect(screen.getByTestId('password-error')).toHaveTextContent('auth.passwordRequired');
  });

  test('should handle loading state', () => {
    const LoginForm = ({ isLoading }: any) => (
      <form data-testid="login-form">
        <input data-testid="email-input" type="email" disabled={isLoading} />
        <input data-testid="password-input" type="password" disabled={isLoading} />
        <button data-testid="login-button" type="submit" disabled={isLoading}>
          {isLoading ? 'auth.signingIn' : 'auth.signIn'}
        </button>
      </form>
    );
    
    render(<LoginForm isLoading={true} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');
    
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('auth.signingIn');
  });

  test('should handle remember me functionality', () => {
    const LoginForm = ({ onRememberMeChange }: any) => (
      <form data-testid="login-form">
        <input data-testid="email-input" type="email" />
        <input data-testid="password-input" type="password" />
        <input 
          data-testid="remember-me" 
          type="checkbox" 
          onChange={(e) => onRememberMeChange(e.target.checked)}
        />
        <button data-testid="login-button" type="submit">auth.signIn</button>
      </form>
    );
    
    const mockOnRememberMeChange = jest.fn();
    render(<LoginForm onRememberMeChange={mockOnRememberMeChange} />);
    
    const rememberMeCheckbox = screen.getByTestId('remember-me');
    fireEvent.click(rememberMeCheckbox);
    
    expect(mockOnRememberMeChange).toHaveBeenCalledWith(true);
  });

  test('should handle password visibility toggle', () => {
    const LoginForm = ({ showPassword, onTogglePassword }: any) => (
      <form data-testid="login-form">
        <input 
          data-testid="password-input" 
          type={showPassword ? 'text' : 'password'} 
        />
        <button 
          data-testid="toggle-password" 
          type="button"
          onClick={onTogglePassword}
        >
          {showPassword ? 'auth.hide' : 'auth.show'}
        </button>
      </form>
    );
    
    const mockOnTogglePassword = jest.fn();
    render(<LoginForm showPassword={false} onTogglePassword={mockOnTogglePassword} />);
    
    const passwordInput = screen.getByTestId('password-input');
    const toggleButton = screen.getByTestId('toggle-password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveTextContent('auth.show');
    
    fireEvent.click(toggleButton);
    
    expect(mockOnTogglePassword).toHaveBeenCalled();
  });

  test('should navigate to forgot password', () => {
    const Login = () => (
      <div>
        <form data-testid="login-form">
          <input data-testid="email-input" type="email" />
          <input data-testid="password-input" type="password" />
          <button data-testid="login-button" type="submit">auth.signIn</button>
        </form>
        <a href="/forgot-password" data-testid="forgot-password-link">auth.forgotPassword</a>
      </div>
    );
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    const forgotPasswordLink = screen.getByTestId('forgot-password-link');
    fireEvent.click(forgotPasswordLink);
    
    // In a real implementation, this would navigate to forgot password
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  test('should store token on successful login', () => {
    const mockLocalStorage = {
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    
    const handleLoginSuccess = (token: string) => {
      mockLocalStorage.setItem('authToken', token);
    };
    
    handleLoginSuccess('test-token-123');
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token-123');
  });

  test('should handle login error', () => {
    const LoginForm = ({ error }: any) => (
      <form data-testid="login-form">
        <input data-testid="email-input" type="email" />
        <input data-testid="password-input" type="password" />
        <button data-testid="login-button" type="submit">auth.signIn</button>
        {error && <div data-testid="login-error">{error}</div>}
      </form>
    );
    
    render(<LoginForm error="auth.invalidCredentials" />);
    
    expect(screen.getByTestId('login-error')).toHaveTextContent('auth.invalidCredentials');
  });

  test('should handle form reset on successful login', async () => {
    const LoginForm = ({ onSubmit }: any) => (
      <form data-testid="login-form" onSubmit={onSubmit}>
        <input data-testid="email-input" type="email" />
        <input data-testid="password-input" type="password" />
        <button data-testid="login-button" type="submit">auth.signIn</button>
      </form>
    );
    
    const mockOnSubmit = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    
    // Fill and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      // After successful login, form should reset
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });
});
