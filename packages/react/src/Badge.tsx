import type { ReactNode } from 'react';
import { cx } from './cx';

type BadgeProps = {
  variant?: 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
  /** Renders the badge as a spiky starburst seal (for "new"/"beta" flags). */
  starburst?: boolean;
  children?: ReactNode;
};

export function Badge({ variant, dot, starburst, children }: BadgeProps) {
  return (
    <span
      className={cx(
        'badge',
        variant && `badge--${variant}`,
        dot && 'badge--dot',
        starburst && 'badge--starburst',
      )}
    >
      {children}
    </span>
  );
}
