import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useId,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { cx } from './cx';

/** Layout effect on the client, a no-op-safe effect on the server (SSR). */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  /** Content shown in the floating label. Text or rich nodes. */
  content: ReactNode;
  side?: TooltipSide;
  /** Delay before showing, in ms. Avoids flashing on a quick mouse pass. */
  delay?: number;
  /** Max width of the bubble in px. */
  maxWidth?: number;
  /**
   * Stretch the anchor to fill its container instead of shrinking to the
   * trigger's content. Use when the tooltip wraps a full-size element (a grid
   * cell, a full-width chip) so the layout isn't collapsed to content width.
   */
  fill?: boolean;
  children: ReactNode;
};

const GAP = 8;

/**
 * A tooltip that renders at a fixed screen position, so it's never clipped by
 * an overflow:hidden ancestor (grids, cards, chips) and needs no portal. Shows
 * on hover and focus after `delay` ms; Escape dismisses it.
 */
export function Tooltip({
  content,
  side = 'top',
  delay = 500,
  maxWidth,
  fill = false,
  children,
}: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [nudge, setNudge] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the bubble on screen. It's positioned off the trigger's rect, so near a
  // screen edge it can spill past the viewport and force a scrollbar on mobile.
  // Measure the rendered bubble (after its transform) and nudge it back inside.
  // left/top are fixed screen coords, so shifting them by the overflow shifts the
  // final position by the same amount. Runs before paint, so there's no flash.
  useIsomorphicLayoutEffect(() => {
    if (!visible || !rect) return;
    const el = bubbleRef.current;
    if (!el || typeof window === 'undefined') return;
    // `hide` clears the nudge, so on each show the bubble is measured at its base
    // position — one correction per show, and the effect doesn't depend on the
    // nudge it sets, so it can't loop (which matters in jsdom, where a measured
    // rect never reflects the applied style).
    setNudge(
      viewportNudge(el.getBoundingClientRect(), { x: 0, y: 0 }, {
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    );
  }, [visible, rect, side]);

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
    setNudge({ x: 0, y: 0 });
  }, []);

  const placed = rect ? place(rect, side) : null;
  const style: CSSProperties | undefined = placed
    ? {
        position: 'fixed',
        ...placed,
        left: (placed.left as number) + nudge.x,
        top: (placed.top as number) + nudge.y,
        // Never wider than the screen, so a wide bubble can't overflow on its own.
        maxWidth: maxWidth ? `min(${maxWidth}px, calc(100vw - 1rem))` : undefined,
      }
    : undefined;

  return (
    <span
      className="tooltip__anchor"
      style={
        fill
          ? { display: 'inline-flex', width: '100%', height: '100%' }
          : { display: 'inline-flex' }
      }
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
          ref={bubbleRef}
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

type Edges = { left: number; right: number; top: number; bottom: number };

/**
 * How far to shift the bubble to bring it fully inside the viewport. `box` is the
 * measured (already-shifted) rect and `applied` the shift currently on it, so the
 * base position is `box - applied`; the returned nudge clamps that base to a
 * margin inside the viewport. On-screen already → {0,0}.
 */
export function viewportNudge(
  box: Edges,
  applied: { x: number; y: number },
  viewport: { width: number; height: number },
  margin = 8,
): { x: number; y: number } {
  const left = box.left - applied.x;
  const right = box.right - applied.x;
  const top = box.top - applied.y;
  const bottom = box.bottom - applied.y;
  let x = 0;
  let y = 0;
  if (left < margin) x = margin - left;
  else if (right > viewport.width - margin) x = viewport.width - margin - right;
  if (top < margin) y = margin - top;
  else if (bottom > viewport.height - margin) y = viewport.height - margin - bottom;
  return { x, y };
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
