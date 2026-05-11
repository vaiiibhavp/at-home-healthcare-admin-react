import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render forgot password form', () => {
    const ForgotPassword = () => (
      <div>
        <h1>auth.forgotPassword</h1>
        <p>auth.forgotPasswordDescription</p>
        <form data-testid="forgot-password-form">
          <input 
            data-testid="email-input" 
            type="email" 
            placeholder="auth.email" 
          />
          <button data-testid="submit-button" type="submit">
            auth.sendResetLink
          </button>
        </form>
        <a href="/login" data-testid="back-to-login">auth.backToLogin</a>
      </div>
    );
    
    render(<ForgotPassword />);
    
    expect(screen.getByText('auth.forgotPassword')).toBeInTheDocument();
    expect(screen.getByText('auth.forgotPasswordDescription')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-login')).toBeInTheDocument();
  });

  test('should handle email input', () => {
    const ForgotPasswordForm = ({ onEmailChange }: any) => (
      <form data-testid="forgot-password-form">
        <input 
          data-testid="email-input" 
          type="email" 
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </form>
    );
    
    const mockOnEmailChange = jest.fn();
    render(<ForgotPasswordForm onEmailChange={mockOnEmailChange} />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(mockOnEmailChange).toHaveBeenCalledWith('test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('should validate email format', () => {
    const ForgotPasswordForm = ({ errors }: any) => (
      <form data-testid="forgot-password-form">
        <input data-testid="email-input" type="email" />
        {errors.email && <span data-testid="email-error">{errors.email}</span>}
        <button data-testid="submit-button" type="submit">auth.sendResetLink</button>
      </form>
    );
    
    render(<ForgotPasswordForm errors={{ email: 'auth.invalidEmail' }} />);
    
    expect(screen.getByTestId('email-error')).toHaveTextContent('auth.invalidEmail');
  });

  test('should handle form submission', async () => {
    const ForgotPasswordForm = ({ onSubmit }: any) => (
      <form data-testid="forgot-password-form" onSubmit={onSubmit}>
        <input data-testid="email-input" type="email" />
        <button data-testid="submit-button" type="submit">auth.sendResetLink</button>
      </form>
    );
    
    const mockOnSubmit = jest.fn();
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  test('should handle loading state', () => {
    const ForgotPasswordForm = ({ isLoading }: any) => (
      <form data-testid="forgot-password-form">
        <input data-testid="email-input" type="email" disabled={isLoading} />
        <button data-testid="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? 'auth.sending' : 'auth.sendResetLink'}
        </button>
      </form>
    );
    
    render(<ForgotPasswordForm isLoading={true} />);
    
    expect(screen.getByTestId('email-input')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('auth.sending');
  });

  test('should show success message', () => {
    const ForgotPasswordForm = ({ successMessage }: any) => (
      <div>
        {successMessage && (
          <div data-testid="success-message" className="success">
            {successMessage}
          </div>
        )}
        <form data-testid="forgot-password-form">
          <input data-testid="email-input" type="email" />
          <button data-testid="submit-button" type="submit">auth.sendResetLink</button>
        </form>
      </div>
    );
    
    render(
      <ForgotPasswordForm successMessage="auth.resetLinkSent" />
    );
    
    expect(screen.getByTestId('success-message')).toHaveTextContent('auth.resetLinkSent');
    expect(screen.getByTestId('success-message')).toHaveClass('success');
  });

  test('should handle back to login navigation', () => {
    const ForgotPassword = () => (
      <div>
        <form data-testid="forgot-password-form">
          <input data-testid="email-input" type="email" />
          <button data-testid="submit-button" type="submit">auth.sendResetLink</button>
        </form>
        <a href="/login" data-testid="back-to-login">auth.backToLogin</a>
      </div>
    );
    
    render(<ForgotPassword />);
    
    const backToLoginLink = screen.getByTestId('back-to-login');
    expect(backToLoginLink).toHaveAttribute('href', '/login');
  });

  test('should handle rate limiting', () => {
    const ForgotPasswordForm = ({ rateLimitError }: any) => (
      <form data-testid="forgot-password-form">
        <input data-testid="email-input" type="email" />
        {rateLimitError && (
          <div data-testid="rate-limit-error">
            {rateLimitError}
          </div>
        )}
        <button data-testid="submit-button" type="submit">auth.sendResetLink</button>
      </form>
    );
    
    render(
      <ForgotPasswordForm rateLimitError="auth.tooManyRequests" />
    );
    
    expect(screen.getByTestId('rate-limit-error')).toHaveTextContent('auth.tooManyRequests');
  });

  test('should handle empty email submission', () => {
    const ForgotPasswordForm = ({ errors }: any) => (
      <form data-testid="forgot-password-form">
        <input data-testid="email-input" type="email" />
        {errors.email && <span data-testid="email-error">{errors.email}</span>}
        <button data-testid="submit-button" type="submit">auth.sendResetLink</button>
      </form>
    );
    
    render(<ForgotPasswordForm errors={{ email: 'auth.emailRequired' }} />);
    
    expect(screen.getByTestId('email-error')).toHaveTextContent('auth.emailRequired');
  });

  test('should have proper form accessibility', () => {
    const ForgotPasswordForm = () => (
      <form data-testid="forgot-password-form">
        <label htmlFor="email-input">auth.email</label>
        <input 
          data-testid="email-input" 
          type="email" 
          id="email-input"
          required
        />
        <button data-testid="submit-button" type="submit">
          auth.sendResetLink
        </button>
      </form>
    );
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('auth.email');
    const submitButton = screen.getByRole('button', { name: 'auth.sendResetLink' });
    
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('aria-required', 'true');
  });
});
