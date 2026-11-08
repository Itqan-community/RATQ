// src/views/AppSaved.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { mockRepo } from '@/lib/supabase';
import { Bookmark, Search, Compass, Trash2 } from 'lucide-react';

export const AppSavedPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // Mock page: no persisted saves exist, so it shows the first 2 listed resources (none in live mode if API is empty).
  const [savedResources, setSavedResources] = useState(() => mockRepo.getResources().slice(0, 2));
  const [search, setSearch] = useState('');

  const handleRemove = (id: string) => {
    setSavedResources((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = savedResources.filter((r) => {
    const title = (isAr ? r.title_ar : r.title_en) || r.title_ar;
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'الموارد المحفوظة' : 'Saved Resources'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'الحزم والمكتبات والبيانات التي قمت بحفظها للرجوع إليها سريعاً في مشاريعك.'
              : 'Quranic packages, libraries, and datasets you bookmarked for reference.'}
          </p>
        </div>
        <Link to="/resources">
          <Button variant="outline" size="sm" className="gap-2">
            <Compass className="w-4 h-4" />
            <span>{isAr ? 'استعراض المزيد' : 'Browse Catalog'}</span>
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      {savedResources.length > 0 && (
        <Card className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? 'البحث في الموارد المحفوظة...' : 'Search saved resources...'}
              className="ps-9"
            />
          </div>
        </Card>
      )}

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-fg-muted">
          <div className="w-14 h-14 rounded-full bg-canvas-subtle text-fg-subtle mx-auto flex items-center justify-center mb-4">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-fg text-lg mb-1">
            {isAr ? 'لا توجد موارد محفوظة حالياً' : 'No saved resources'}
          </h3>
          <p className="text-sm max-w-sm mx-auto mb-6">
            {isAr
              ? 'يمكنك حفظ أي حزمة أو مكتبة أو مجموعة بيانات من صفحة المورد عبر زر الحفظ.'
              : 'You can bookmark any resource from the catalog to keep it handy here.'}
          </p>
          <Link to="/resources">
            <Button variant="primary">
              {isAr ? 'استكشاف الفهرس' : 'Explore Catalog'}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />
              <button
                type="button"
                onClick={() => handleRemove(resource.id)}
                title={isAr ? 'إزالة من المحفوظات' : 'Remove bookmark'}
                className="absolute top-4 end-4 z-20 p-2 rounded-lg bg-canvas-card/90 backdrop-blur-sm border border-border text-fg-muted hover:text-red-600 hover:border-red-300 shadow-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppSavedPage;
