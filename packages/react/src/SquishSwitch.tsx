import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type SquishSwitchProps = {
  /** Whether the switch is on. */
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible label for the switch. */
  label: string;
  className?: string;
};

/**
 * A toggle whose thumb squishes as it slides across, and that compresses on
 * press — the springy, tactile feel of a physical switch. A real `role="switch"`
 * button, so it's keyboard-operable and announces its state. Under
 * prefers-reduced-motion the squish and slide are dropped; the state still flips.
 */
export function SquishSwitch({
  checked,
  onChange,
  label,
  className,
}: SquishSwitchProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'squish-switch',
        checked && 'squish-switch--on',
        reduced && 'squish-switch--static',
        className,
      )}
    >
      <span aria-hidden="true" className="squish-switch__thumb" />
    </button>
  );
}
