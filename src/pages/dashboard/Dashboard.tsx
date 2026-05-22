import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import KPICards from '../../components/dashboard/KPICards';
import Charts from '../../components/dashboard/Charts';
import RecentActivity from '../../components/dashboard/RecentActivity';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import { useExportDashboardQuery } from '../../services/dashboardApi';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: exportData, isLoading: isExporting, error: exportError } = useExportDashboardQuery();
  
  const handleViewRequest = () => {
    navigate('/requests');
  };

  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log('Notification action:', notificationId, action);
    // Handle navigation or other actions based on notification type
  };

  const handleExportReport = async () => {
    try {
      if (exportData) {
        // Create a blob with the export data
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  // Handle export errors
  useEffect(() => {
    if (exportError) {
      const errorMessage = 'status' in exportError ? 
        (exportError.data as { message?: string })?.message || 'Failed to export dashboard data' :
        (exportError as { message?: string })?.message || 'An error occurred';
      
      alert(`Export error: ${errorMessage}`);
    }
  }, [exportError]);

  return ( 
    <div className="flex h-[1024px] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky pt-10 pb-10">  {/* top-0 z-10 */}
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
              onNotificationAction={handleNotificationAction}
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
                onClick={handleExportReport}
                disabled={isExporting || !exportData}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <i className="fa-solid fa-download"></i> 
                {t('dashboard.exportReport') || 'Export Report'}
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
