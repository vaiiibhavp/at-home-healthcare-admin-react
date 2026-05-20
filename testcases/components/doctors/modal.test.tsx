import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render when isOpen is false', () => {
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={false}
        onClose={jest.fn()}
        type="approve"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    expect(screen.queryByText('Dr. John Doe')).not.toBeInTheDocument();
  });

  test('should render approval modal when type is approve', () => {
    const mockOnConfirm = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="approve"
        onConfirm={mockOnConfirm}
        doctorName="Dr. John Doe"
      />
    );

    expect(screen.getByText('modal.confirmApproval')).toBeInTheDocument();
    expect(screen.getByText(/Dr\. John Doe/)).toBeInTheDocument();
    expect(screen.getByText('modal.approveNow')).toBeInTheDocument();
    expect(screen.getByText('common.cancel')).toBeInTheDocument();
  });

  test('should render rejection modal when type is reject', () => {
    const mockOnConfirm = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="reject"
        onConfirm={mockOnConfirm}
        doctorName="Dr. John Doe"
      />
    );

    expect(screen.getByText('modal.rejectApplication')).toBeInTheDocument();
    expect(screen.getByText(/Dr\. John Doe/)).toBeInTheDocument();
    expect(screen.getByText('modal.confirmRejection')).toBeInTheDocument();
    expect(screen.getByText('common.cancel')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Missing RPPS/)).toBeInTheDocument();
  });

  test('should call onConfirm with Approved when approve button is clicked', () => {
    const mockOnConfirm = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="approve"
        onConfirm={mockOnConfirm}
        doctorName="Dr. John Doe"
      />
    );

    const approveButton = screen.getByText('modal.approveNow');
    fireEvent.click(approveButton);

    expect(mockOnConfirm).toHaveBeenCalledWith('Approved');
  });

  test('should call onConfirm with Rejected when reject button is clicked', () => {
    const mockOnConfirm = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="reject"
        onConfirm={mockOnConfirm}
        doctorName="Dr. John Doe"
      />
    );

    const rejectButton = screen.getByText('modal.confirmRejection');
    fireEvent.click(rejectButton);

    expect(mockOnConfirm).toHaveBeenCalledWith('Rejected');
  });

  test('should call onClose when cancel button is clicked in approval modal', () => {
    const mockOnClose = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        type="approve"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const cancelButton = screen.getByText('common.cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when cancel button is clicked in rejection modal', () => {
    const mockOnClose = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        type="reject"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const cancelButton = screen.getByText('common.cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when close button is clicked in rejection modal', () => {
    const mockOnClose = jest.fn();
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        type="reject"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const closeButton = screen.getByRole('generic', { hidden: true }); // Close icon
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should have proper styling classes for approval modal', () => {
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="approve"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const modalContainer = screen.getByText('modal.confirmApproval').closest('div');
    expect(modalContainer).toHaveClass('fixed inset-0 z-50 flex items-center justify-center p-4');

    const modalContent = screen.getByText('modal.confirmApproval').parentElement?.parentElement;
    expect(modalContent).toHaveClass('bg-white w-full max-w-md rounded-2xl p-8 text-center');
  });

  test('should have proper styling classes for rejection modal', () => {
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="reject"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const modalContainer = screen.getByText('modal.rejectApplication').closest('div');
    expect(modalContainer).toHaveClass('fixed inset-0 z-50 flex items-center justify-center p-4');

    const modalContent = screen.getByText('modal.rejectApplication').parentElement?.parentElement;
    expect(modalContent).toHaveClass('bg-white w-full max-w-md rounded-2xl');
  });

  test('should display rejection textarea in rejection modal', () => {
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="reject"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const textarea = screen.getByPlaceholderText(/e\.g\. Missing RPPS/);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea).toHaveClass('w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm');
  });

  test('should handle textarea input in rejection modal', () => {
    const Modal = require('../../../src/components/doctors/Modal').default;
    
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        type="reject"
        onConfirm={jest.fn()}
        doctorName="Dr. John Doe"
      />
    );

    const textarea = screen.getByPlaceholderText(/e\.g\. Missing RPPS/);
    fireEvent.change(textarea, { target: { value: 'Test rejection reason' } });

    expect(textarea).toHaveValue('Test rejection reason');
  });
});
