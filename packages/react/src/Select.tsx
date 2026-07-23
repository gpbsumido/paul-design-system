import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cx } from './cx';

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string;
  error?: string;
  helper?: string;
  size?: 'sm' | 'md';
  /**
   * `vertical` (default) stacks the label above the control, matching the
   * input field family. `horizontal` puts the label inline to the left, for
   * compact filter rows (see `FilterBar`).
   */
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
};

/**
 * A labelled, accessible `<select>` that shares the input styling and paints
 * its own chevron (the native one is hidden for cross-browser consistency).
 * When rendered without a visible `label`, pass an `aria-label` so the control
 * still has an accessible name.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, helper, size, orientation = 'vertical', disabled, className, children, ...props },
    ref,
  ) {
    const id = useId();
    const helperId = `${id}-helper`;
    const helperText = error || helper;

    return (
      <div className={cx('select__wrapper', orientation === 'horizontal' && 'select__wrapper--horizontal')}>
        {label && <label className="select__label" htmlFor={id}>{label}</label>}
        <select
          ref={ref}
          id={id}
          className={cx('select', size && size !== 'md' && `select--${size}`, error && 'select--error', className)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={helperText ? helperId : undefined}
          {...props}
        >
          {children}
        </select>
        {helperText && (
          <span
            id={helperId}
            className={cx('select__helper', error && 'select__helper--error')}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
