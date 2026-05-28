import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getPasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length > 3) strength = 1;
    if (value.length > 6) strength = 2;
    if (value.length > 9) strength = 3;
    if (value.length > 12) strength = 4;
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0: return t('auth.passwordStrength.weak');
      case 1: return t('auth.passwordStrength.weak');
      case 2: return t('auth.passwordStrength.medium');
      case 3: return t('auth.passwordStrength.strong');
      case 4: return t('auth.passwordStrength.veryStrong');
      default: return t('auth.passwordStrength.weak');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate password reset process
    const formContent = document.getElementById('form-content');
    if (formContent) {
      formContent.style.opacity = '0';
      setTimeout(() => {
        setIsSuccess(true);
        setTimeout(() => {
          const successState = document.getElementById('success-state');
          if (successState) {
            successState.style.opacity = '1';
          }
        }, 50);
      }, 300);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  if (isSuccess) {
    return (
      <div className="antialiased flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full py-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white relative overflow-hidden">
              <i className="fa-solid fa-house text-sm z-10"></i>
              <div className="absolute inset-0 opacity-40 border-2 border-white rounded-full scale-150"></div>
              <div className="absolute inset-0 border border-white/30 rounded-full rotate-45 scale-110"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">At-Home</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-start justify-center pt-8 px-4">
          <section className="w-full max-w-[440px]">
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-8 md:p-10">
              <div id="success-state" className="text-center py-4" style={{ opacity: 0, transition: 'opacity 0.3s ease' }}>
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto mb-8">
                  <i className="fa-solid fa-circle-check text-4xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-textMain mb-3">{t('auth.passwordUpdated')}</h2>
                <p className="text-textMuted text-sm leading-relaxed mb-10 px-4">
                  {t('auth.passwordUpdatedDescription')}
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {t('auth.returnToAdminLogin')}
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Copyright */}
        <footer className="py-8 text-center mt-auto">
          <p className="text-xs text-textMuted/60 font-mono uppercase tracking-widest">
            © 2024 AT-HOME HEALTHCARE SYSTEMS V2.4.0
          </p>
        </footer>
      </div>
    );
  }

  const strength = getPasswordStrength(password);

  return (
    <div className="antialiased flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="w-full py-8 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white relative overflow-hidden">
            <i className="fa-solid fa-house text-sm z-10"></i>
            <div className="absolute inset-0 opacity-40 border-2 border-white rounded-full scale-150"></div>
            <div className="absolute inset-0 border border-white/30 rounded-full rotate-45 scale-110"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">At-Home</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-start justify-center pt-8 px-4">
        <section className="w-full max-w-[440px]">
          {/* Reset Form State */}
          <div className="bg-surface rounded-2xl shadow-soft border border-border p-8 md:p-10 transition-all duration-300">
            <div id="form-content" style={{ transition: 'opacity 0.3s ease' }}>
              {/* Back Link */}
              <div className="mb-8">
                <button 
                  onClick={handleBackToLogin}
                  className="text-xs font-semibold text-textMuted hover:text-primary flex items-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  {t('auth.backToAdminLogin')}
                </button>
              </div>

              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                    <i className="fa-solid fa-shield-keyhole text-xl"></i>
                  </div>
                  <h1 className="text-2xl font-semibold mb-2">{t('auth.resetPasswordTitle')}</h1>
                  <p className="text-textMuted text-sm leading-relaxed">
                    {t('auth.resetPasswordDescription')}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('en')}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                      i18n.language.startsWith('en')
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-textMuted hover:text-slate-700'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage('fr')}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                      i18n.language.startsWith('fr')
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-textMuted hover:text-slate-700'
                    }`}
                  >
                    FR
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Input */}
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-xs font-bold text-textMain uppercase tracking-wider">
                    {t('auth.newPassword')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
                      <i className="fa-regular fa-lock"></i>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      placeholder="•••••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field w-full h-12 pl-11 pr-12 border border-border rounded-xl bg-white outline-none transition-all text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-primary"
                    >
                      <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                  </div>

                  {/* Strength Indicator */}
                  <div className="pt-2 space-y-2">
                    <div className="flex gap-1">
                      <div className={`strength-bar flex-1 ${strength >= 1 ? 'strength-active' : ''}`}></div>
                      <div className={`strength-bar flex-1 ${strength >= 2 ? 'strength-active' : ''}`}></div>
                      <div className={`strength-bar flex-1 ${strength >= 3 ? 'strength-active' : ''}`}></div>
                      <div className={`strength-bar flex-1 ${strength >= 4 ? 'strength-active' : ''}`}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-textMuted uppercase tracking-tighter">
                        {t('auth.strengthLabel')}: {getStrengthLabel(strength)}
                      </span>
                      <span className="text-[10px] text-textMuted">{t('auth.minCharacters')}</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-xs font-bold text-textMain uppercase tracking-wider">
                    {t('auth.confirmNewPassword')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
                      <i className="fa-regular fa-lock-keyhole"></i>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      placeholder="•••••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field w-full h-12 pl-11 pr-4 border border-border rounded-xl bg-white outline-none transition-all text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-primary"
                    >
                      <i className={`fa-regular ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={password !== confirmPassword || password.length < 12}
                    className="w-full h-12 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {t('auth.updatePassword')}
                    <i className="fa-solid fa-check-circle text-[10px]"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Copyright */}
      <footer className="py-8 text-center mt-auto">
        <p className="text-xs text-textMuted/60 font-mono uppercase tracking-widest">
          © 2024 AT-HOME HEALTHCARE SYSTEMS V2.4.0
        </p>
      </footer>
    </div>
  );
};

export default ResetPassword;
