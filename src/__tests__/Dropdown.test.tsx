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
});
