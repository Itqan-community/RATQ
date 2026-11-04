// Live-mode only: announcements from Payload, shown above the home hero (live shows them as a carousel).
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { fetchAnnouncements, type Announcement } from '@/lib/payloadAnnouncements';

export const AnnouncementsStrip: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => {
    void fetchAnnouncements().then(setItems);
  }, []);
  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 pt-4 space-y-2" aria-label="announcements">
      {items.map((a) => (
        <div key={a.id} className="flex items-start gap-3 rounded-xl border border-border bg-canvas-subtle px-4 py-3 text-start">
          <Megaphone className="w-4 h-4 mt-1 shrink-0 text-ratq-600" />
          <div className="min-w-0 text-sm">
            <span className="font-bold text-fg">{a.title}</span>
            <span className="text-fg-muted"> - {a.description}</span>
            {a.ctaUrl &&
              (a.ctaUrl.startsWith('/') ? (
                <Link to={a.ctaUrl} className="ms-2 font-semibold text-ratq-700 hover:underline">{a.ctaLabel ?? '→'}</Link>
              ) : (
                <a href={a.ctaUrl} target="_blank" rel="noopener noreferrer" className="ms-2 font-semibold text-ratq-700 hover:underline">
                  {a.ctaLabel ?? '→'}
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
