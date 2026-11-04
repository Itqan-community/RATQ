import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ResourceAppBadges } from '@/components/resources/ResourceAppBadges';
import { EcosystemApp } from '@/types';

const mockApps: EcosystemApp[] = [
  {
    id: 'app-1',
    name_ar: 'تطبيق آية',
    name_en: 'Ayah App',
    icon_url: '/images/apps/ayah.jpg',
    app_type: 'mushaf',
    used_resource_slugs: ['cms-144'],
  },
  {
    id: 'app-2',
    name_ar: 'تطبيق ترتيل',
    name_en: 'Tarteel AI',
    icon_url: '/images/apps/tarteel.jpg',
    app_type: 'ai',
    used_resource_slugs: ['cms-144'],
  },
  {
    id: 'app-3',
    name_ar: 'منصة قرآن.كوم',
    name_en: 'Quran.com',
    icon_url: '/images/apps/quran-com.jpg',
    app_type: 'web',
    used_resource_slugs: ['cms-144'],
  },
  {
    id: 'app-4',
    name_ar: 'تطبيق وَحي',
    name_en: 'Wahy App',
    icon_url: '/images/apps/wahy.png',
    app_type: 'mushaf',
    used_resource_slugs: ['cms-144'],
  },
  {
    id: 'app-5',
    name_ar: 'تطبيق ماهر',
    name_en: 'Maher App',
    icon_url: '/images/apps/maher.png',
    app_type: 'ai',
    used_resource_slugs: ['cms-144'],
  },
];

describe('ResourceAppBadges Component', () => {
  it('renders nothing when apps array is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <ResourceAppBadges apps={[]} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders app icons when apps are provided', () => {
    render(
      <MemoryRouter>
        <ResourceAppBadges apps={mockApps.slice(0, 2)} />
      </MemoryRouter>
    );

    expect(screen.getByText('مُعتمد في:')).toBeInTheDocument();
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(2);
    expect(imgs[0]).toHaveAttribute('alt', 'تطبيق آية');
    expect(imgs[1]).toHaveAttribute('alt', 'تطبيق ترتيل');
  });

  it('renders overflow counter when apps exceed maxDisplay', () => {
    render(
      <MemoryRouter>
        <ResourceAppBadges apps={mockApps} maxDisplay={3} />
      </MemoryRouter>
    );

    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(3);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders up to 6 apps by default and shows +N overflow badge', () => {
    const elevenApps: EcosystemApp[] = Array.from({ length: 11 }, (_, i) => ({
      id: `app-${i + 1}`,
      name_ar: `تطبيق ${i + 1}`,
      name_en: `App ${i + 1}`,
      icon_url: `/images/apps/ayah.jpg`,
      app_type: 'mushaf',
      used_resource_slugs: ['cms-144'],
    }));

    render(
      <MemoryRouter>
        <ResourceAppBadges apps={elevenApps} />
      </MemoryRouter>
    );

    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(6);
    expect(screen.getByText('+5')).toBeInTheDocument();
  });
});
