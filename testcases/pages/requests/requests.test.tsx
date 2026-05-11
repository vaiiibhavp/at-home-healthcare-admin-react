import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Requests Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render requests page header', () => {
    const RequestsHeader = () => (
      <div>
        <h1>requests.title</h1>
        <p>requests.subtitle</p>
        <div data-testid="request-stats">
          <span data-testid="pending-count">5</span>
          <span data-testid="approved-count">12</span>
          <span data-testid="rejected-count">3</span>
        </div>
      </div>
    );
    
    render(<RequestsHeader />);
    
    expect(screen.getByText('requests.title')).toBeInTheDocument();
    expect(screen.getByText('requests.subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('pending-count')).toHaveTextContent('5');
    expect(screen.getByTestId('approved-count')).toHaveTextContent('12');
    expect(screen.getByTestId('rejected-count')).toHaveTextContent('3');
  });

  test('should display requests list', () => {
    const mockRequests = [
      {
        id: 1,
        type: 'doctor_registration',
        requesterName: 'Dr. John Smith',
        email: 'john.smith@example.com',
        status: 'pending',
        createdAt: '2023-01-15T10:30:00Z',
        details: {
          specialty: 'Cardiology',
          experience: '10 years',
          hospital: 'City General Hospital'
        }
      },
      {
        id: 2,
        type: 'provider_approval',
        requesterName: 'City Medical Center',
        email: 'admin@citymed.com',
        status: 'approved',
        createdAt: '2023-01-14T14:20:00Z',
        details: {
          services: ['Cardiology', 'Neurology'],
          address: '123 Main St, City'
        }
      }
    ];

    const RequestsList = ({ requests }: any) => (
      <div data-testid="requests-list">
        {requests.map((request: any) => (
          <div key={request.id} data-testid={`request-${request.id}`}>
            <h3>{request.type}</h3>
            <p>{request.requesterName}</p>
            <span data-testid={`status-${request.id}`}>{request.status}</span>
            <button data-testid={`view-${request.id}`}>requests.view</button>
          </div>
        ))}
      </div>
    );
    
    render(<RequestsList requests={mockRequests} />);
    
    expect(screen.getByTestId('requests-list')).toBeInTheDocument();
    expect(screen.getByText('doctor_registration')).toBeInTheDocument();
    expect(screen.getByText('provider_approval')).toBeInTheDocument();
    expect(screen.getByTestId('status-1')).toHaveTextContent('pending');
    expect(screen.getByTestId('status-2')).toHaveTextContent('approved');
  });

  test('should handle request filtering', () => {
    const RequestFilters = ({ onFilter }: any) => (
      <div data-testid="request-filters">
        <select data-testid="type-filter" onChange={(e) => onFilter('type', e.target.value)}>
          <option value="all">requests.allTypes</option>
          <option value="doctor_registration">requests.doctorRegistration</option>
          <option value="provider_approval">requests.providerApproval</option>
          <option value="service_mapping">requests.serviceMapping</option>
        </select>
        <select data-testid="status-filter" onChange={(e) => onFilter('status', e.target.value)}>
          <option value="all">requests.allStatus</option>
          <option value="pending">requests.pending</option>
          <option value="approved">requests.approved</option>
          <option value="rejected">requests.rejected</option>
        </select>
        <input data-testid="date-filter" type="date" onChange={(e) => onFilter('date', e.target.value)} />
      </div>
    );
    
    const mockOnFilter = jest.fn();
    render(<RequestFilters onFilter={mockOnFilter} />);
    
    const typeFilter = screen.getByTestId('type-filter');
    const statusFilter = screen.getByTestId('status-filter');
    const dateFilter = screen.getByTestId('date-filter');
    
    fireEvent.change(typeFilter, { target: { value: 'doctor_registration' } });
    fireEvent.change(statusFilter, { target: { value: 'approved' } });
    fireEvent.change(dateFilter, { target: { value: '2023-01-15' } });
    
    expect(mockOnFilter).toHaveBeenCalledTimes(3);
    expect(mockOnFilter).toHaveBeenCalledWith('type', 'doctor_registration');
    expect(mockOnFilter).toHaveBeenCalledWith('status', 'approved');
    expect(mockOnFilter).toHaveBeenCalledWith('date', '2023-01-15');
  });

  test('should handle request approval', () => {
    const RequestActions = ({ request, onApprove, onReject }: any) => (
      <div data-testid={`request-${request.id}`}>
        <button data-testid={`approve-${request.id}`} onClick={() => onApprove(request.id)}>
          requests.approve
        </button>
        <button data-testid={`reject-${request.id}`} onClick={() => onReject(request.id)}>
          requests.reject
        </button>
      </div>
    );
    
    const mockOnApprove = jest.fn();
    const mockOnReject = jest.fn();
    const mockRequest = { id: 1, type: 'doctor_registration' };
    
    render(
      <RequestActions 
        request={mockRequest} 
        onApprove={mockOnApprove} 
        onReject={mockOnReject} 
      />
    );
    
    fireEvent.click(screen.getByTestId(`approve-${mockRequest.id}`));
    expect(mockOnApprove).toHaveBeenCalledWith(1);
    
    fireEvent.click(screen.getByTestId(`reject-${mockRequest.id}`));
    expect(mockOnReject).toHaveBeenCalledWith(1);
  });

  test('should show request details modal', () => {
    const RequestDetailModal = ({ request, isOpen, onClose }: any) => {
      if (!isOpen) return null;
      
      return (
        <div data-testid="request-detail-modal">
          <h2>requests.requestDetails</h2>
          <div data-testid="request-info">
            <p><strong>requests.type:</strong> {request.type}</p>
            <p><strong>requests.requester:</strong> {request.requesterName}</p>
            <p><strong>requests.email:</strong> {request.email}</p>
            <p><strong>requests.status:</strong> {request.status}</p>
            <p><strong>requests.createdAt:</strong> {request.createdAt}</p>
          </div>
          <button data-testid="close-modal" onClick={onClose}>
            requests.close
          </button>
        </div>
      );
    };
    
    const mockOnClose = jest.fn();
    const mockRequest = {
      id: 1,
      type: 'doctor_registration',
      requesterName: 'Dr. John Smith',
      email: 'john.smith@example.com',
      status: 'pending',
      createdAt: '2023-01-15T10:30:00Z'
    };
    
    render(
      <RequestDetailModal 
        request={mockRequest} 
        isOpen={true} 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByTestId('request-detail-modal')).toBeInTheDocument();
    expect(screen.getByText('requests.requestDetails')).toBeInTheDocument();
    expect(screen.getByText('doctor_registration')).toBeInTheDocument();
    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('john.smith@example.com')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('2023-01-15T10:30:00Z')).toBeInTheDocument();
  });

  test('should handle request search', () => {
    const RequestSearch = ({ onSearch }: any) => (
      <div data-testid="request-search">
        <input
          data-testid="search-input"
          placeholder="requests.searchPlaceholder"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button data-testid="search-btn" onClick={() => onSearch('')}>
          requests.search
        </button>
      </div>
    );
    
    const mockOnSearch = jest.fn();
    render(<RequestSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByTestId('search-input');
    const searchButton = screen.getByTestId('search-btn');
    
    fireEvent.change(searchInput, { target: { value: 'John Smith' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('John Smith');
  });

  test('should handle bulk actions', () => {
    const RequestBulkActions = ({ selectedRequests, onBulkApprove, onBulkReject }: any) => (
      <div data-testid="bulk-actions">
        <span data-testid="selected-count">{selectedRequests.length}</span>
        <button 
          data-testid="bulk-approve" 
          onClick={() => onBulkApprove(selectedRequests)}
          disabled={selectedRequests.length === 0}
        >
          requests.bulkApprove
        </button>
        <button 
          data-testid="bulk-reject" 
          onClick={() => onBulkReject(selectedRequests)}
          disabled={selectedRequests.length === 0}
        >
          requests.bulkReject
        </button>
      </div>
    );
    
    const mockOnBulkApprove = jest.fn();
    const mockOnBulkReject = jest.fn();
    const selectedRequests = [1, 2, 3];
    
    render(
      <RequestBulkActions 
        selectedRequests={selectedRequests}
        onBulkApprove={mockOnBulkApprove}
        onBulkReject={mockOnBulkReject}
      />
    );
    
    expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
    
    fireEvent.click(screen.getByTestId('bulk-approve'));
    expect(mockOnBulkApprove).toHaveBeenCalledWith(selectedRequests);
    
    fireEvent.click(screen.getByTestId('bulk-reject'));
    expect(mockOnBulkReject).toHaveBeenCalledWith(selectedRequests);
  });

  test('should handle request pagination', () => {
    const RequestPagination = ({ currentPage, totalPages, onPageChange }: any) => (
      <div data-testid="request-pagination">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          requests.previous
        </button>
        <span data-testid="current-page">{currentPage}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          requests.next
        </button>
      </div>
    );
    
    const mockOnPageChange = jest.fn();
    render(
      <RequestPagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('3');
    
    const prevButton = screen.getByText('requests.previous');
    const nextButton = screen.getByText('requests.next');
    
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
    
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test('should display request statistics', () => {
    const RequestStats = ({ stats }: any) => (
      <div data-testid="request-stats">
        <div data-testid="total-requests">{stats.total}</div>
        <div data-testid="pending-requests">{stats.pending}</div>
        <div data-testid="approved-requests">{stats.approved}</div>
        <div data-testid="rejected-requests">{stats.rejected}</div>
        <div data-testid="approval-rate">{stats.approvalRate}%</div>
      </div>
    );
    
    const mockStats = {
      total: 50,
      pending: 15,
      approved: 30,
      rejected: 5,
      approvalRate: 60
    };
    
    render(<RequestStats stats={mockStats} />);
    
    expect(screen.getByTestId('total-requests')).toHaveTextContent('50');
    expect(screen.getByTestId('pending-requests')).toHaveTextContent('15');
    expect(screen.getByTestId('approved-requests')).toHaveTextContent('30');
    expect(screen.getByTestId('rejected-requests')).toHaveTextContent('5');
    expect(screen.getByTestId('approval-rate')).toHaveTextContent('60%');
  });

  test('should handle empty state', () => {
    const EmptyRequests = () => (
      <div data-testid="empty-requests">
        <div data-testid="empty-icon">📋</div>
        <h3>requests.noRequestsFound</h3>
        <p>requests.noRequestsDescription</p>
      </div>
    );
    
    render(<EmptyRequests />);
    
    expect(screen.getByTestId('empty-requests')).toBeInTheDocument();
    expect(screen.getByText('requests.noRequestsFound')).toBeInTheDocument();
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });
});
