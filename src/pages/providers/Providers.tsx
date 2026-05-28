import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/dashboard/Sidebar';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import PaginationComponent from '../../components/ui/PaginationComponent';
import { useGetProvidersQuery, useGetProviderByIdQuery, useDeactivateProviderMutation, useActivateProviderMutation, useBulkDeactivateProvidersMutation, useExportProvidersCSVMutation } from '../../services/providersApi';
import { useGetServicesQuery } from '../../services/servicesApi';
import { Provider as APIProvider } from '../../types/provider';

// Local interface for UI compatibility
interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  status: 'active' | 'inactive';
  initials: string;
  activeRequests: number;
}


const Providers: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedService, setSelectedService] = useState('all');
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedProviderForDeactivate, setSelectedProviderForDeactivate] = useState<string>('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedProviderForActivate, setSelectedProviderForActivate] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProviderForView, setSelectedProviderForView] = useState<string>('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [showBulkDeactivateModal, setShowBulkDeactivateModal] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [updatingProviderId, setUpdatingProviderId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log('Notification action:', notificationId, action);
    // Handle navigation or other actions based on notification type
  };

  // API call to get providers
  const { data: providersData, isLoading, error, refetch } = useGetProvidersQuery({
    page: currentPage,
    size: itemsPerPage,
    status: filterStatus === 'all' ? undefined :
            filterStatus === 'active' ? 'approved' : 'inactive',
    search: searchTerm || undefined,
    service: selectedService === 'all' ? undefined : selectedService
  });

  const { data: providerDetails, isLoading: isLoadingProvider } = useGetProviderByIdQuery(selectedProviderForView, {
    skip: !selectedProviderForView || !showViewModal
  });

  const { data: servicesData } = useGetServicesQuery({ page: 1, size: 100 });

  // Helper to translate service names from API
  const getTranslatedServiceName = (name: string): string => {
    const key = name.toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
    return t(`serviceNames.${key}`, { defaultValue: name });
  };

  // Create a map of service ID to translated service name
  const serviceIdToNameMap = servicesData?.data?.services?.reduce((map: Record<string, string>, service: any) => {
    const rawName = service.name || service.serviceName;
    map[service._id || service.id] = getTranslatedServiceName(rawName);
    return map;
  }, {}) || {};

  const [deactivateProvider, { isLoading: isDeactivating }] = useDeactivateProviderMutation();
  const [activateProvider, { isLoading: isActivating }] = useActivateProviderMutation();
  const [bulkDeactivateProviders, { isLoading: isBulkDeactivating }] = useBulkDeactivateProvidersMutation();
  const [exportProvidersCSV, { isLoading: isExporting }] = useExportProvidersCSVMutation();

  // Transform provider details to local Provider interface for modal
  const getTransformedProvider = (): Provider | null => {
    if (!providerDetails?.data) return null;
    
    const apiProvider = providerDetails.data;
    const names = apiProvider.providerName.split(' ');
    const initials = names.length > 1 
      ? names[0][0] + names[names.length - 1][0]
      : names[0][0] + (names[0][1] || '');
    
    return {
      id: apiProvider.id,
      name: apiProvider.providerName,
      email: apiProvider.email,
      phone: apiProvider.phoneNumber,
      services: [], // Will be populated from serviceDetails if available
      status: apiProvider.status === 'approved' ? 'active' : 'inactive',
      initials: initials.toUpperCase(),
      activeRequests: apiProvider.submittedFormCount || 0
    };
  };

  // Transform API data to local Provider interface
  const transformApiProvider = (apiProvider: APIProvider): Provider => {
    const names = apiProvider.providerName.split(' ');
    const initials = names.length > 1 
      ? names[0][0] + names[names.length - 1][0]
      : names[0][0] + (names[0][1] || '');
    
    return {
      id: apiProvider.id,
      name: apiProvider.providerName,
      email: apiProvider.email,
      phone: apiProvider.phoneNumber,
      services: apiProvider.serviceDetails.map(service => service.serviceName),
      status: apiProvider.status === 'approved' ? 'active' : 'inactive',
      initials: initials.toUpperCase(),
      activeRequests: 0 // API doesn't provide this, default to 0
    };
  };

  const providers: Provider[] = providersData?.data?.providers?.map(transformApiProvider) || [];

  const handleDeactivate = (providerId: string) => {
    console.log('handleDeactivate called with:', providerId);
    console.log('providerId type:', typeof providerId);
    console.log('providerId length:', providerId?.length);
    // Close other modals
    setShowActivateModal(false);
    setShowViewModal(false);
    setShowBulkDeactivateModal(false);
    setSelectedProviderForDeactivate(providerId);
    setShowDeactivateModal(true);
  };

  const handleActivate = (providerId: string) => {
    console.log('handleActivate called with:', providerId);
    console.log('providerId type:', typeof providerId);
    console.log('providerId length:', providerId?.length);
    // Close other modals
    setShowDeactivateModal(false);
    setShowViewModal(false);
    setShowBulkDeactivateModal(false);
    setSelectedProviderForActivate(providerId);
    setShowActivateModal(true);
  };

  const handleBulkDeactivate = () => {
    if (!showCheckboxes) {
      setShowCheckboxes(true);
      setToastMessage(t('providers.selectProvidersToDeactivate'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    if (selectedProviders.length === 0) {
      setToastMessage(t('providers.selectAtLeastOne'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setShowBulkDeactivateModal(true);
  };

  const confirmBulkDeactivate = async () => {
    try {
      const result = await bulkDeactivateProviders({
        providerIds: selectedProviders
      }).unwrap();
      
      setShowBulkDeactivateModal(false);
      setShowCheckboxes(false);
      setSelectedProviders([]);
      setToastMessage(t('providers.providersDeactivated', { count: result.data.deactivatedCount }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(t('providers.deactivateProvidersFailed'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleExportCSV = async () => {
    try {
      const result = await exportProvidersCSV().unwrap();
      
      // Parse the CSV blob to replace service IDs with names
      const text = await result.text();
      const lines = text.split('\n');
      
      // Find the index of the services column (assuming it's named something like "Services" or "assignedServices")
      const header = lines[0].split(',');
      const servicesIndex = header.findIndex(h => h.toLowerCase().includes('service'));
      
      let processedLines = lines;
      if (servicesIndex !== -1) {
        processedLines = lines.map((line, index) => {
          if (index === 0) return line; // Skip header
          const columns = line.split(',');
          if (columns[servicesIndex]) {
            const serviceIds = columns[servicesIndex].split(';').map(id => id.trim());
            const serviceNames = serviceIds.map(id => serviceIdToNameMap[id] || id).join('; ');
            columns[servicesIndex] = serviceNames;
          }
          return columns.join(',');
        });
      }
      
      const processedText = processedLines.join('\n');
      const processedBlob = new Blob([processedText], { type: 'text/csv' });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(processedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `providers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setToastMessage(t('providers.exportSuccess'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(t('providers.exportFailed'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const selectAllProviders = () => {
    if (selectedProviders.length === displayedProviders.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(displayedProviders.map(p => p.id));
    }
  };

  const confirmDeactivate = async () => {
    console.log('confirmDeactivate - selectedProviderForDeactivate:', selectedProviderForDeactivate);
    console.log('confirmDeactivate - selectedProviderForDeactivate type:', typeof selectedProviderForDeactivate);
    console.log('confirmDeactivate - selectedProviderForDeactivate length:', selectedProviderForDeactivate?.length);
    
    const providerId = selectedProviderForDeactivate;
    setShowDeactivateModal(false);
    setUpdatingProviderId(providerId);
    
    try {
      await deactivateProvider({
        id: providerId,
        body: { status: 'inactive' }
      }).unwrap();
      
      console.log('Deactivate success');
      await refetch();
      setUpdatingProviderId(null);
      setToastMessage(t('providers.deactivatedSuccessfully'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Deactivate error:', error);
      setUpdatingProviderId(null);
      setToastMessage(t('providers.deactivateFailed'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const confirmActivate = async () => {
    console.log('confirmActivate - selectedProviderForActivate:', selectedProviderForActivate);
    console.log('confirmActivate - selectedProviderForActivate type:', typeof selectedProviderForActivate);
    console.log('confirmActivate - selectedProviderForActivate length:', selectedProviderForActivate?.length);
    
    const providerId = selectedProviderForActivate;
    setShowActivateModal(false);
    setUpdatingProviderId(providerId);
    
    try {
      await activateProvider({
        id: providerId,
        body: { status: 'approved' }
      }).unwrap();
      
      console.log('Activate success');
      await refetch();
      setUpdatingProviderId(null);
      setToastMessage(t('providers.activatedSuccessfully'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Activate error:', error);
      setUpdatingProviderId(null);
      setToastMessage(t('providers.activateFailed'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleViewProvider = (provider: Provider) => {
    // Close other modals
    setShowDeactivateModal(false);
    setShowActivateModal(false);
    setShowBulkDeactivateModal(false);
    setSelectedProviderForView(provider.id);
    setShowViewModal(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          {t('common.active')}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold border border-slate-200">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
          {t('common.inactive')}
        </span>
      );
    }
  };

  const getInitialsBadge = (initials: string, status: string) => {
    const baseClasses = "w-10 h-10 rounded-xl flex items-center justify-center font-bold";
    const statusClasses = status === 'active' 
      ? "bg-primary/5 text-primary" 
      : "bg-slate-100 text-slate-400";
    
    return (
      <div className={`${baseClasses} ${statusClasses}`}>
        {initials}
      </div>
    );
  };

  // Use API-provided pagination data
  const totalItems = providersData?.data?.pagination?.total || 0;
  const totalPages = providersData?.data?.pagination?.totalPages || 1;
  
  // Client-side service filtering as fallback if API doesn't support it
  const displayedProviders = selectedService === 'all'
    ? providers
    : providers.filter(provider =>
        provider.services.includes(selectedService)
      );

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset pagination when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Debug modal states
  console.log('Modal states:', {
    showDeactivateModal,
    showActivateModal,
    showViewModal,
    showBulkDeactivateModal
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 pt-10 pb-10">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder={t('providers.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <Link to="/providers/create" className="inline-block">
              <button 
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-primary/10"
              >
                <i className="fa-solid fa-plus"></i> {t('providers.createProvider')}
              </button>
            </Link>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <NotificationDropdown
              onNotificationAction={handleNotificationAction}
            />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Filters Bar */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    handleFilterChange();
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg ${
                    filterStatus === 'all' 
                      ? 'bg-primary text-white' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t('providers.allProviders')}
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('active');
                    handleFilterChange();
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg ${
                    filterStatus === 'active' 
                      ? 'bg-primary text-white' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t('common.active')}
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('inactive');
                    handleFilterChange();
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg ${
                    filterStatus === 'inactive' 
                      ? 'bg-primary text-white' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t('common.inactive')}
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none shadow-sm flex items-center justify-between w-48"
                >
                  <span className="truncate">
                    {selectedService === 'all' ? t('services.allServices') : getTranslatedServiceName(selectedService)}
                  </span>
                    <span
                      className={`ml-2 transition-transform duration-200 ${
                        isServiceDropdownOpen ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                </button>
                {isServiceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div
                      onClick={() => {
                        setSelectedService('all');
                        setIsServiceDropdownOpen(false);
                        handleFilterChange();
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      {t('services.allServices')}
                    </div>
                    {servicesData?.data?.services?.map((service: any) => (
                      <div
                        key={service._id || service.id}
                        onClick={() => {
                          setSelectedService(service.name || service.serviceName);
                          setIsServiceDropdownOpen(false);
                          handleFilterChange();
                        }}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer truncate"
                      >
                        {getTranslatedServiceName(service.name || service.serviceName)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Providers Table */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-500">{t('providers.loadingProviders')}</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <i className="fa-solid fa-triangle-exclamation text-danger text-2xl mb-3"></i>
                  <p className="text-sm text-slate-500">{t('providers.errorLoadingProviders')}</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {showCheckboxes && (
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedProviders.length === displayedProviders.length && displayedProviders.length > 0}
                            onChange={selectAllProviders}
                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                          />
                          <span>{t('providers.selectAll')}</span>
                        </div>
                      </th>
                    )}
                    <th className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${showCheckboxes ? '' : 'pl-12'}`}>
                      {t('providers.providerName')}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('common.contact')}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('providers.eligibleServices')}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t('common.status')}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayedProviders.length === 0 ? (
                    <tr>
                      <td colSpan={showCheckboxes ? 7 : 6} className="px-6 py-12 text-center">
                        <div className="text-center">
                          <i className="fa-solid fa-inbox text-slate-300 text-3xl mb-3"></i>
                          <p className="text-sm text-slate-500">{t('providers.noProvidersFound')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedProviders.map((provider) => (
                      <tr key={provider.id} className={`hover:bg-slate-50/50 transition-colors ${selectedProviders.includes(provider.id) ? 'bg-primary/5' : ''}`}>
                        {showCheckboxes && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProviders.includes(provider.id)}
                              onChange={() => toggleProviderSelection(provider.id)}
                              className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                            />
                          </td>
                        )}
                        <td className={`px-6 py-4 ${showCheckboxes ? '' : 'pl-6'}`}>
                          <div className="flex items-center gap-3">
                            {getInitialsBadge(provider.initials, provider.status)}
                            <div>
                              <p className="text-sm font-bold text-slate-900">{provider.name}</p>
                              <p className="text-[11px] text-slate-500">ID: {provider.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">{provider.email}</p>
                          <p className="text-[11px] text-slate-500">{provider.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {provider.services.slice(0, 2).map((service, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200"
                              >
                                {getTranslatedServiceName(service)}
                              </span>
                            ))}
                            {provider.services.length > 2 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200">
                                +{provider.services.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(provider.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewProvider(provider)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all"
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            <Link to={`/providers/edit/${provider.id}`} className="inline-block">
                              <button 
                                className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                            </Link>
                            {updatingProviderId === provider.id ? (
                              <div className="p-2">
                                <div className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin"></div>
                              </div>
                            ) : provider.status === 'active' ? (
                              <button
                                onClick={() => handleDeactivate(provider.id)}
                                className="p-2 text-slate-400 hover:text-danger hover:bg-white rounded-lg transition-all relative z-10"
                                title={t('providers.deactivateProvider')}
                              >
                                <i className="fa-solid fa-ban"></i>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(provider.id)}
                                className="p-2 text-emerald-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all relative z-10"
                                title={t('providers.activateProvider')}
                              >
                                <i className="fa-solid fa-circle-check"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
            <div className="flex gap-2 p-6 bg-slate-50/30 border-t border-slate-100">
              {filterStatus === 'active' && (
                <button 
                  onClick={handleBulkDeactivate}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  {t('common.bulkDeactivate')}
                </button>
              )}
              <button 
                onClick={handleExportCSV}
                disabled={isExporting}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting && (
                  <div className="w-3 h-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {isExporting ? t('providers.exporting') : `${t('common.export')} CSV`}
              </button>
            </div>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </section>
        </div>
      </main>

      {/* Bulk Deactivate Confirmation Modal */}
      {showBulkDeactivateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t('providers.bulkDeactivateTitle')}</h3>
            <p className="text-slate-500 text-sm mt-2">
              {t('providers.bulkDeactivateConfirm', { count: selectedProviders.length })}
            </p>
            <div className="mt-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {selectedProviders.map(providerId => {
                  const provider = providers.find(p => p.id === providerId);
                  return provider ? (
                    <div key={providerId} className="text-xs text-slate-600 py-1">
                      • {provider.name}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowBulkDeactivateModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmBulkDeactivate}
                disabled={isBulkDeactivating}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-danger hover:bg-red-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBulkDeactivating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isBulkDeactivating ? t('providers.deactivating') : t('providers.deactivateAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t('providers.deactivateProvider')}?</h3>
            <p className="text-slate-500 text-sm mt-2">
              {t('providers.deactivateConfirm', { providerName: providers.find(p => p.id === selectedProviderForDeactivate)?.name || 'Unknown Provider' })}
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDeactivate}
                disabled={isDeactivating}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-danger hover:bg-red-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeactivating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isDeactivating ? t('providers.deactivating') : t('common.deactivate')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Confirmation Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-circle-check text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t('providers.activateProviderTitle')}</h3>
            <p className="text-slate-500 text-sm mt-2">
              {t('providers.activateConfirm', { providerName: providers.find(p => p.id === selectedProviderForActivate)?.name || 'Unknown Provider' })}
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowActivateModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmActivate}
                disabled={isActivating}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isActivating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isActivating ? t('providers.activating') : t('providers.activate')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 transform transition-all duration-300 z-[60]">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* View Provider Modal */}
      {showViewModal && selectedProviderForView && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden">
            {/* Show loading state while fetching provider details */}
            {isLoadingProvider ? (
              <div className="p-12 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-500">{t('providers.loadingDetails')}</span>
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary/5 to-slate-50 p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTransformedProvider() && getInitialsBadge(getTransformedProvider()!.initials, getTransformedProvider()!.status)}
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{getTransformedProvider()?.name}</h2>
                        <p className="text-sm text-slate-500">ID: {selectedProviderForView}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('common.status')}</h3>
                    {getTransformedProvider() && getStatusBadge(getTransformedProvider()!.status)}
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                          <i className="fa-solid fa-envelope text-sm"></i>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{t('common.email')}</p>
                          <p className="text-sm font-medium text-slate-900">{getTransformedProvider()?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <i className="fa-solid fa-phone text-sm"></i>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{t('common.phone')}</p>
                          <p className="text-sm font-medium text-slate-900">{getTransformedProvider()?.phone}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">{t('providers.eligibleServices')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {providerDetails?.data?.assignedServices?.map((serviceId, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-xs font-bold border border-primary/10"
                        >
                          {serviceIdToNameMap[serviceId] || serviceId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-600 mb-1">{t('providers.providerInfo')}</p>
                    <p className="text-xs text-slate-500">
                      {t('providers.verifiedDescription')}
                      {getTransformedProvider()?.status === 'active' 
                        ? t('providers.acceptingRequests') 
                        : t('providers.notAcceptingRequests')}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
                  <Link 
                    to={`/providers/edit/${selectedProviderForView}`}
                    className="inline-block flex-1"
                    onClick={() => setShowViewModal(false)}
                  >
                    <button className="w-full px-4 py-2.5 text-sm font-bold text-white bg-primary hover:bg-slate-800 rounded-xl transition-all">
                      {t('providers.editProviderButton')}
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
