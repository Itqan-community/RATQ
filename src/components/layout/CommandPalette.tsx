// src/components/layout/CommandPalette.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Layers, BookOpen, Shield, Code2, ArrowLeft } from 'lucide-react';
import { DEMO_RESOURCES } from '@/lib/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResources = DEMO_RESOURCES.filter(
    (r) =>
      r.title_ar.includes(query) ||
      (r.title_en && r.title_en.toLowerCase().includes(query.toLowerCase())) ||
      r.tags.some((t) => t.includes(query))
  ).slice(0, 5);

  const quickLinks = [
    { label: 'الكتالوج الشامل', path: '/resources', icon: BookOpen },
    { label: 'دليل الناشرين', path: '/publishers', icon: Layers },
    { label: 'معيار إتقان للجودة', path: '/standards', icon: Shield },
    { label: 'بوابة المطور', path: '/app', icon: Code2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-xl border border-border bg-canvas shadow-2xl overflow-hidden z-10 text-start animate-in fade-in-0 zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-subtle">
          <Search className="w-5 h-5 text-fg-subtle shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مورد، مكتبة، حزمة، أو تصنيف..."
            autoFocus
            className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-fg-subtle hover:text-fg">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredResources.length > 0 && (
            <div className="mb-3">
              <span className="text-[11px] font-bold text-fg-subtle px-3 py-1 block uppercase">
                الموارد والبرمجيات
              </span>
              {filteredResources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    navigate(`/resources/${res.slug}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-subtle transition-colors text-start cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-ratq-600 shrink-0" />
                    <div>
                      <p className="font-bold text-fg">{res.title_ar}</p>
                      <p className="text-2xs text-fg-subtle">{res.summary_ar.slice(0, 50)}...</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-fg-subtle rtl:rotate-0 rotate-180" />
                </button>
              ))}
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold text-fg-subtle px-3 py-1 block uppercase">
              مسارات سريعة
            </span>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-fg rounded-lg hover:bg-subtle transition-colors text-start cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-fg-subtle shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border-subtle bg-muted/40 flex items-center justify-between text-[11px] text-fg-subtle">
          <span>التنقل بالأسهم والمفاتيح</span>
          <span>ESC للإغلاق</span>
        </div>
      </div>
    </div>
  );
};
