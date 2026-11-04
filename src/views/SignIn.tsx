// src/views/SignIn.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { isLive } from '@/lib/payloadAuth';
import { LogIn, Lock, Mail } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { signIn, signInLive, switchRole } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please provide email and password');
      return;
    }

    setLoading(true);
    setError(null);
    if (isLive()) {
      const err = await signInLive(email, password);
      setLoading(false);
      if (err) setError(err);
      else navigate('/app');
      return;
    }
    setTimeout(() => {
      setLoading(false);
      signIn(email);
      navigate('/app');
    }, 500);
  };

  const handleQuickDemoRole = (role: UserRole) => {
    switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'reviewer') navigate('/review');
    else if (role === 'moderator') navigate('/moderation');
    else if (role === 'publisher_owner') navigate('/publisher');
    else navigate('/app');
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-ratq-600 to-deep-700 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
              ر
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr ? 'مرحباً بك مجدداً في منصة مجتمع رتق' : 'Welcome back to RATQ Community'}
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-fg mb-1.5">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@ratq.org"
                  className="ps-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-fg">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <Link to="/auth/forgot" className="text-xs text-ratq-600 hover:underline">
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ps-10"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full gap-2 mt-2 shrink-0">
              <LogIn className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </Button>
          </form>

          {/* Demo role switcher bypasses auth: mock mode only, never alongside real sessions. */}
          {!isLive() && (<>
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-canvas-card px-3 text-xs text-fg-subtle">
              {isAr ? 'أو الدخول التجريبي كـ' : 'Or quick demo login as'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoRole('developer')}
            >
              {isAr ? 'مطور (Developer)' : 'Developer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoRole('publisher_owner')}
            >
              {isAr ? 'ناشر (Publisher)' : 'Publisher'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoRole('reviewer')}
            >
              {isAr ? 'محكّم (Reviewer)' : 'Reviewer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoRole('admin')}
            >
              {isAr ? 'مدير (Admin)' : 'Admin'}
            </Button>
          </div>
          </>)}

          <p className="text-center text-xs text-fg-muted mt-6">
            {isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account?"}{' '}
            <Link to="/auth/sign-up" className="text-ratq-600 font-semibold hover:underline">
              {isAr ? 'إنشاء حساب جديد' : 'Sign up'}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
