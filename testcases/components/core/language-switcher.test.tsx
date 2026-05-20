import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock i18n
const mockChangeLanguage = jest.fn();
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockI18n.language = 'en';
  });

  test('should render language buttons', () => {
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  test('should highlight active language (English)', () => {
    mockI18n.language = 'en';
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    const enButton = screen.getByText('EN');
    const frButton = screen.getByText('FR');

    expect(enButton).toHaveClass('bg-blue-500 text-white');
    expect(frButton).toHaveClass('bg-gray-200 text-gray-700');
  });

  test('should highlight active language (French)', () => {
    mockI18n.language = 'fr';
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    const enButton = screen.getByText('EN');
    const frButton = screen.getByText('FR');

    expect(frButton).toHaveClass('bg-blue-500 text-white');
    expect(enButton).toHaveClass('bg-gray-200 text-gray-700');
  });

  test('should call changeLanguage when English button is clicked', () => {
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  test('should call changeLanguage when French button is clicked', () => {
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    const frButton = screen.getByText('FR');
    fireEvent.click(frButton);

    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });

  test('should handle multiple language changes', () => {
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    const enButton = screen.getByText('EN');
    const frButton = screen.getByText('FR');

    // Click French
    fireEvent.click(frButton);
    expect(mockChangeLanguage).toHaveBeenLastCalledWith('fr');

    // Click English
    fireEvent.click(enButton);
    expect(mockChangeLanguage).toHaveBeenLastCalledWith('en');

    expect(mockChangeLanguage).toHaveBeenCalledTimes(2);
  });

  test('should have proper button styling classes', () => {
    const LanguageSwitcher = require('../../../src/components/LanguageSwitcher').default;
    render(<LanguageSwitcher />);

    const enButton = screen.getByText('EN');
    const frButton = screen.getByText('FR');

    // Check that buttons have base classes
    expect(enButton).toHaveClass('px-2 py-1 text-xs font-medium rounded transition-colors');
    expect(frButton).toHaveClass('px-2 py-1 text-xs font-medium rounded transition-colors');
  });
});
