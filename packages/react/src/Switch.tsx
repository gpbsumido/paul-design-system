import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from './cx';

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  /** Whether the switch is on. Controlled. */
  checked: boolean;
  /** Called with the next value when toggled. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

/**
 * An on/off toggle. Controlled via `checked` + `onCheckedChange`. Exposes
 * role="switch" with aria-checked so assistive tech reads its state. Give it
 * an aria-label (or aria-labelledby) since it has no text of its own.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({ checked, onCheckedChange, disabled, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cx('switch', checked && 'switch--on', className)}
        {...props}
      >
        <span className="switch__thumb" />
      </button>
    );
  },
);
