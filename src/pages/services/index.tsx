import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/dashboard/Sidebar';
import { ServicesTable } from '../../components/services/ServicesTable';
import { AddServiceModal } from '../../components/services/AddServiceModal';
import { ViewServiceModal } from '../../components/services/ViewServiceModal';
import { MapFormModal } from '../../components/services/MapFormModal';
import { ViewFormModal } from '../../components/services/ViewFormModal';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import { useGetServicesQuery, useGetServiceByIdQuery, useGetServiceStatsQuery } from '../../services/servicesApi';
import { Service } from '../../services/servicesApi';

interface MapFormData {
  formName: string;
  formType: string;
  fields: string[];
}

export const Services: React.FC = () => {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isMapFormModalOpen, setIsMapFormModalOpen] = useState(false);
  const [isViewFormModalOpen, setIsViewFormModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch individual service details when selectedServiceId changes
  const { data: serviceDetails } = useGetServiceByIdQuery(selectedServiceId, {
    skip: !selectedServiceId
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log('Notification action:', notificationId, action);
    // Handle navigation or other actions based on notification type
  };

  // Fetch services and stats from API
  const { data: servicesData, isLoading, error, refetch } = useGetServicesQuery({ page: currentPage, size: itemsPerPage, search: searchTerm || undefined });
  const { data: statsData } = useGetServiceStatsQuery();
  const services = servicesData?.data?.services || [];
  const pagination = servicesData?.data?.pagination;
  
  // Pagination calculations
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRefresh = () => {
    refetch();
  };

  // Calculate stats based on API data
  const stats = {
    totalServices: statsData?.data?.totalServices || 0,
    mappedForms: statsData?.data?.mappedForms || 0,
    unmappedServices: statsData?.data?.unmappedServices || 0,
    activeProviders: 0 // Not available in stats API
  };

  const handleViewService = (service: Service) => {
    setSelectedServiceId(service.id);
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleMapForm = (service: Service) => {
    setSelectedService(service);
    setIsMapFormModalOpen(true);
  };

  const handleViewForm = (service: Service) => {
    setSelectedService(service);
    setIsViewFormModalOpen(true);
  };

  const handleMapFormSubmit = (service: Service, formData: MapFormData) => {
    console.log('Mapping form:', service, formData);
    // TODO: Implement actual form mapping logic
    setIsMapFormModalOpen(false);
    setSelectedService(null);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsAddModalOpen(true);
  };

  const handleSaveService = () => {
    setIsAddModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 pt-10 pb-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">{t('services.title')}</h1>
              <p className="text-[11px] text-slate-500 font-medium">{t('services.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                placeholder={t('services.searchServices')}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
              />
            </div>
            {/* <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              {t('services.addService')}
            </button> */}
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <NotificationDropdown
              onNotificationAction={handleNotificationAction}
            />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-1 pt-5 overflow-y-auto">
          <div className="p-8 space-y-6">
          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 tradingview-shadow">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('services.totalServices')}</p>
              <h3 className="text-xl font-bold text-slate-800">{stats.totalServices}</h3>
            </div>
          </section>

          {/* Services Table */}
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 tradingview-shadow p-8">
              <div className="text-center text-slate-500">{t('services.loadingServices')}</div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-slate-200 tradingview-shadow p-8">
              <div className="text-center text-red-500">{t('services.errorLoadingServices')}</div>
            </div>
          ) : (
            <ServicesTable
              services={services}
              onEdit={handleEditService}
              onView={handleViewService}
              onMapForm={handleMapForm}
              onViewForm={handleViewForm}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onRefresh={handleRefresh}
            />
          )}
        </div>
        </main>

        {/* Modals */}
        <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedService(null);
        }}
        onSave={handleSaveService}
        service={selectedService}
      />

      <ViewServiceModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedService(null);
          setSelectedServiceId(null);
        }}
        service={serviceDetails?.data || selectedService}
      />

      <MapFormModal
        isOpen={isMapFormModalOpen}
        onClose={() => {
          setIsMapFormModalOpen(false);
          setSelectedService(null);
        }}
        onMap={handleMapFormSubmit}
        service={selectedService}
      />

      <ViewFormModal
        isOpen={isViewFormModalOpen}
        onClose={() => {
          setIsViewFormModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />
      </div>
    </div>
  );
};
