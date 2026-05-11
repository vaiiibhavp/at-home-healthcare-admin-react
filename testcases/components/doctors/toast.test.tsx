import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should not render when show is false', () => {
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    render(
      <Toast 
        message="Test message" 
        show={false} 
        onClose={jest.fn()} 
      />
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  test('should render message when show is true', () => {
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    render(
      <Toast 
        message="Test message" 
        show={true} 
        onClose={jest.fn()} 
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('generic', { hidden: true })).toHaveClass('fa-circle-check');
  });

  test('should have proper styling classes', () => {
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    render(
      <Toast 
        message="Test message" 
        show={true} 
        onClose={jest.fn()} 
      />
    );

    const toastContainer = screen.getByText('Test message').closest('div')?.parentElement;
    expect(toastContainer).toHaveClass('fixed', 'bottom-8', 'right-8', 'transform', 'transition-all', 'duration-300', 'z-[60]');
    
    const toastContent = screen.getByText('Test message').parentElement;
    expect(toastContent).toHaveClass('bg-slate-900', 'text-white', 'px-6', 'py-3', 'rounded-xl', 'shadow-2xl', 'flex', 'items-center', 'gap-3');
  });

  test('should auto-hide after 3 seconds', async () => {
    const mockOnClose = jest.fn();
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    render(
      <Toast 
        message="Test message" 
        show={true} 
        onClose={mockOnClose} 
      />
    );

    // Initially visible
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);

    // Wait for the transition to complete
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }, { timeout: 4000 });
  });

  test('should clean up timer on unmount', () => {
    const mockOnClose = jest.fn();
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    const { unmount } = render(
      <Toast 
        message="Test message" 
        show={true} 
        onClose={mockOnClose} 
      />
    );

    // Unmount before timer completes
    unmount();

    // Advance timers - onClose should not be called
    jest.advanceTimersByTime(3000);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('should handle multiple toasts', () => {
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    const { rerender } = render(
      <Toast 
        message="First message" 
        show={true} 
        onClose={jest.fn()} 
      />
    );

    expect(screen.getByText('First message')).toBeInTheDocument();

    // Rerender with different message
    rerender(
      <Toast 
        message="Second message" 
        show={true} 
        onClose={jest.fn()} 
      />
    );

    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  test('should handle show state changes', () => {
    const mockOnClose = jest.fn();
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    const { rerender } = render(
      <Toast 
        message="Test message" 
        show={false} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();

    // Show the toast
    rerender(
      <Toast 
        message="Test message" 
        show={true} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Hide the toast
    rerender(
      <Toast 
        message="Test message" 
        show={false} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  test('should have success icon', () => {
    const Toast = require('../../../src/components/doctors/Toast').default;
    
    render(
      <Toast 
        message="Success message" 
        show={true} 
        onClose={jest.fn()} 
      />
    );

    const icon = screen.getByRole('generic', { hidden: true });
    expect(icon).toHaveClass('fa-circle-check', 'text-emerald-400');
  });
});
