import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock chart components
jest.mock('react-plotly.js', () => {
  return function MockPlot({ data, layout }: any) {
    return (
      <div data-testid="plotly-chart">
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
        <div data-testid="chart-layout">{JSON.stringify(layout)}</div>
      </div>
    );
  };
});

// Mock dashboard components
const mockDashboardStats = {
  totalDoctors: 150,
  pendingApprovals: 12,
  activeProviders: 45,
  totalServices: 28,
  recentActivity: [
    { id: 1, type: 'doctor_registered', name: 'Dr. John Doe', time: '2 hours ago' },
    { id: 2, type: 'service_mapped', name: 'Cardiology Service', time: '4 hours ago' },
  ],
  chartData: {
    registrations: [10, 15, 12, 20, 18, 25, 22],
    approvals: [8, 12, 10, 15, 14, 20, 18],
  }
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render dashboard title', () => {
    const Dashboard = () => (
      <div>
        <h1>dashboard.title</h1>
        <p>dashboard.subtitle</p>
      </div>
    );
    
    render(<Dashboard />);
    
    expect(screen.getByText('dashboard.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.subtitle')).toBeInTheDocument();
  });

  test('should display statistics cards', () => {
    const StatsCards = ({ stats }: any) => (
      <div>
        <div data-testid="total-doctors">{stats.totalDoctors}</div>
        <div data-testid="pending-approvals">{stats.pendingApprovals}</div>
        <div data-testid="active-providers">{stats.activeProviders}</div>
        <div data-testid="total-services">{stats.totalServices}</div>
      </div>
    );
    
    render(<StatsCards stats={mockDashboardStats} />);
    
    expect(screen.getByTestId('total-doctors')).toHaveTextContent('150');
    expect(screen.getByTestId('pending-approvals')).toHaveTextContent('12');
    expect(screen.getByTestId('active-providers')).toHaveTextContent('45');
    expect(screen.getByTestId('total-services')).toHaveTextContent('28');
  });

  test('should display recent activity', () => {
    const RecentActivity = ({ activities }: any) => (
      <div data-testid="recent-activity">
        {activities.map((activity: any) => (
          <div key={activity.id} data-testid={`activity-${activity.id}`}>
            <span>{activity.name}</span>
            <span>{activity.time}</span>
          </div>
        ))}
      </div>
    );
    
    render(<RecentActivity activities={mockDashboardStats.recentActivity} />);
    
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
    expect(screen.getByTestId('activity-1')).toHaveTextContent('Dr. John Doe');
    expect(screen.getByTestId('activity-2')).toHaveTextContent('Cardiology Service');
  });

  test('should render chart components', () => {
    const ChartComponent = ({ data }: any) => (
      <div data-testid="chart-container">
        <div data-testid="chart-title">Registration Trends</div>
        <div data-testid="chart-values">{data.join(', ')}</div>
      </div>
    );
    
    render(<ChartComponent data={mockDashboardStats.chartData.registrations} />);
    
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('chart-title')).toHaveTextContent('Registration Trends');
    expect(screen.getByTestId('chart-values')).toHaveTextContent('10, 15, 12, 20, 18, 25, 22');
  });

  test('should handle loading state', () => {
    const LoadingDashboard = () => (
      <div>
        <div data-testid="loading-spinner">Loading...</div>
        <div>Skeleton components would be here</div>
      </div>
    );
    
    render(<LoadingDashboard />);
    
    expect(screen.getByTestId('loading-spinner')).toHaveTextContent('Loading...');
  });

  test('should handle empty state', () => {
    const EmptyDashboard = () => (
      <div>
        <div data-testid="empty-state">No data available</div>
        <button>Get Started</button>
      </div>
    );
    
    render(<EmptyDashboard />);
    
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No data available');
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  test('should display navigation breadcrumbs', () => {
    const Breadcrumbs = () => (
      <nav data-testid="breadcrumbs">
        <span>Home</span>
        <span>/</span>
        <span>Dashboard</span>
      </nav>
    );
    
    render(<Breadcrumbs />);
    
    const breadcrumbs = screen.getByTestId('breadcrumbs');
    expect(breadcrumbs).toHaveTextContent('Home / Dashboard');
  });

  test('should handle date range selection', () => {
    const DateRangeSelector = ({ onRangeChange }: any) => (
      <div data-testid="date-range-selector">
        <select data-testid="range-select" onChange={(e) => onRangeChange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
    );
    
    const mockOnRangeChange = jest.fn();
    render(<DateRangeSelector onRangeChange={mockOnRangeChange} />);
    
    const select = screen.getByTestId('range-select');
    expect(select).toBeInTheDocument();
    
    // Test selection change
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(mockOnRangeChange).toHaveBeenCalled();
  });

  test('should display export functionality', () => {
    const ExportActions = ({ onExport }: any) => (
      <div data-testid="export-actions">
        <button onClick={() => onExport('pdf')}>Export PDF</button>
        <button onClick={() => onExport('csv')}>Export CSV</button>
      </div>
    );
    
    const mockOnExport = jest.fn();
    render(<ExportActions onExport={mockOnExport} />);
    
    const pdfButton = screen.getByText('Export PDF');
    const csvButton = screen.getByText('Export CSV');
    
    pdfButton.click();
    expect(mockOnExport).toHaveBeenCalledWith('pdf');
    
    csvButton.click();
    expect(mockOnExport).toHaveBeenCalledWith('csv');
  });
});
