import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import KPICards from '../../components/dashboard/KPICards';
import Charts from '../../components/dashboard/Charts';
import RecentActivity from '../../components/dashboard/RecentActivity';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import NotificationDropdown, { Notification } from '../../components/common/NotificationDropdown';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: t('notifications.newDoctorRegistration'),
      message: t('notifications.newDoctorMessage', { name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', rpps: '#82910' }),
      time: '2 mins ago',
      isRead: false,
      icon: 'fa-user-plus',
      iconColor: 'text-blue-500',
      actions: [
        { label: t('notifications.viewProfile'), variant: 'primary' },
        { label: t('notifications.dismiss'), variant: 'secondary' }
      ]
    },
    {
      id: '2',
      title: t('notifications.monthlyAuditReport'),
      message: t('notifications.auditReportMessage'),
      time: '3 hours ago',
      isRead: true,
      icon: 'fa-file-export',
      iconColor: 'text-slate-500'
    }
  ]);

  const handleNotificationAction = (notificationId: string, action: string) => {
    if (action === t('notifications.viewProfile')) {
      console.log('View profile for notification:', notificationId);
    } else if (action === t('notifications.dismiss')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleViewRequest = () => {
    navigate('/requests');
  };

  return (
    <div className="flex h-[1024px] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 pt-10 pb-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder={t('common.search') || 'Search doctors, requests, or forms...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown
              notifications={notifications}
              onNotificationAction={handleNotificationAction}
              onMarkAllAsRead={markAllAsRead}
            />
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <LanguageSwitcher />
          </div>
        </header>
        
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {t('dashboard.title') || 'Dashboard Overview'}</h2>
              <p className="text-slate-500 text-sm mt-1">{t('dashboard.subtitle') || 'Real-time healthcare operations monitoring and analytics.'}</p>
            </div>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-download"></i> {t('dashboard.exportReport') || 'Export Report'}
              </button>
              <button
                onClick={handleViewRequest}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-eye"></i> {t('dashboard.viewRequest') || 'View Request'}
              </button>
            </div>
          </div>

          {/* KPI Cards Section */}
          <KPICards />

          {/* Analytics Charts Section */}
          <Charts />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
