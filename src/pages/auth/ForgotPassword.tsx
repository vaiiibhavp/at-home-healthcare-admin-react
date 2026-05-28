import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForgotPasswordMutation } from '../../services/api';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await forgotPassword({ email }).unwrap();
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      const errorMessage = err.data?.message || t('auth.failedSendReset');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    window.history.back();
  };

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

      {/* Main Content: Forgot Password Card */}
      <main className="flex-grow flex items-start justify-center pt-12 px-4">
        <section className="w-full max-w-[440px]">
          <div className="bg-surface rounded-2xl shadow-soft border border-border p-8 md:p-10">
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
                  <i className="fa-solid fa-key text-xl"></i>
                </div>
                <h1 className="text-2xl font-semibold mb-2">{t('auth.forgotPasswordTitle')}</h1>
                <p className="text-textMuted text-sm leading-relaxed">
                  {t('auth.forgotPasswordDescription')}
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

            {success ? (
              <div className="space-y-6">
                <div className="bg-success/10 border border-success/20 text-success p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fa-solid fa-check-circle text-lg"></i>
                    <h3 className="font-semibold">{t('auth.resetInstructionsSent')}</h3>
                  </div>
                  <p className="text-sm">
                    {t('auth.resetInstructionsDesc')}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/reset-password'}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {t('auth.resetPasswordButton')}
                  <i className="fa-solid fa-key text-[10px]"></i>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-textMain uppercase tracking-wider">
                    {t('auth.workEmailAddress')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
                      <i className="fa-regular fa-envelope"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      required
                      className="input-field w-full h-12 pl-11 pr-4 border border-border rounded-xl bg-white outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

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
                    className="w-full h-12 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        {t('auth.sending')}
                      </>
                    ) : (
                      <>
                        {t('auth.sendResetInstructions')}
                        <i className="fa-solid fa-paper-plane text-[10px]"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Security Microcopy */}
            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-success">
                  <i className="fa-solid fa-circle-info"></i>
                </div>
                <p className="text-[12px] leading-relaxed text-textMuted">
                  {t('auth.forgotPasswordSecurityNotice')}
                </p>
              </div>
              <div className="flex items-start gap-3 opacity-60">
                <div className="mt-0.5 text-textMuted">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <p className="text-[11px] leading-relaxed text-textMuted uppercase tracking-tight">
                  {t('auth.hipaaResetNotice')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Copyright */}
      <footer className="py-8 text-center">
        <p className="text-xs text-textMuted/60 font-mono uppercase">
          © 2026 AT-HOME HEALTHCARE SYSTEMS V2.4.0
        </p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
