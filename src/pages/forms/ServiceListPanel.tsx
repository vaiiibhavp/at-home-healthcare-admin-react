import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from './FormTypes';

interface ServiceListPanelProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
}

export const ServiceListPanel: React.FC<ServiceListPanelProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mapped' | 'unmapped'>('all');

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || service.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'mapped') {
      return (
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase border border-emerald-100">
          Mapped
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded uppercase border border-amber-100">
          Unmapped
        </span>
      );
    }
  };

  return (
    <section className="w-[380px] bg-white rounded-2xl border border-slate-200 tradingview-shadow flex flex-col overflow-hidden flex-shrink-0">
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Services</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {(services || []).length} Total
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Mapped
          </button>
          {/* <button
            onClick={() => setFilter('mapped')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'mapped'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mapped
          </button>
          <button
            onClick={() => setFilter('unmapped')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              filter === 'unmapped'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unmapped
          </button> */}
        </div>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <p className="text-sm font-bold text-slate-800">{service.name}</p>
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
