// src/test/ResourceDetails.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ResourceDetails } from '@/views/ResourceDetails';

describe('ResourceDetails Page - Ecosystem Apps in Sidebar', () => {
  it('does NOT render the "التطبيقات المستفيدة" tab as per new specs', () => {
    render(
      <MemoryRouter initialEntries={['/resources/quran-morphology-js']}>
        <Routes>
          <Route path="/resources/:slug" element={<ResourceDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Should find the resource title in the main heading
    expect(screen.getByRole('heading', { level: 1, name: 'مكتبة الصرف والإعراب القرآني' })).toBeInTheDocument();

    // Tab "التطبيقات المستفيدة" must NOT exist
    expect(screen.queryByRole('button', { name: /التطبيقات المستفيدة/i })).not.toBeInTheDocument();
  });

  it('renders sidebar ecosystem apps card with icons in a single row without app name text', () => {
    render(
      <MemoryRouter initialEntries={['/resources/quran-morphology-js']}>
        <Routes>
          <Route path="/resources/:slug" element={<ResourceDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Sidebar card title exists
    expect(screen.getByText(/تطبيقات تعتمد على المورد/i)).toBeInTheDocument();

    // Apps are rendered as crisp icons with alt tags
    expect(screen.getByAltText(/منصة القرآن الكريم العالمية/i)).toBeInTheDocument();

    // Button "عرض تفاصيل التطبيقات" must NOT exist
    expect(screen.queryByRole('button', { name: /عرض تفاصيل التطبيقات/i })).not.toBeInTheDocument();
  });

  it('does NOT render the "مُعتمد في ... تطبيق رائد" badge in the header as per new specs', () => {
    render(
      <MemoryRouter initialEntries={['/resources/quran-morphology-js']}>
        <Routes>
          <Route path="/resources/:slug" element={<ResourceDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/مُعتمد في \d+ تطبيق رائد/i)).not.toBeInTheDocument();
  });
});
