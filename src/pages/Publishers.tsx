// src/pages/Publishers.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export const Publishers: React.FC = () => {
  const publishers = mockRepo.getPublishers();
  const resources = mockRepo.getResources();

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 w-full text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg">دليل الناشرين والمؤسسات</h1>
          <p className="text-xs sm:text-sm text-fg-subtle mt-1">
            الجهات والبيوت العلمية والمطورون المعتمدون لنشر وصيانة الأصول والبرمجيات القرآنية.
          </p>
        </div>

        <Link to="/publisher/claim">
          <Button variant="outline" size="sm">
            المطالبة بملكية مورد أو الانضمام
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishers.map((pub) => {
          const pubResources = resources.filter((r) => r.publisher_id === pub.id);

          return (
            <div
              key={pub.id}
              className="p-6 rounded-2xl border border-border bg-canvas hover:border-border-strong transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-ratq-100 dark:bg-ratq-900 text-ratq-700 dark:text-ratq-300 flex items-center justify-center font-bold text-base shrink-0">
                    {pub.name_ar.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-fg">{pub.name_ar}</h3>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ناشر موثق
                    </span>
                  </div>
                </div>

                <p className="text-xs text-fg-muted leading-relaxed line-clamp-3 mb-4">
                  {pub.description_ar}
                </p>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="font-semibold text-fg-subtle">
                  {pubResources.length} موارد منشورة
                </span>

                <Link
                  to={`/publishers/${pub.slug}`}
                  className="inline-flex items-center gap-1 text-ratq-700 font-bold hover:underline"
                >
                  <span>عرض الملف</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
