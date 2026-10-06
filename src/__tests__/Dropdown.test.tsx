import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from '@/shared/ui/Dropdown';

const options = [
  { value: 'zayd', label: 'Zayd' },
  { value: 'alpha', label: 'Alpha' },
  { value: 'Mohamed Saleh ben Youssef Bettaieb', label: 'Mohamed Saleh ben Youssef Bettaieb' },
];

function renderDropdown(overrides: Partial<React.ComponentProps<typeof Dropdown>> = {}) {
  const onChange = overrides.onChange ?? vi.fn();
  render(
    <Dropdown
      label="Publishers"
      options={options}
      value={[]}
      direction="ltr"
      onChange={onChange}
      {...overrides}
    />,
  );
  return onChange;
}

describe('Dropdown', () => {
  it('renders the trigger with the provided label and starts closed', () => {
    renderDropdown();

    const trigger = screen.getByRole('button', { name: 'Publishers' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens and displays sorted options when the trigger is clicked', () => {
    renderDropdown();

    fireEvent.click(screen.getByRole('button', { name: 'Publishers' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Alpha',
      'Mohamed Saleh ben Youssef Bettaieb',
      'Zayd',
    ]);
  });

  it('closes the options when the trigger is clicked again', () => {
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'Publishers' });

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('selects an option in single-select mode and closes the dropdown', () => {
    const onChange = renderDropdown();
    fireEvent.click(screen.getByRole('button', { name: 'Publishers' }));

    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));

    expect(onChange).toHaveBeenCalledWith('alpha');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects and deselects options in multiple-select mode', () => {
    const onChange = vi.fn();
    const view = render(
      <Dropdown
        label="Publishers"
        options={options}
        value={[]}
        direction="ltr"
        multiple
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Publishers' }));

    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
    expect(onChange).toHaveBeenLastCalledWith(['alpha']);

    view.rerender(
      <Dropdown
        label="Publishers"
        options={options}
        value={['alpha']}
        direction="ltr"
        multiple
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('shows the selected label in the trigger', () => {
    renderDropdown({ value: ['alpha'] });

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publishers' })).toHaveTextContent('Alpha');
  });

  it('shows a selection count when selected labels exceed the inline limit', () => {
    renderDropdown({
      multiple: true,
      options: options,
      value: ['alpha', 'zayd' , 'Mohamed Saleh ben Youssef Bettaieb'],
      selectionCountLabel: (count) => `${count} publishers selected`,
    });

    expect(screen.getByRole('button', { name: 'Publishers' })).toHaveTextContent(
      '3 publishers selected',
    );
  });

  // ── Dismissal (regression: the open listbox used to stay on screen, visually
  // detached from its trigger, when the page scrolled — Publishers filter) ──
  describe('dismissal', () => {
    function openDropdown() {
      const trigger = screen.getByRole('button', { name: 'Publishers' });
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      return trigger;
    }

    it('closes when the page scrolls while open', () => {
      renderDropdown();
      const trigger = openDropdown();

      fireEvent.scroll(window);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('stays open when the listbox itself scrolls (internal scroll guard)', () => {
      renderDropdown();
      openDropdown();

      fireEvent.scroll(screen.getByRole('listbox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('stays open on pointer press inside the dropdown', () => {
      renderDropdown();
      openDropdown();

      fireEvent.pointerDown(screen.getByRole('listbox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes when pressing outside the dropdown', () => {
      renderDropdown();
      openDropdown();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes on Escape', () => {
      renderDropdown();
      const trigger = openDropdown();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not clear the selection when closing on scroll in multi-select mode', () => {
      const onChange = vi.fn();
      render(
        <Dropdown
          label="Publishers"
          options={options}
          value={['alpha']}
          direction="ltr"
          multiple
          selectionCountLabel={(count) => `${count} publishers selected`}
          onChange={onChange}
        />,
      );
      openDropdown();

      fireEvent.scroll(window);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Publishers' })).toHaveTextContent('Alpha');
    });

    it('re-attaches its dismissal listeners when reopened after closing', () => {
      renderDropdown();
      const trigger = screen.getByRole('button', { name: 'Publishers' });

      // Close via Escape, reopen, then scroll — the second open cycle must
      // still dismiss on scroll (proves listeners are cleaned up per cycle).
      fireEvent.click(trigger);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.scroll(window);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
