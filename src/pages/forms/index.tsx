import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ServiceListPanel } from './ServiceListPanel';
import { FormStructureViewer } from './FormStructureViewer';
import { UnmapModal } from './UnmapModal';
import { Service } from './FormTypes';
import { useGetFormMappingsQuery } from '../../services/formMappingsApi';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import Sidebar from '../../components/dashboard/Sidebar';
import NotificationDropdown from '../../components/common/NotificationDropdown';

const Forms: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isUnmapModalOpen, setIsUnmapModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  
  // Fetch form mappings from API - get first page to see total
  const { data: firstPageData, isLoading, error } = useGetFormMappingsQuery({ page: 1, limit: 10 });
  
  // Fetch second page if it exists
  const { data: secondPageData } = useGetFormMappingsQuery({ 
    page: 2, 
    limit: 10 
  }, {
    skip: !firstPageData?.data?.pagination?.hasNextPage
  });
  
  // Combine all pages data
  const formMappingsData = React.useMemo(() => {
    if (!firstPageData) return null;
    
    const combinedServices = [...firstPageData.data.services];
    
    if (secondPageData?.data?.services) {
      combinedServices.push(...secondPageData.data.services);
    }
    
    return {
      ...firstPageData,
      data: {
        ...firstPageData.data,
        services: combinedServices
      }
    };
  }, [firstPageData, secondPageData]);
  
  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log('Notification action:', notificationId, action);
    // Handle navigation or other actions based on notification type
  };

  // Transform API data to Service interface
  const services: Service[] = React.useMemo(() => {
    if (!formMappingsData?.data?.services) return [];
    
    return formMappingsData.data.services.map((apiService) => ({
      id: apiService.id,
      name: apiService.serviceName,
      description: apiService.description,
      formName: apiService.formMapping.templateName || undefined,
      status: apiService.formMapping.status.toLowerCase() === 'mapped' ? 'mapped' : 'unmapped',
      isActive: apiService.isActive,
      category: apiService.category,
      icon: apiService.icon,
      assignedProviders: apiService.assignedProviders
    }));
  }, [formMappingsData]);

  // Handle URL parameters for service selection from services page
  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    const serviceName = searchParams.get('serviceName');
    const formMapped = searchParams.get('formMapped') === 'true';
    
    if (serviceId && serviceName) {
      // Find the service in our services list or create a new one
      const existingService = services.find(s => s.id === serviceId);
      if (existingService) {
        setSelectedService(existingService);
      } else {
        // Create a temporary service object for the selected service
        const tempService: Service = {
          id: serviceId,
          name: decodeURIComponent(serviceName),
          status: formMapped ? 'mapped' : 'unmapped',
          formName: formMapped ? 'Temp_Form_Name' : undefined
        };
        setSelectedService(tempService);
      }
    }
  }, [searchParams, services]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleMapService = () => {
    // Logic to open mapping modal would go here
    showNotification(t('forms.mappingFunctionality'));
  };

  
  
  const confirmUnmap = () => {
    setIsUnmapModalOpen(false);
    showNotification(t('forms.unmapSuccess'));
    // Update the service status
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        formName: undefined,
        status: 'unmapped'
      });
    }
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 pt-10 pb-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">{t('forms.title')}</h1>
              <p className="text-[11px] text-slate-500 font-medium">{t('forms.subtitle')}</p>
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

        {/* Main Content Area */}
        <div className="p-8 h-[calc(1024px-64px)] flex gap-6 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <i className="fa-solid fa-spinner fa-spin text-3xl text-primary mb-4"></i>
                <p className="text-sm text-slate-600">Loading services...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
                <p className="text-sm text-slate-600">Error loading services. Please try again.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Left: Services List */}
              <ServiceListPanel
                services={services}
                selectedService={selectedService}
                onServiceSelect={handleServiceSelect}
              />

              {/* Right: Form Structure Viewer */}
              <FormStructureViewer
                selectedService={selectedService}
                onMapService={handleMapService}
              />
            </>
          )}
        </div>
      </main>

      {/* Unmap Confirmation Modal */}
      <UnmapModal
        isOpen={isUnmapModalOpen}
        onClose={() => setIsUnmapModalOpen(false)}
        onConfirm={confirmUnmap}
        formName={selectedService?.formName || ''}
        serviceName={selectedService?.name || ''}
      />

      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 z-[100] flex items-center gap-3 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <i className="fa-solid fa-circle-check text-emerald-400"></i>
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};

export default Forms;
