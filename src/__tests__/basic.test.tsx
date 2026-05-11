import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Basic test to verify the testing setup works
describe('Testing Setup Verification', () => {
  test('should render a simple component', () => {
    const TestComponent = () => <div data-testid="test-element">Hello World</div>;
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-element')).toBeInTheDocument();
    expect(getByTestId('test-element')).toHaveTextContent('Hello World');
  });

  test('should handle basic assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
    expect('hello').toContain('hell');
  });

  test('should verify mock functions work', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('Component Import Tests', () => {
  test('should verify basic React imports work', () => {
    // Test basic React functionality
    expect(() => {
      const React = require('react');
      expect(React.createElement).toBeDefined();
    }).not.toThrow();
  });

  test('should verify testing library imports work', () => {
    // Test testing library functionality
    expect(() => {
      const { render } = require('@testing-library/react');
      expect(render).toBeDefined();
    }).not.toThrow();
  });
});
