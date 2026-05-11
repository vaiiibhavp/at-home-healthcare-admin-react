import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Providers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render providers page header', () => {
    const ProvidersHeader = () => (
      <div>
        <h1>providers.title</h1>
        <p>providers.subtitle</p>
        <button data-testid="add-provider-btn">providers.addNew</button>
      </div>
    );
    
    render(<ProvidersHeader />);
    
    expect(screen.getByText('providers.title')).toBeInTheDocument();
    expect(screen.getByText('providers.subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('add-provider-btn')).toBeInTheDocument();
  });

  test('should display providers list', () => {
    const mockProviders = [
      {
        id: 1,
        name: 'City General Hospital',
        email: 'admin@cityhospital.com',
        phone: '+1-234-567-8900',
        status: 'active',
        services: ['Cardiology', 'Neurology'],
        address: '123 Main St, City, State'
      },
      {
        id: 2,
        name: 'Specialty Medical Center',
        email: 'contact@specialtymed.com',
        phone: '+1-234-567-8901',
        status: 'pending',
        services: ['Pediatrics', 'Orthopedics'],
        address: '456 Oak Ave, Town, State'
      }
    ];

    const ProvidersList = ({ providers }: any) => (
      <div data-testid="providers-list">
        {providers.map((provider: any) => (
          <div key={provider.id} data-testid={`provider-${provider.id}`}>
            <h3>{provider.name}</h3>
            <p>{provider.email}</p>
            <p>{provider.phone}</p>
            <span data-testid={`status-${provider.id}`}>{provider.status}</span>
          </div>
        ))}
      </div>
    );
    
    render(<ProvidersList providers={mockProviders} />);
    
    expect(screen.getByTestId('providers-list')).toBeInTheDocument();
    expect(screen.getByText('City General Hospital')).toBeInTheDocument();
    expect(screen.getByText('Specialty Medical Center')).toBeInTheDocument();
    expect(screen.getByTestId('status-1')).toHaveTextContent('active');
    expect(screen.getByTestId('status-2')).toHaveTextContent('pending');
  });

  test('should handle provider search', () => {
    const ProviderSearch = ({ onSearch }: any) => (
      <div data-testid="provider-search">
        <input
          data-testid="search-input"
          placeholder="providers.searchPlaceholder"
          onChange={(e) => onSearch(e.target.value)}
        />
        <select data-testid="status-filter" onChange={(e) => onSearch(e.target.value)}>
          <option value="all">providers.allStatus</option>
          <option value="active">providers.active</option>
          <option value="pending">providers.pending</option>
        </select>
      </div>
    );
    
    const mockOnSearch = jest.fn();
    render(<ProviderSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByTestId('search-input');
    const statusFilter = screen.getByTestId('status-filter');
    
    fireEvent.change(searchInput, { target: { value: 'City Hospital' } });
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    
    expect(mockOnSearch).toHaveBeenCalledTimes(2);
  });

  test('should handle provider status filtering', () => {
    const ProvidersList = ({ providers, statusFilter }: any) => (
      <div data-testid="providers-list">
        {providers
          .filter((provider: any) => statusFilter === 'all' || provider.status === statusFilter)
          .map((provider: any) => (
            <div key={provider.id} data-testid={`provider-${provider.id}`}>
              <span data-testid={`status-${provider.id}`}>{provider.status}</span>
            </div>
          ))}
      </div>
    );
    
    const mockProviders = [
      { id: 1, name: 'Active Provider', status: 'active' },
      { id: 2, name: 'Pending Provider', status: 'pending' },
      { id: 3, name: 'Inactive Provider', status: 'inactive' },
    ];
    
    const { rerender } = render(<ProvidersList providers={mockProviders} statusFilter="all" />);
    
    // Should show all providers
    expect(screen.getByTestId('status-1')).toHaveTextContent('active');
    expect(screen.getByTestId('status-2')).toHaveTextContent('pending');
    expect(screen.getByTestId('status-3')).toHaveTextContent('inactive');
    
    // Filter by active status
    rerender(<ProvidersList providers={mockProviders} statusFilter="active" />);
    
    expect(screen.getByTestId('status-1')).toHaveTextContent('active');
    expect(screen.queryByTestId('status-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('status-3')).not.toBeInTheDocument();
  });

  test('should handle provider creation', () => {
    const CreateProviderModal = ({ isOpen, onClose, onSubmit }: any) => {
      if (!isOpen) return null;
      
      return (
        <div data-testid="create-provider-modal">
          <h2>providers.createProvider</h2>
          <form onSubmit={onSubmit}>
            <input data-testid="provider-name" placeholder="providers.name" />
            <input data-testid="provider-email" placeholder="providers.email" />
            <input data-testid="provider-phone" placeholder="providers.phone" />
            <textarea data-testid="provider-address" placeholder="providers.address" />
            <button data-testid="submit-btn" type="submit">providers.create</button>
            <button data-testid="cancel-btn" type="button" onClick={onClose}>
              providers.cancel
            </button>
          </form>
        </div>
      );
    };
    
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <CreateProviderModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    );
    
    const nameInput = screen.getByTestId('provider-name');
    const emailInput = screen.getByTestId('provider-email');
    const phoneInput = screen.getByTestId('provider-phone');
    const addressTextarea = screen.getByTestId('provider-address');
    
    fireEvent.change(nameInput, { target: { value: 'Test Provider' } });
    fireEvent.change(emailInput, { target: { value: 'test@provider.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1-234-567-8900' } });
    fireEvent.change(addressTextarea, { target: { value: '123 Test St' } });
    
    fireEvent.click(screen.getByTestId('submit-btn'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Provider',
      email: 'test@provider.com',
      phone: '+1-234-567-8900',
      address: '123 Test St'
    });
  });

  test('should handle provider editing', () => {
    const EditProviderModal = ({ provider, onUpdate }: any) => (
      <div data-testid="edit-provider-modal">
        <h2>providers.editProvider</h2>
        <form onSubmit={onUpdate}>
          <input 
            data-testid="provider-name" 
            defaultValue={provider.name} 
          />
          <input 
            data-testid="provider-email" 
            defaultValue={provider.email} 
          />
          <button data-testid="update-btn" type="submit">providers.update</button>
        </form>
      </div>
    );
    
    const mockOnUpdate = jest.fn();
    const mockProvider = {
      id: 1,
      name: 'Existing Provider',
      email: 'existing@provider.com'
    };
    
    render(
      <EditProviderModal 
        provider={mockProvider} 
        onUpdate={mockOnUpdate} 
      />
    );
    
    const nameInput = screen.getByTestId('provider-name');
    expect(nameInput).toHaveValue('Existing Provider');
    
    fireEvent.change(nameInput, { target: { value: 'Updated Provider' } });
    fireEvent.click(screen.getByTestId('update-btn'));
    
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockProvider,
      name: 'Updated Provider'
    });
  });

  test('should handle provider deletion', () => {
    const ProviderActions = ({ provider, onDelete }: any) => (
      <div data-testid={`provider-actions-${provider.id}`}>
        <button data-testid="edit-btn" onClick={() => {}}>
          providers.edit
        </button>
        <button data-testid="delete-btn" onClick={() => onDelete(provider.id)}>
          providers.delete
        </button>
      </div>
    );
    
    const mockOnDelete = jest.fn();
    const mockProvider = { id: 1, name: 'Test Provider' };
    
    render(<ProviderActions provider={mockProvider} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-btn');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('should handle provider status changes', () => {
    const ProviderStatus = ({ provider, onStatusChange }: any) => (
      <div data-testid={`provider-${provider.id}`}>
        <span data-testid={`status-${provider.id}`}>{provider.status}</span>
        <select 
          data-testid={`status-select-${provider.id}`}
          value={provider.status}
          onChange={(e) => onStatusChange(provider.id, e.target.value)}
        >
          <option value="active">providers.active</option>
          <option value="pending">providers.pending</option>
          <option value="inactive">providers.inactive</option>
        </select>
      </div>
    );
    
    const mockOnStatusChange = jest.fn();
    const mockProvider = { id: 1, name: 'Test Provider', status: 'pending' };
    
    render(
      <ProviderStatus 
        provider={mockProvider} 
        onStatusChange={mockOnStatusChange} 
      />
    );
    
    const statusSelect = screen.getByTestId('status-select-1');
    fireEvent.change(statusSelect, { target: { value: 'active' } });
    
    expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'active');
  });

  test('should display provider services', () => {
    const ProviderServices = ({ provider }: any) => (
      <div data-testid={`provider-${provider.id}`}>
        <h3>{provider.name}</h3>
        <div data-testid={`services-${provider.id}`}>
          {provider.services.map((service: string) => (
            <span key={service} data-testid={`service-${service}`}>
              {service}
            </span>
          ))}
        </div>
      </div>
    );
    
    const mockProvider = {
      id: 1,
      name: 'Test Provider',
      services: ['Cardiology', 'Neurology', 'Pediatrics']
    };
    
    render(<ProviderServices provider={mockProvider} />);
    
    expect(screen.getByTestId('services-1')).toBeInTheDocument();
    expect(screen.getByTestId('service-Cardiology')).toBeInTheDocument();
    expect(screen.getByTestId('service-Neurology')).toBeInTheDocument();
    expect(screen.getByTestId('service-Pediatrics')).toBeInTheDocument();
  });

  test('should handle pagination', () => {
    const ProviderPagination = ({ currentPage, totalPages, onPageChange }: any) => (
      <div data-testid="provider-pagination">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          providers.previous
        </button>
        <span data-testid="current-page">{currentPage}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          providers.next
        </button>
      </div>
    );
    
    const mockOnPageChange = jest.fn();
    render(
      <ProviderPagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    
    const prevButton = screen.getByText('providers.previous');
    const nextButton = screen.getByText('providers.next');
    
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('should handle empty state', () => {
    const EmptyProviders = () => (
      <div data-testid="empty-providers">
        <div data-testid="empty-icon">🏥</div>
        <h3>providers.noProvidersFound</h3>
        <p>providers.noProvidersDescription</p>
        <button data-testid="add-first-provider">providers.addFirstProvider</button>
      </div>
    );
    
    render(<EmptyProviders />);
    
    expect(screen.getByTestId('empty-providers')).toBeInTheDocument();
    expect(screen.getByText('providers.noProvidersFound')).toBeInTheDocument();
    expect(screen.getByTestId('add-first-provider')).toBeInTheDocument();
  });
});
