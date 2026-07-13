export const zIndex = {
  base: '0',
  dropdown: '10',
  sticky: '20',
  fixed: '30',
  'modal-backdrop': '40',
  modal: '50',
  popover: '60',
  toast: '70',
} as const;

export type ZIndex = typeof zIndex;
