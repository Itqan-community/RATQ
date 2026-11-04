// src/pages/Roadmap.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, Sparkles, ArrowUpRight, ThumbsUp } from 'lucide-react';

interface Milestone {
  id: string;
  quarter: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  status: 'completed' | 'in_progress' | 'planned';
  category: 'core' | 'sacred' | 'ai' | 'developer';
  votes: number;
}

const ROADMAP_ITEMS: Milestone[] = [
  {
    id: 'm1',
    quarter: 'Q1 2026',
    title_ar: 'الأساس المتين وميثاق نزاهة القرآن الكريم',
    title_en: 'Foundations & Sacred Text Integrity Covenant',
    desc_ar: 'إطلاق الدليل الموحد مع تدقيق مشدد لقواعد النص القرآني وعدم التوليد الآلي، وفهرسة الحزم التقنية، وتطبيق RLS الصارم.',
    desc_en: 'Unified catalog launch with strict sacred text zero-hallucination guardrails, technical packaging index, and strict Postgres RLS.',
    status: 'completed',
    category: 'sacred',
    votes: 342,
  },
  {
    id: 'm2',
    quarter: 'Q1 2026',
    title_ar: 'نظام شارات الإتقان (1-4) والتقييم الفني',
    title_en: 'Itqan Badges (1-4) & Peer Review System',
    desc_ar: 'تفعيل مسار المراجعة الفنية عبر مصفوفة مؤتمتة من 14 معياراً، مع إصدار أول 20 شارة للمطورين الموثقين.',
    desc_en: 'Peer review workflow based on automated 14-point audit matrix, launching the first 20 verified publisher badges.',
    status: 'completed',
    category: 'core',
    votes: 215,
  },
  {
    id: 'm3',
    quarter: 'Q2 2026',
    title_ar: 'بوابة المطور وإدارة المفاتيح ومحدد الطلبات',
    title_en: 'Developer Portal, Key Hashes & Rate Limiting',
    desc_ar: 'إدارة مفاتيح API الآمنة (SHA-256) مع لوحة متابعة الاستهلاك وحصص الاستخدام العادل للأفراد والجهات.',
    desc_en: 'Secure API key generation (SHA-256 + Pepper) with fair use quota monitors and SLA dashboards.',
    status: 'in_progress',
    category: 'developer',
    votes: 189,
  },
  {
    id: 'm4',
    quarter: 'Q2 2026',
    title_ar: 'تكامل البحث الدلالي المتجهي (pgvector)',
    title_en: 'Hybrid Vector Semantic Search (pgvector)',
    desc_ar: 'ربط البحث الهجين بين التضمينات المتجهة والبحث النصي الكامل (BM25) للوصول الفوري للمكتبات والتفاسير.',
    desc_en: 'Hybrid vector search combining embeddings with full-text Arabic search for libraries and scholarly datasets.',
    status: 'in_progress',
    category: 'ai',
    votes: 260,
  },
  {
    id: 'm5',
    quarter: 'Q3 2026',
    title_ar: 'شبكة الشركاء المعتمدين والمزامنة السحابية',
    title_en: 'Federated Ecosystem & Cloud Sync',
    desc_ar: 'تمكين المراكز البحثية والجمعيات الخيرية من نشر مستودعاتها بتوقيع رقمي موثق ومزامنة تلقائية.',
    desc_en: 'Enabling verified research hubs and charitable societies to publish cryptographically signed packages with auto-sync.',
    status: 'planned',
    category: 'developer',
    votes: 145,
  },
  {
    id: 'm6',
    quarter: 'Q4 2026',
    title_ar: 'منصة مسابقات الهاكاثون القرآني المفتوح',
    title_en: 'Open QuranTech Hackathons & Grants',
    desc_ar: 'إطلاق برنامج المنح المفتوحة لدعم برمجيات خدمة القرآن الكريم مفتوحة المصدر وبروتوكولات التشفير.',
    desc_en: 'Grants program and open challenges to support open-source Quranic computing and archival integrity.',
    status: 'planned',
    category: 'core',
    votes: 312,
  },
];

export const RoadmapPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'planned'>('all');
  const [votedItems, setVotedItems] = useState<Record<string, boolean>>({});

  const toggleVote = (id: string) => {
    setVotedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = ROADMAP_ITEMS.filter((item) => filter === 'all' || item.status === filter);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="primary" className="mb-3">
          <Sparkles className="w-3.5 h-3.5 me-1.5" />
          {isAr ? 'خارطة طريق المنتج' : 'Product Roadmap'}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-fg tracking-tight mb-4">
          {isAr ? 'مسار بناء منظومة رتق' : 'The Path Forward for RATQ'}
        </h1>
        <p className="text-fg-muted text-lg leading-relaxed">
          {isAr
            ? 'نعمل وفق رؤية واضحة تضع موثوقية النص القرآني وأداء البنية التحتية البرمجية على رأس أولوياتنا المجتمعية.'
            : 'Guided by our commitment to sacred text integrity and developer-first infrastructure.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { key: 'all', label_ar: 'الكل', label_en: 'All' },
          { key: 'completed', label_ar: 'مكتمل', label_en: 'Completed' },
          { key: 'in_progress', label_ar: 'قيد التنفيذ', label_en: 'In Progress' },
          { key: 'planned', label_ar: 'مخطط له', label_en: 'Planned' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-ratq-600 text-white shadow-sm'
                : 'bg-canvas-card border border-border text-fg-muted hover:text-fg hover:border-ratq-300'
            }`}
          >
            {isAr ? tab.label_ar : tab.label_en}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const hasVoted = votedItems[item.id];
          const currentVotes = item.votes + (hasVoted ? 1 : 0);

          return (
            <Card key={item.id} className="p-6 flex flex-col justify-between hover:border-ratq-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-ratq-600 dark:text-ratq-400 bg-ratq-50 dark:bg-ratq-950/40 px-2.5 py-1 rounded-md">
                    {item.quarter}
                  </span>
                  {item.status === 'completed' && (
                    <Badge variant="success">
                      <CheckCircle2 className="w-3.5 h-3.5 me-1" />
                      {isAr ? 'مكتمل' : 'Completed'}
                    </Badge>
                  )}
                  {item.status === 'in_progress' && (
                    <Badge variant="warning">
                      <Clock className="w-3.5 h-3.5 me-1" />
                      {isAr ? 'قيد التطوير' : 'In Progress'}
                    </Badge>
                  )}
                  {item.status === 'planned' && (
                    <Badge variant="default">
                      <ArrowUpRight className="w-3.5 h-3.5 me-1" />
                      {isAr ? 'مستقبلي' : 'Planned'}
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-fg mb-2">
                  {isAr ? item.title_ar : item.title_en}
                </h3>
                <p className="text-fg-muted text-sm leading-relaxed mb-6">
                  {isAr ? item.desc_ar : item.desc_en}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-fg-subtle capitalize">
                  {isAr ? `الفئة: ${item.category}` : `Category: ${item.category}`}
                </span>
                <Button
                  size="sm"
                  variant={hasVoted ? 'primary' : 'outline'}
                  onClick={() => toggleVote(item.id)}
                  className="gap-1.5"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                  <span>{currentVotes}</span>
                  <span className="text-xs">{isAr ? 'تأييد' : 'Votes'}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;
