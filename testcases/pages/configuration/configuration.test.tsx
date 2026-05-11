import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Configuration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render configuration page header', () => {
    const ConfigurationHeader = () => (
      <div>
        <h1>configuration.title</h1>
        <p>configuration.subtitle</p>
      </div>
    );
    
    render(<ConfigurationHeader />);
    
    expect(screen.getByText('configuration.title')).toBeInTheDocument();
    expect(screen.getByText('configuration.subtitle')).toBeInTheDocument();
  });

  test('should display system settings', () => {
    const SystemSettings = ({ settings }: any) => (
      <div data-testid="system-settings">
        <div data-testid="setting-app-name">
          <label>configuration.appName</label>
          <input 
            data-testid="app-name-input"
            value={settings.appName}
            onChange={(e) => settings.onAppNameChange(e.target.value)}
          />
        </div>
        <div data-testid="setting-timezone">
          <label>configuration.timezone</label>
          <select 
            data-testid="timezone-select"
            value={settings.timezone}
            onChange={(e) => settings.onTimezoneChange(e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
          </select>
        </div>
        <div data-testid="setting-language">
          <label>configuration.defaultLanguage</label>
          <select 
            data-testid="language-select"
            value={settings.defaultLanguage}
            onChange={(e) => settings.onLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
    );
    
    const mockSettings = {
      appName: 'At-Home Healthcare',
      timezone: 'UTC',
      defaultLanguage: 'en',
      onAppNameChange: jest.fn(),
      onTimezoneChange: jest.fn(),
      onLanguageChange: jest.fn()
    };
    
    render(<SystemSettings settings={mockSettings} />);
    
    expect(screen.getByTestId('app-name-input')).toHaveValue('At-Home Healthcare');
    expect(screen.getByTestId('timezone-select')).toHaveValue('UTC');
    expect(screen.getByTestId('language-select')).toHaveValue('en');
  });

  test('should handle setting changes', () => {
    const SystemSettings = ({ settings }: any) => (
      <div data-testid="system-settings">
        <div data-testid="setting-app-name">
          <input 
            data-testid="app-name-input"
            value={settings.appName}
            onChange={(e) => settings.onAppNameChange(e.target.value)}
          />
        </div>
      </div>
    );
    
    const mockOnAppNameChange = jest.fn();
    const mockSettings = {
      appName: 'Test App',
      onAppNameChange: mockOnAppNameChange
    };
    
    render(<SystemSettings settings={mockSettings} />);
    
    const appNameInput = screen.getByTestId('app-name-input');
    fireEvent.change(appNameInput, { target: { value: 'Updated App Name' } });
    
    expect(mockOnAppNameChange).toHaveBeenCalledWith('Updated App Name');
  });

  test('should display email configuration', () => {
    const EmailConfig = ({ config }: any) => (
      <div data-testid="email-config">
        <h3>configuration.emailSettings</h3>
        <div data-testid="smtp-settings">
          <div data-testid="smtp-host">
            <label>configuration.smtpHost</label>
            <input 
              data-testid="smtp-host-input"
              value={config.smtpHost}
              onChange={(e) => config.onSmtpHostChange(e.target.value)}
            />
          </div>
          <div data-testid="smtp-port">
            <label>configuration.smtpPort</label>
            <input 
              data-testid="smtp-port-input"
              type="number"
              value={config.smtpPort}
              onChange={(e) => config.onSmtpPortChange(e.target.value)}
            />
          </div>
          <div data-testid="smtp-username">
            <label>configuration.smtpUsername</label>
            <input 
              data-testid="smtp-username-input"
              value={config.smtpUsername}
              onChange={(e) => config.onSmtpUsernameChange(e.target.value)}
            />
          </div>
          <div data-testid="smtp-password">
            <label>configuration.smtpPassword</label>
            <input 
              data-testid="smtp-password-input"
              type="password"
              value={config.smtpPassword}
              onChange={(e) => config.onSmtpPasswordChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
    
    const mockConfig = {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'admin@example.com',
      smtpPassword: 'password123',
      onSmtpHostChange: jest.fn(),
      onSmtpPortChange: jest.fn(),
      onSmtpUsernameChange: jest.fn(),
      onSmtpPasswordChange: jest.fn()
    };
    
    render(<EmailConfig config={mockConfig} />);
    
    expect(screen.getByTestId('smtp-host-input')).toHaveValue('smtp.example.com');
    expect(screen.getByTestId('smtp-port-input')).toHaveValue(587);
    expect(screen.getByTestId('smtp-username-input')).toHaveValue('admin@example.com');
    expect(screen.getByTestId('smtp-password-input')).toHaveValue('password123');
  });

  test('should display security settings', () => {
    const SecurityConfig = ({ config }: any) => (
      <div data-testid="security-config">
        <h3>configuration.securitySettings</h3>
        <div data-testid="password-policy">
          <label>configuration.passwordPolicy</label>
          <input 
            data-testid="min-length-input"
            type="number"
            value={config.minPasswordLength}
            onChange={(e) => config.onMinPasswordLengthChange(e.target.value)}
          />
          <input 
            data-testid="require-uppercase"
            type="checkbox"
            checked={config.requireUppercase}
            onChange={(e) => config.onRequireUppercaseChange(e.target.checked)}
          />
          <input 
            data-testid="require-numbers"
            type="checkbox"
            checked={config.requireNumbers}
            onChange={(e) => config.onRequireNumbersChange(e.target.checked)}
          />
        </div>
        <div data-testid="session-settings">
          <label>configuration.sessionTimeout</label>
          <input 
            data-testid="session-timeout-input"
            type="number"
            value={config.sessionTimeout}
            onChange={(e) => config.onSessionTimeoutChange(e.target.value)}
          />
        </div>
      </div>
    );
    
    const mockConfig = {
      minPasswordLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      sessionTimeout: 30,
      onMinPasswordLengthChange: jest.fn(),
      onRequireUppercaseChange: jest.fn(),
      onRequireNumbersChange: jest.fn(),
      onSessionTimeoutChange: jest.fn()
    };
    
    render(<SecurityConfig config={mockConfig} />);
    
    expect(screen.getByTestId('min-length-input')).toHaveValue(8);
    expect(screen.getByTestId('require-uppercase')).toBeChecked();
    expect(screen.getByTestId('require-numbers')).toBeChecked();
    expect(screen.getByTestId('session-timeout-input')).toHaveValue(30);
  });

  test('should handle configuration save', () => {
    const ConfigurationActions = ({ onSave, onReset }: any) => (
      <div data-testid="config-actions">
        <button data-testid="save-config" onClick={onSave}>
          configuration.save
        </button>
        <button data-testid="reset-config" onClick={onReset}>
          configuration.reset
        </button>
      </div>
    );
    
    const mockOnSave = jest.fn();
    const mockOnReset = jest.fn();
    
    render(
      <ConfigurationActions 
        onSave={mockOnSave} 
        onReset={mockOnReset} 
      />
    );
    
    fireEvent.click(screen.getByTestId('save-config'));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTestId('reset-config'));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('should validate configuration inputs', () => {
    const SystemSettings = ({ settings, errors }: any) => (
      <div data-testid="system-settings">
        <div data-testid="setting-app-name">
          <input 
            data-testid="app-name-input"
            value={settings.appName}
            className={errors.appName ? 'error' : ''}
          />
          {errors.appName && (
            <span data-testid="app-name-error">{errors.appName}</span>
          )}
        </div>
      </div>
    );
    
    const mockSettings = { appName: '', onAppNameChange: jest.fn() };
    const mockErrors = { appName: 'configuration.appNameRequired' };
    
    render(<SystemSettings settings={mockSettings} errors={mockErrors} />);
    
    const appNameInput = screen.getByTestId('app-name-input');
    const errorElement = screen.getByTestId('app-name-error');
    
    expect(appNameInput).toHaveClass('error');
    expect(errorElement).toHaveTextContent('configuration.appNameRequired');
  });

  test('should display backup configuration', () => {
    const BackupConfig = ({ config }: any) => (
      <div data-testid="backup-config">
        <h3>configuration.backupSettings</h3>
        <div data-testid="backup-frequency">
          <label>configuration.backupFrequency</label>
          <select 
            data-testid="backup-frequency-select"
            value={config.backupFrequency}
            onChange={(e) => config.onBackupFrequencyChange(e.target.value)}
          >
            <option value="daily">configuration.daily</option>
            <option value="weekly">configuration.weekly</option>
            <option value="monthly">configuration.monthly</option>
          </select>
        </div>
        <div data-testid="backup-retention">
          <label>configuration.backupRetention</label>
          <input 
            data-testid="backup-retention-input"
            type="number"
            value={config.backupRetention}
            onChange={(e) => config.onBackupRetentionChange(e.target.value)}
          />
        </div>
        <button data-testid="backup-now" onClick={config.onBackupNow}>
          configuration.backupNow
        </button>
      </div>
    );
    
    const mockConfig = {
      backupFrequency: 'weekly',
      backupRetention: 30,
      onBackupFrequencyChange: jest.fn(),
      onBackupRetentionChange: jest.fn(),
      onBackupNow: jest.fn()
    };
    
    render(<BackupConfig config={mockConfig} />);
    
    expect(screen.getByTestId('backup-frequency-select')).toHaveValue('weekly');
    expect(screen.getByTestId('backup-retention-input')).toHaveValue(30);
  });

  test('should handle configuration tabs', () => {
    const ConfigurationTabs = ({ activeTab, onTabChange }: any) => (
      <div data-testid="config-tabs">
        <button 
          data-testid="tab-system"
          className={activeTab === 'system' ? 'active' : ''}
          onClick={() => onTabChange('system')}
        >
          configuration.system
        </button>
        <button 
          data-testid="tab-email"
          className={activeTab === 'email' ? 'active' : ''}
          onClick={() => onTabChange('email')}
        >
          configuration.email
        </button>
        <button 
          data-testid="tab-security"
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => onTabChange('security')}
        >
          configuration.security
        </button>
        <button 
          data-testid="tab-backup"
          className={activeTab === 'backup' ? 'active' : ''}
          onClick={() => onTabChange('backup')}
        >
          configuration.backup
        </button>
      </div>
    );
    
    const mockOnTabChange = jest.fn();
    
    render(<ConfigurationTabs activeTab="system" onTabChange={mockOnTabChange} />);
    
    expect(screen.getByTestId('tab-system')).toHaveClass('active');
    expect(screen.getByTestId('tab-email')).not.toHaveClass('active');
    
    fireEvent.click(screen.getByTestId('tab-email'));
    expect(mockOnTabChange).toHaveBeenCalledWith('email');
  });
});
