import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestDetailModal } from './RequestDetailModal';
import { RequestData } from './RequestTypes';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import Sidebar from '../../components/dashboard/Sidebar';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import PaginationComponent from '../../components/ui/PaginationComponent';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

interface ApiResponse {
  status: number;
  message: string;
  data: {
    requests: RequestData[];
    pagination: {
      total: number;
      page: number;
      size: number;
      totalPages: number;
      totalRange: string;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  timestamp: string;
}

const Requests: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedRequestForReset, setSelectedRequestForReset] = useState<RequestData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // API state
  const [requestsData, setRequestsData] = useState<RequestData[]>([]);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const latestRequestId = useRef(0);
  const [servicesList, setServicesList] = useState<Array<{ id: string; serviceName: string }>>([]);

  // Helper to translate service names from API
  const getTranslatedServiceName = (name: string): string => {
    const key = name.toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
    return t(`serviceNames.${key}`, { defaultValue: name });
  };
  
  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log('Notification action:', notificationId, action);
    // Handle navigation or other actions based on notification type
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Helper function to get service color based on status
  const getServiceColor = (status: string): string => {
    const colorMap = {
      pending: 'amber',
      completed: 'emerald',
      inprogress: 'blue',
      returned: 'red',
      cancelled: 'red',
      draft: 'gray'
    };
    return colorMap[status as keyof typeof colorMap] || 'gray';
  };

