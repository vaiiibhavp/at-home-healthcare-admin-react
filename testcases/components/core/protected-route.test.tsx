import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Redux hook
jest.mock('../../../src/hooks/redux', () => ({
  useAppSelector: jest.fn(),
}));

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  test('should show loading spinner when authentication is loading', () => {
    const { useAppSelector } = require('../../../src/hooks/redux');
    useAppSelector.mockReturnValue({ isAuthenticated: false, isLoading: true });

    const ProtectedRoute = require('../../../src/components/ProtectedRoute').default;
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
    expect(screen.getByRole('generic', { hidden: true })).toHaveClass('fa-spinner');
  });

  test('should redirect to login when not authenticated', () => {
    const { useAppSelector } = require('../../../src/hooks/redux');
    useAppSelector.mockReturnValue({ isAuthenticated: false, isLoading: false });

    const ProtectedRoute = require('../../../src/components/ProtectedRoute').default;
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockLocation.href).toBe('/login');
  });

  test('should render children when authenticated', () => {
    const { useAppSelector } = require('../../../src/hooks/redux');
    useAppSelector.mockReturnValue({ isAuthenticated: true, isLoading: false });

    const ProtectedRoute = require('../../../src/components/ProtectedRoute').default;
    
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockLocation.href).toBe('');
  });

  test('should handle multiple protected components', () => {
    const { useAppSelector } = require('../../../src/hooks/redux');
    useAppSelector.mockReturnValue({ isAuthenticated: true, isLoading: false });

    const ProtectedRoute = require('../../../src/components/ProtectedRoute').default;
    
    render(
      <div>
        <ProtectedRoute>
          <div data-testid="content-1">Content 1</div>
        </ProtectedRoute>
        <ProtectedRoute>
          <div data-testid="content-2">Content 2</div>
        </ProtectedRoute>
      </div>
    );

    expect(screen.getByTestId('content-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-2')).toBeInTheDocument();
  });
});
