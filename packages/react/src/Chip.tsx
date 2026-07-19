import type { HTMLAttributes, MouseEvent, CSSProperties } from 'react';
import { cx } from './cx';

type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> & {
  label: string;
  /** Background color (any CSS color). Text flips to white when set. */
  color?: string;
  size?: 'sm' | 'md';
  /** Stretch to fill the container (e.g. a grid cell). */
  fullWidth?: boolean;
  clickable?: boolean;
  removable?: boolean;
  /** When set, the label becomes a real button. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onRemove?: () => void;
  title?: string;
};

export function Chip({
  label,
  color,
  size,
  fullWidth,
  clickable,
  removable,
  onClick,
  onRemove,
  title,
  className,
  ...props
}: ChipProps) {
  const showRemove = removable || !!onRemove;
  const interactive = clickable || !!onClick;

  const classes = cx(
    'chip',
    size && size !== 'md' && `chip--${size}`,
    interactive && 'chip--clickable',
    showRemove && 'chip--removable',
    fullWidth && 'chip--full-width',
    className,
  );

  const style: CSSProperties | undefined = color
    ? { backgroundColor: color, color: '#fff' }
    : undefined;

  const remove = showRemove ? (
    <button
      type="button"
      className="chip__remove"
      aria-label={`Remove ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        onRemove?.();
      }}
    >
      <span aria-hidden="true">&times;</span>
    </button>
  ) : null;

  // A clickable chip puts the label in its own button so it's keyboard
  // reachable, with the remove button as a sibling (no button-in-button).
  if (onClick) {
    return (
      <span className={classes} style={style} title={title} {...props}>
        <button type="button" className="chip__label" onClick={onClick}>
          {label}
        </button>
        {remove}
      </span>
    );
  }

  return (
    <span className={classes} style={style} title={title} {...props}>
      {label}
      {remove}
    </span>
  );
}