  // Helper function to get initials from doctor name
  const getDoctorInitials = (firstName?: string, lastName?: string): string => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = lastName?.charAt(0).toUpperCase() || '';
    return (firstInitial + lastInitial) || 'DR';
  };

  // Helper function to format form status from API response
  const formatFormStatus = useCallback((status?: string): string => {
    if (!status) return t('requests.pending').toUpperCase();
    // Normalize status to lowercase for consistent mapping
    const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '');
    const statusMap: Record<string, string> = {
      draft: t('requests.draft').toUpperCase(),
      signed: t('requests.signed').toUpperCase(),
      submitted: t('requests.submitted').toUpperCase(),
      awaitingsignature: t('requests.awaitingSignature').toUpperCase(),
      cancelled: t('requests.cancelled').toUpperCase(),
      notstarted: t('requests.notStarted').toUpperCase(),
    };
    return statusMap[normalizedStatus] || status.toUpperCase();
  }, [t]);

  // API function to fetch services for filter dropdown
  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/services?page=1&size=100`, {
        method: 'GET',
        headers
      });
      const data = await response.json();

      if (data.status === 200 && data.data?.services) {
        setServicesList(data.data.services);
      }
    } catch (error) {
      console.error('Fetch Services Error:', error);
    }
  }, []);

  // API function to fetch requests
  const fetchRequests = useCallback(async (page: number = 1, size: number = 10, status?: string, startDate?: string, endDate?: string, service?: string, search?: string) => {
    const requestId = ++latestRequestId.current;
    try {
      // Map frontend status values to API-expected values
      const statusMap: Record<string, string> = {
        pending: 'submitted',
        inprogress: 'inProgress'
      };
      const apiStatus = status ? (statusMap[status] || status) : undefined;

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(apiStatus && { status: apiStatus }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(service && { service }),
        ...(search && { search })
      });
      
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/admin/requests?${params}`, {
        method: 'GET',
        headers
      });
      const data: ApiResponse = await response.json();
      
      if (data.status === 200) {
        if (latestRequestId.current !== requestId) return;

        // Transform API response to match component structure
        const transformedRequests = data.data.requests.map((apiRequest: any) => {
          // Normalize API status values to frontend status keys
          const apiToFrontendStatus: Record<string, string> = {
            submitted: 'pending',
            inProgress: 'inprogress',
            completed: 'completed',
            returned: 'returned',
            cancelled: 'cancelled',
            draft: 'draft'
          };
          const normalizedStatus = apiToFrontendStatus[apiRequest.status] || apiRequest.status;

          return {
            ...apiRequest,
            status: normalizedStatus,
            // Add backward compatibility properties
            doctor: {
              name: `${apiRequest.doctorFirstName || ''} ${apiRequest.doctorLastName || ''}`.trim() || apiRequest.doctorName || t('requests.unknownDoctor'),
              specialty: apiRequest.doctorSpeciality || t('requests.unknownSpecialty'),
              avatar: resolveImageUrl(apiRequest.doctorProfileImage)
            },
            patient: apiRequest.patientName || t('requests.unknownPatient'),
            serviceType: apiRequest.serviceName || t('requests.unknownService'),
            dateCreated: apiRequest.createdAt ? new Date(apiRequest.createdAt).toLocaleDateString(dateLocale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : t('requests.unknownDate'),
            lastUpdated: apiRequest.updatedAt ? new Date(apiRequest.updatedAt).toLocaleDateString(dateLocale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : t('requests.unknownDate'),
            serviceColor: getServiceColor(normalizedStatus),
            formStatus: formatFormStatus(apiRequest.formStatus)
          };
        });
        
        setRequestsData(transformedRequests);
        setTotalItems(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.page);
        setItemsPerPage(data.data.pagination.size);
      } else {
        console.error('API Error:', data.message);
        // Set empty data on error
        if (latestRequestId.current === requestId) {
          setRequestsData([]);
          setTotalItems(0);
          setTotalPages(0);
        }
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      // Set empty data on error
      if (latestRequestId.current === requestId) {
        setRequestsData([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } finally {
      // no-op
    }
  }, [t, dateLocale, formatFormStatus]);

  // API function to fetch detailed request data
  const fetchRequestDetails = useCallback(async (requestId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return null;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/admin/requests/${requestId}`, {
        method: 'GET',
        headers
      });
      const data = await response.json();
      
      if (data.status === 200) {
        return data.data;
      } else {
        console.error('API Error:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      return null;
    }
  }, []);

  const fetchAuditLogs = useCallback(async (requestId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return null;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/admin/requests/${requestId}/audit-logs`, {
        method: 'GET',
        headers
      });
      
      const data = await response.json();
      
      if (data.status === 200) {
        return data.data.auditLogs;
      } else {
        console.error('API Error:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      return null;
    }
  }, []);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Fetch data on component mount and when pagination/filters change
  useEffect(() => {
    fetchRequests(currentPage, itemsPerPage, statusFilter, startDate, endDate, serviceFilter, searchQuery);
  }, [currentPage, itemsPerPage, statusFilter, startDate, endDate, serviceFilter, searchQuery, fetchRequests]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusChipClass = (status: string): string => {
    const statusClasses = {
      pending: 'status-chip status-pending',
      completed: 'status-chip status-completed',
      inprogress: 'status-chip status-inprogress',
      returned: 'status-chip status-returned',
      cancelled: 'status-chip status-returned',
      draft: 'status-chip status-draft'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-chip';
  };

  const getStatusText = (status: string): string => {
    const statusTexts = {
      pending: t('requests.submitted'),
      completed: t('requests.completed'),
      inprogress: t('requests.inProgress'),
      returned: t('requests.returned'),
      cancelled: t('requests.cancelled'),
      draft: t('requests.draft')
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const handleRowClick = async (request: RequestData) => {
    // Fetch detailed request data
    const detailedData = await fetchRequestDetails(request.id);
    
    if (detailedData) {
      // Pass complete API response data directly
      const completeRequestData: RequestData = {
        ...request, // Keep basic fields
        ...detailedData, // Add all detailed API fields
        requestId: request.requestId, // Always preserve human-readable request ID from list data
        // Keep backward compatibility for existing UI
        doctor: {
          name: `${detailedData.doctorFirstName || detailedData.doctorId?.fName || ''} ${detailedData.doctorLastName || detailedData.doctorId?.lName || ''}`.trim() || request.doctorName || t('requests.unknownDoctor'),
          specialty: detailedData.doctorId?.specialty || request.doctorSpeciality || t('requests.unknownSpecialty'),
          avatar: resolveImageUrl(request.doctorProfileImage)
        },
        patient: detailedData.patientId?.fullName || request.patientName || t('requests.unknownPatient'),
        serviceType: detailedData.serviceId?.serviceName || request.serviceName || t('requests.unknownService'),
        dateCreated: detailedData.createdAt ? new Date(detailedData.createdAt).toLocaleDateString(dateLocale, { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : request.dateCreated,
        lastUpdated: detailedData.updatedAt ? new Date(detailedData.updatedAt).toLocaleDateString(dateLocale, { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : request.lastUpdated,
        serviceColor: getServiceColor(detailedData.status),
        formStatus: formatFormStatus(detailedData.formStatus)
      };
      
      setSelectedRequest(completeRequestData);
      setIsModalOpen(true);
    } else {
      // Fallback to basic request data if detailed fetch fails
      setSelectedRequest(request);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleResetRequest = (request: RequestData) => {
    setSelectedRequestForReset(request);
    setShowResetModal(true);
  };

  const handleCancelRequest = async (request: RequestData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || ''}/admin/requests/${request.id}`,
        {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!response.ok) throw new Error('Failed to cancel request');

      setRequestsData(prevData =>
        prevData.map(req =>
          req.id === request.id
            ? { ...req, status: 'cancelled', serviceColor: 'red' }
            : req
        )
      );
      setIsModalOpen(false);
      setSelectedRequest(null);
      setToastMessage(t('requests.requestCancelledSuccess'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Cancel Request Error:', error);
      setToastMessage(t('requests.failedToCancelRequest'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleResetStatus = () => {
    // Update the request status from inprogress to submitted
    if (selectedRequestForReset) {
      setRequestsData(prevData =>
        prevData.map(req =>
          req.id === selectedRequestForReset.id
            ? { ...req, status: 'pending', serviceColor: 'amber' } // 'pending' corresponds to 'submitted' status
            : req
        )
      );
    }

    setToastMessage(t('requests.requestStatusResetSuccess'));
    setShowToast(true);
    setShowResetModal(false);
    setSelectedRequestForReset(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('authToken');
      const statusMap: Record<string, string> = {
        pending: 'PENDING',
        inprogress: 'IN_PROGRESS',
        completed: 'COMPLETED',
        returned: 'RETURNED',
        draft: 'DRAFT'
      };
      const filters: Record<string, string> = {};
      if (statusFilter) filters.status = statusMap[statusFilter] || statusFilter.toUpperCase();
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (serviceFilter) filters.serviceName = serviceFilter;

      const fields = 'requestId,status,patientName,doctorName,serviceName,formStatus,createdAt,updatedAt';
      const params = new URLSearchParams({
        entityType: 'serviceRequests',
        format: 'csv',
        filters: JSON.stringify(filters),
        fields
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || ''}/export?${params}`,
        {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `service_requests_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToastMessage(t('requests.exportDownloaded'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Export Error:', error);
      setToastMessage(t('requests.exportFailed'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden gap-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-20 pt-10 pb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900">{t('requests.title')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
              <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs mr-2"></i>
              <input
                type="text"
                placeholder={t('requests.searchPlaceholder')}
                className="bg-transparent border-none outline-none text-xs w-64 text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <NotificationDropdown
              onNotificationAction={handleNotificationAction}
            />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            {/* <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all relative">
              <i className="fa-solid fa-filter text-sm"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-bold">2</span>
            </button> */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {exporting ? t('requests.exporting') : t('common.export')}
            </button>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="p-8 flex flex-col gap-6 h-full overflow-y-auto">
          {/* Filters & Views Section */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <select 
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-primary shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('requests.allRequests')}</option>
                <option value="pending">{t('requests.submitted')}</option>
                <option value="inprogress">{t('requests.inProgress')}</option>
                <option value="completed">{t('requests.completed')}</option>
                <option value="returned">{t('requests.returned')}</option>
                <option value="cancelled">{t('requests.cancelled')}</option>
                <option value="draft">{t('requests.draft')}</option>
              </select>
            </div>
            <div className="flex items-center gap-3 relative" ref={datePickerRef}>
              <div 
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <i className="fa-solid fa-calendar text-slate-400 text-xs"></i>
                <span className="text-xs font-medium text-slate-600">
                  {startDate && endDate ? `${startDate} - ${endDate}` : t('requests.dateRange')}
                </span>
                <i className="fa-solid fa-chevron-down text-slate-400 text-[10px] ml-2"></i>
              </div>
              
              {showDatePicker && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-50 w-72">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">{t('requests.startDate')}</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">{t('requests.endDate')}</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setStartDate('');
                          setEndDate('');
                          setShowDatePicker(false);
                        }}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        {t('common.clear')}
                      </button>
                      <button
                        onClick={() => {
                          setShowDatePicker(false);
                        }}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-all"
                      >
                        {t('common.apply')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <select 
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 pr-3 items-start text-left"
                value={serviceFilter}
                onChange={(e) => {
                  setServiceFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('requests.allServices')}</option>
                {servicesList.map((svc) => (
                  <option key={svc.id} value={svc.serviceName}>{getTranslatedServiceName(svc.serviceName)}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Requests Table Section */}
          <section className="bg-white rounded-2xl border border-slate-200 tradingview-shadow overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                        {t('requests.requestId')} <i className="fa-solid fa-sort"></i>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.doctor')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.patient')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.serviceType')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.status')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.formStatus')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.dateCreated')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('requests.lastUpdated')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('requests.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requestsData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <i className="fa-solid fa-inbox text-slate-300 text-3xl mb-3"></i>
                          <span className="text-sm text-slate-500">{t('requests.noRequestsFound')}</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    requestsData.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => handleRowClick(request)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-slate-500">#{request.requestId || request.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {request.doctor?.avatar && request.doctor?.avatar !== 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg' ? (
                            /* eslint-disable-next-line jsx-a11y/alt-text */
                            <img
                              src={request.doctor.avatar}
                              alt={`${request.doctor?.name || t('requests.unknownDoctor')} - Doctor Avatar`}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {getDoctorInitials(request.doctorFirstName, request.doctorLastName)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-800">{request.doctor?.name || t('requests.unknownDoctor')}</p>
                            <p className="text-[10px] text-slate-500">{request.doctor?.specialty || t('requests.unknownSpecialty')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-700">{request.patient}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full bg-${request.serviceColor}-400`}></span>
                          <span className="text-xs text-slate-600">{getTranslatedServiceName(request.serviceType)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusChipClass(request.status)}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {request.formStatus || t('requests.noForm')}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{request.dateCreated}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{request.lastUpdated}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {request.status === 'inprogress' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResetRequest(request);
                              }}
                              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                              title={t('requests.resetRequest')}
                            >
                              <i className="fa-solid fa-undo text-sm"></i>
                            </button>
                          )}
                          {request.status !== 'completed' && request.status !== 'cancelled' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelRequest(request);
                              }}
                              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                              title={t('requests.cancelRequest')}
                            >
                              <i className="fa-solid fa-times text-sm"></i>
                            </button>
                          )}
                          <button 
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                            title={t('requests.viewDetail')}
                          >
                            <i className="fa-solid fa-eye text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </section>
        </div>
      </main>

      {/* Request Detail Modal */}
      <RequestDetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            request={selectedRequest}
            fetchAuditLogs={fetchAuditLogs}
            onCancelRequest={handleCancelRequest}
          />

      {/* Reset Status Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden tradingview-shadow">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{t('requests.resetRequestStatus')}</h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                <i className="fa-solid fa-exclamation-triangle text-amber-600 mt-0.5"></i>
                <p className="text-sm text-amber-800">
                  {t('requests.resetWarning')}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t('requests.reasonForReset')}</label>
                <input 
                  type="text"
                  placeholder="" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox"
                  id="understand-checkbox"
                  className="w-4 h-4 text-primary border-slate-300 rounded mt-0.5 focus:ring-primary"
                />
                <label htmlFor="understand-checkbox" className="text-sm text-slate-600">
                  {t('requests.iUnderstand')}
                </label>
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
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
              >
                {t('requests.resetRequestButton')}
              </button>
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
    </div>
  );
};

export default Requests;
