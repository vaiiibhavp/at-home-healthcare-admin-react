import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Service, FormTemplate } from './FormTypes';

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
  const [showFormTemplates, setShowFormTemplates] = useState(false);
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<'all' | 'mapped' | 'unmapped'>('all');

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || service.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredFormTemplates = (formTemplates || []).filter(template => {
    if (templateFilter === 'all') return true;
    if (templateFilter === 'mapped') return (template.mappedServices || []).length > 0;
    if (templateFilter === 'unmapped') return (template.unmappedServices || []).length > 0;
    return true;
  });

  const fetchFormTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://163.227.92.122:3047/forms/templates?page=1&size=10', {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Handle different response structures
      let templates = [];
      if (data.data && Array.isArray(data.data)) {
        templates = data.data;
      } else if (data.templates) {
        templates = data.templates;
      } else if (data.data && data.data.templates) {
        templates = data.data.templates;
      } else if (Array.isArray(data)) {
        templates = data;
      }
      
      // Process templates to ensure they have required fields
      templates = templates.map(template => ({
        id: template.id || Math.random().toString(),
        name: template.name || template.title || template.templateName || `Template ${template.id}`,
        description: template.description || template.desc || '',
        mappedServices: template.mappedServices || template.mapped_services || [],
        unmappedServices: template.unmappedServices || template.unmapped_services || [],
        totalServices: template.totalServices || template.total_services || 0,
        ...template // Include any other fields
      }));
      
      console.log('Extracted templates:', templates); // Debug log
      console.log('First template structure:', templates[0]); // Debug first template
      setFormTemplates(templates);
    } catch (error) {
      console.error('Error fetching form templates:', error);
      setFormTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (showFormTemplates) {
      fetchFormTemplates();
    }
  }, [showFormTemplates]);

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
            All
          </button>
          <button
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
          </button>
          <button
            onClick={() => setShowFormTemplates(!showFormTemplates)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              showFormTemplates
                ? 'bg-purple-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Form Templates
          </button>
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
        {showFormTemplates ? (
          <div className="p-4 space-y-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTemplateFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  templateFilter === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Templates
              </button>
              <button
                onClick={() => setTemplateFilter('mapped')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  templateFilter === 'mapped'
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Has Mapped
              </button>
              <button
                onClick={() => setTemplateFilter('unmapped')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  templateFilter === 'unmapped'
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Has Unmapped
              </button>
            </div>
            
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  console.log('Rendering templates:', filteredFormTemplates);
                  return null;
                })()}
                {filteredFormTemplates.map((template) => {
                  console.log('Rendering template:', template);
                  return (
                  <div key={template.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-slate-800">
                      {template.name || template.title || template.templateName || `Template ${template.id}`}
                    </h4>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase border border-emerald-100">
                          {(template.mappedServices || []).length} Mapped
                        </span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded uppercase border border-amber-100">
                          {(template.unmappedServices || []).length} Unmapped
                        </span>
                      </div>
                    </div>
                    {template.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                        {template.description}
                      </p>
                    )}
                    
                    {/* Mapped Services Section */}
                    {(template.mappedServices || []).length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">
                          Mapped Services ({(template.mappedServices || []).length}):
                        </p>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto p-1 bg-emerald-50 rounded">
                          {(template.mappedServices || []).map((service) => (
                            <span key={service.id} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium">
                              {service.name || service.service_name || `Service ${service.id}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Unmapped Services Section */}
                    {(template.unmappedServices || []).length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-bold uppercase text-amber-600 mb-1">
                          Unmapped Services ({(template.unmappedServices || []).length}):
                        </p>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto p-1 bg-amber-50 rounded">
                          {(template.unmappedServices || []).map((service) => (
                            <span key={service.id} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-medium">
                              {service.name || service.service_name || `Service ${service.id}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* No Services Message */}
                    {((template.mappedServices || []).length === 0 && (template.unmappedServices || []).length === 0) && (
                      <p className="text-[10px] text-slate-400 italic">No services assigned</p>
                    )}
                  </div>
                  );
                })}
                {filteredFormTemplates.length === 0 && !loadingTemplates && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No form templates found
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};
