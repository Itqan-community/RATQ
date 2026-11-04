// src/test/QuranicRoadmap.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuranicRoadmapPage } from '@/pages/QuranicRoadmap';

describe('QuranicRoadmapPage Component', () => {
  it('renders page header, total resources card, smart wizard button, and methodology guide', () => {
    render(
      <MemoryRouter>
        <QuranicRoadmapPage />
      </MemoryRouter>
    );

    // Verify Title & Breadcrumb
    expect(screen.getByText(/خريطة طريق المطور القرآني التفاعلية/i)).toBeInTheDocument();
    expect(screen.getByText(/مسار المطور/i)).toBeInTheDocument();

    // Verify "إجمالي الموارد المشمولة:" card
    expect(screen.getByText(/إجمالي الموارد المشمولة:/i)).toBeInTheDocument();

    // Verify Smart Wizard button next to the total resources card
    expect(screen.getByRole('button', { name: /المعالج الذكي لتحديد مسارك/i })).toBeInTheDocument();

    // Verify Methodology Guide button
    expect(screen.getByRole('button', { name: /دليل منهجية وفلسفة بناء المراحل/i })).toBeInTheDocument();
  });

  it('opens Smart Wizard modal, completes the steps, and applies the diagnosed track', () => {
    render(
      <MemoryRouter>
        <QuranicRoadmapPage />
      </MemoryRouter>
    );

    // Initial state: no track banner
    expect(screen.queryByText(/المسار المعتمد عبر المعالج:/i)).not.toBeInTheDocument();

    // Open Smart Wizard
    const wizardTriggerBtn = screen.getByRole('button', { name: /المعالج الذكي لتحديد مسارك/i });
    fireEvent.click(wizardTriggerBtn);

    // Step 1: Project Type
    expect(screen.getByText(/معالج توليد المسار القرآني المخصص/i)).toBeInTheDocument();
    expect(screen.getByText(/ما هو نوع المشروع القرآني الذي تسعى لبنائه وتطويره؟/i)).toBeInTheDocument();

    // Pick AI project
    const aiOption = screen.getByText(/نظام ذكاء اصطناعي وتسميع أو بحث دلالي/i);
    fireEvent.click(aiOption);

    // Step 2: Tech Stack
    expect(screen.getByText(/ما هي بيئة العمل أو إطار البرمجة الأساسي المفضل لديك؟/i)).toBeInTheDocument();
    const pythonOption = screen.getByText(/Python \/ PyTorch \/ AI/i);
    fireEvent.click(pythonOption);

    // Step 3: Priority
    expect(screen.getByText(/ما هي أولويتك ومستواك في التعامل مع التقنيات القرآنية؟/i)).toBeInTheDocument();
    const readyOption = screen.getByText(/لدي مشروع قائم وأريد حزم ومكتبات إنتاجية جاهزة/i);
    fireEvent.click(readyOption);

    // Step 4: Result recommendation
    expect(screen.getByText(/تطابق بنسبة 98%/i)).toBeInTheDocument();
    expect(screen.queryByText(/التقدير الزمني/i)).not.toBeInTheDocument();
    const applyBtn = screen.getByRole('button', { name: /اعتماد هذا المسار وتطبيقه على الخارطة الآن/i });
    expect(applyBtn).toBeInTheDocument();

    // Apply track
    fireEvent.click(applyBtn);

    // Wizard modal should be closed
    expect(screen.queryByText(/معالج توليد المسار القرآني المخصص/i)).not.toBeInTheDocument();

    // Applied track banner should now be visible
    expect(screen.getByText(/المسار المعتمد عبر المعالج:/i)).toBeInTheDocument();
    expect(screen.getByText(/مسار مهندس الذكاء الاصطناعي واللغويات/i)).toBeInTheDocument();

    // Test reset button
    const resetBtn = screen.getByText(/عرض كافة المراحل \(إعادة ضبط\)/i);
    fireEvent.click(resetBtn);

    // Reset should remove the indicator banner
    expect(screen.queryByText(/المسار المعتمد عبر المعالج:/i)).not.toBeInTheDocument();
  });

  it('closes Smart Wizard modal when clicking outside on the backdrop', () => {
    render(
      <MemoryRouter>
        <QuranicRoadmapPage />
      </MemoryRouter>
    );

    // Open Smart Wizard
    const wizardTriggerBtn = screen.getByRole('button', { name: /المعالج الذكي لتحديد مسارك/i });
    fireEvent.click(wizardTriggerBtn);

    // Modal is open
    expect(screen.getByText(/معالج توليد المسار القرآني المخصص/i)).toBeInTheDocument();

    // Click outside backdrop
    const backdrop = screen.getByTestId('quiz-modal-backdrop');
    fireEvent.click(backdrop);

    // Modal is closed
    expect(screen.queryByText(/معالج توليد المسار القرآني المخصص/i)).not.toBeInTheDocument();
  });
});
