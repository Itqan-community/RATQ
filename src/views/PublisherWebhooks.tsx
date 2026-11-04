// src/views/PublisherWebhooks.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Webhook, Plus, CheckCircle2, Play, Trash2, Shield } from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'failing';
  lastStatus: number;
  lastDeliveredAt: string;
}

export const PublisherWebhooksPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: 'wh_001',
      url: 'https://qurantech.org/api/webhooks/ratq-events',
      events: ['access_request.created', 'package.downloaded'],
      status: 'active',
      lastStatus: 200,
      lastDeliveredAt: '2026-01-20T11:30:00Z',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [testingPing, setTestingPing] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setEndpoints((prev) => [
      ...prev,
      {
        id: `wh_${Date.now()}`,
        url: newUrl,
        events: ['access_request.created'],
        status: 'active',
        lastStatus: 200,
        lastDeliveredAt: new Date().toISOString(),
      },
    ]);
    setIsAddOpen(false);
    setNewUrl('');
  };

  const handleTestPing = () => {
    setTestingPing(true);
    setTimeout(() => {
      setTestingPing(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }, 800);
  };

  const handleDelete = (id: string) => {
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'خطافات الويب والأحداث الحية (Webhooks)' : 'Outbound Webhooks'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'تلقي إشعارات فورية في خوادم مؤسستك عند تقديم طلب وصول جديد أو تنزيل حزمة برمجية.'
              : 'Receive HTTP push notifications on inbound access permits and downloads.'}
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'إضافة نقطة نهاية' : 'Add Endpoint'}</span>
        </Button>
      </div>

      {testSuccess && (
        <Alert variant="success" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'تم إرسال اختبار التحقق (Ping) بنجاح 200 OK' : 'Test ping succeeded (200 OK)'}</span>
        </Alert>
      )}

      {/* Endpoints List */}
      <div className="space-y-4">
        {endpoints.map((ep) => (
          <Card key={ep.id} className="p-6 border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ratq-500/10 text-ratq-600 flex items-center justify-center shrink-0">
                    <Webhook className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-fg break-all" dir="ltr">
                      {ep.url}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {ep.events.map((ev) => (
                        <Badge key={ev} variant="outline" className="text-[10px] font-mono">
                          {ev}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-fg-subtle pt-1 ps-13">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {ep.lastStatus} OK
                  </span>
                  <span>•</span>
                  <span>
                    {isAr
                      ? `آخر تسليم: ${new Date(ep.lastDeliveredAt).toLocaleTimeString()}`
                      : `Last delivered: ${new Date(ep.lastDeliveredAt).toLocaleTimeString()}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  loading={testingPing}
                  onClick={handleTestPing}
                  className="gap-1.5 text-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال اختبار (Ping)' : 'Send Ping'}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(ep.id)}
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 h-9 w-9"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={isAr ? 'إضافة نقطة نهاية Webhook جديدة' : 'Add Webhook Endpoint'}
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'عنوان الرابط (HTTPS URL) *' : 'Endpoint URL (HTTPS) *'}
            </label>
            <Input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.org/webhook"
              dir="ltr"
            />
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-border text-2xs text-fg-muted flex items-start gap-2">
            <Shield className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'يتم توقيع كل حمولة مرسلة عبر ترويسة x-ratq-signature باستخدام خوارزمية HMAC-SHA256 لضمان أصالة الرسالة.'
                : 'All payloads are signed with HMAC-SHA256 via x-ratq-signature header.'}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary">
              {isAr ? 'حفظ نقطة النهاية' : 'Save Endpoint'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PublisherWebhooksPage;
