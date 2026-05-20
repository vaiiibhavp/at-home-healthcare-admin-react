import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock window.logout
declare global {
  interface Window {
    logout?: () => void;
  }
}

Object.defineProperty(window, 'logout', {
  value: jest.fn(),
  writable: true,
});

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render sidebar with logo', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('At-Home')).toBeInTheDocument();
    expect(screen.getByRole('generic', { hidden: true })).toHaveClass('fa-atom');
  });

  test('should render main navigation items', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // Check main navigation items
    expect(screen.getByText('navigation.dashboard')).toBeInTheDocument();
    expect(screen.getByText('navigation.doctors')).toBeInTheDocument();
    expect(screen.getByText('navigation.providers')).toBeInTheDocument();
    expect(screen.getByText('navigation.services')).toBeInTheDocument();
    expect(screen.getByText('navigation.forms')).toBeInTheDocument();
    expect(screen.getByText('navigation.requests')).toBeInTheDocument();
  });

  test('should render system navigation items', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('navigation.settings')).toBeInTheDocument();
  });

  test('should have navigation links with correct paths', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // Check that navigation links exist
    const dashboardLink = screen.getByText('navigation.dashboard');
    const doctorsLink = screen.getByText('navigation.doctors');
    const servicesLink = screen.getByText('navigation.services');

    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
    expect(doctorsLink.closest('a')).toHaveAttribute('href', '/doctors');
    expect(servicesLink.closest('a')).toHaveAttribute('href', '/services');
  });

  test('should show active state for current route', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter initialEntries={['/doctors']}>
        <Sidebar />
      </MemoryRouter>
    );

    const doctorsLink = screen.getByText('navigation.doctors');
    expect(doctorsLink.closest('a')).toHaveClass('sidebar-item-active bg-primary/10 text-primary');
  });

  test('should render logout button', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByTitle('auth.logout');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveClass('fa-arrow-right-from-bracket');
  });

  test('should call logout function when logout button is clicked', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    const mockLogout = jest.fn();
    window.logout = mockLogout;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByTitle('auth.logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('should have proper navigation structure', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // Check that navigation structure is correct
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check for icons in navigation items
    const icons = screen.getAllByRole('generic', { hidden: true });
    const navigationIcons = icons.filter(icon => 
      icon.className.includes('fa-') && 
      !icon.className.includes('fa-atom') // Exclude logo icon
    );

    expect(navigationIcons.length).toBeGreaterThan(0);
  });

  test('should handle navigation interactions', () => {
    const Sidebar = require('../../../src/components/dashboard/Sidebar').default;
    
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // Test clicking on navigation items
    const servicesLink = screen.getByText('navigation.services');
    fireEvent.click(servicesLink);

    // The link should still be present and clickable
    expect(servicesLink).toBeInTheDocument();
    expect(servicesLink.closest('a')).toHaveAttribute('href', '/services');
  });
});
