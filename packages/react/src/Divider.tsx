import { type HTMLAttributes } from 'react';
import { cx } from './cx';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: 'horizontal' | 'vertical';
};

/**
 * A thin rule that separates content. Renders an <hr> (implicit
 * role="separator"); pass orientation="vertical" for use inside a flex row.
 */
export function Divider({ orientation = 'horizontal', className, ...props }: DividerProps) {
  return (
    <hr
      className={cx('divider', orientation === 'vertical' && 'divider--vertical', className)}
      aria-orientation={orientation}
      {...props}
    />
  );
}
