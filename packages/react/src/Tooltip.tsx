import {
  useState,
  useRef,
  useCallback,
  useId,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { cx } from './cx';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  /** Content shown in the floating label. Text or rich nodes. */
  content: ReactNode;
  side?: TooltipSide;
  /** Delay before showing, in ms. Avoids flashing on a quick mouse pass. */
  delay?: number;
  /** Max width of the bubble in px. */
  maxWidth?: number;
  children: ReactNode;
};

const GAP = 8;

/**
 * A tooltip that renders at a fixed screen position, so it's never clipped by
 * an overflow:hidden ancestor (grids, cards, chips) and needs no portal. Shows
 * on hover and focus after `delay` ms; Escape dismisses it.
 */
export function Tooltip({ content, side = 'top', delay = 500, maxWidth, children }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (el: HTMLElement) => {
      setRect(el.getBoundingClientRect());
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(true), delay);
    },
    [delay],
  );

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  const style: CSSProperties | undefined = rect
    ? { position: 'fixed', ...place(rect, side), maxWidth }
    : undefined;

  return (
    <span
      className="tooltip__anchor"
      style={{ display: 'inline-flex' }}
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={hide}
      onFocus={(e) => show(e.currentTarget)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && visible) hide();
      }}
      aria-describedby={visible ? id : undefined}
    >
      {children}
      {visible && rect && (
        <span
          id={id}
          role="tooltip"
          className={cx('tooltip', `tooltip--${side}`, 'tooltip--visible')}
          style={style}
        >
          {content}
        </span>
      )}
    </span>
  );
}

/** Screen coordinates + transform to anchor the bubble on a side of the rect. */
function place(rect: DOMRect, side: TooltipSide): CSSProperties {
  switch (side) {
    case 'bottom':
      return {
        left: rect.left + rect.width / 2,
        top: rect.bottom + GAP,
        transform: 'translateX(-50%)',
      };
    case 'left':
      return {
        left: rect.left - GAP,
        top: rect.top + rect.height / 2,
        transform: 'translate(-100%, -50%)',
      };
    case 'right':
      return {
        left: rect.right + GAP,
        top: rect.top + rect.height / 2,
        transform: 'translateY(-50%)',
      };
    case 'top':
    default:
      return {
        left: rect.left + rect.width / 2,
        top: rect.top - GAP,
        transform: 'translate(-50%, -100%)',
      };
  }
}
