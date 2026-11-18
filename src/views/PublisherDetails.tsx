// src/views/PublisherDetails.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Globe, Mail } from 'lucide-react';

export const PublisherDetails: React.FC = () => {
  const { t, i18n } = useTranslation('site');
  const en = i18n.language === 'en';
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const publishers = mockRepo.getPublishers();
  const publisher = publishers.find((p) => p.slug === slug);
  const resources = mockRepo.getResources().filter((r) => r.publisher_id === publisher?.id);

  if (!publisher) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-fg mb-2">{t('publisher_details.d00')}</h2>
        <Button variant="primary" onClick={() => navigate('/publishers')}>
          {t('publisher_details.d01')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 w-full text-start">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-fg-subtle mb-6">
        <Link to="/" className="hover:text-fg">{t('publisher_details.d02')}</Link>
        <span>/</span>
        <Link to="/publishers" className="hover:text-fg">{t('publisher_details.d03')}</Link>
        <span>/</span>
        <span className="text-fg font-medium">{en ? publisher.name_en || publisher.name_ar : publisher.name_ar}</span>
      </nav>

      {/* Publisher Banner Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border hero-gradient-bg transition-colors shadow-xs mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-qtd-700 dark:text-qtd-300 flex items-center justify-center font-bold text-xl shrink-0 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              {publisher.logo_url ? (
                <img src={publisher.logo_url} alt={publisher.name_ar} className="w-full h-full object-cover" />
              ) : (
                publisher.name_ar.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-fg">{en ? publisher.name_en || publisher.name_ar : publisher.name_ar}</h1>
                <span className="text-xs text-qtd-600 dark:text-qtd-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {t('publisher_details.verified')}
                </span>
              </div>
              {publisher.name_en && (
                <p className="text-xs font-mono text-fg-subtle mb-3">{publisher.name_en}</p>
              )}
              <p className="text-xs text-fg-muted max-w-xl leading-relaxed">
                {publisher.description_ar}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {publisher.website && (
              <a href={publisher.website} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  startIcon={<Globe className="w-4 h-4" />}
                  className="bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-border/80 shadow-2xs"
                >
                  {t('publisher_details.d04')}
                </Button>
              </a>
            )}
            {publisher.public_contact_email && (
              <a href={`mailto:${publisher.public_contact_email}`}>
                <Button
                  variant="primary"
                  size="sm"
                  startIcon={<Mail className="w-4 h-4" />}
                >
                  {t('publisher_details.d05')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Published Resources */}
      <div>
        <h2 className="text-lg font-bold text-fg mb-4">
          {t('publisher_details.published_by', { count: resources.length })}
        </h2>

        {resources.length === 0 ? (
          <div className="py-12 text-center text-xs text-fg-subtle border border-dashed rounded-xl">
            {t('publisher_details.d06')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
