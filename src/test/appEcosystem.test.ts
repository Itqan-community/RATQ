// src/test/appEcosystem.test.ts
import { describe, it, expect } from 'vitest';
import {
  ECOSYSTEM_APPS,
  getAppsUsingResource,
  getResourceAppCount,
} from '@/lib/appEcosystem';

describe('App Ecosystem Mapping', () => {
  it('should have ecosystem apps loaded with valid properties', () => {
    expect(ECOSYSTEM_APPS.length).toBeGreaterThanOrEqual(10);
    const ayahApp = ECOSYSTEM_APPS.find((app) => app.id === 'ayah-app');
    expect(ayahApp).toBeDefined();
    expect(ayahApp?.name_ar).toContain('آية');
    expect(ayahApp?.icon_url).toBe('/images/apps/ayah.jpg');
    expect(ayahApp?.used_resource_slugs.length).toBeGreaterThan(0);
  });

  it('should return apps using a specific resource slug', () => {
    const appsUsingMushafHafs = getAppsUsingResource('cms-144');
    expect(appsUsingMushafHafs.length).toBeGreaterThanOrEqual(3);
    const appIds = appsUsingMushafHafs.map((a) => a.id);
    expect(appIds).toContain('ayah-app');
    expect(appIds).toContain('quran-com');
  });

  it('should return apps using a resource font or morphology', () => {
    const appsUsingMorphology = getAppsUsingResource('quran-morphology-js');
    expect(appsUsingMorphology.length).toBeGreaterThanOrEqual(2);
    const appIds = appsUsingMorphology.map((a) => a.id);
    expect(appIds).toContain('tarteel-ai');
    expect(appIds).toContain('quran-com');
  });

  it('should return apps using a resource matched by Arabic name', () => {
    const appsByName = getAppsUsingResource('non-matching-slug', 'المختصر في تفسير القرآن الكريم');
    expect(appsByName.length).toBeGreaterThanOrEqual(1);
    const appIds = appsByName.map((a) => a.id);
    expect(appIds).toContain('ayah-app');
  });

  it('should return an empty array for an unused resource', () => {
    const emptyApps = getAppsUsingResource('unconnected-resource-slug', 'عنوان مورد غير مستخدم');
    expect(emptyApps).toEqual([]);
    expect(getResourceAppCount('unconnected-resource-slug')).toBe(0);
  });

  it('should count apps correctly', () => {
    const count = getResourceAppCount('cms-144');
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
