import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cx } from './cx';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  error?: string;
  helper?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, helper, size, disabled, className, ...props }, ref) {
    const id = useId();
    const helperId = `${id}-helper`;
    const helperText = error || helper;

    return (
      <div className="input__wrapper">
        {label && <label className="input__label" htmlFor={id}>{label}</label>}
        <input
          ref={ref}
          id={id}
          className={cx('input', size && size !== 'md' && `input--${size}`, error && 'input--error', className)}
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
