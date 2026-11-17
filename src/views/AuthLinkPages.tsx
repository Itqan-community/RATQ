// Pages reached from emailed / OAuth links. Paths match live RATQ so Payload's emails and the GitHub
// redirect (FRONTEND_URL/oauth/callback) keep working: /reset-password, /verify-email, /oauth/callback.
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { exchangeOAuthCode, isLive, parseOAuthCode, resetPassword, verifyEmail } from '@/lib/payloadAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { validatePassword } from '@/lib/authFlow';
import { GuestOnly } from '@/components/layout/GuestOnly';
import { hydrateUserData } from '@/lib/hydrateUserData';

const Shell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
    <div className="w-full max-w-md">
      <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight text-center mb-6">{title}</h1>
      <Card className="p-6 md:p-8 space-y-4">{children}</Card>
    </div>
  </div>
);

export const ResetPasswordPage: React.FC = () => {
  const isAr = useTranslation().i18n.language === 'ar';
  const token = useSearchParams()[0].get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError(isAr ? 'يجب أن تتراوح كلمة المرور بين 8 و64 حرفاً' : 'Password must be between 8 and 64 characters');
      return;
    }
    if (password !== confirm) {
      setError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    const err = await resetPassword(token, password);
    setLoading(false);
    if (err) setError(err);
    else setDone(true);
  };

  return (
    <GuestOnly>
    <Shell title={isAr ? 'تعيين كلمة مرور جديدة' : 'Set a New Password'}>
      {!token ? (
        <>
          <Alert variant="error">
            {isAr ? 'رابط إعادة التعيين غير صالح أو مفقود.' : 'This reset link is invalid or missing.'}
          </Alert>
          <Link to="/auth/forgot"><Button className="w-full">{isAr ? 'اطلب رابطاً جديداً' : 'Request a new link'}</Button></Link>
        </>
      ) : done ? (
        <>
          <Alert variant="success">{isAr ? 'تم تغيير كلمة المرور.' : 'Your password has been changed.'}</Alert>
          <Link to="/auth/sign-in"><Button className="w-full">{isAr ? 'تسجيل الدخول' : 'Sign In'}</Button></Link>
        </>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={64}
            placeholder={isAr ? 'كلمة المرور الجديدة' : 'New password'}
          />
          <Input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            maxLength={64}
            placeholder={isAr ? 'تأكيد كلمة المرور' : 'Confirm password'}
          />
          <Button type="submit" variant="primary" loading={loading} className="w-full">
            {isAr ? 'حفظ' : 'Save'}
          </Button>
        </form>
      )}
    </Shell>
    </GuestOnly>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const isAr = useTranslation().i18n.language === 'ar';
  const token = useSearchParams()[0].get('token') ?? '';
  const [state, setState] = useState<'pending' | 'ok' | string>('pending');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // the token is single-use
    ran.current = true;
    verifyEmail(token).then((err) => setState(err ?? 'ok'));
  }, [token]);

  return (
    <Shell title={isAr ? 'تأكيد البريد الإلكتروني' : 'Verify Email'}>
      {state === 'pending' && <p className="text-sm text-fg-muted">{isAr ? 'جارٍ التحقق...' : 'Verifying...'}</p>}
      {state === 'ok' && <Alert variant="success">{isAr ? 'تم تأكيد بريدك الإلكتروني.' : 'Your email is verified.'}</Alert>}
      {state !== 'pending' && state !== 'ok' && (
        <Alert variant="error">{token ? state : isAr ? 'رابط التأكيد غير صالح أو مفقود.' : 'This verification link is invalid or missing.'}</Alert>
      )}
      <Link to="/auth/sign-in"><Button variant="outline" className="w-full">{isAr ? 'تسجيل الدخول' : 'Sign In'}</Button></Link>
    </Shell>
  );
};

// Live RATQ's /logout: end the session, then go home.
export const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const { signOut, signOutLive } = useAuthStore.getState();
    (isLive() ? signOutLive() : Promise.resolve(signOut())).finally(() => navigate('/', { replace: true }));
  }, [navigate]);

  return null;
};

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // the code is single-use; a second run would fail a login that succeeded
    ran.current = true;
    const code = parseOAuthCode(window.location.hash);
    // Drop the code from the address bar immediately.
    window.history.replaceState(null, '', window.location.pathname);
    if (!code) return void navigate('/auth/sign-in', { replace: true });
    exchangeOAuthCode(code).then(async (err) => {
      if (err) return navigate('/auth/sign-in', { replace: true });
      await useAuthStore.getState().hydrateAuth();
      if (useAuthStore.getState().isAuthenticated) await hydrateUserData();
      navigate('/app', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm font-semibold text-fg-muted">Signing you in...</p>
    </div>
  );
};
