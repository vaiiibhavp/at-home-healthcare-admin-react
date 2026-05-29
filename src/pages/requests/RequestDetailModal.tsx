import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestData } from './RequestTypes';

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RequestData | null;
  fetchAuditLogs?: (requestId: string) => Promise<any>;
  onCancelRequest?: (request: RequestData) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  fetchAuditLogs,
  onCancelRequest
}) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  const getTranslatedServiceName = (name: string): string => {
    const key = name.toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
    return t(`serviceNames.${key}`, { defaultValue: name });
  };

  const [showResetModal, setShowResetModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showPhysicianModal, setShowPhysicianModal] = useState(false);
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newResetStatus, setNewResetStatus] = useState('');
  const [resetReason, setResetReason] = useState('');
  const [resetting, setResetting] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Fetch signed PDF with auth headers and create blob URL
  React.useEffect(() => {
    const fetchPdf = async () => {
      if (!request || request.formStatus?.toLowerCase() !== 'signed' || !request.signedPdfUrl) {
        setPdfBlobUrl(null);
        return;
      }

      setLoadingPdf(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/${request.signedPdfUrl}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
          }
        );
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (error) {
        console.error('Error fetching signed PDF:', error);
        setPdfBlobUrl(null);
      } finally {
        setLoadingPdf(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id, request?.signedPdfUrl, request?.formStatus]);

  const handleExportPdf = async () => {
    if (!request?.signedPdfUrl) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/${request.signedPdfUrl}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      );
      if (!response.ok) throw new Error('Failed to fetch PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${request.requestId || 'request'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleZoom = () => {
    setZoomLevel((prev) => (prev >= 1.5 ? 1 : prev + 0.25));
  };

  // Build timeline from API statusHistory
  const timelineEvents = React.useMemo(() => {
    if (!request || !request.statusHistory || request.statusHistory.length === 0) return [];

    const history = request.statusHistory;
    const statusMap: Record<string, string> = {
      submitted: t('requests.submitted'),
      inprogress: t('requests.inProgress'),
      completed: t('requests.completed'),
      returned: t('requests.returned'),
      cancelled: t('requests.cancelled'),
      draft: t('requests.requestCreated'),
      pending: t('requests.pending')
    };
    const iconMap: Record<string, string> = {
      submitted: 'fa-paper-plane',
      inprogress: 'fa-spinner',
      completed: 'fa-flag-checkered',
      returned: 'fa-undo',
      cancelled: 'fa-ban',
      draft: 'fa-check',
      pending: 'fa-clock'
    };

    return history.map((item: any, index: number) => {
      const isLast = index === history.length - 1;
      return {
        status: statusMap[item.status] || item.status.charAt(0).toUpperCase() + item.status.slice(1),
        date: new Date(item.changedAt).toLocaleDateString(dateLocale, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        notes: item.notes,
        icon: iconMap[item.status] || 'fa-circle',
        isActive: isLast,
        isCompleted: !isLast
      };
    });
  }, [request]);

  if (!isOpen || !request) return null;

  const getStatusChipClass = (status: string): string => {
    const statusClasses = {
      pending: 'status-chip bg-blue-50 text-blue-600 border-blue-200',
      completed: 'status-chip bg-emerald-50 text-emerald-600 border-emerald-200',
      inprogress: 'status-chip bg-blue-50 text-blue-600 border-blue-200',
      returned: 'status-chip bg-amber-50 text-amber-600 border-amber-200',
      cancelled: 'status-chip bg-red-50 text-red-600 border-red-200'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-chip bg-slate-50 text-slate-600 border-slate-200';
  };

  const getStatusText = (status: string): string => {
    const statusTexts = {
      pending: t('requests.submitted'),
      completed: t('requests.completed'),
      inprogress: t('requests.inProgress'),
      returned: t('requests.returned'),
      cancelled: t('requests.cancelled')
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const handleResetStatus = async () => {
    if (!request || !newResetStatus || !resetReason.trim()) return;
    setResetting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/requests/${request.requestId || request.id}/reset-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            newStatus: newResetStatus,
            reason: resetReason.trim()
          })
        }
      );
      if (!response.ok) throw new Error('Failed to reset status');
      setToastMessage(t('requests.requestStatusResetSuccess'));
      setShowToast(true);
      setShowResetModal(false);
      setNewResetStatus('');
      setResetReason('');
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error resetting status:', error);
      setToastMessage(t('requests.failedToResetStatus'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setResetting(false);
    }
  };

  
  // Function to fetch audit logs when audit modal is opened
  const handleOpenAuditModal = async () => {
    if (!request || !fetchAuditLogs) return;
    
    setLoadingAuditLogs(true);
    try {
      const logs = await fetchAuditLogs(request.id);
      if (logs) {
        setAuditLogs(logs);
      } else {
        setAuditLogs([]);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setAuditLogs([]);
    } finally {
      setLoadingAuditLogs(false);
      setShowAuditModal(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-white overflow-hidden">
        <div className="h-full w-full flex flex-col">
          {/* Header */}
          <div className="h-24 bg-white border-b border-slate-200 flex flex-col justify-center px-8 flex-shrink-0 z-20 pt-10 pb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-900">{t('requests.requestNumber', { id: request.requestId || request.id })}</h1>
                    <span className={getStatusChipClass(request.status)}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    <i className="fa-regular fa-clock mr-1"></i> {t('requests.received')}: {request.dateCreated} • 
                    <i className="fa-regular fa-calendar-check ml-2 mr-1"></i> {t('requests.lastUpdate')}: {request.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(request.status === 'completed' || request.formStatus?.toLowerCase() === 'signed') && (
                  <button
                    onClick={handleExportPdf}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-file-pdf text-danger"></i> {t('requests.exportPdf')}
                  </button>
                )}
                <button
                  onClick={handleOpenAuditModal}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <i className="fa-solid fa-list-ul"></i> {t('requests.auditLog')}
                </button>
              </div>
            </div>
          </div>

          {/* Cancelled Banner */}
          {(request.status === 'returned' || request.status === 'cancelled') && (
            <div className="bg-red-50 border-b border-red-200 px-8 py-3 flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-red-500"></i>
              <p className="text-sm font-bold text-red-700">{t('requests.cancelledByAdmin')}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50">
            {/* Entity Info Cards */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Doctor Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 tradingview-shadow">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {t('requests.requestingPhysician')}
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={request.doctorProfileImage || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"}
                    alt={`${request.doctorName || t('requests.unknownDoctor')} - Doctor Avatar`}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 capitalize">{request.doctorName || t('requests.unknownDoctor')}</p>
                    <p className="text-xs text-slate-500 capitalize">{request.doctorSpeciality || t('requests.unknownSpecialty')} • {request.doctorId?.businessAddress || t('requests.privatePractice')}</p>
                    <p className="text-[11px] font-mono text-primary mt-1">{t('requests.rppsLabel')}: {request.doctorId?.rppsNumber || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <button onClick={() => setShowPhysicianModal(true)} className="text-xs font-bold text-primary hover:underline">{t('requests.viewFullProfile')}</button>
                  <button className="text-slate-400 hover:text-primary">
                    <i className="fa-solid fa-envelope"></i>
                  </button>
                </div>
              </div>

              {/* Patient Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 tradingview-shadow">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {t('requests.patientInfo')}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xl font-bold">
                    RJ
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{request.patientName || t('requests.unknownPatient')}</p>
                    <p className="text-xs text-slate-500">
                      {request.patientId?.dateOfBirth ? new Date().getFullYear() - new Date(request.patientId.dateOfBirth).getFullYear() : t('requests.notAvailable')} {t('requests.years')}, {request.patientId?.gender || t('requests.unknown')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      <i className="fa-solid fa-location-dot mr-1"></i> 
                      {request.patientId?.streetAddress && request.patientId?.city && request.patientId?.zip 
                        ? `${request.patientId.streetAddress}, ${request.patientId.city}, ${request.patientId.zip}`
                        : t('requests.addressNotAvailable')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end items-center">
                  <span className="text-xs text-slate-500">
                    <i className="fa-solid fa-phone mr-1"></i>
                    {request.patientId?.phoneNumber || t('requests.notAvailable')}
                  </span>
                </div>
              </div>

              {/* Service Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 tradingview-shadow">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {t('requests.serviceDetails')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">{t('requests.serviceType')}</span>
                    <span className="text-xs font-bold text-slate-900">{getTranslatedServiceName(request.serviceName || request.serviceType || t('requests.unknownService'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">{t('services.description')}</span>
                    <span className="text-xs font-bold text-slate-900">{request.serviceId?.description || t('requests.noDescription')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">{t('requests.priority')}</span>
                    <span className="text-xs font-bold text-slate-900 capitalize">{request.priorityLevel || t('requests.normal')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">{t('requests.provider')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{request.assignedProviderName || t('requests.notAssigned')}</span>
                      {request.assignedProviderName && <i className="fa-solid fa-circle-check text-[10px] text-emerald-500"></i>}
                    </div>
                  </div>
                                  </div>
              </div>
            </section>

            {/* Form Preview & Timeline */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
              {/* Form Preview */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 tradingview-shadow flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-file-waveform text-primary"></i>
                      <h3 className="text-sm font-bold text-slate-800">{t('requests.form')}: Laboratory Prescription V2.1</h3>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleZoom} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-all" title={t('common.zoom') || 'Zoom'}>
                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                      </button>
                      <button onClick={() => setShowExpandModal(true)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-all" title={t('common.expand') || 'Expand'}>
                        <i className="fa-solid fa-expand"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t('requests.formStatusLabel')}:</span>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                        request.formStatus?.toLowerCase() === 'signed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        request.formStatus?.toLowerCase() === 'awaitingsignature' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        request.formStatus?.toLowerCase() === 'submitted' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        request.formStatus?.toLowerCase() === 'draft' ? 'bg-gray-50 text-gray-600 border border-gray-200' :
                        'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {request.formStatus?.toLowerCase() === 'signed' ? t('requests.signed').toUpperCase() :
                         request.formStatus?.toLowerCase() === 'awaitingsignature' ? t('requests.awaitingSignature').toUpperCase() :
                         request.formStatus?.toLowerCase() === 'submitted' ? t('requests.submitted').toUpperCase() :
                         request.formStatus?.toLowerCase() === 'draft' ? t('requests.draft').toUpperCase() : (request.formStatus || t('requests.unknown'))}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>
                        <i className="fa-solid fa-calendar-check mr-1"></i>
                        {t('requests.updatedBy', { date: request.updatedAt ? new Date(request.updatedAt).toLocaleDateString(dateLocale, { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : t('requests.unknownDate'), user: request.updatedBy?.fName && request.updatedBy?.lName ? `${request.updatedBy.fName} ${request.updatedBy.lName}` : request.updatedBy?.email || t('requests.unknownUser') })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-slate-100/30 flex-1 min-h-[500px] overflow-auto">
                  {request.formStatus?.toLowerCase() === 'signed' && request.signedPdfUrl ? (
                    loadingPdf ? (
                      <div className="flex items-center justify-center h-full min-h-[500px]">
                        <i className="fa-solid fa-spinner fa-spin text-primary text-xl mr-3"></i>
                        <span className="text-sm text-slate-600">{t('requests.loadingPdf')}</span>
                      </div>
                    ) : pdfBlobUrl ? (
                      <iframe
                        src={`${pdfBlobUrl}#toolbar=0&zoom=page-fit`}
                        title="Signed Form PDF"
                        className="w-full h-full min-h-[600px] border border-slate-200 rounded-lg bg-white"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[500px]">
                        <span className="text-sm text-slate-500">{t('requests.failedToLoadPdf')}</span>
                      </div>
                    )
                  ) : (
                    <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-10 shadow-sm space-y-8 transition-transform origin-top" style={{ transform: `scale(${zoomLevel})` }}>
                      <div className="flex justify-between items-start border-b pb-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{t('requests.medicalPrescription')}</h2>
                          <p className="text-xs text-slate-500">ID: {request.requestId || t('requests.notAvailable')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-800">At-Home Healthcare</p>
                          <p className="text-[10px] text-slate-500">{t('requests.digitalHealthNetwork')}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8 text-xs">
                        <div>
                          <p className="font-bold text-slate-400 uppercase mb-2">{t('requests.patientLabel')}</p>
                          <p className="text-slate-900 font-medium">{request.patientName || request.patient || t('requests.unknownPatient')}</p>
                          <p className="text-slate-500 mt-1">{t('requests.dob')}: {request.patientId?.dateOfBirth ? new Date(request.patientId.dateOfBirth).toLocaleDateString(dateLocale, { 
                            month: '2-digit', 
                            day: '2-digit', 
                            year: 'numeric'
                          }) : t('requests.notAvailable')}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase mb-2">{t('requests.prescriber')}</p>
                          <p className="text-slate-900 font-medium capitalize">{request.doctorName || request.doctor?.name || t('requests.unknownDoctor')}</p>
                          <p className="text-slate-500 mt-1">{t('requests.license')}: #{request.doctorId?.rppsNumber || t('requests.notAvailable')}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t('requests.analysisRequested')}</p>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded border-2 border-primary flex items-center justify-center mt-0.5">
                              <i className="fa-solid fa-file-medical text-[10px] text-primary"></i>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                                {request.patientId?.medicalDescription || t('requests.noMedicalDescription')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {(request.digitalSignature?.signedAt || request.status === 'completed') && (
                        <div className="pt-8 flex justify-end">
                          <div className="text-center">
                            <div className="w-48 h-12 border-b-2 border-slate-200 flex items-center justify-center italic text-primary font-serif capitalize">
                              {request.doctorName || request.doctor?.name || t('requests.unknownDoctor')}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                              {request.digitalSignature?.signedAt
                                ? t('requests.digitallySignedOn', { date: new Date(request.digitalSignature.signedAt).toLocaleDateString(dateLocale, {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric'
                                  }) })
                                : t('requests.digitallySigned')
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline & Actions */}
              <div className="lg:col-span-4 space-y-6">
                {/* Status Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 tradingview-shadow">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                    {t('requests.requestLifecycle')}
                  </h3>
                  <div className="relative space-y-8 pl-4">
                    <div className="timeline-line"></div>
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="flex gap-4 items-start relative">
                        <div className={`timeline-dot ${event.isActive ? (event.isCompleted ? 'active bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'active border-primary text-primary animate-pulse') : ''} pt-0.5 pb-0.5`}>
                          <i className={`fa-solid ${event.icon} text-xs`}></i>
                        </div>
                        <div className={`${!event.isActive ? 'opacity-40' : ''}`}>
                          <p className="text-sm font-bold text-slate-900">{event.status}</p>
                          <p className="text-xs text-slate-500">{event.date}</p>
                          {event.notes && <p className="text-[10px] text-slate-400 mt-1 italic">{event.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Controls */}
                {request.status !== 'completed' && request.status !== 'returned' && request.status !== 'cancelled' && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 tradingview-shadow">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      {t('requests.adminControls')}
                    </h3>
                    <div className="space-y-3">
                      {request.status === 'inprogress' && (
                        <button
                          onClick={() => setShowResetModal(true)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                        >
                          <i className="fa-solid fa-rotate-left"></i> {t('requests.resetStatus')}
                        </button>
                      )}
                      <button
                        onClick={() => request && onCancelRequest?.(request)}
                        className="w-full px-4 py-3 bg-danger/5 text-danger rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-danger/10 transition-all"
                      >
                        <i className="fa-solid fa-ban"></i> {t('requests.cancelRequest')}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Internal Notes */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 tradingview-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('requests.internalNotes')}
                    </h3>
                    <button className="text-primary text-[10px] font-bold hover:underline">{t('requests.addNote')}</button>
                  </div>
                  <div className="space-y-4">
                    {request.initialNotes ? (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {request.initialNotes}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          {t('requests.by')} {request.createdBy?.fName && request.createdBy?.lName ? `${request.createdBy.fName} ${request.createdBy.lName}` : request.createdBy?.email || t('requests.unknownUser')} • 
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString(dateLocale, { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : t('requests.unknownDate')}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-400 italic">
                          {t('requests.noInternalNotes')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Reset Status Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden tradingview-shadow">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{t('requests.resetRequestStatus')}</h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl flex gap-3">
                <i className="fa-solid fa-triangle-exclamation text-warning mt-0.5"></i>
                <p className="text-xs text-slate-700">
                  {t('requests.resetWarning')}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t('requests.resetToStatus')}</label>
                <select
                  value={newResetStatus}
                  onChange={(e) => setNewResetStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">{t('requests.selectStatus')}</option>
                  <option value="pending">{t('requests.pending')}</option>
                  <option value="submitted">{t('requests.submitted')}</option>
                  <option value="draft">{t('requests.draft')}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t('requests.reason')}</label>
                <textarea
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  placeholder={t('requests.resetPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 h-24"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleResetStatus}
                disabled={!newResetStatus || !resetReason.trim() || resetting}
                className="flex-1 px-4 py-3 bg-danger text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> {t('requests.resetting')}
                  </>
                ) : (
                  t('requests.resetRequestStatusButton')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden tradingview-shadow max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{t('requests.auditLogTitle', { id: request?.requestId || request?.id })}</h3>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loadingAuditLogs ? (
                <div className="flex items-center justify-center py-8">
                  <i className="fa-solid fa-spinner fa-spin text-primary text-xl mr-3"></i>
                  <span className="text-sm text-slate-600">{t('requests.loadingAuditLogs')}</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="flex flex-col items-center py-8">
                  <i className="fa-solid fa-clipboard-list text-slate-300 text-3xl mb-3"></i>
                  <span className="text-sm text-slate-500">{t('requests.noAuditLogs')}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log, index) => (
                    <div key={log.id || index} className="flex gap-4 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-history text-slate-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{log.actionType}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {t('requests.by')} {log.performedBy?.fName && log.performedBy?.lName 
                            ? `${log.performedBy.fName} ${log.performedBy.lName}` 
                            : log.performedBy?.email || t('requests.unknownUser')} • 
                          {log.performedAt 
                            ? new Date(log.performedAt).toLocaleDateString(dateLocale, { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : t('requests.unknownDate')
                          }
                        </p>
                        {log.reason && (
                          <p className="text-xs text-slate-600 mt-2 italic">{t('requests.reason')}: {log.reason}</p>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-slate-400 mt-1">{t('requests.ip')}: {log.ipAddress}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Physician Profile Modal */}
      {showPhysicianModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden tradingview-shadow">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{t('requests.physicianProfile')}</h3>
              <button onClick={() => setShowPhysicianModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={request.doctorProfileImage || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"}
                  alt={`${request.doctorName || t('requests.unknownDoctor')} - Doctor Avatar`}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 capitalize">{request.doctorName || t('requests.unknownDoctor')}</p>
                  <p className="text-xs text-slate-500 capitalize">{request.doctorSpeciality || t('requests.unknownSpecialty')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <i className="fa-solid fa-envelope text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('common.email')}</p>
                    <p className="text-sm font-medium text-slate-900">{request.doctorId?.email || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <i className="fa-solid fa-phone text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('common.phone')}</p>
                    <p className="text-sm font-medium text-slate-900">{request.doctorId?.phoneNumber || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                    <i className="fa-solid fa-id-card text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('requests.rppsNumber')}</p>
                    <p className="text-sm font-medium text-slate-900">{request.doctorId?.rppsNumber || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                    <i className="fa-solid fa-building text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('requests.finessNumber')}</p>
                    <p className="text-sm font-medium text-slate-900">{request.doctorId?.finessNumber || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                    <i className="fa-solid fa-stethoscope text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('requests.specialty')}</p>
                    <p className="text-sm font-medium text-slate-900 capitalize">{request.doctorId?.specialty || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                    <i className="fa-solid fa-location-dot text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('requests.businessAddress')}</p>
                    <p className="text-sm font-medium text-slate-900">{request.doctorId?.businessAddress || t('requests.notAvailable')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <i className="fa-solid fa-hospital text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('requests.practiceType')}</p>
                    <p className="text-sm font-medium text-slate-900 capitalize">{request.doctorId?.practiceType || t('requests.notAvailable')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expand Modal */}
      {showExpandModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden tradingview-shadow flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{t('requests.formPreview')}</h3>
              <button onClick={() => setShowExpandModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-100/30">
              {request.formStatus?.toLowerCase() === 'signed' && request.signedPdfUrl ? (
                loadingPdf ? (
                  <div className="flex items-center justify-center h-full min-h-[500px]">
                    <i className="fa-solid fa-spinner fa-spin text-primary text-xl mr-3"></i>
                    <span className="text-sm text-slate-600">{t('requests.loadingPdf')}</span>
                  </div>
                ) : pdfBlobUrl ? (
                  <iframe
                    src={`${pdfBlobUrl}#toolbar=0&zoom=page-fit`}
                    title="Signed Form PDF"
                    className="w-full h-full min-h-[600px] border border-slate-200 rounded-lg bg-white"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[500px]">
                    <span className="text-sm text-slate-500">{t('requests.failedToLoadPdf')}</span>
                  </div>
                )
              ) : (
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-10 shadow-sm space-y-8">
                  <div className="flex justify-between items-start border-b pb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{t('requests.medicalPrescription')}</h2>
                      <p className="text-xs text-slate-500">ID: {request.requestId || t('requests.notAvailable')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">At-Home Healthcare</p>
                      <p className="text-[10px] text-slate-500">{t('requests.digitalHealthNetwork')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-xs">
                    <div>
                      <p className="font-bold text-slate-400 uppercase mb-2">{t('requests.patientLabel')}</p>
                      <p className="text-slate-900 font-medium">{request.patientName || request.patient || t('requests.unknownPatient')}</p>
                      <p className="text-slate-500 mt-1">{t('requests.dob')}: {request.patientId?.dateOfBirth ? new Date(request.patientId.dateOfBirth).toLocaleDateString(dateLocale, { month: '2-digit', day: '2-digit', year: 'numeric' }) : t('requests.notAvailable')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase mb-2">{t('requests.prescriber')}</p>
                      <p className="text-slate-900 font-medium capitalize">{request.doctorName || request.doctor?.name || t('requests.unknownDoctor')}</p>
                      <p className="text-slate-500 mt-1">{t('requests.license')}: #{request.doctorId?.rppsNumber || t('requests.notAvailable')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">{t('requests.analysisRequested')}</p>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded border-2 border-primary flex items-center justify-center mt-0.5">
                          <i className="fa-solid fa-file-medical text-[10px] text-primary"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {request.patientId?.medicalDescription || t('requests.noMedicalDescription')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(request.digitalSignature?.signedAt || request.status === 'completed') && (
                    <div className="pt-8 flex justify-end">
                      <div className="text-center">
                        <div className="w-48 h-12 border-b-2 border-slate-200 flex items-center justify-center italic text-primary font-serif capitalize">
                          {request.doctorName || request.doctor?.name || t('requests.unknownDoctor')}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">
                          {request.digitalSignature?.signedAt
                            ? t('requests.digitallySignedOn', { date: new Date(request.digitalSignature.signedAt).toLocaleDateString(dateLocale, { month: '2-digit', day: '2-digit', year: 'numeric' }) })
                            : t('requests.digitallySigned')
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[70] bg-white border-l-4 border-success rounded-xl shadow-2xl p-4 min-w-[300px] tradingview-shadow">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-circle-check text-success"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{t('common.success')}</p>
              <p className="text-xs text-slate-500 mt-1">{toastMessage}</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
