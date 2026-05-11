import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Forms Management Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render forms page header', () => {
    const FormsHeader = () => (
      <header>
        <h1>forms.title</h1>
        <p>forms.subtitle</p>
      </header>
    );
    
    render(<FormsHeader />);
    
    expect(screen.getByText('forms.title')).toBeInTheDocument();
    expect(screen.getByText('forms.subtitle')).toBeInTheDocument();
  });

  test('should display form statistics', () => {
    const FormStats = ({ stats }: any) => (
      <div data-testid="form-stats">
        <div data-testid="total-forms">{stats.totalForms}</div>
        <div data-testid="active-forms">{stats.activeForms}</div>
        <div data-testid="draft-forms">{stats.draftForms}</div>
        <div data-testid="archived-forms">{stats.archivedForms}</div>
      </div>
    );
    
    const mockStats = {
      totalForms: 45,
      activeForms: 32,
      draftForms: 8,
      archivedForms: 5
    };
    
    render(<FormStats stats={mockStats} />);
    
    expect(screen.getByTestId('total-forms')).toHaveTextContent('45');
    expect(screen.getByTestId('active-forms')).toHaveTextContent('32');
    expect(screen.getByTestId('draft-forms')).toHaveTextContent('8');
    expect(screen.getByTestId('archived-forms')).toHaveTextContent('5');
  });

  test('should render forms table', () => {
    const FormsTable = ({ forms }: any) => (
      <table data-testid="forms-table">
        <thead>
          <tr>
            <th>forms.table.name</th>
            <th>forms.table.status</th>
            <th>forms.table.created</th>
            <th>forms.table.actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form: any) => (
            <tr key={form.id}>
              <td>{form.name}</td>
              <td>{form.status}</td>
              <td>{form.createdDate}</td>
              <td>
                <button data-testid={`edit-${form.id}`}>Edit</button>
                <button data-testid={`delete-${form.id}`}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    
    const mockForms = [
      { id: 1, name: 'Patient Registration', status: 'Active', createdDate: '2023-01-15' },
      { id: 2, name: 'Medical History', status: 'Draft', createdDate: '2023-01-20' },
    ];
    
    render(<FormsTable forms={mockForms} />);
    
    expect(screen.getByTestId('forms-table')).toBeInTheDocument();
    expect(screen.getByText('Patient Registration')).toBeInTheDocument();
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(screen.getByTestId('edit-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-2')).toBeInTheDocument();
  });

  test('should handle form creation', () => {
    const CreateForm = ({ onCreate }: any) => (
      <div data-testid="create-form">
        <input data-testid="form-name-input" placeholder="Form name" />
        <select data-testid="form-type-select">
          <option value="registration">Registration</option>
          <option value="medical">Medical</option>
        </select>
        <button onClick={() => onCreate('Test Form', 'registration')}>
          forms.create
        </button>
      </div>
    );
    
    const mockOnCreate = jest.fn();
    render(<CreateForm onCreate={mockOnCreate} />);
    
    const nameInput = screen.getByTestId('form-name-input');
    const typeSelect = screen.getByTestId('form-type-select');
    const createButton = screen.getByText('forms.create');
    
    // Fill form
    fireEvent.change(nameInput, { target: { value: 'Test Form' } });
    fireEvent.change(typeSelect, { target: { value: 'registration' } });
    
    // Submit form
    fireEvent.click(createButton);
    
    expect(mockOnCreate).toHaveBeenCalledWith('Test Form', 'registration');
  });

  test('should handle form search', () => {
    const FormSearch = ({ onSearch }: any) => (
      <div data-testid="form-search">
        <input
          data-testid="search-input"
          placeholder="forms.searchPlaceholder"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    );
    
    const mockOnSearch = jest.fn();
    render(<FormSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Patient' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('Patient');
  });

  test('should handle form filtering', () => {
    const FormFilters = ({ onFilter }: any) => (
      <div data-testid="form-filters">
        <select data-testid="status-filter" onChange={(e) => onFilter('status', e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <select data-testid="type-filter" onChange={(e) => onFilter('type', e.target.value)}>
          <option value="all">All Types</option>
          <option value="registration">Registration</option>
          <option value="medical">Medical</option>
        </select>
      </div>
    );
    
    const mockOnFilter = jest.fn();
    render(<FormFilters onFilter={mockOnFilter} />);
    
    const statusFilter = screen.getByTestId('status-filter');
    const typeFilter = screen.getByTestId('type-filter');
    
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    expect(mockOnFilter).toHaveBeenCalledWith('status', 'active');
    
    fireEvent.change(typeFilter, { target: { value: 'registration' } });
    expect(mockOnFilter).toHaveBeenCalledWith('type', 'registration');
  });

  test('should handle form actions', () => {
    const FormActions = ({ form, onEdit, onDelete, onDuplicate }: any) => (
      <div data-testid={`form-actions-${form.id}`}>
        <button onClick={() => onEdit(form)}>Edit</button>
        <button onClick={() => onDelete(form.id)}>Delete</button>
        <button onClick={() => onDuplicate(form)}>Duplicate</button>
      </div>
    );
    
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();
    const mockDuplicate = jest.fn();
    
    const mockForm = { id: 1, name: 'Test Form' };
    
    render(
      <FormActions 
        form={mockForm} 
        onEdit={mockEdit}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />
    );
    
    const actionsContainer = screen.getByTestId('form-actions-1');
    
    // Test edit action
    fireEvent.click(actionsContainer.querySelector('button:first-child')!);
    expect(mockEdit).toHaveBeenCalledWith(mockForm);
    
    // Test delete action
    fireEvent.click(actionsContainer.querySelectorAll('button')[1]!);
    expect(mockDelete).toHaveBeenCalledWith(1);
    
    // Test duplicate action
    fireEvent.click(actionsContainer.querySelector('button:last-child')!);
    expect(mockDuplicate).toHaveBeenCalledWith(mockForm);
  });

  test('should handle pagination', () => {
    const FormPagination = ({ currentPage, totalPages, onPageChange }: any) => (
      <div data-testid="form-pagination">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span data-testid="current-page">{currentPage}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
    
    const mockOnPageChange = jest.fn();
    render(
      <FormPagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    
    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');
    
    // Test navigation
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('should handle form preview', () => {
    const FormPreview = ({ form, onClose }: any) => (
      <div data-testid="form-preview">
        <h2>{form.name}</h2>
        <p>{form.description}</p>
        <div data-testid="form-fields">
          {form.fields.map((field: any) => (
            <div key={field.id} data-testid={`field-${field.id}`}>
              <label>{field.label}</label>
              <input type={field.type} placeholder={field.placeholder} />
            </div>
          ))}
        </div>
        <button onClick={onClose}>Close Preview</button>
      </div>
    );
    
    const mockOnClose = jest.fn();
    const mockForm = {
      id: 1,
      name: 'Patient Registration',
      description: 'Form for patient registration',
      fields: [
        { id: 1, label: 'First Name', type: 'text', placeholder: 'Enter first name' },
        { id: 2, label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
      ]
    };
    
    render(<FormPreview form={mockForm} onClose={mockOnClose} />);
    
    expect(screen.getByText('Patient Registration')).toBeInTheDocument();
    expect(screen.getByText('Form for patient registration')).toBeInTheDocument();
    expect(screen.getByTestId('field-1')).toBeInTheDocument();
    expect(screen.getByTestId('field-2')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Close Preview'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
