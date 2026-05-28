import React from 'react';
import { useTranslation } from 'react-i18next';
import { Service } from '../../services/servicesApi';

interface ViewServiceModalProps {
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

export const ViewServiceModal: React.FC<ViewServiceModalProps> = ({
  isOpen,
  onClose,
  service
}) => {
  const { t } = useTranslation();

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white w-full max-w-lg rounded-2xl tradingview-shadow overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{t('services.serviceDetails')}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Service Header */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center`}>
              <i className={`fa-solid fa-kit-medical text-lg`}></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{service?.serviceName ? t(`serviceNames.${getServiceKey(service.serviceName)}`, service.serviceName) : t('services.na')}</h4>
              <p className="text-sm text-slate-500">{service?.category || t('services.noCategory')}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t('services.description')}
            </label>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
              {service?.serviceName ? t(`serviceDescriptions.${getServiceKey(service.serviceName)}`, service?.description || '') || t('services.noDescription') : t('services.noDescription')}
            </p>
          </div>

          {/* Service Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('services.formStatus')}</p>
              <div className="flex items-center gap-2">
                {service?.formMapping?.status === 'Mapped' ? (
                  <>
                    <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                    <span className="text-sm font-bold text-emerald-700">{t('services.mapped')}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-circle-exclamation text-amber-500 text-sm"></i>
                    <span className="text-sm font-bold text-amber-700">{t('services.notMapped')}</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('common.status')}</p>
              <div className="flex items-center gap-2">
                <i className={`fa-solid fa-circle text-${service?.isActive ? 'emerald' : 'amber'}-500 text-sm`}></i>
                <span className="text-sm font-bold text-slate-700">{service?.isActive ? t('status.active') : t('status.inactive')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
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
