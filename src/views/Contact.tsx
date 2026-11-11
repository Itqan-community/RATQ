// src/views/Contact.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { isLive } from '@/lib/payloadAuth';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, Github, ExternalLink } from 'lucide-react';

// Same channels as old prod's /contact page.
const CHANNELS = {
  email: 'connect@itqan.dev',
  issues: 'https://github.com/Itqan-community/RATQ/issues',
  forum: 'https://community.itqan.dev',
};

export const ContactPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <Badge variant="primary" className="mb-3">
          <Mail className="w-3.5 h-3.5 me-1.5" />
          {isAr ? 'التواصل والدعم' : 'Contact & Support'}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-fg tracking-tight mb-4">
          {isAr ? 'نسعد بتواصلك مع فريق رتق' : 'Get in Touch with RATQ Team'}
        </h1>
        <p className="text-fg-muted text-lg max-w-2xl mx-auto">
          {isAr
            ? 'سواء كان لديك استفسار علمي، اقتراح تقني، أو رغبة في توثيق جهة نشر، نحن هنا لخدمتكم.'
            : 'Whether you have a technical query, scholarly suggestion, or organization claim inquiry.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information & Channels */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-fg mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ratq-600" />
              {isAr ? 'قنوات المجتمع' : 'Community Hubs'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={CHANNELS.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-canvas-subtle text-fg-muted hover:text-fg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span>{isAr ? 'تذاكر GitHub' : 'GitHub Issues'}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={CHANNELS.forum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-canvas-subtle text-fg-muted hover:text-fg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{isAr ? 'منتدى النقاش (Flarum)' : 'Discussion Forum'}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href={`mailto:${CHANNELS.email}`} className="p-2 text-fg-muted hover:text-fg flex items-center gap-2 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-ratq-600" />
                  <span>{CHANNELS.email}</span>
                </a>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-ratq-50/50 dark:bg-ratq-950/20 border-ratq-200 dark:border-ratq-800">
            <h4 className="font-bold text-ratq-900 dark:text-ratq-100 text-sm mb-2">
              {isAr ? 'ملاحظة حول مراجعات المصحف' : 'Sacred Review Inquiries'}
            </h4>
            <p className="text-xs text-ratq-800 dark:text-ratq-300 leading-relaxed">
              {isAr
                ? 'البلاغات المتعلقة بنصوص الآيات أو قراءاتها تُحال فورياً للجنة التدقيق العلمي ويتم الرد عليها خلال 24 ساعة كحد أقصى.'
                : 'Reports concerning Quranic text accuracy are routed to the Scholarly Audit Committee within 24 hours.'}
            </p>
          </Card>
        </div>

        {/* Contact Form (demo only: it never sends anything, so live mode shows the real channels, as old prod did) */}
        <div className="md:col-span-2">
          <Card className="p-6 md:p-8">
            {isLive() ? (
              <div className="space-y-4 text-sm leading-relaxed">
                <h3 className="text-xl font-bold text-fg">{isAr ? 'كيف تتواصل معنا' : 'How to reach us'}</h3>
                <p className="text-fg-muted">
                  {isAr
                    ? 'رَتْق مشروع مفتوح المصدر تديره المجتمع، وكل من يعمل عليه يبدأ من نفس قائمة المهام المفتوحة على GitHub.'
                    : 'RATQ is a community-run open-source project. Everyone working on it starts from the same open queue on GitHub.'}
                </p>
                <ul className="space-y-3 text-fg-muted">
                  <li>
                    {isAr ? 'بريدنا الإلكتروني: ' : 'Email: '}
                    <a href={`mailto:${CHANNELS.email}`} className="font-semibold text-fg underline">{CHANNELS.email}</a>
                  </li>
                  <li>
                    {isAr ? 'للمشاكل التقنية أو اقتراح ميزة جديدة، افتح تذكرة على ' : 'For bugs and feature requests, open an issue on '}
                    <a href={CHANNELS.issues} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline">GitHub</a>
                  </li>
                  <li>
                    {isAr ? 'للنقاش المجتمعي العام: ' : 'For general community discussion: '}
                    <a href={CHANNELS.forum} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline">community.itqan.dev</a>
                  </li>
                  <li>
                    {isAr
                      ? 'تريد المساهمة بالكود؟ راجع دليل المساهمة (CONTRIBUTING.md) في المستودع للبدء.'
                      : 'Want to contribute code? See CONTRIBUTING.md in the repo to get started.'}
                  </li>
                </ul>
              </div>
            ) : submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-fg">
                  {isAr ? 'تم استلام رسالتك بنجاح' : 'Message Sent Successfully'}
                </h3>
                <p className="text-fg-muted text-sm max-w-md mx-auto">
                  {isAr
                    ? 'شكراً لتواصلك معنا. سنقوم بالرد عليك عبر البريد الإلكتروني في أقرب وقت.'
                    : 'Thank you for reaching out. We will get back to you shortly.'}
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert variant="error">{error}</Alert>}

                <div>
                  <label className="block text-sm font-semibold text-fg mb-1.5">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={isAr ? 'مثال: عبد الله أحمد' : 'e.g. John Doe'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg mb-1.5">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg mb-1.5">
                    {isAr ? 'موضوع الرسالة' : 'Topic'}
                  </label>
                  <Select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    options={[
                      { value: 'general', label: isAr ? 'استفسار عام' : 'General Inquiry' },
                      { value: 'sacred', label: isAr ? 'بلاغ تدقيق نص قرآني' : 'Sacred Text Audit' },
                      { value: 'publisher', label: isAr ? 'طلب توثيق جهة نشر' : 'Publisher Verification' },
                      { value: 'security', label: isAr ? 'إبلاغ عن ثغرة أمنية' : 'Security Vulnerability' },
                      { value: 'partnership', label: isAr ? 'شراكة وتعاون مؤسسي' : 'Institutional Partnership' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg mb-1.5">
                    {isAr ? 'الرسالة أو التفاصيل *' : 'Message *'}
                  </label>
                  <Textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isAr ? 'اكتب استفسارك بالتفصيل...' : 'Write your message details...'}
                  />
                </div>

                <Button type="submit" variant="primary" loading={submitting} className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
