import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Modal from '../../components/doctors/Modal';
import Toast from '../../components/doctors/Toast';
import { useGetDoctorDetailsQuery, useUpdateDoctorStatusMutation, useUpdateInternalNotesMutation } from '../../services/doctorsApi';
import { Doctor } from '../../types/doctor';
import { camelCaseToTitleCase } from '../../utils/formatText';

interface DoctorDetailProps {
  isApproved?: boolean; // Optional prop to pass doctor's approval status
}

const DoctorDetail: React.FC<DoctorDetailProps> = ({ isApproved: propIsApproved = false }) => {
  const { t } = useTranslation('common');
  const [searchParams] = useSearchParams();
  const { id: doctorId } = useParams<{ id: string }>();
  
  // Store the original approved parameter from URL for back navigation
  const originalApprovedParam = searchParams.get('approved') === 'true';
  
  // Fetch doctor details - only call API if doctorId exists
  const { data: doctorData, isLoading, error } = useGetDoctorDetailsQuery(doctorId || '', {
    skip: !doctorId
  });
  
  // Extract doctor profile and verification data from the nested structure
  const doctor = doctorData?.data?.profile || null;
  const verification = doctorData?.data?.verification || null;
  
  // Status update mutation
  const [updateDoctorStatus] = useUpdateDoctorStatusMutation();
  
  // Internal notes mutation
  const [updateInternalNotes] = useUpdateInternalNotesMutation();
  
  const isApproved = doctor?.status === 'approved' || propIsApproved || originalApprovedParam;
  const isInactive = doctor?.status === 'inactive';

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'approve' as 'approve' | 'reject',
    doctorName: ''
  });

  const [toast, setToast] = useState({
    show: false,
    message: ''
  });

  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectError, setShowRejectError] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');

  // Initialize internal notes when doctor data is loaded
  React.useEffect(() => {
    if (doctor?.internalNotes) {
      setInternalNotes(doctor.internalNotes);
    }
  }, [doctor]);

  const handleSaveInternalNotes = async () => {
    if (!doctorId || !internalNotes.trim()) {
      setToast({
        show: true,
        message: t('doctors.notesRequired')
      });
      return;
    }

    try {
      await updateInternalNotes({ 
        doctorId, 
        notesData: { internalNotes: internalNotes.trim() } 
      }).unwrap();
      
      setToast({
        show: true,
        message: t('doctors.notesSaved')
      });
    } catch (error) {
      console.error('Error saving internal notes:', error);
      setToast({
        show: true,
        message: t('doctors.notesSaveError')
      });
    }
  };

  const showModal = (type: 'approve' | 'reject') => {
    setModalState({
      isOpen: true,
      type,
      doctorName: doctor ? `Dr. ${doctor.fullName}` : ''
    });
  };

  const handleApprove = () => {
    handleAction('approved');
  };

  // Generate avatar URL based on doctor's name
  const getAvatarUrl = (doctor: Doctor) => {
    return `https://ui-avatars.com/api/?name=${doctor.fullName}&background=random&color=fff&size=128`;
  };

  if (!doctorId) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{t('doctors.noDoctorId')}</p>
              <Link to={`/doctors?approved=${searchParams.get('approved') === 'true'}`} className="text-primary hover:underline">
                {t('doctors.backToDoctorsList')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {/* {t('doctors.errorLoading') || 'Error loading doctor details'} */}
                </p>  
              <Link to={`/doctors?approved=${searchParams.get('approved') === 'true'}`} className="text-primary hover:underline">
                {t('doctors.backToDoctorsList')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{t('doctors.doctorDataNotFound')}</p>
              <Link to={`/doctors?approved=${searchParams.get('approved') === 'true'}`} className="text-primary hover:underline">
                {t('doctors.backToDoctorsList')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hideModal = () => {
    setModalState({
      ...modalState,
      isOpen: false
    });
    setRejectReason('');
    setRejectComment('');
    setShowRejectError(false);
  };

  const validateReject = () => {
    if (!rejectReason) {
      setShowRejectError(true);
      return;
    }
    setShowRejectError(false);
    handleAction('rejected');
  };

  const handleAction = async (status?: string) => {
    hideModal();
    
    if (!doctorId || !status) return;
    
    try {
      const statusData = {
        status: status as 'approved' | 'rejected',
        reason: status === 'rejected' ? rejectReason : undefined,
        comment: rejectComment || undefined
      };
      
      await updateDoctorStatus({ doctorId, statusData }).unwrap();
      
      setToast({
        show: true,
        message: t('doctors.statusUpdate', { status: status === 'approved' ? t('doctors.approved') : t('status.rejected'), doctorName: modalState.doctorName })
      });
    } catch (error) {
      setToast({
        show: true,
        message: `Error updating doctor status: ${error}`
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
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 pt-10 pb-10">
          <div className="flex items-center gap-4">
            <Link to={`/doctors?approved=${originalApprovedParam}`} className="inline-block">
              <button 
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">{t('doctors.doctorProfileDetail')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              isApproved 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : isInactive
                ? 'bg-slate-50 text-slate-700 border border-slate-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              <i className={`fa-solid ${
                isApproved ? 'fa-check' : 
                isInactive ? 'fa-pause' : 
                'fa-clock'
              }`}></i> 
              {isApproved ? t('doctors.approved') : isInactive ? t('common.inactive') : t('doctors.pendingApproval')}
            </div>
          </div>
        </header>

        <div className="p-8 flex flex-col lg:flex-row gap-8">
          {/* Left Column: Profile Details */}
          <section className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 tradingview-shadow overflow-hidden h-full">
              <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={getAvatarUrl(doctor)}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                      alt={`Dr. ${doctor.fullName}`}
                    />
                    {doctor.isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center border-4 border-white">
                        <i className="fa-solid fa-check text-[10px]"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">Dr. {doctor.fullName}</h2>
                    <p className="text-primary font-medium">{camelCaseToTitleCase(doctor.specialty)}</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <i className="fa-solid fa-envelope opacity-60"></i>
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t('doctors.professionalIdentifiers')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t('doctors.rppsNumber')}</p>
                        <p className="text-sm font-mono font-bold text-slate-900">{doctor.rppsNumber}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t('doctors.finessNumber')}</p>
                        <p className="text-sm font-mono font-bold text-slate-900">{doctor.finessNumber}</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="space-y-6">

                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t('doctors.officeInformation')}
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('doctors.businessAddress')}</span>
                        <span className="font-medium text-slate-900 text-right">{doctor.businessAddress}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('doctors.practiceType')}</span>
                        <span className="font-medium text-slate-900 text-right">{doctor.practiceType}</span>
                      </div>
                      {doctor.country && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">{t('doctors.country')}</span>
                          <span className="font-medium text-slate-900 text-right">{doctor.country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Approval Panel */}
          <section className="lg:w-1/3 space-y-6">
            {/* Action Card - Only show for pending approval */}
            {!isApproved && !isInactive && (
              <div className="bg-white rounded-2xl border border-slate-200 tradingview-shadow p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{t('doctors.verificationStatus')}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="fa-solid fa-magnifying-glass-chart text-primary"></i>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('doctors.auditSnippet')}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">
                      {t('doctors.auditSnippetText')}
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-slate-200 left-4"></div>
                    <div className="space-y-6">
                      <div className="relative step-line pb-2.5 pl-11">
                        <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center z-10 justify-between m-0 p-2.5 gap-1.5">
                          <i className="fa-solid fa-check text-xs"></i>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{t('doctors.steps.registrationSubmitted')}</p>
                        <p className="text-[10px] text-slate-500">
                          {verification?.timeline?.[0]?.timestamp 
                            ? new Date(verification.timeline[0].timestamp).toLocaleDateString()
                            : t('doctors.steps.registrationDate')
                          }
                        </p>
                      </div>

                      <div className="relative step-line pb-2.5 pl-11">
                        <div className={`absolute left-0 top-0 w-8 h-8 ${
                          doctor?.status === 'pendingApproval' ? 'bg-amber-100 text-amber-600' :
                          doctor?.status === 'approved' || doctor?.status === 'rejected' ? 'bg-emerald-100 text-emerald-600' :
                          doctor?.status === 'inactive' ? 'bg-slate-100 text-slate-600' :
                          'bg-slate-100 text-slate-600'
                        } rounded-full flex items-center justify-center z-10 p-2.5 m-0 gap-1.5`}>
                          <i className={`fa-solid ${
                            doctor?.status === 'pendingApproval' ? 'fa-clock' :
                            doctor?.status === 'approved' || doctor?.status === 'rejected' ? 'fa-check' :
                            doctor?.status === 'inactive' ? 'fa-pause' :
                            'fa-circle text-xs'
                          } text-xs`}></i>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{t('doctors.steps.adminReview')}</p>
                        <p className="text-[10px] text-slate-500">
                          {doctor?.status === 'pendingApproval' 
                            ? t('doctors.stepStatus.pendingApproval')
                            : doctor?.status === 'approved' 
                            ? t('doctors.stepStatus.approved')
                            : doctor?.status === 'rejected'
                            ? t('doctors.stepStatus.rejected')
                            : doctor?.status === 'inactive'
                            ? t('doctors.stepStatus.inactive')
                            : t('doctors.steps.adminReviewStatus')
                          }
                        </p>
                      </div>

                      <div className="relative pl-11">
                        <div className={`absolute left-0 top-0 w-8 h-8 ${
                          doctor?.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                          doctor?.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          doctor?.status === 'inactive' ? 'bg-slate-100 text-slate-600' :
                          'bg-slate-100 text-slate-600'
                        } rounded-full flex items-center justify-center z-10 p-2.5 m-0 gap-1.5`}>
                          <i className={`fa-solid ${
                            doctor?.status === 'approved' ? 'fa-check' :
                            doctor?.status === 'rejected' ? 'fa-times' :
                            doctor?.status === 'inactive' ? 'fa-pause' :
                            'fa-circle text-xs'
                          } text-xs`}></i>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{t('doctors.steps.emailVerified')}</p>
                        <p className="text-[10px] text-slate-500">
                          {doctor?.status === 'approved' 
                            ? t('doctors.verificationStates.verified')
                            : doctor?.status === 'rejected'
                            ? t('doctors.verificationStates.notVerified')
                            : doctor?.status === 'inactive'
                            ? t('doctors.verificationStates.inactive')
                            : t('doctors.verificationStates.pendingAdminApproval')
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <i className="fa-solid fa-user-check"></i> 
                    {t('doctors.approveApplication')}
                  </button>
                  <button
                    onClick={() => showModal('reject')}
                    className="w-full py-3 bg-white text-danger border border-danger/20 rounded-xl font-bold text-sm hover:bg-danger/5 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-user-xmark"></i> {t('doctors.rejectNotify')}
                  </button>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 tradingview-shadow p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">{t('doctors.internalNotes')}</h3>
              <div className="space-y-4">
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder={t('doctors.notesPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/10 outline-none min-h-[100px]"
                />
                <div className="flex justify-end">
                  <button 
                    onClick={handleSaveInternalNotes}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    {t('doctors.saveNote')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modals */}
        {modalState.type === 'approve' && (
          <Modal
            isOpen={modalState.isOpen}
            onClose={hideModal}
            type={modalState.type}
            onConfirm={handleAction}
            doctorName={modalState.doctorName}
          />
        )}

        {modalState.type === 'reject' && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalState.isOpen ? '' : 'hidden'}`} style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white w-full max-w-md rounded-2xl tradingview-shadow overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">{t('doctors.rejectApplicationTitle')}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    hideModal();
                  }} 
                  className="text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">{t('doctors.rejectionDescription')}</p>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-danger/10 outline-none"
                >
                  <option value="">{t('doctors.selectReason')}</option>
                  <option value="invalid_rpps">{t('doctors.rejectionReasons.invalidRpps')}</option>
                  <option value="missing_docs">{t('doctors.rejectionReasons.missingDocs')}</option>
                  <option value="expired_insurance">{t('doctors.rejectionReasons.expiredInsurance')}</option>
                  <option value="other">{t('doctors.rejectionReasons.other')}</option>
                </select>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={3}
                  placeholder={t('doctors.additionalComments')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-danger/10 outline-none"
                />
                {showRejectError && (
                  <p className="text-xs text-danger">{t('doctors.selectRejectionReason')}</p>
                )}
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    hideModal();
                  }} 
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('doctors.cancel')}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    validateReject();
                  }} 
                  className="px-4 py-2 text-sm font-bold text-white bg-danger rounded-lg hover:bg-red-700"
                >
                  {t('doctors.confirmReject')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <Toast
          message={toast.message}
          show={toast.show}
          onClose={hideToast}
        />
      </main>
    </div>
  );
};

export default DoctorDetail;
