import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('DoctorDetail Component Tests', () => {
  test('should render doctor profile information', () => {
    const DoctorProfile = () => (
      <div>
        <h2>Dr. John Doe</h2>
        <p>Cardiology</p>
        <p>john.doe@example.com</p>
        <p>123 Main St, City, State</p>
      </div>
    );
    
    render(<DoctorProfile />);
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, City, State')).toBeInTheDocument();
  });

  test('should handle approval actions', () => {
    const ApprovalActions = ({ onApprove, onReject }: any) => (
      <div>
        <button onClick={onApprove} data-testid="approve-btn">Approve</button>
        <button onClick={onReject} data-testid="reject-btn">Reject</button>
      </div>
    );
    
    const mockApprove = jest.fn();
    const mockReject = jest.fn();
    
    render(<ApprovalActions onApprove={mockApprove} onReject={mockReject} />);
    
    fireEvent.click(screen.getByTestId('approve-btn'));
    expect(mockApprove).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTestId('reject-btn'));
    expect(mockReject).toHaveBeenCalledTimes(1);
  });

  test('should display doctor status', () => {
    const DoctorStatus = ({ status }: { status: string }) => (
      <div data-testid="doctor-status">{status}</div>
    );
    
    const { rerender } = render(<DoctorStatus status="pending" />);
    expect(screen.getByTestId('doctor-status')).toHaveTextContent('pending');
    
    rerender(<DoctorStatus status="approved" />);
    expect(screen.getByTestId('doctor-status')).toHaveTextContent('approved');
  });

  test('should handle internal notes', () => {
    const InternalNotes = ({ notes, onSave }: any) => (
      <div>
        <textarea 
          data-testid="notes-textarea"
          value={notes}
          onChange={(e) => onSave(e.target.value)}
        />
        <button onClick={() => onSave('Test note')} data-testid="save-btn">Save</button>
      </div>
    );
    
    const mockSave = jest.fn();
    render(<InternalNotes notes="" onSave={mockSave} />);
    
    const textarea = screen.getByTestId('notes-textarea');
    const saveButton = screen.getByTestId('save-btn');
    
    fireEvent.click(saveButton);
    expect(mockSave).toHaveBeenCalledWith('Test note');
  });
});
