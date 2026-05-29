import React from 'react';
import { useTranslation } from 'react-i18next';
import { RequestData } from '../RequestTypes';
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

interface RequestsTableProps {
  requests: RequestData[];
  loading: boolean;
  onRowClick: (request: RequestData) => void;
  onResetRequest: (request: RequestData) => void;
  onCancelRequest: (request: RequestData) => void;
}

export const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  loading,
  onRowClick,
  onResetRequest,
  onCancelRequest
}) => {
  const { t } = useTranslation();

  const getTranslatedServiceName = (name: string): string => {
    const key = name.toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
    return t(`serviceNames.${key}`, { defaultValue: name });
  };

  const getStatusChipClass = (status: string): string => {
    const statusClasses = {
      pending: 'status-chip status-pending',
      completed: 'status-chip status-completed',
      inprogress: 'status-chip status-inprogress',
      returned: 'status-chip status-returned',
      cancelled: 'status-chip status-returned',
      draft: 'status-chip status-draft'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-chip';
  };

  const getDoctorInitials = (firstName?: string, lastName?: string, fallbackName?: string): string => {
    const primary = `${firstName || ''} ${lastName || ''}`.trim();
    const fullName = primary.includes(' ') ? primary : (fallbackName || primary);
    const names = fullName.split(' ').filter(Boolean);
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0]?.slice(0, 2).toUpperCase() || 'DR';
  };

  const getStatusText = (status: string): string => {
    const statusTexts: Record<string, string> = {
      pending: t('requests.submitted'),
      completed: t('requests.completed'),
      inprogress: t('requests.inProgress'),
      returned: t('requests.returned'),
      cancelled: t('requests.cancelled'),
      draft: t('requests.draft')
    };
    return statusTexts[status] || status;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                Request ID <i className="fa-solid fa-sort"></i>
              </div>
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Form Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Created</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center">
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin text-primary text-xl mr-3"></i>
                  <span className="text-sm text-slate-600">Loading requests...</span>
                </div>
              </td>
            </tr>
          ) : requests.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center">
                  <i className="fa-solid fa-inbox text-slate-300 text-3xl mb-3"></i>
                  <span className="text-sm text-slate-500">No requests found</span>
                </div>
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr
                key={request.id}
                onClick={() => onRowClick(request)}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-slate-500">#{request.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg relative">
                      {request.doctorProfileImage && (
                        <img
                          src={resolveImageUrl(request.doctorProfileImage)}
                          alt={`${`${request.doctorFirstName || ''} ${request.doctorLastName || ''}`.trim() || request.doctor?.name || 'Unknown Doctor'} - Doctor Avatar`}
                          className="w-8 h-8 rounded-lg object-cover absolute inset-0 z-10"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <div
                        className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-[10px] font-bold"
                        style={{ display: request.doctorProfileImage ? 'none' : 'flex' }}
                      >
                        {getDoctorInitials(request.doctorFirstName, request.doctorLastName, request.doctor?.name)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{`${request.doctorFirstName || ''} ${request.doctorLastName || ''}`.trim() || request.doctor?.name || 'Unknown Doctor'}</p>
                      <p className="text-[10px] text-slate-500">{request.doctorSpeciality || request.doctor?.specialty || 'Unknown Specialty'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">{request.patient}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${request.serviceColor}-400`}></span>
                    <span className="text-xs text-slate-600">{getTranslatedServiceName(request.serviceType)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusChipClass(request.status)}>
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {request.formStatus || 'No form'}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{request.dateCreated}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{request.lastUpdated}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {request.status === 'inprogress' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onResetRequest(request);
                        }}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                        title="Reset Request"
                      >
                        <i className="fa-solid fa-undo text-sm"></i>
                      </button>
                    )}
                    {request.status !== 'completed' && request.status !== 'returned' && request.status !== 'cancelled' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelRequest(request);
                        }}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                        title="Cancel Request"
                      >
                        <i className="fa-solid fa-times text-sm"></i>
                      </button>
                    )}
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                      title="View Detail"
                    >
                      <i className="fa-solid fa-eye text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
