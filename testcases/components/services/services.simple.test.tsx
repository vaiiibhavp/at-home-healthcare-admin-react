import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to verify the testing setup works
describe('Testing Setup', () => {
  test('should render a simple component', () => {
    const TestComponent = () => <div data-testid="test-element">Hello World</div>;
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-element')).toBeInTheDocument();
    expect(getByTestId('test-element')).toHaveTextContent('Hello World');
  });

  test('should handle basic assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
  });
});

describe('Services Component Basic Tests', () => {
  test('should import Services component successfully', () => {
    // This test verifies that the component can be imported
    expect(() => {
      require('../../../src/pages/services/index');
    }).not.toThrow();
  });

  test('should import services API successfully', () => {
    // This test verifies that the API can be imported
    expect(() => {
      require('../../../src/services/servicesApi');
    }).not.toThrow();
  });
});
