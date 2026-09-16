import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { FilterPanel, CC_LICENSE_ROWS } from '@/modules/resources/components/FilterPanel';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

let mockSearchParams = new URLSearchParams();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/resources',
  useRouter: () => ({ push: mockPush }),
}));

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

// Helper: decode a URL string into a sorted array of [key, value] pairs so
// repeated params (e.g. ?license=a&license=b) can be asserted order-independently.
function parseParams(url: string): [string, string][] {
  const search = url.includes('?') ? url.split('?')[1] : '';
  return [...new URLSearchParams(search).entries()].sort((a, b) =>
    a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]),
  );
}

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders all 16 type filter buttons with translated labels (including CMS types)', () => {
    renderWithProvider(<FilterPanel />);
    expect(screen.getByRole('button', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recitation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mushaf' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tajweed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Translation' })).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: /Library|SDK|Dataset|API|Tafsir|Audio|PDF|JSON|Recitation|Mushaf|Program|Linguistic|Translation|Font|Search|Tajweed/,
      }),
    ).toHaveLength(16);
  });

  it('renders all 6 CC license checkboxes (rows 5+6 merged into one CC-BY-NC-SA row)', () => {
    renderWithProvider(<FilterPanel />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(CC_LICENSE_ROWS.length); // 6
    expect(CC_LICENSE_ROWS).toHaveLength(6);
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
    // No row should map to CC-BY-NC-4.0 — that licence has no checkbox
    const allValues = CC_LICENSE_ROWS.flatMap((r) => r.values);
    expect(allValues).not.toContain('CC-BY-NC-4.0');
    // No two rows should share a stored value
    expect(allValues.length).toBe(new Set(allValues).size);
  });

  // ── Type filter ────────────────────────────────────────────────────────────

  it('pushes a CMS type filter (e.g. recitation) onto the URL', () => {
    renderWithProvider(<FilterPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Recitation' }));
    expect(mockPush).toHaveBeenCalledWith('/resources?type=recitation', { scroll: false });
  });

  it('pushes a type filter onto the URL when a type is selected', () => {
    renderWithProvider(<FilterPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    expect(mockPush).toHaveBeenCalledWith('/resources?type=library', { scroll: false });
  });

  it('removes the type filter when the active type is clicked again', () => {
    mockSearchParams = new URLSearchParams('type=library');
    renderWithProvider(<FilterPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    expect(mockPush).toHaveBeenCalledWith('/resources?', { scroll: false });
  });

  // ── License filter — multi-select ──────────────────────────────────────────

  it('adds all SPDX values for a CC row as repeated license params when checked', () => {
    // Use the CC BY row (index 1) which maps to ['CC-BY-4.0', 'CC-BY-3.0', 'CC-BY-2.0']
    const ccByRow = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc_by')!;
    renderWithProvider(<FilterPanel />);

    // The checkbox is labelled by the surrounding <label> — query by role
    const checkbox = screen.getAllByRole('checkbox')[
      CC_LICENSE_ROWS.findIndex((r) => r.labelKey === 'cc_by')
    ];
    fireEvent.click(checkbox);

    expect(mockPush).toHaveBeenCalledTimes(1);
    const calledUrl: string = mockPush.mock.calls[0][0];
    const params = parseParams(calledUrl);
    const licenseParams = params.filter(([k]) => k === 'license').map(([, v]) => v);
    // All SPDX values from this row must be present
    ccByRow.values.forEach((v) => expect(licenseParams).toContain(v));
    // No stray params
    expect(params.filter(([k]) => k === 'page')).toHaveLength(0);
  });

  it('combines type and license filters when both are active', () => {
    // Start with type=library already in the URL, then check CC0
    mockSearchParams = new URLSearchParams('type=library');
    const cc0Row = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc0')!;
    renderWithProvider(<FilterPanel />);

    const checkbox = screen.getAllByRole('checkbox')[
      CC_LICENSE_ROWS.findIndex((r) => r.labelKey === 'cc0')
    ];
    fireEvent.click(checkbox);

    const calledUrl: string = mockPush.mock.calls[0][0];
    const params = parseParams(calledUrl);
    expect(params).toContainEqual(['type', 'library']);
    cc0Row.values.forEach((v) => expect(params).toContainEqual(['license', v]));
  });

  it('checking a second license row adds its values without removing the first', () => {
    // Pre-select CC0 values in the URL
    const cc0Row = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc0')!;
    const ccByRow = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc_by')!;
    mockSearchParams = new URLSearchParams(
      cc0Row.values.map((v) => `license=${encodeURIComponent(v)}`).join('&'),
    );
    renderWithProvider(<FilterPanel />);

    // Check CC BY row
    const checkbox = screen.getAllByRole('checkbox')[
      CC_LICENSE_ROWS.findIndex((r) => r.labelKey === 'cc_by')
    ];
    fireEvent.click(checkbox);

    const calledUrl: string = mockPush.mock.calls[0][0];
    const params = parseParams(calledUrl);
    const licenseValues = params.filter(([k]) => k === 'license').map(([, v]) => v);
    cc0Row.values.forEach((v) => expect(licenseValues).toContain(v));
    ccByRow.values.forEach((v) => expect(licenseValues).toContain(v));
  });

  it("unchecking a license row removes only that row's values", () => {
    // Pre-select both CC0 and CC BY values
    const cc0Row = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc0')!;
    const ccByRow = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc_by')!;
    const allPreselected = [...cc0Row.values, ...ccByRow.values];
    mockSearchParams = new URLSearchParams(
      allPreselected.map((v) => `license=${encodeURIComponent(v)}`).join('&'),
    );
    renderWithProvider(<FilterPanel />);

    // Uncheck CC BY row
    const checkbox = screen.getAllByRole('checkbox')[
      CC_LICENSE_ROWS.findIndex((r) => r.labelKey === 'cc_by')
    ];
    fireEvent.click(checkbox);

    const calledUrl: string = mockPush.mock.calls[0][0];
    const params = parseParams(calledUrl);
    const licenseValues = params.filter(([k]) => k === 'license').map(([, v]) => v);
    // CC0 values must still be present
    cc0Row.values.forEach((v) => expect(licenseValues).toContain(v));
    // CC BY values must be gone
    ccByRow.values.forEach((v) => expect(licenseValues).not.toContain(v));
  });

  it('resets the page param when a type filter changes', () => {
    mockSearchParams = new URLSearchParams('page=3');
    renderWithProvider(<FilterPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    expect(mockPush).toHaveBeenCalledWith('/resources?type=library', { scroll: false });
  });

  it('resets the page param when a license filter changes', () => {
    mockSearchParams = new URLSearchParams('page=3');
    renderWithProvider(<FilterPanel />);
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    const calledUrl: string = mockPush.mock.calls[0][0];
    expect(parseParams(calledUrl).filter(([k]) => k === 'page')).toHaveLength(0);
  });

  // ── Clear all — always visible per design ────────────────────────────────

  it('clears all active filters (type + repeated license params) when "Clear all" is clicked', () => {
    const cc0Row = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc0')!;
    mockSearchParams = new URLSearchParams(
      ['type=library', ...cc0Row.values.map((v) => `license=${encodeURIComponent(v)}`)].join('&'),
    );
    renderWithProvider(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(mockPush).toHaveBeenCalledWith('/resources?', { scroll: false });
  });

  it('shows "Clear all" even when no filters are active (always-visible per design)', () => {
    renderWithProvider(<FilterPanel />);
    // The button is always rendered — never conditionally hidden.
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('shows "Clear all" when a type filter is active', () => {
    mockSearchParams = new URLSearchParams('type=library');
    renderWithProvider(<FilterPanel />);
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('shows "Clear all" when only a license filter is active', () => {
    const cc0Row = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc0')!;
    mockSearchParams = new URLSearchParams(
      cc0Row.values.map((v) => `license=${encodeURIComponent(v)}`).join('&'),
    );
    renderWithProvider(<FilterPanel />);
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('checked state reflects pre-selected license values in the URL', () => {
    const ccByRow = CC_LICENSE_ROWS.find((r) => r.labelKey === 'cc_by')!;
    // Only the first SPDX value is in the URL — the whole row should be checked
    mockSearchParams = new URLSearchParams(`license=${encodeURIComponent(ccByRow.values[0])}`);
    renderWithProvider(<FilterPanel />);

    const checkboxes = screen.getAllByRole('checkbox');
    const ccByIndex = CC_LICENSE_ROWS.findIndex((r) => r.labelKey === 'cc_by');
    expect(checkboxes[ccByIndex]).toBeChecked();
    // Other rows must be unchecked
    checkboxes.forEach((cb, i) => {
      if (i !== ccByIndex) expect(cb).not.toBeChecked();
    });
  });
});
