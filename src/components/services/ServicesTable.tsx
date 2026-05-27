import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Service, useLazyDownloadServicesQuery } from '../../services/servicesApi';
import PaginationComponent from '../ui/PaginationComponent';

interface ServicesTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onView: (service: Service) => void;
  onMapForm: (service: Service) => void;
  onViewForm: (service: Service) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  onRefresh?: () => void;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  onEdit,
  onView,
  onMapForm,
  onViewForm,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onRefresh
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'mapped'>('all');
  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadServicesQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDownload = async () => {
    try {
      const { data: blob } = await triggerDownload();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'services.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filter services based on selected status
  const filteredServices = useMemo(() => {
    switch (filterStatus) {
      case 'mapped':
        return services.filter(service => service.formMapping.status === 'Mapped');
      default:
        return services;
    }
  }, [services, filterStatus]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === t('services.mappedOnly')) {
      setFilterStatus('mapped');
    } else {
      setFilterStatus('all');
    }
  };
  return (
    <section className="bg-white rounded-2xl border border-slate-200 tradingview-shadow overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-slate-800">{t('services.allServices')}</h2>
          <div className="flex gap-2">
            <select 
              className="text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
              value={filterStatus === 'all' ? t('services.allStatus') : t('services.mappedOnly')}
              onChange={handleFilterChange}
            >
              <option value={t('services.allStatus')}>{t('services.allStatus')}</option>
              <option value={t('services.mappedOnly')}>{t('services.mappedOnly')}</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh"
          >
            {!isRefreshing && <i className="fa-solid fa-rotate"></i>}
            {isRefreshing && <i className="fa-solid fa-spinner fa-spin"></i>}
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download"
          >
            {!isDownloading && <i className="fa-solid fa-download"></i>}
            {isDownloading && <i className="fa-solid fa-spinner fa-spin"></i>}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.serviceName')}
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.description')}
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.formMapped')}
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.assignedProviders')}
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                {t('services.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center`}>
                      <i className={`fa-solid fa-kit-medical text-xs`}></i>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{service.serviceName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-500 max-w-xs truncate">{service.description}</p>
                </td>
                <td className="px-6 py-4">
                  {service.formMapping.status === 'Mapped' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                      <i className="fa-solid fa-circle-check text-[8px]"></i>
                      {t('common.yes')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-100 uppercase tracking-wider">
                      <i className="fa-solid fa-circle-exclamation text-[8px]"></i>
                      {t('common.no')}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {service.assignedProviders && service.assignedProviders.length > 0 ? (
                    <span className="text-xs font-semibold text-slate-700">
                      {service.assignedProviders.reduce((total, group) => total + group.providers.length, 0)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">0</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        // Navigate to forms page with the specific service
                        navigate(`/forms?serviceId=${service.id}&serviceName=${encodeURIComponent(service.serviceName)}&formMapped=${service.formMapping.status === 'Mapped'}`);
                      }}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                      title={service.formMapping.status === 'Mapped' ? "View Form" : "Assign Form"}
                    >
                      <i className={`fa-solid ${service.formMapping.status === 'Mapped' ? 'fa-file-lines' : 'fa-link'}`}></i>
                    </button>
                    {/* <div className="w-px h-4 bg-slate-200"></div> */}
                    {/* <button
                      onClick={() => onView(service)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                      title="View"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button> */}
                    {/* <button
                      onClick={() => onEdit(service)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && onItemsPerPageChange ? (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      ) : (
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
          <p className="text-xs text-slate-400 font-medium">{t('services.showingResults', { start: 1, end: services.length, total: 24 })}</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-all border border-slate-200">
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-all border border-slate-200">
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
