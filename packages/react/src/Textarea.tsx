import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cx } from './cx';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
};

/**
 * Multi-line text field. Mirrors Input's label/error/helper API so the two
 * feel the same in a form.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, helper, disabled, className, ...props }, ref) {
    const id = useId();
    const helperId = `${id}-helper`;
    const helperText = error || helper;

    return (
      <div className="input__wrapper">
        {label && (
          <label className="input__label" htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cx('textarea', error && 'textarea--error', className)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={helperText ? helperId : undefined}
          {...props}
        />
        {helperText && (
          <span
            id={helperId}
            className={cx('input__helper', error && 'input__helper--error')}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
