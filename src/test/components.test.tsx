// src/test/components.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ItqanBadge } from '../components/ui/ItqanBadge';
import { QuranQuote } from '../components/ui/QuranQuote';
import { DirectionalIcon } from '../components/ui/DirectionalIcon';
import { ResourceCard } from '../components/resources/ResourceCard';
import { Home } from '../views/Home';
import { MemoryRouter } from 'react-router-dom';
import { mockRepo } from '../lib/supabase';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const dummyResource = mockRepo.getResources()[0];

describe('UI Component Suite', () => {
  it('renders Button with children and variant', () => {
    render(<Button variant="primary">حفظ البيانات</Button>);
    const btn = screen.getByRole('button', { name: /حفظ البيانات/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders Badge with custom content', () => {
    render(<Badge variant="gold">إتقان ذهبي</Badge>);
    expect(screen.getByText('إتقان ذهبي')).toBeInTheDocument();
  });

  it('renders ItqanBadge for verified level', () => {
    render(<ItqanBadge level="verified" />);
    expect(screen.getByText(/موثّق/i)).toBeInTheDocument();
  });

  it('renders QuranQuote with ayah and surah details', () => {
    render(
      <QuranQuote
        text="اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
        surahName="العلق"
        ayahNumber={1}
      />
    );
    expect(screen.getByText(/اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ/i)).toBeInTheDocument();
    expect(screen.getByText(/سورة العلق/i)).toBeInTheDocument();
  });

  it('renders DirectionalIcon cleanly', () => {
    const { container } = render(
      <DirectionalIcon ltrIcon={ArrowLeft} rtlIcon={ArrowRight} className="test-icon" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders DirectionalIcon with name', () => {
    const { container } = render(
      <DirectionalIcon name="chevron-next" className="test-icon" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ResourceCard in default full mode', () => {
    render(
      <MemoryRouter>
        <ResourceCard resource={dummyResource} isCompact={false} />
      </MemoryRouter>
    );
    expect(screen.getByText(dummyResource.title_ar)).toBeInTheDocument();
    if (dummyResource.tech_stack?.[0]) {
      expect(screen.getByText(dummyResource.tech_stack[0])).toBeInTheDocument();
    }
  });

  it('renders ResourceCard in compact mode without tech stack clutter', () => {
    render(
      <MemoryRouter>
        <ResourceCard resource={dummyResource} isCompact={true} />
      </MemoryRouter>
    );
    expect(screen.getByText(dummyResource.title_ar)).toBeInTheDocument();
    if (dummyResource.tech_stack?.[0]) {
      expect(screen.queryByText(dummyResource.tech_stack[0])).not.toBeInTheDocument();
    }
  });

  it('renders ResourceCard with app ecosystem badges without label when showAppUsages is true', () => {
    const resourceWithApps = {
      ...dummyResource,
      slug: 'cms-144',
      title_ar: 'مصحف المدينة النبوية برواية حفص 1441هـ',
    };
    render(
      <MemoryRouter>
        <ResourceCard resource={resourceWithApps} showAppUsages={true} />
      </MemoryRouter>
    );
    expect(screen.queryByText('مُعتمد في:')).not.toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
  });

  it('truncates ResourceCard title to a single line and renders hover tooltip', () => {
    const longTitleResource = {
      ...dummyResource,
      title_ar: 'مكتبة الصرف والإعراب القرآني المتقدمة لمطوري الويب وتطبيقات الجوال والذكاء الاصطناعي',
    };
    render(
      <MemoryRouter>
        <ResourceCard resource={longTitleResource} />
      </MemoryRouter>
    );

    const titleSpan = screen.getByText(longTitleResource.title_ar);
    expect(titleSpan).toHaveClass('truncate');
    expect(screen.getByText(new RegExp(`عنوان المورد: ${longTitleResource.title_ar}`))).toBeInTheDocument();
  });

  it('does NOT render tooltip for short titles that do not end in dots', () => {
    const shortTitleResource = {
      ...dummyResource,
      title_ar: 'مصحف التجويد',
    };
    render(
      <MemoryRouter>
        <ResourceCard resource={shortTitleResource} />
      </MemoryRouter>
    );

    expect(screen.queryByText(new RegExp(`عنوان المورد: ${shortTitleResource.title_ar}`))).not.toBeInTheDocument();
  });

  it('renders Featured Resources in Home page with app ecosystem badges without label', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('الموارد المختارة والمتميزة')).toBeInTheDocument();
    expect(screen.queryByText('مُعتمد في:')).not.toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
  });
});
