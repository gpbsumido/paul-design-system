import { cx } from './cx';

type TypingDotsProps = {
  /** Announced to screen readers; the dots themselves are decorative. */
  label?: string;
  className?: string;
};

/**
 * A three-dot "typing" indicator for chat surfaces. The animation is purely
 * visual and hidden from assistive tech; the `label` carries the meaning and is
 * exposed through a polite live region.
 */
export function TypingDots({ label = 'Typing…', className }: TypingDotsProps) {
  return (
    <span role="status" aria-label={label} className={cx('typing-dots', className)}>
      <span className="typing-dots__dots" aria-hidden="true">
        <span className="typing-dots__dot" />
        <span className="typing-dots__dot" />
        <span className="typing-dots__dot" />
      </span>
    </span>
  );
}
