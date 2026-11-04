// src/views/Categories.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { BookOpen, Library, Code2, PenTool, Database, Search, ArrowLeft } from 'lucide-react';

export const Categories: React.FC = () => {
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
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">شجرة التصنيفات المعرفية</h1>
        <p className="text-xs sm:text-sm text-fg-subtle mt-1">
          تصفح الموارد والبرمجيات القرآنية بحسب الفئات الكبرى والتفرعات التخصصية.
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
              className="p-6 rounded-2xl border border-border bg-canvas hover:border-ratq-400 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-ratq-50 dark:bg-ratq-950 flex items-center justify-center text-ratq-700 dark:text-ratq-300 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-fg group-hover:text-ratq-700 transition-colors">
                  {cat.name_ar}
                </h3>
                <p className="text-xs text-fg-muted mt-2 leading-relaxed">
                  {cat.description_ar}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-fg-subtle">
                <span>{count} موارد منشورة</span>
                <span className="text-ratq-700 flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>استكشف</span>
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
