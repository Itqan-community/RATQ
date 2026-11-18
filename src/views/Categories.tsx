// src/views/Categories.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { BookOpen, Library, Code2, PenTool, Database, Search, ArrowLeft } from 'lucide-react';

export const Categories: React.FC = () => {
  const { t, i18n } = useTranslation('site');
  const en = i18n.language === 'en';
  const categories = mockRepo.getCategories();
  const resources = mockRepo.getResources();

  const iconMap: Record<string, any> = {
    BookOpen,
    Library,
    Code2,
    PenTool,
    Database,
    Search,
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 w-full text-start">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">{t('categories.c00')}</h1>
        <p className="text-xs sm:text-sm text-fg-subtle mt-1">
          {t('categories.c01')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon || 'BookOpen'] || BookOpen;
          const count = resources.filter((r) => r.categories.includes(cat.id)).length;

          return (
            <Link
              key={cat.id}
              to={`/resources?category=${cat.id}`}
              className="p-6 rounded-2xl border border-border bg-canvas hover:border-qtd-400 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-qtd-50 dark:bg-qtd-950 flex items-center justify-center text-qtd-700 dark:text-qtd-300 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-fg group-hover:text-qtd-700 transition-colors">
                  {en ? cat.name_en : cat.name_ar}
                </h3>
                <p className="text-xs text-fg-muted mt-2 leading-relaxed">
                  {en ? t(`catalog.cat_desc.${cat.id}`, { defaultValue: cat.description_ar }) : cat.description_ar}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-fg-subtle">
                <span>{t('categories.published_count', { count })}</span>
                <span className="text-qtd-700 flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>{t('categories.c02')}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
