import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetRecentActivityQuery } from '../../services/dashboardApi';

const RecentActivity: React.FC = () => {
  const { t } = useTranslation();
  const { data: activitiesData, isLoading, error } = useGetRecentActivityQuery({ size: 10 });
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'doctor_registration':
        return {
          icon: 'fa-user-doctor',
          bg: 'bg-blue-50',
          color: 'text-blue-600'
        };
      case 'completed':
        return {
          icon: 'fa-check',
          bg: 'bg-emerald-50',
          color: 'text-emerald-600'
        };
      case 'returned':
        return {
          icon: 'fa-rotate-left',
          bg: 'bg-amber-50',
          color: 'text-amber-600'
        };
      default:
        return {
          icon: 'fa-circle',
          bg: 'bg-slate-50',
          color: 'text-slate-600'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 tradingview-shadow w-full">
        <div className="flex justify-between items-center mb-6 w-full">
          <h4 className="font-bold text-slate-800">{t('dashboard.recentActivity.title') || 'Recent Activity'}</h4>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-slate-500 text-sm">Loading recent activity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'status' in error ? 
      (error as { data?: { message?: string } }).data?.message || 'Failed to load recent activity' :
      (error as { message?: string })?.message || 'An error occurred';
    
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 tradingview-shadow w-full">
        <div className="flex justify-between items-center mb-6 w-full">
          <h4 className="font-bold text-slate-800">{t('dashboard.recentActivity.title') || 'Recent Activity'}</h4>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-error text-sm">Error: {errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="ijax57" className="bg-white p-6 rounded-2xl border border-slate-100 tradingview-shadow w-full">
      <div className="mb-6 w-full">
        <h4 className="font-bold text-slate-800">{t('dashboard.recentActivity.title') || 'Recent Activity'}</h4>
      </div>
      <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
        {activitiesData?.data.map((activity) => {
          const iconConfig = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex gap-4">
              <div className={`w-10 h-10 rounded-full ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}>
                <i className={`fa-solid ${iconConfig.icon} ${iconConfig.color} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                <p className="text-xs text-slate-500">{activity.description}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
