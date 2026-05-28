import React from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from '../../services/servicesApi';

interface ViewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const getServiceKey = (name: string): string => {
  const overrides: Record<string, string> = {
    'Antibiothérapy infusion': 'antibiotherapy_infusion',
  };
  if (overrides[name]) return overrides[name];
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
};

export const ViewFormModal: React.FC<ViewFormModalProps> = ({
  isOpen,
  onClose,
  service
}) => {
  const { t } = useTranslation();

  if (!isOpen || !service) return null;

  // Mock form data - in real app this would come from API
  const formData = {
    formName: service.formMapping.templateName || `${service.serviceName} Form`,
    formType: 'Medical',
    fields: [
      'patientName',
      'dateOfBirth',
      'medicalHistory',
      'symptoms',
      'diagnosis',
      'treatmentPlan'
    ],
    createdAt: '2024-01-15',
    lastUpdated: '2024-03-20'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white w-full max-w-2xl rounded-2xl tradingview-shadow overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{t('services.formDetails')}</h3>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100">
              {t('status.active')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Service Info */}
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className={`w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center`}>
              <i className={`fa-solid fa-kit-medical text-sm`}></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t(`serviceNames.${getServiceKey(service.serviceName)}`, service.serviceName)}</h4>
              <p className="text-xs text-slate-500">{service.category || t('services.noCategory')}</p>
            </div>
          </div>

          {/* Form Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.formName')}
              </label>
              <div className="px-4 py-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-700">{formData.formName}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.formType')}
              </label>
              <div className="px-4 py-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-700">{t(`services.formTypes.${formData.formType.toLowerCase()}`)}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t('services.formFieldsCount', { count: formData.fields.length })}
            </label>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3">
                {formData.fields.map((field, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-sm text-slate-700">{t(`services.formFieldNames.${field}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('services.created')}</p>
              <p className="text-sm font-bold text-slate-700">{formData.createdAt}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('services.lastUpdated')}</p>
              <p className="text-sm font-bold text-slate-700">{formData.lastUpdated}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('services.usage')}</p>
              <p className="text-sm font-bold text-slate-700">{t('services.submissions', { count: 127 })}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <i className="fa-solid fa-circle-info text-blue-500"></i>
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              {t('services.formActiveInfo')}
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
          <div className="flex gap-3">
            <button className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all border border-slate-200">
              <i className="fa-solid fa-download mr-2"></i>
              {t('common.export')}
            </button>
            <button className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all border border-slate-200">
              <i className="fa-solid fa-pen mr-2"></i>
              {t('services.editForm')}
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
