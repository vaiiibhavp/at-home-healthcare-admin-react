import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ChangePasswordModal from '../ChangePasswordModal';

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const mainNavItems: SidebarItem[] = [
    { icon: 'fa-chart-pie', label: t('navigation.dashboard'), path: '/dashboard' },
    { icon: 'fa-user-doctor', label: t('navigation.doctors'), path: '/doctors' },
    { icon: 'fa-hospital', label: t('navigation.providers'), path: '/providers' },
    { icon: 'fa-hand-holding-medical', label: t('navigation.services'), path: '/services' },
    { icon: 'fa-file-lines', label: t('navigation.forms'), path: '/forms' },
    { icon: 'fa-clipboard-list', label: t('navigation.requests'), path: '/requests' }
  ];

  const systemNavItems: SidebarItem[] = [
    { icon: 'fa-gear', label: t('navigation.settings'), path: '/settings' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <div className="-top-1 -right-1 items-center text-center static top-0">
            <i className="fa-solid fa-atom text-primary text-xs animate-pulse"></i>
          </div>
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">At-Home</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 mt-4 overflow-y-auto px-4 space-y-1">
        {mainNavItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'sidebar-item-active bg-primary/10 text-primary border-r-3 border-primary' : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            {item.label}
          </NavLink>
        ))}

        {/* System Section Divider */}
        <div className="pt-4 pb-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            System
          </p>
        </div>

        {systemNavItems.map((item, index) => (
          <NavLink
            key={`system-${index}`}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'sidebar-item-active bg-primary/10 text-primary border-r-3 border-primary' : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
          {/* <img
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
            alt="Admin"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Alexander Wright</p>
            <p className="text-[10px] text-slate-500 truncate">Senior Admin</p>
          </div> */}
          <button 
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="text-slate-400 hover:text-primary p-1"
            title="Change Password"
          >
            <i className="fa-solid fa-key"></i>
          </button>
          <button 
            onClick={() => window.logout?.()} 
            className="text-slate-400 hover:text-danger p-1 auth-logout"
            title={t('auth.logout')}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen} 
        onClose={() => setIsChangePasswordModalOpen(false)} 
      />
    </aside>
  );
};

export default Sidebar;
