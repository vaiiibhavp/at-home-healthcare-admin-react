import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from '../../services/servicesApi';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  service?: Service | null;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  service
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    serviceName: service?.serviceName || '',
    description: service?.description || '',
    category: service?.category || 'Diagnostics'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white w-full max-w-lg rounded-2xl tradingview-shadow overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {service ? t('services.editService') : t('services.addNewService')}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t('services.serviceName')}
            </label>
            <select
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            >
              <option value="">{t('services.selectService')}</option>
              <option value="Generic">{t('serviceNames.generic')}</option>
              <option value="Wound Care">{t('serviceNames.wound_care')}</option>
              <option value="IV Therapy">{t('serviceNames.iv_therapy')}</option>
              <option value="Medical Oxygen">{t('serviceNames.medical_oxygen')}</option>
              <option value="Artificial Nutrition">{t('serviceNames.artificial_nutrition')}</option>
              <option value="Personal Hygiene care">{t('serviceNames.personal_hygiene_care')}</option>
              <option value="PCA(Pain management)">{t('serviceNames.pca_pain_management')}</option>
              <option value="Pregnancy related care">{t('serviceNames.pregnancy_related_care')}</option>
              <option value="Parenteral nutrition (central line)">{t('serviceNames.parenteral_nutrition_central_line')}</option>
              <option value="CNO">{t('serviceNames.cno')}</option>
              <option value="Hydration Infusion">{t('serviceNames.hydration_infusion')}</option>
              <option value="Antibiothérapy infusion">{t('serviceNames.antibiotherapy_infusion')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t('services.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('services.serviceDescriptionPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              required
            />
          </div>

          {/* <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t('services.category')}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="Diagnostics">{t('servicesData.diagnostics')}</option>
              <option value="Nursing">{t('servicesData.homeNursing')}</option>
              <option value="Rehabilitation">{t('servicesData.rehabilitation')}</option>
              <option value="Pharmacy">{t('servicesData.pharmacy')}</option>
            </select>
          </div> */}

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <i className="fa-solid fa-circle-info text-amber-500"></i>
            <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
              {t('services.formMappingInfo')}
            </p>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            {service ? t('services.updateService') : t('services.saveService')}
          </button>
        </div>
      </div>
    </div>
  );
};
