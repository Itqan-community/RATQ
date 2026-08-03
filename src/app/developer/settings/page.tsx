'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function DeveloperSettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Stub: real API call in Session 3
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">الإعدادات</h2>

      {saved && (
        <div className="card p-4 mb-6 bg-green-50 border-green-200">
          <p className="text-sm text-green-700">تم حفظ التغييرات بنجاح</p>
        </div>
      )}

      {/* Profile section */}
      <div className="card p-6 mb-6">
        <h3 className="font-heading font-semibold text-base mb-4">الملف الشخصي</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">البريد الإلكتروني لا يمكن تغييره</p>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">اسم العرض</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary text-sm py-2 px-5"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Password section */}
      <div className="card p-6 mb-6">
        <h3 className="font-heading font-semibold text-base mb-4">تغيير كلمة المرور</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">كلمة المرور الحالية</label>
            <input type="password" className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">كلمة المرور الجديدة</label>
            <input type="password" className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">تأكيد كلمة المرور الجديدة</label>
            <input type="password" className="input-field" />
          </div>
          <button className="btn-primary text-sm py-2 px-5">تغيير كلمة المرور</button>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold text-base mb-4">تفضيلات الإشعارات</h3>
        <div className="space-y-3">
          {[
            'إشعارات طلبات الوصول',
            'إشعارات التعليقات والردود',
            'إشعارات التقارير',
            'نشاط على مواردي المنشورة',
          ].map((pref) => (
            <label key={pref} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--accent-primary)]" />
              <span className="text-sm text-[var(--text-secondary)]">{pref}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
