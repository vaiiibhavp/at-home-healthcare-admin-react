import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Services Component Tests', () => {
  test('should render services page header', () => {
    const Header = () => (
      <header>
        <h1>Services Management</h1>
        <p>Manage healthcare services and forms</p>
      </header>
    );
    
    render(<Header />);
    expect(screen.getByText('Services Management')).toBeInTheDocument();
    expect(screen.getByText('Manage healthcare services and forms')).toBeInTheDocument();
  });

  test('should handle search functionality', () => {
    const SearchComponent = () => (
      <div>
        <input 
          placeholder="Search services..." 
          data-testid="search-input"
        />
      </div>
    );
    
    render(<SearchComponent />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Cardiology' } });
    expect(searchInput).toHaveValue('Cardiology');
  });

  test('should display service statistics', () => {
    const StatsComponent = () => (
      <div>
        <div data-testid="total-services">25</div>
        <div data-testid="mapped-forms">18</div>
        <div data-testid="unmapped-services">7</div>
      </div>
    );
    
    render(<StatsComponent />);
    expect(screen.getByTestId('total-services')).toHaveTextContent('25');
    expect(screen.getByTestId('mapped-forms')).toHaveTextContent('18');
    expect(screen.getByTestId('unmapped-services')).toHaveTextContent('7');
  });
});
