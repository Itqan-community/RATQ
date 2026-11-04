// src/test/BranchedMenu.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BranchedMenu, BranchedMenuItem } from '@/components/ui/BranchedMenu';
import { FileCode, BookOpen } from 'lucide-react';

const mockItems: BranchedMenuItem[] = [
  {
    label: 'مجلد النصوص',
    value: 'root_text',
    children: [
      { value: 'sub_uthmani', label: 'الرسم العثماني', icon: BookOpen, badge: 5 },
      { value: 'sub_fonts', label: 'خطوط المصحف', icon: FileCode, badge: 3 },
    ],
  },
  {
    label: 'مجلد البرمجيات',
    value: 'root_dev',
    children: [
      { value: 'sub_js', label: 'حزم جافاسكربت', icon: FileCode, badge: 8 },
    ],
  },
];

describe('BranchedMenu Component', () => {
  it('renders root section heads and default open section with SVG curves', () => {
    const { container } = render(
      <BranchedMenu items={mockItems} defaultOpen={0} defaultActive="sub_uthmani" isRtl={true} />
    );

    expect(screen.getByText('مجلد النصوص')).toBeInTheDocument();
    expect(screen.getByText('مجلد البرمجيات')).toBeInTheDocument();

    // Default open section children are rendered
    expect(screen.getByText('الرسم العثماني')).toBeInTheDocument();
    expect(screen.getByText('خطوط المصحف')).toBeInTheDocument();

    // SVG branch lines exist
    const svg = container.querySelector('svg.branched-menu__lines');
    expect(svg).toBeInTheDocument();
  });

  it('triggers onSelect when clicking a child item', () => {
    const handleSelect = vi.fn();
    render(
      <BranchedMenu
        items={mockItems}
        defaultOpen={0}
        defaultActive="sub_uthmani"
        onSelect={handleSelect}
      />
    );

    const childBtn = screen.getByText('خطوط المصحف');
    fireEvent.click(childBtn);

    expect(handleSelect).toHaveBeenCalledWith('sub_fonts', expect.objectContaining({ value: 'sub_fonts' }));
  });

  it('toggles section when clicking section head', () => {
    const handleToggle = vi.fn();
    render(
      <BranchedMenu
        items={mockItems}
        defaultOpen={0}
        onToggle={handleToggle}
      />
    );

    const devFolder = screen.getByText('مجلد البرمجيات');
    fireEvent.click(devFolder);

    expect(handleToggle).toHaveBeenCalledWith(1, true);
  });
});
