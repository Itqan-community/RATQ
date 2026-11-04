// src/views/AdminUsers.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { DEMO_PROFILES } from '@/lib/mockData';
import { Profile, UserRole } from '@/types';
import { Search, Ban, Edit } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [users, setUsers] = useState<Profile[]>(Object.values(DEMO_PROFILES));
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('developer');

  const filtered = users.filter((u) => {
    const name = u.display_name.toLowerCase();
    const handle = u.handle.toLowerCase();
    return name.includes(search.toLowerCase()) || handle.includes(search.toLowerCase());
  });

  const handleSaveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u } : u))
    );
    setEditingUser(null);
  };

  const handleToggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_blocked: !u.is_blocked } : u))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'إدارة المستخدمين والأدوار' : 'User Accounts & Roles'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'التحكم في صلاحيات المستخدمين، منح أدوار التحكيم والإشراف، وإدارة الحظر.'
            : 'Assign roles (reviewer, publisher, moderator) and control account statuses.'}
        </p>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم أو المعرف...' : 'Search users...'}
            className="ps-9"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-canvas-subtle border-b border-border text-fg-subtle text-xs">
              <tr>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'المستخدم' : 'User'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'المعرف' : 'Handle'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'المهارات' : 'Skills'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'تاريخ الانضمام' : 'Joined'}</th>
                <th className="py-3 px-4 font-bold text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-canvas-subtle/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.display_name}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                      <span className="font-bold text-fg">{u.display_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-fg-muted">
                    @{u.handle}
                  </td>
                  <td className="py-3 px-4 text-xs text-fg-muted">
                    {u.skills.slice(0, 2).join(', ')}
                  </td>
                  <td className="py-3 px-4">
                    {u.is_blocked ? (
                      <Badge variant="danger">{isAr ? 'محظور' : 'Blocked'}</Badge>
                    ) : (
                      <Badge variant="success">{isAr ? 'نشط' : 'Active'}</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-fg-subtle">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingUser(u);
                        }}
                        className="text-xs gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>{isAr ? 'الأدوار' : 'Roles'}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleBlock(u.id)}
                        className={`text-xs p-1.5 h-8 w-8 ${
                          u.is_blocked ? 'text-emerald-600' : 'text-red-600'
                        }`}
                        title={u.is_blocked ? 'إلغاء الحظر' : 'حظر الحساب'}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Assignment Modal */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title={isAr ? `تعديل صلاحيات: ${editingUser?.display_name}` : 'Assign Role'}
      >
        <div className="space-y-4">
          <p className="text-xs text-fg-muted">
            {isAr
              ? 'حدد الدور الوظيفي للمستخدم في المنصة، تتيح أدوار المحكم والمشرف صلاحيات خاصة.'
              : 'Choose user role. Reviewer and Moderator roles grant elevated privileges.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'الدور المعتمد' : 'Assigned Role'}
            </label>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              options={[
                { value: 'developer', label: isAr ? 'مطور (باحث / مستخدم)' : 'Developer' },
                { value: 'publisher_owner', label: isAr ? 'ناشر (مالك جهة النشر)' : 'Publisher Owner' },
                { value: 'reviewer', label: isAr ? 'محكّم معتمد (مجلس الإتقان)' : 'Accredited Reviewer' },
                { value: 'moderator', label: isAr ? 'مشرف مجتمع (إشراف وامتثال)' : 'Moderator' },
                { value: 'admin', label: isAr ? 'مدير نظام (صلاحيات كاملة)' : 'System Admin' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditingUser(null)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="primary" onClick={handleSaveRole}>
              {isAr ? 'حفظ الصلاحية' : 'Save Role'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
