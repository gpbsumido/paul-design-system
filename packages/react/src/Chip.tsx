import type { HTMLAttributes } from 'react';
import { cx } from './cx';

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  size?: 'sm' | 'md';
  clickable?: boolean;
  removable?: boolean;
  onRemove?: () => void;
};

export function Chip({
  label,
  size,
  clickable,
  removable,
  onClick,
  onRemove,
  className,
  ...props
}: ChipProps) {
  return (
    <span
      className={cx(
        'chip',
        size && size !== 'md' && `chip--${size}`,
        clickable && 'chip--clickable',
        removable && 'chip--removable',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {label}
      {removable && (
        <button
          type="button"
          className="chip__remove"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        />
      )}
    </span>
  );
}
