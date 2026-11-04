// src/views/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DirectionalIcon } from '@/components/ui/DirectionalIcon';

export const ForgotPasswordPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(isAr ? 'يرجى إدخال عنوان البريد الإلكتروني' : 'Please provide your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
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
            {isAr ? 'استعادة كلمة المرور' : 'Reset Password'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة ضبط كلمة المرور'
              : 'Enter your email address and we will send a password reset link'}
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-fg">
                {isAr ? 'تم إرسال رابط الاستعادة' : 'Reset Link Sent'}
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                {isAr
                  ? `إذا كان الحساب (${email}) مسجلاً لدينا، فستصلك رسالة تحتوي على تعليمات إعادة الضبط خلال دقائق.`
                  : `If an account with (${email}) exists, instructions have been sent.`}
              </p>
              <Link to="/auth/sign-in" className="block pt-2">
                <Button variant="outline" className="w-full">
                  {isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

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
                    placeholder="name@example.com"
                    className="ps-10"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                {isAr ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/auth/sign-in"
                  className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg font-medium"
                >
                  <DirectionalIcon ltrIcon={ArrowLeft} rtlIcon={ArrowRight} className="w-3.5 h-3.5" />
                  <span>{isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
