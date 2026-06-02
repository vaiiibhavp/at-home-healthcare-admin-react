import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/dashboard/Sidebar';
import DoctorsTable from '../../components/doctors/DoctorsTable';
import Modal from '../../components/doctors/Modal';
import Toast from '../../components/doctors/Toast';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import { useGetDoctorsQuery, useUpdateDoctorStatusMutation } from '../../services/doctorsApi';
import { Doctor, DoctorStatusUpdateRequest } from '../../types/doctor';

const Doctors: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch doctors data
  const { data: doctorsData, isLoading } = useGetDoctorsQuery({ page: 1, size: 50 });  //error handled in component
  const doctors = doctorsData?.data?.doctors || [];
  
  // Status update mutation
  const [updateDoctorStatus] = useUpdateDoctorStatusMutation();
  
  // Tab state managed at parent level
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate total counts before search filtering
  const totalPendingDoctors = doctors.filter(doctor => doctor.status === 'pendingApproval').length;
  const totalApprovedDoctors = doctors.filter(doctor => doctor.status === 'approved').length;
  
  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      `${doctor.fName} ${doctor.lName}`?.toLowerCase().includes(query) ||
      doctor.email?.toLowerCase().includes(query) ||
      doctor.specialty?.toLowerCase().includes(query)
    );
  });
  
  // Helper function to get approved parameter
  const getApprovedParam = (): string => {
    const tabMap: Record<'pending' | 'approved', string> = {
      pending: 'false',
      approved: 'true'
    };
    return tabMap[activeTab];
  };
  
  // Sync tab state with URL parameter on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const approvedParam = params.get('approved');
    if (approvedParam === 'true') {
      setActiveTab('approved');
    } else {
      setActiveTab('pending');
    }
  }, [location.search]);
  
  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log('Notification action:', notificationId, action);
    // Handle navigation or other actions based on notification type
  };

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    doctorName: string;
    doctorId: string;
  }>({
    isOpen: false,
    type: null,
    doctorName: '',
    doctorId: ''
  });
  
  const [toast, setToast] = useState({
    show: false,
    message: ''
  });

  const handleApprove = (doctor: Doctor) => {
    setModalState({
      isOpen: true,
      type: 'approve',
      doctorName: `Dr. ${doctor.fName} ${doctor.lName}`,
      doctorId: doctor.id
    });
  };

  const handleReject = (doctor: Doctor) => {
    setModalState({
      isOpen: true,
      type: 'reject',
      doctorName: `Dr. ${doctor.fName} ${doctor.lName}`,
      doctorId: doctor.id
    });
  };

  const handleDisable = (doctor: Doctor) => {
    const statusKey = doctor.status === 'inactive' ? 'doctors.activated' : 'doctors.disabled';
    const status = t(statusKey);
    const doctorName = `Dr. ${doctor.fName} ${doctor.lName}`;
    setToast({
      show: true,
      message: t('doctors.statusChangeSuccess', { doctorName, status })
    });
  };

  const handleView = (doctor: Doctor) => {
    navigate(`/doctors/${doctor.id}?approved=${getApprovedParam()}`);
  };

  const hideModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      doctorName: '',
      doctorId: ''
    });
  };

  const confirmAction = async () => {
    try {
      if (!modalState.type) return;
      
      const statusData: DoctorStatusUpdateRequest = modalState.type === 'approve' 
        ? { status: 'approved' } 
        : { status: 'rejected', reason: 'Rejected by admin' };
      
      await updateDoctorStatus({ 
        doctorId: modalState.doctorId, 
        statusData 
      }).unwrap();
      
      const statusText = modalState.type === 'approve' ? t('doctors.approved') : t('status.rejected');
      setToast({
        show: true,
        message: t('doctors.statusUpdate', { status: statusText, doctorName: modalState.doctorName })
      });
      hideModal();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      setToast({
        show: true,
        message: t('doctors.errorUpdatingStatus') || 'Error updating doctor status'
      });
    }
  };

  const hideToast = () => {
    setToast({
      show: false,
      message: ''
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 pt-10 pb-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder={t('doctors.searchDoctors')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown
              onNotificationAction={handleNotificationAction}
            />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-6">
          {/* Page Title & Header */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {t('doctors.title')}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {t('doctors.subtitle')}
                </p>
              </div>
              {/* <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-plus"></i>
                Add Doctor
              </button> */}
            </div>
          </div>

          {/* Doctors Table */}
          <DoctorsTable 
            doctors={filteredDoctors}
            loading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
            onDisable={handleDisable}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            totalPendingDoctors={totalPendingDoctors}
            totalApprovedDoctors={totalApprovedDoctors}
          />
          
          {/* Error State */}
          {/* {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                {t('doctors.errorLoading') || 'Error loading doctors data. Please try again.'}
              </p>
            </div>
          )} */}
        </div>
        </main>

        {/* Modals */}
        {modalState.type && (
          <Modal
            isOpen={modalState.isOpen}
            onClose={hideModal}
            type={modalState.type}
            onConfirm={confirmAction}
            doctorName={modalState.doctorName}
          />
        )}

        {/* Toast */}
        <Toast
          message={toast.message}
          show={toast.show}
          onClose={hideToast}
        />
      </div>
    </div>
  );
};

export default Doctors;
