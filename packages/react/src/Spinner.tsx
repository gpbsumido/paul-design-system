import { type HTMLAttributes } from 'react';
import { cx } from './cx';

type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name announced to screen readers. Defaults to "Loading". */
  label?: string;
};

/**
 * An indeterminate loading spinner. Renders as a live status region so
 * assistive tech announces that something is loading.
 */
export function Spinner({ size, label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx('spinner', size && size !== 'md' && `spinner--${size}`, className)}
      {...props}
    />
  );
}
