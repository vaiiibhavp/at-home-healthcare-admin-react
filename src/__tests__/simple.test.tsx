import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to verify the testing setup works
describe('Basic Testing Setup', () => {
  test('should render a simple component', () => {
    const TestComponent = () => <div data-testid="test-element">Hello World</div>;
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test-element')).toBeInTheDocument();
    expect(getByTestId('test-element')).toHaveTextContent('Hello World');
  });

  test('should find elements by text', () => {
    const TestComponent = () => <div>Test Content</div>;
    render(<TestComponent />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('should handle basic assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
    expect('hello').toContain('hell');
    expect([1, 2, 3]).toContain(2);
    expect({ name: 'test' }).toHaveProperty('name', 'test');
  });

  test('should verify mock functions work', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should handle async operations', async () => {
    const asyncFunction = () => Promise.resolve('success');
    const result = await asyncFunction();
    expect(result).toBe('success');
  });

  test('should handle user interactions', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    };
    
    const { getByTestId, getByText } = render(<TestComponent />);
    
    expect(getByTestId('count')).toHaveTextContent('0');
    
    // Simulate button click using fireEvent
    const { fireEvent } = require('@testing-library/react');
    const button = getByText('Increment');
    fireEvent.click(button);
    
    expect(getByTestId('count')).toHaveTextContent('1');
  });
});
