import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from '../ui/PaginationComponent';
import { Doctor } from '../../types/doctor';
import { useUpdateDoctorStatusMutation } from '../../services/doctorsApi';

interface DoctorsTableProps {
  doctors: Doctor[];
  loading?: boolean;
  onApprove: (doctor: Doctor) => void;
  onReject: (doctor: Doctor) => void;
  onView: (doctor: Doctor) => void;
  onDisable?: (doctor: Doctor) => void;
  activeTab: 'pending' | 'approved';
  setActiveTab: (tab: 'pending' | 'approved') => void;
  totalPendingDoctors?: number;
  totalApprovedDoctors?: number;
}

const DoctorsTable = ({ doctors, loading = false, onApprove, onReject, onView, onDisable, activeTab, setActiveTab, totalPendingDoctors, totalApprovedDoctors }: DoctorsTableProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  
  // Helper function to get approved parameter
  const getApprovedParam = (): string => {
    const tabMap: Record<'pending' | 'approved', string> = {
      pending: 'false',
      approved: 'true'
    };
    return tabMap[activeTab];
  };
  
  // Status update mutation
  const [updateDoctorStatus] = useUpdateDoctorStatusMutation();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter state
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Filter doctors based on status and specialty
  const pendingDoctors = doctors.filter(doctor => 
    doctor.status === 'pendingApproval' && 
    (selectedSpecialty === '' || doctor.specialty === selectedSpecialty)
  );
  const approvedDoctors = doctors.filter(doctor => 
    (doctor.status === 'approved' || doctor.status === 'inactive') && 
    (selectedSpecialty === '' || doctor.specialty === selectedSpecialty)
  );

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendingApproval':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <i className="fa-solid fa-circle text-[6px] mr-1.5"></i>
            {t('status.pending') || 'Pending'}
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <i className="fa-solid fa-circle text-[6px] mr-1.5"></i>
            {t('status.active') || 'Active'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            <i className="fa-solid fa-circle text-[6px] mr-1.5"></i>
            {t('status.rejected') || 'Rejected'}
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
            <i className="fa-solid fa-circle text-[6px] mr-1.5"></i>
            {t('status.inactive') || 'Inactive'}
          </span>
        );
      default:
        return null;
    }
  };

  // Get current doctors based on active tab
  const getCurrentDoctors = () => {
    const doctors = activeTab === 'pending' ? pendingDoctors : approvedDoctors;
    return doctors;
  };

  // Pagination calculations
  const currentDoctors = getCurrentDoctors();
  const totalItems = currentDoctors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDoctors = currentDoctors.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset pagination when switching tabs
  const handleTabChange = (tab: 'pending' | 'approved') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Generate avatar URL based on doctor's name
  const getAvatarUrl = (doctor: Doctor) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(`${doctor.fName} ${doctor.lName}`)}&background=random&color=fff`;
  };

  // Get doctor's full name
  const getDoctorName = (doctor: Doctor) => {
    return `Dr. ${doctor.fName} ${doctor.lName}`;
  };

  const getTranslatedSpecialty = (specialty: string) => {
    const translation = t(`doctors.${specialty}`);
    return translation.startsWith('doctors.') ? capitalizeFirst(specialty) : translation;
  };

  // Handle approve action
  const handleApprove = (doctor: Doctor) => {
    onApprove(doctor);
  };

  // Handle disable/activate action
  const handleDisable = async (doctor: Doctor) => {
    try {
      const newStatus = doctor.status === 'inactive' ? 'approved' : 'inactive';
      const reason = doctor.status === 'inactive' ? 'Reactivated by admin' : 'Disabled by admin';
      
      await updateDoctorStatus({ 
        doctorId: doctor.id, 
        statusData: { status: newStatus, reason } 
      }).unwrap();
      onDisable?.(doctor);
    } catch (error) {
      console.error('Error updating doctor status:', error);
    }
  };

  // Handle reject action
  const handleReject = (doctor: Doctor) => {
    onReject(doctor);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => handleTabChange('pending')}
          className={`px-6 py-3 text-sm font-medium transition-all ${
            activeTab === 'pending' 
              ? 'tab-active border-b-2 border-primary text-primary font-bold' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('doctors.pendingApprovals')} 
          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">{totalPendingDoctors !== undefined ? totalPendingDoctors : pendingDoctors.length}</span>
        </button>
        <button
          onClick={() => handleTabChange('approved')}
          className={`px-6 py-3 text-sm font-medium transition-all ${
            activeTab === 'approved' 
              ? 'tab-active border-b-2 border-primary text-primary font-bold' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('doctors.approvedDoctors')}
          <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">{totalApprovedDoctors !== undefined ? totalApprovedDoctors : approvedDoctors.length}</span>
        </button>
      </div>

      {/* Table Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
        <div className="flex gap-2">
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10"
            value={selectedSpecialty}
            onChange={(e) => {
              setSelectedSpecialty(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="">{t('doctors.allSpecialties')}</option>
            <option value="generalPractice">{t('doctors.generalPractice')}</option>
            <option value="cardiology">{t('doctors.cardiology')}</option>
            <option value="pediatrics">{t('doctors.pediatrics')}</option>
            <option value="dermatology">{t('doctors.dermatology')}</option>
            <option value="neurology">{t('doctors.neurology')}</option>
            <option value="orthopedics">{t('doctors.orthopedics')}</option>
            <option value="other">{t('doctors.other')}</option>
          </select>
          {/* <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
            <i className="fa-solid fa-filter mr-1"></i> {t('doctors.moreFilters')}
          </button> */}
        </div>
      </div>

      {/* Pending Table */}
      {activeTab === 'pending' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('doctors.doctorName')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('doctors.emailAddress')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('doctors.specialty')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(doctor)}
                        className="w-8 h-8 rounded-lg object-cover"
                        alt={getDoctorName(doctor)}
                      />
                      <span className="text-sm font-semibold text-slate-900">{getDoctorName(doctor)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{doctor.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{getTranslatedSpecialty(doctor.specialty)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(doctor)}
                        title={t('doctors.approve')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button
                        onClick={() => handleReject(doctor)}
                        title={t('doctors.reject')}
                        className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                      <button
                        onClick={() => navigate(`/doctors/${doctor.id}?approved=${getApprovedParam()}`)}
                        title={t('doctors.viewDetails')}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approved Table */}
      {activeTab === 'approved' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('doctors.doctorName')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('doctors.specialty')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('common.status')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(doctor)}
                        className="w-8 h-8 rounded-lg object-cover"
                        alt={getDoctorName(doctor)}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{getDoctorName(doctor)}</p>
                        <p className="text-[10px] text-slate-400">RPPS: {doctor.rppsNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{getTranslatedSpecialty(doctor.specialty)}</td>
                  <td className="px-6 py-4">{getStatusBadge(doctor.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/doctors/${doctor.id}?approved=${getApprovedParam()}`)}
                        className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {t('doctors.view')}
                      </button>
                      <button 
                        onClick={() => handleDisable(doctor)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                          doctor.status === 'inactive' 
                            ? 'text-emerald-600 hover:bg-emerald-50' 
                            : 'text-danger hover:bg-red-50'
                        }`}
                      >
                        {doctor.status === 'inactive' ? t('doctors.activate') : t('doctors.disable')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default DoctorsTable;
