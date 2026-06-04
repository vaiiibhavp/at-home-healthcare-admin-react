import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from './FormTypes';

interface ServiceListPanelProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: 'all' | 'mapped' | 'unmapped';
  onFilterChange: (value: 'all' | 'mapped' | 'unmapped') => void;
}

export const ServiceListPanel: React.FC<ServiceListPanelProps> = ({
  services,
  selectedService,
  onServiceSelect,
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange
}) => {
  const { t } = useTranslation();

  // Filter services based on search term
  const filteredServices = useMemo(() => {
    if (!searchTerm) return services || [];
    
    const searchLower = searchTerm.toLowerCase();
    return (services || []).filter(service =>
      service.name.toLowerCase().includes(searchLower) ||
      (service.description && service.description.toLowerCase().includes(searchLower)) ||
      (service.formName && service.formName.toLowerCase().includes(searchLower))
    );
  }, [services, searchTerm]);

  const getStatusBadge = (status: string) => {
    if (status === 'mapped') {
      return (
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase border border-emerald-100">
          {t('forms.mapped')}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded uppercase border border-amber-100">
          {t('forms.unmapped')}
        </span>
      );
    }
  };

  return (
    <section className="w-[380px] bg-white rounded-2xl border border-slate-200 tradingview-shadow flex flex-col overflow-hidden flex-shrink-0">
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">{t('forms.services')}</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {filteredServices.length} {t('forms.total')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('forms.allMapped')}
          </button>
          {/* <button
            onClick={() => onFilterChange('mapped')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'mapped'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('forms.mapped')}
          </button>
          <button
            onClick={() => onFilterChange('unmapped')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'unmapped'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('forms.unmapped')}
          </button> */}
        </div>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder={t('forms.searchServices')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-slate-50">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => onServiceSelect(service)}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-all ${
                  selectedService?.id === service.id
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-800">{t(`forms.serviceNames.${service.name}`, { defaultValue: service.name })}</p>
                  {getStatusBadge(service.status)}
                </div>
                {service.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-1">
                    {service.description}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {service.formName ? <>{t('forms.form')}: <span className="font-bold">{service.formName}</span></> : t('forms.noFormAssigned')}
                </p>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};
