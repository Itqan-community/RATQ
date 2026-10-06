'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MAX_INLINE_LABEL_LENGTH,
  truncateLabel,
  type DropdownOption,
} from './dropdown-helpers';

export type { DropdownOption } from './dropdown-helpers';

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string[];
  direction: 'ltr' | 'rtl';
  multiple?: boolean;
  selectionCountLabel?: (count: number) => string;
  onChange: (value: string | string[]) => void;
}

export function Dropdown({
  label,
  options,
  value,
  direction,
  multiple = false,
  selectionCountLabel,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orderedOptions = [...options].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const selectedOptions = orderedOptions.filter((option) => selectedValues.includes(option.value));

  // Dismiss the open listbox on outside press, Escape, or scroll outside the
  // dropdown. The listbox itself is overflow-y-auto, so scrolling *inside* it
  // must not close the dropdown — events whose target stays within the
  // container are ignored. Listeners are attached only while open and removed
  // on close/unmount, so no global listener leaks.
  useEffect(() => {
    if (!open) return;

    function isInsideContainer(target: EventTarget | null) {
      return target instanceof Node && containerRef.current?.contains(target);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!isInsideContainer(event.target)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    // Page/ancestor scroll bubbles to window; the listbox's internal scroll
    // bubbles too but its target is inside the container, so it is guarded.
    function handleScroll(event: Event) {
      if (!isInsideContainer(event.target)) setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  function toggleOption(optionValue: string) {
    if (!multiple) {
      onChange(optionValue);
      setOpen(false);
      return;
    }

    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
      : [...selectedValues, optionValue];
    onChange(nextValues);
  }

  const joinedLabel = selectedOptions.map((option) => option.label).join(', ');
  const shouldShowCount = selectedOptions.length > 1 && joinedLabel.length > MAX_INLINE_LABEL_LENGTH;

  let triggerLabel = truncateLabel(label, MAX_INLINE_LABEL_LENGTH); // default text shown when nothing is selected
  if (selectedOptions.length > 0) {
    triggerLabel = shouldShowCount
      ? selectionCountLabel?.(selectedOptions.length) ?? `${selectedOptions.length} selected`
      : truncateLabel(joinedLabel, MAX_INLINE_LABEL_LENGTH);
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0" dir={direction}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex h-10 w-full min-w-0 max-w-full items-center justify-between gap-3 overflow-hidden rounded-lg border border-[#d0d0d0] bg-white px-3 text-sm outline-none transition hover:border-[#a8a8a8] focus:border-black focus:ring-2 focus:ring-black/10"
      >
        <span
          className={`min-w-0 flex-1 truncate text-start ${selectedOptions.length > 0 ? 'text-[#3a3a3a]' : 'text-[#8b8b8b]'}`}
          title={selectedOptions.length > 0 ? joinedLabel : label}
          dir="auto"
        >
          {triggerLabel}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#8b8b8b] transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-x-hidden overflow-y-auto rounded-lg border border-[#e2e2e2] bg-white p-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
          style={{ scrollbarGutter: 'stable' }}
          role="listbox"
          aria-label={label}
          dir={direction}
        >
          {orderedOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleOption(option.value)}
                className={`flex h-9 w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 text-start text-sm transition-colors ${
                  isSelected ? 'bg-[#f0f0f0] text-black' : 'text-[#3a3a3a] hover:bg-[#f4f4f4]'
                }`}
              >
                {multiple && (
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected ? 'border-black bg-black text-white' : 'border-[#bdbdbd] bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && <span className="text-[10px] leading-none">✓</span>}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate" title={option.label} dir="auto">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
