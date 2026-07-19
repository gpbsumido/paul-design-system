import {
  forwardRef,
  useId,
  useState,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from './cx';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helper?: string;
  /** Visually hide the label while keeping it available to screen readers. */
  hideLabel?: boolean;
  /** Show a live "used / max" character count. Needs maxLength to be set. */
  showCount?: boolean;
  disabled?: boolean;
};

/**
 * Multi-line text field. Mirrors Input's label/error/helper API, and adds an
 * optional hidden label, a required marker, and a live character counter when
 * paired with maxLength.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      helper,
      hideLabel = false,
      showCount = false,
      required,
      disabled,
      maxLength,
      value,
      defaultValue,
      onChange,
      className,
      ...props
    },
    ref,
  ) {
    const id = useId();
    const helperId = `${id}-helper`;
    const countId = `${id}-count`;
    const helperText = error || helper;

    // Count is derived from a controlled value, or tracked locally otherwise.
    const controlled = value !== undefined;
    const [localCount, setLocalCount] = useState(
      () => String(defaultValue ?? '').length,
    );
    const count = controlled ? String(value ?? '').length : localCount;
    const withCount = showCount && maxLength != null;

    const describedBy =
      [helperText ? helperId : null, withCount ? countId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="input__wrapper">
        {label && (
          <label className={hideLabel ? 'sr-only' : 'input__label'} htmlFor={id}>
            {label}
            {required && (
              <span aria-hidden="true"> *</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cx('textarea', error && 'textarea--error', className)}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            if (!controlled) setLocalCount(e.target.value.length);
            onChange?.(e);
          }}
          {...props}
        />
        {withCount && (
          <span id={countId} className="textarea__count" aria-live="polite">
            {count} / {maxLength}
          </span>
        )}
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
