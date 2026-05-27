import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDashboardOverviewQuery } from '../../services/dashboardApi';

interface KPICard {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconBg: string;
  iconColor: string;
  progress?: number;
  subtitle?: string;
  avatars?: string[];
  status?: string;
}

const KPICards: React.FC = () => {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading, error } = useGetDashboardOverviewQuery();
  
  const kpiData: KPICard[] = dashboardData ? [
    {
      title: t('dashboard.kpi.totalDoctors'),
      value: dashboardData.data.totalDoctors.toLocaleString(),
      change: `${Math.abs(dashboardData.data.trends.doctors.percentage)}%`,
      changeType: dashboardData.data.trends.doctors.isPositive ? 'positive' : 'negative',
      icon: 'fa-user-doctor',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: t('dashboard.kpi.pendingApprovals'),
      value: dashboardData.data.pendingApprovals.toLocaleString(),
      change: dashboardData.data.pendingApprovals > 0 ? t('dashboard.kpi.pending') : 'pending',
      changeType: dashboardData.data.pendingApprovals > 0 ? 'neutral' : 'positive',
      icon: 'fa-clock-rotate-left',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      subtitle: dashboardData.data.pendingApprovals > 0 ? 'requiring urgent review' : 'all clear'
    },
    {
      title: t('dashboard.kpi.activeRequests'),
      value: dashboardData.data.activeRequests.toLocaleString(),
      change: `${Math.abs(dashboardData.data.trends.requests.percentage)}%`,
      changeType: dashboardData.data.trends.requests.isPositive ? 'positive' : 'negative',
      icon: 'fa-heart-pulse',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: t('dashboard.kpi.providers'),
      value: dashboardData.data.totalProviders.toLocaleString(),
      change: t('dashboard.kpi.stable'),
      changeType: 'neutral',
      icon: 'fa-building-columns',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ] : [];

  const getChangeBadge = (kpi: KPICard) => {
    if (kpi.changeType === 'positive') {
      return (
        <span className="text-success text-xs font-bold flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
          <i className="fa-solid fa-arrow-up"></i> {kpi.change}
        </span>
      );
    } else if (kpi.changeType === 'negative') {
      return (
        <span className="text-error text-xs font-bold flex items-center gap-1 bg-error/10 px-2 py-1 rounded-full">
          <i className="fa-solid fa-arrow-down"></i> {kpi.change}
        </span>
      );
    } else if (kpi.changeType === 'neutral') {
      return (
        <span className={`${kpi.iconColor} text-xs font-bold flex items-center gap-1 ${kpi.iconBg} px-2 py-1 rounded-full`}>
          {kpi.change}
        </span>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-slate-500 text-lg font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    const errorMessage = 'status' in error ? 
      (error.data as { message?: string })?.message || 'Failed to load dashboard data' :
      error.message || 'An error occurred';
    
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-error text-lg font-bold">Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <section id="kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl border border-slate-100 tradingview-shadow card-hover"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center`}>
              <i className={`fa-solid ${kpi.icon} ${kpi.iconColor} text-xl`}></i>
            </div>
            {kpi.change && getChangeBadge(kpi)}
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            {kpi.title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
          
          {kpi.progress && (
            <div className="mt-4 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full" style={{ width: `${kpi.progress}%` }}></div>
            </div>
          )}
          
          {kpi.subtitle && (
            <p className="text-[10px] text-slate-400 mt-4 italic">{kpi.subtitle}</p>
          )}
          
          {kpi.avatars && (
            <div className="flex -space-x-2 mt-4">
              {kpi.avatars.slice(0, 3).map((avatar, avatarIndex) => (
                <img
                  key={avatarIndex}
                  src={avatar}
                  alt={`User ${avatarIndex + 1}`}
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600">
                +12
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default KPICards;