export interface DropdownOption {
  value: string;
  label: string;
}

export const MAX_INLINE_LABEL_LENGTH = 40;

export function truncateLabel(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
