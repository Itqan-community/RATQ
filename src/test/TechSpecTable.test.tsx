// src/test/TechSpecTable.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TechSpecTablePreviewPage } from '@/pages/previews/TechSpecTablePreviewPage';
import { TechStacksPage } from '@/pages/TechStacks';

describe('Idea 7: TechSpecTablePreviewPage Component', () => {
  it('renders breadcrumbs and page title without the return button or resources link', () => {
    render(
      <MemoryRouter>
        <TechSpecTablePreviewPage />
      </MemoryRouter>
    );

    // Verify breadcrumb and heading: "الرئيسية / حزم التطبيقات"
    expect(screen.getByRole('link', { name: /الرئيسية/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /^حزم التطبيقات$/i })).toBeInTheDocument();
    // Return button and resources link in breadcrumb should NOT be rendered
    expect(screen.queryByRole('link', { name: /العودة لمكتبة الموارد/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^الموارد$/i)).not.toBeInTheDocument();
    // Big banner should NOT be rendered
    expect(screen.queryByText(/معاينة الفكرة 7/i)).not.toBeInTheDocument();
  });

  it('renders app switcher pills and table with architectural layers', () => {
    render(
      <MemoryRouter>
        <TechSpecTablePreviewPage />
      </MemoryRouter>
    );

    // Default selected app is Quran.com
    expect(screen.getAllByText(/منصة القرآن الكريم العالمية/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/جدول المواصفات البرمجية والطبقات المعمارية/i)).toBeInTheDocument();

    // Verify table headers
    expect(screen.getByText(/الطبقة المعمارية \(Layer\)/i)).toBeInTheDocument();
    expect(screen.getByText(/الحزمة \/ المورد المعتمد \(Package\)/i)).toBeInTheDocument();
    expect(screen.getByText(/معيار إتقان \(Verification\)/i)).toBeInTheDocument();

    // Verify layers exist
    expect(screen.getByText(/مصحف المدينة النبوية برواية حفص 1441هـ/i)).toBeInTheDocument();
    expect(screen.getByText('L1')).toBeInTheDocument();
  });

  it('focuses purely on the app tech spec table without the comparison matrix toggle', () => {
    render(
      <MemoryRouter>
        <TechSpecTablePreviewPage />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: /مصفوفة المقارنة الشاملة/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/مصفوفة المقارنة الهندسية الشاملة لجميع التطبيقات/i)).not.toBeInTheDocument();
    expect(screen.getByText(/جدول المواصفات البرمجية والطبقات المعمارية/i)).toBeInTheDocument();
  });

  it('opens resource inspection modal when clicking a resource in the table', () => {
    render(
      <MemoryRouter>
        <TechSpecTablePreviewPage />
      </MemoryRouter>
    );

    const resBtn = screen.getByRole('button', { name: /مصحف المدينة النبوية برواية حفص 1441هـ/i });
    fireEvent.click(resBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/نبذة عن المورد:/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /إغلاق النافذة/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders category filter buttons inline on the same line and filters apps when clicked', () => {
    render(
      <MemoryRouter>
        <TechSpecTablePreviewPage />
      </MemoryRouter>
    );

    // Filter buttons should be rendered directly in the document (not hidden inside a closed dropdown)
    const allBtn = screen.getByRole('button', { name: /كافة التطبيقات/i });
    const aiBtn = screen.getByRole('button', { name: /الذكاء الاصطناعي والتسميع/i });
    const mushafBtn = screen.getByRole('button', { name: /المصاحف والتلاوة/i });

    expect(allBtn).toBeInTheDocument();
    expect(aiBtn).toBeInTheDocument();
    expect(mushafBtn).toBeInTheDocument();

    // Click on AI filter button
    fireEvent.click(aiBtn);

    // AI apps should be shown, non-AI apps filtered out
    expect(screen.getAllByText(/ترتيل/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/منصة القرآن الكريم العالمية/i)).not.toBeInTheDocument();
  });

  it('applies blue/cyan gradient background to selected app card matching datasets & AI section', () => {
    const { container } = render(
      <MemoryRouter>
        <TechSpecTablePreviewPage />
      </MemoryRouter>
    );

    // Check for cyan gradient in the app details card
    const gradientCard = container.querySelector('.from-cyan-500\\/10');
    expect(gradientCard).toBeInTheDocument();
  });

  it('verifies that TechStacksPage is the canonical Tech Spec Table', () => {
    render(
      <MemoryRouter>
        <TechStacksPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /^حزم التطبيقات$/i })).toBeInTheDocument();
    expect(screen.getByText(/جدول المواصفات البرمجية والطبقات المعمارية/i)).toBeInTheDocument();
  });
});
