import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  iconColor: string;
  actions?: {
    label: string;
    variant: 'primary' | 'secondary';
  }[];
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onNotificationAction?: (notificationId: string, action: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onNotificationAction,
  onMarkAllAsRead
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notificationId: string, action: string) => {
    if (onNotificationAction) {
      onNotificationAction(notificationId, action);
    }
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
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-bold text-slate-500 hover:text-primary px-3 py-2"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <i className="fa-regular fa-bell text-3xl text-slate-300 mb-3"></i>
                <p className="text-sm text-slate-500">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white p-4 rounded-xl border-l-4 border border-slate-200 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'border-l-accent' : 'border-l-slate-300 opacity-75'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${
                      !notification.isRead ? 'bg-blue-50' : 'bg-slate-100'
                    } flex items-center justify-center ${notification.iconColor} flex-shrink-0`}>
                      <i className={`fa-solid ${notification.icon}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{notification.title}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{notification.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                      {notification.actions && (
                        <div className="mt-3 flex gap-2">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification.id, action.label);
                              }}
                              className={`px-3 py-1 text-[10px] font-bold rounded-lg ${
                                action.variant === 'primary'
                                  ? 'bg-primary text-white'
                                  : 'border border-slate-200 text-slate-500 hover:bg-white'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
