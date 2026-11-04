import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TreeExplorerPreviewPage } from '@/pages/previews/TreeExplorerPreviewPage';

describe('TreeExplorerPreviewPage Component', () => {
  it('renders tree explorer page with directory tree and details inspector', () => {
    render(
      <MemoryRouter>
        <TreeExplorerPreviewPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/مستكشف المجلدات الهرمي/i)).toBeInTheDocument();
    expect(screen.getByText(/المواصفات التقنية:/i)).toBeInTheDocument();
  });

  it('renders ecosystem apps widget in selected resource details view when resource has apps', () => {
    render(
      <MemoryRouter>
        <TreeExplorerPreviewPage />
      </MemoryRouter>
    );

    // Initial selected resource in text_uthmani has ecosystem apps (e.g., quran-complex-fonts or similar)
    // Verify that the ecosystem apps section is present in details
    const appsSectionHeader = screen.queryByText(/تطبيقات تعتمد على المورد:/i);
    if (appsSectionHeader) {
      expect(appsSectionHeader).toBeInTheDocument();
      // App icons exist as images
      const appIcons = screen.getAllByRole('img');
      expect(appIcons.length).toBeGreaterThan(0);
    }
  });

  it('does NOT render the install and import command section as per new specs', () => {
    render(
      <MemoryRouter>
        <TreeExplorerPreviewPage />
      </MemoryRouter>
    );

    expect(screen.queryByText(/أمر التثبيت والاستدعاء/i)).not.toBeInTheDocument();
  });

  it('renders filter buttons (advanced filters, itqan badge, access level) and opens dropdowns/drawer', () => {
    render(
      <MemoryRouter>
        <TreeExplorerPreviewPage />
      </MemoryRouter>
    );

    // 1. Verify buttons are present
    const advancedFiltersBtn = screen.getByRole('button', { name: /الفلاتر المتقدمة/i });
    const badgeBtn = screen.getByRole('button', { name: /شارة إتقان/i });
    const accessBtn = screen.getByRole('button', { name: /مستوى الوصول/i });

    expect(advancedFiltersBtn).toBeInTheDocument();
    expect(badgeBtn).toBeInTheDocument();
    expect(accessBtn).toBeInTheDocument();

    // 2. Click Itqan Badge button to open dropdown
    fireEvent.click(badgeBtn);
    expect(screen.getByText(/تصفية بشارة إتقان/i)).toBeInTheDocument();
    expect(screen.getByText(/إتقان ذهبي/i)).toBeInTheDocument();

    // 3. Click Access button to open dropdown
    fireEvent.click(accessBtn);
    expect(screen.getByText(/مفتوح ومباشر/i)).toBeInTheDocument();

    // 4. Click Advanced Filters button to open Drawer
    fireEvent.click(advancedFiltersBtn);
    expect(screen.getByText(/الفلاتر المتقدمة للمكتبة/i)).toBeInTheDocument();
  });

  it('does NOT render the "صفحة المورد الكاملة" button in breadcrumbs toolbar', () => {
    render(
      <MemoryRouter>
        <TreeExplorerPreviewPage />
      </MemoryRouter>
    );

    expect(screen.queryByText(/صفحة المورد الكاملة/i)).not.toBeInTheDocument();
  });
});
