import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../services/api';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import './Login.css';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    dispatch(loginFailure(''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const result = await loginMutation(formData).unwrap();
      dispatch(loginSuccess({
        user: result.data,
        token: result.data.accessToken
      }));
      window.location.href = '/dashboard';
    } catch (err: any) {
      const errorMessage = err.data?.message || t('auth.invalidCredentials');
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="antialiased flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full py-8 flex justify-center text-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center relative overflow-hidden">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/FwWoWvhFRtVXodtR5CK3BVPRcSP2%2F2f63fe4a-2524-441c-b0fb-47972806c27b.png"
                alt="At-Home Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">At-Home</span>
          </div>
        </header>

        {/* Main Content: Login Card */}
        <main
          className="flex-grow flex items-start justify-center pt-12 px-4 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://storage.googleapis.com/uxpilot-auth.appspot.com/FwWoWvhFRtVXodtR5CK3BVPRcSP2%2Ff6225975-b1ed-4bc8-bb0d-6acd994b01df.png")'
          }}
        >
          <section className="w-full max-w-[440px]">
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-8 md:p-10">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">{t('auth.adminLogin')}</h1>
                <p className="text-textMuted text-sm">
                  {t('auth.loginDescription')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-textMuted">
                    {t('auth.emailAddress')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted/60">
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('auth.emailPlaceholder')}
                      required
                      className="tradingview-input w-full h-12 pl-11 pr-4 bg-white border border-border rounded-xl text-sm transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-textMuted">
                      {t('auth.password')}
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted/60">
                      <i className="fa-solid fa-lock text-sm"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                      className="tradingview-input w-full h-12 pl-11 pr-12 bg-white border border-border rounded-xl text-sm transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          <path d="M2.293 14.707a1 1 0 010-1.414l12-12a1 1 0 111.414 1.414l-12 12a1 1 0 01-1.414 0z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                {/* <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="remember" className="text-sm text-textMuted select-none">
                    Remember me
                  </label>
                </div> */}

                {/* Error Message */}
                {error && (
                  <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        {t('auth.loggingIn')}
                      </span>
                    ) : (
                      t('auth.loginToDashboard')
                    )}
                  </button>
                </div>
              </form>

              {/* Security Microcopy */}
              <div className="mt-8 pt-6 border-t border-border flex items-start gap-3">
                <div className="mt-0.5 text-textMuted/40">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <p className="text-[11px] leading-relaxed text-textMuted uppercase tracking-tight">
                  Secure administrative portal. All activities are logged and monitored for HIPAA compliance.
                  Unauthorized access is strictly prohibited.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Copyright */}
        <footer className="py-8 text-center opacity-100 pt-0 pb-0">
          <p className="text-xs text-textMuted/60 font-mono text-center">
            © 2026 AT-HOME HEALTHCARE SYSTEMS V2.4.0
          </p>
        </footer>
    </div>
  );
};

export default Login;
