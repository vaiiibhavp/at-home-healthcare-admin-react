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
  test('should import Services component successfully', () => {
    // This test verifies that the component can be imported
    expect(() => {
      require('../src/pages/services/index');
    }).not.toThrow();
  });

  test('should import services API successfully', () => {
    // This test verifies that the API can be imported
    expect(() => {
      require('../src/services/servicesApi');
    }).not.toThrow();
  });

  test('should import DoctorDetail component successfully', () => {
    // This test verifies that the component can be imported
    expect(() => {
      require('../src/pages/doctor-detail/DoctorDetail');
    }).not.toThrow();
  });
});
