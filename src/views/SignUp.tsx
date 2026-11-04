// src/views/SignUp.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAuthStore } from '@/store/useAuthStore';
import { isLive } from '@/lib/payloadAuth';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { signIn, signUpLive } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      setError(isAr ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    if (!agreeTerms) {
      setError(
        isAr
          ? 'يجب الموافقة على شروط الاستخدام وميثاق نزاهة القرآن الكريم'
          : 'You must agree to the Terms and Sacred Text Integrity Covenant'
      );
      return;
    }

    setLoading(true);
    setError(null);
    if (isLive()) {
      const err = await signUpLive(email, password, fullName);
      setLoading(false);
      if (err) setError(err);
      else navigate('/app');
      return;
    }
    setTimeout(() => {
      setLoading(false);
      signIn(email);
      navigate('/app');
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
            {isAr ? 'إنشاء حساب جديد' : 'Create an Account'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr ? 'انضم إلى مجتمع رتق لخدمة البرمجيات والبيانات القرآنية' : 'Join the RATQ community of QuranTech developers'}
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-fg mb-1.5">
                {isAr ? 'الاسم الكامل *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isAr ? 'عبد الرحمن محمد' : 'Jane Doe'}
                  className="ps-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-fg mb-1.5">
                {isAr ? 'اسم المستخدم (معرف) *' : 'Username *'}
              </label>
              <Input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="developer_quran"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-fg mb-1.5">
                {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
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

            <div>
              <label className="block text-sm font-semibold text-fg mb-1.5">
                {isAr ? 'كلمة المرور *' : 'Password *'}
              </label>
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

            <div className="pt-2">
              <Checkbox
                checked={agreeTerms}
                onChange={(checked) => setAgreeTerms(checked)}
                label={
                  isAr ? (
                    <>
                      أوافق على <Link to="/legal/terms" className="text-ratq-600 underline">شروط الاستخدام</Link> و
                      <span className="font-semibold text-fg"> ميثاق نزاهة القرآن الكريم</span>، وعدم استخدام أي نماذج ذكاء اصطناعي توليدية لاختلاق نصوص أو تفاسير.
                    </>
                  ) : (
                    <>
                      I agree to the <Link to="/legal/terms" className="text-ratq-600 underline">Terms of Service</Link> and the{' '}
                      <span className="font-semibold text-fg">Sacred Text Integrity Covenant</span>.
                    </>
                  )
                }
                labelClassName="text-xs text-fg-muted font-normal leading-relaxed"
              />
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full gap-2 mt-4 shrink-0">
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'إنشاء الحساب' : 'Create Account'}</span>
            </Button>
          </form>

          <p className="text-center text-xs text-fg-muted mt-6">
            {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/auth/sign-in" className="text-ratq-600 font-semibold hover:underline">
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
