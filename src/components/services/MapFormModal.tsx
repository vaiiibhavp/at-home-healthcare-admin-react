import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from '../../services/servicesApi';

interface MapFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMap: (service: Service, formData: MapFormData) => void;
  service: Service | null;
}

interface MapFormData {
  formName: string;
  formType: string;
  fields: string[];
}

const getServiceKey = (name: string): string => {
  const overrides: Record<string, string> = {
    'Antibiothérapy infusion': 'antibiotherapy_infusion',
  };
  if (overrides[name]) return overrides[name];
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
};

export const MapFormModal: React.FC<MapFormModalProps> = ({
  isOpen,
  onClose,
  onMap,
  service
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<MapFormData>({
    formName: '',
    formType: 'Medical',
    fields: []
  });

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMap(service, formData);
  };

  const handleFieldToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const availableFields = [
    'patientName',
    'dateOfBirth',
    'medicalHistory',
    'symptoms',
    'diagnosis',
    'treatmentPlan',
    'medications',
    'allergies',
    'vitalSigns',
    'testResults'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white w-full max-w-2xl rounded-2xl tradingview-shadow overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{t('services.mapFormToService')}</h3>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.formName')}
              </label>
              <input
                type="text"
                value={formData.formName}
                onChange={(e) => setFormData(prev => ({ ...prev, formName: e.target.value }))}
                placeholder={t('services.formNamePlaceholder')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            {/* Form Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.formType')}
              </label>
              <select
                value={formData.formType}
                onChange={(e) => setFormData(prev => ({ ...prev, formType: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="Medical">{t('services.formTypes.medical')}</option>
                <option value="Diagnostic">{t('services.formTypes.diagnostic')}</option>
                <option value="Treatment">{t('services.formTypes.treatment')}</option>
                <option value="Assessment">{t('services.formTypes.assessment')}</option>
              </select>
            </div>

            {/* Form Fields */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {t('services.formFields')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableFields.map((field) => (
                  <label
                    key={field}
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.fields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20"
                    />
                    <span className="text-sm text-slate-700">{t(`services.formFieldNames.${field}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <i className="fa-solid fa-circle-info text-blue-500"></i>
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                {t('services.mapFormInfo')}
              </p>
            </div>
          </form>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            {t('services.mapForm')}
          </button>
        </div>
      </div>
    </div>
  );
};
