import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './App.css';
import './i18n'; // Initialize i18n
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { Login /*, ForgotPassword, ResetPassword */ } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { Doctors } from './pages/doctors';
import { DoctorDetail } from './pages/doctor-detail';
import Providers, { CreateProvider } from './pages/providers';
import { Services } from './pages/services';
import Requests from './pages/requests';
import Forms from './pages/forms';
import ProtectedRoute from './components/ProtectedRoute';

// Extend Window interface for global logout function
declare global {
  interface Window {
    logout?: () => void;
  }
}

// Global logout function
window.logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

function App() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Force language initialization
    if (!i18n.language || i18n.language === 'dev') {
      i18n.changeLanguage('en');
    }
    
    // Add global styles for authentication
    const style = document.createElement('style');
    style.textContent = `
      .auth-logout {
        cursor: pointer;
        color: #ef4444;
        transition: color 0.2s;
      }
      .auth-logout:hover {
        color: #dc2626;
      }
    `;
    document.head.appendChild(style);
  }, [i18n]);

  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

function AppContent() {
  useDocumentTitle();
  
  return (
    <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          {/* Forgot password and reset password routes commented out for now */}
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */}
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/doctors/:id" element={
            <ProtectedRoute>
              <DoctorDetail />
            </ProtectedRoute>
          } />
          <Route path="/providers" element={
            <ProtectedRoute>
              <Providers />
            </ProtectedRoute>
          } />
          <Route path="/providers/create" element={
            <ProtectedRoute>
              <CreateProvider />
            </ProtectedRoute>
          } />
          <Route path="/providers/edit/:id" element={
            <ProtectedRoute>
              <CreateProvider />
            </ProtectedRoute>
          } />
          <Route path="/services" element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          } />
          <Route path="/forms" element={
            <ProtectedRoute>
              <Forms />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
}

export default App;
