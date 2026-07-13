import type { ReactNode } from 'react';
import { cx } from './cx';

type BadgeProps = {
  variant?: 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
  children?: ReactNode;
};

export function Badge({ variant, dot, children }: BadgeProps) {
  return (
    <span
      className={cx(
        'badge',
        variant && `badge--${variant}`,
        dot && 'badge--dot',
      )}
    >
      {children}
    </span>
  );
}
