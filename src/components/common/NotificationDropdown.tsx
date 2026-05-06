import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetNotificationStatsQuery
} from '../../services/notificationsApi';

interface NotificationDropdownProps {
  onNotificationAction?: (notificationId: string, action: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onNotificationAction
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notification stats from API
  const { data: statsData, isLoading, error } = useGetNotificationStatsQuery();
  const totalNotifications = statsData?.data?.total || 0;
  const unreadCount = totalNotifications; // Assuming all are unread until we have more detailed data

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    if (onNotificationAction) {
      onNotificationAction('stats', 'view');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <i className="fa-regular fa-bell text-lg"></i>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        )}
        {unreadCount > 9 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            9+
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-slate-900">
                {t('notifications.recentNotification')}
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">
                  {unreadCount} {t('notifications.unread')}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-slate-500 mt-3">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
                <p className="text-sm text-slate-500">Failed to load notifications</p>
              </div>
            ) : totalNotifications === 0 ? (
              <div className="p-8 text-center">
                <i className="fa-regular fa-bell text-3xl text-slate-300 mb-3"></i>
                <p className="text-sm text-slate-500">No notifications</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <i className="fa-solid fa-bell text-3xl text-blue-500 mb-3"></i>
                <p className="text-lg font-bold text-slate-900 mb-2">
                  You have {totalNotifications} notifications
                </p>
                {/* <p className="text-sm text-slate-500 mb-4">
                  Notification details will be available when the full API is implemented
                </p> */}
                <button
                  onClick={handleNotificationClick}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
