// src/test/TechStacksInspector.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TechStacksPage } from '@/pages/TechStacks';
import { SiteHeader } from '@/components/layout/SiteHeader';

describe('TechStacksPage Component (Canonical Tech Spec Table)', () => {
  it('renders page with canonical title and breadcrumbs (الرئيسية / حزم التطبيقات)', () => {
    render(
      <MemoryRouter>
        <TechStacksPage />
      </MemoryRouter>
    );

    // Verify canonical title and breadcrumbs
    expect(screen.getByRole('heading', { level: 1, name: /^حزم التطبيقات$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /الرئيسية/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /العودة لمكتبة الموارد/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^الموارد$/i)).not.toBeInTheDocument();

    // Verify old split-view inspector elements are completely removed
    expect(screen.queryByText(/حزمة التثبيت الفوري/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/المخطط المعماري للطبقات/i)).not.toBeInTheDocument();
  });

  it('renders master app selector pills and architectural tech spec table', () => {
    render(
      <MemoryRouter>
        <TechStacksPage />
      </MemoryRouter>
    );

    // Initial selected stack is Quran.com
    expect(screen.getAllByText(/منصة القرآن الكريم العالمية/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/جدول المواصفات البرمجية والطبقات المعمارية/i)).toBeInTheDocument();

    // Verify table headers
    expect(screen.getByText(/الطبقة المعمارية \(Layer\)/i)).toBeInTheDocument();
    expect(screen.getByText(/الحزمة \/ المورد المعتمد \(Package\)/i)).toBeInTheDocument();
    expect(screen.getByText(/معيار إتقان \(Verification\)/i)).toBeInTheDocument();
  });

  it('filters apps by category using inline category buttons', () => {
    render(
      <MemoryRouter>
        <TechStacksPage />
      </MemoryRouter>
    );

    const aiBtn = screen.getByRole('button', { name: /الذكاء الاصطناعي والتسميع/i });
    expect(aiBtn).toBeInTheDocument();

    // Click AI category
    fireEvent.click(aiBtn);

    // Tarteel should be displayed
    expect(screen.getAllByText(/ترتيل/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/منصة القرآن الكريم العالمية/i)).not.toBeInTheDocument();
  });

  it('opens resource details modal when clicking resource in table, and closes on close button', () => {
    render(
      <MemoryRouter>
        <TechStacksPage />
      </MemoryRouter>
    );

    const resBtn = screen.getByRole('button', { name: /مصحف المدينة النبوية برواية حفص 1441هـ/i });
    fireEvent.click(resBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/نبذة عن المورد:/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /إغلاق النافذة/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

import { Catalog } from '@/pages/Catalog';

describe('SiteHeader App Stacks and Resources Direct Navigation', () => {
  it('renders direct link to /resources/stacks without dropdown', () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>
    );

    // Check that App Stacks is a direct link to /resources/stacks
    const stacksLinks = screen.getAllByRole('link', { name: /حزم التطبيقات/i });
    expect(stacksLinks.length).toBeGreaterThan(0);
    expect(stacksLinks[0]).toHaveAttribute('href', '/resources/stacks');
  });

  it('renders direct link to /resources for Resources Library without dropdown', () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>
    );

    // Check that Resources Library is a direct link to /resources
    const resourcesLinks = screen.getAllByRole('link', { name: /مكتبة الموارد/i });
    expect(resourcesLinks.length).toBeGreaterThan(0);
    expect(resourcesLinks[0]).toHaveAttribute('href', '/resources');

    // Verify no preview dropdown trigger exists
    expect(screen.queryByLabelText(/قائمة نماذج المعاينة للمكتبة/i)).not.toBeInTheDocument();
  });
});

describe('Canonical Catalog Component (Categorized Sections + Sticky Spy)', () => {
  it('renders canonical catalog page with categorized sections and breadcrumbs', () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );

    // Header & breadcrumbs
    expect(screen.getByText(/مكتبة الموارد القرآنية الموثقة/i)).toBeInTheDocument();
    expect(screen.getByText('مكتبة الموارد')).toBeInTheDocument();

    // Floating TOC and Categories
    expect(screen.getByText(/فهرس الأقسام/i)).toBeInTheDocument();
    expect(screen.getAllByText(/نصوص ومصادر مصحفية/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/الفلاتر المتقدمة/i)).toBeInTheDocument();
  });
});
