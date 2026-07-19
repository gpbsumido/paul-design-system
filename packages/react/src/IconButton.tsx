import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required: describes the action for screen readers, since the button
   *  holds only an icon. */
  'aria-label': string;
  size?: 'sm' | 'md';
  children: ReactNode;
};

/**
 * A square, icon-only button. Always needs an aria-label because there's no
 * visible text to name it.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ size, className, children, type, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cx('icon-btn', size && size !== 'md' && `icon-btn--${size}`, className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
