import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';

/** Layout effect on the client, a no-op-safe effect on the server (SSR). */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type GuidedTourStep = {
  /** Id of the element to spotlight. Omit for a centred card (an intro step). */
  target?: string;
  title: string;
  body: ReactNode;
  /**
   * Run when this step becomes active — switch a tab, scroll a panel into view,
   * anything the step needs set up before its target is measured. Fired from the
   * navigation handler, so a tab switch has rendered before the spotlight reads
   * the target's box.
   */
  onEnter?: () => void;
};

type GuidedTourLabels = {
  back?: string;
  next?: string;
  skip?: string;
  finish?: string;
};

type GuidedTourProps = {
  open: boolean;
  steps: GuidedTourStep[];
  /** Skipped, dismissed (Escape), or finished — the tour should close. */
  onClose: () => void;
  /** Reached the end and pressed the finish control. Fires before `onClose`. */
  onFinish?: () => void;
  /** Accessible name for the dialog. */
  'aria-label'?: string;
  /** Override the control labels. */
  labels?: GuidedTourLabels;
  className?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Size = { width: number; height: number };

/**
 * Keep the whole card on screen. Pin it under the target when it fits there,
 * flip above when it doesn't, then clamp both axes to the viewport using the
 * card's measured size — so on a small (mobile) screen it never spills past an
 * edge and forces a scrollbar. Centres when there's no target (an intro step).
 * `card` is {0,0} until measured; the fallbacks match the CSS width and a
 * typical height so the first paint is close before the real size lands.
 */
export function cardStyle(rect: DOMRect | null, card: Size, viewport: Size): CSSProperties {
  if (!rect) {
    return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
  const margin = 12;
  const width = card.width || 336;
  const height = card.height || 220;
  const belowTop = rect.bottom + margin;
  const aboveTop = rect.top - height - margin;
  const fitsBelow = belowTop + height + margin <= viewport.height;
  const preferredTop = fitsBelow ? belowTop : aboveTop >= margin ? aboveTop : belowTop;
  return {
    position: 'fixed',
    top: Math.max(margin, Math.min(preferredTop, viewport.height - height - margin)),
    left: Math.max(margin, Math.min(rect.left, viewport.width - width - margin)),
  };
}

/**
 * A click-through guided tour. It walks `steps` one at a time, dimming the page
 * and spotlighting each step's target element (measured live, so it tracks
 * scroll and resize), with a card that pins near the target or centres when a
 * step has none. Portals to the body, traps focus, and closes on Escape — the
 * same shell as Modal. Purely presentational: the host owns `open` and decides
 * what a finish or skip does.
 */
export function GuidedTour({
  open,
  steps,
  onClose,
  onFinish,
  'aria-label': ariaLabel = 'Guided tour',
  labels,
  className,
}: GuidedTourProps) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [cardSize, setCardSize] = useState<Size>({ width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const current = steps[index];
  const isLast = index === steps.length - 1;

  // Start each opening at the first step. Deferred so the effect never sets
  // state synchronously (the codebase's rule for motion-driven components).
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setIndex(0));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Fire the first step's onEnter as the tour opens (later steps fire from the
  // navigation handler). Runs the consumer's callback, never this component's
  // own setState, so it's clear of the set-state-in-effect rule.
  useEffect(() => {
    if (open) steps[0]?.onEnter?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Measure the current target and keep the spotlight on it through scroll and
  // resize. Non-target steps (and a closed tour) clear the rect.
  useEffect(() => {
    if (!open) return;
    const target = current?.target;
    const measure = () => {
      const el = target ? document.getElementById(target) : null;
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, current?.target]);

  // Measure the card so its position can be clamped to the viewport (a tall card
  // on a small screen would otherwise spill past an edge). Runs before paint, so
  // the clamped position lands without a flash. Only updates on a real size
  // change, so it can't loop with the reposition it drives.
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const el = cardRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setCardSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  }, [open, index, rect]);

  // Focus the card on open, restore focus on close, and trap Tab + handle
  // Escape while it's up.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => cardRef.current?.focus());

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const card = cardRef.current;
      if (e.key !== 'Tab' || !card) return;
      const focusables = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  // No document on the server, and the overlay portals to it — render nothing
  // there rather than reaching createPortal(document.body). A host that opens
  // the tour during SSR then gets a clean no-op instead of a crash.
  if (!open || !current || typeof document === 'undefined') return null;

  const go = (target: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, target));
    steps[clamped]?.onEnter?.();
    setIndex(clamped);
  };
  const back = () => go(index - 1);
  const next = () => {
    if (isLast) {
      onFinish?.();
      onClose();
    } else {
      go(index + 1);
    }
  };

  const spotlight: CSSProperties | undefined = rect
    ? {
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }
    : undefined;

  return createPortal(
    <div className="tour" role="presentation">
      {spotlight ? (
        <div className="tour__spotlight" style={spotlight} aria-hidden />
      ) : (
        <div className="tour__backdrop" aria-hidden />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        style={cardStyle(rect, cardSize, {
          width: window.innerWidth,
          height: window.innerHeight,
        })}
        className={cx('tour__card', className)}
      >
        <p className="tour__step">
          Step {index + 1} of {steps.length}
        </p>
        <h2 className="tour__title">{current.title}</h2>
        <div className="tour__body">{current.body}</div>

        <div className="tour__actions">
          <button type="button" className="tour__skip" onClick={onClose}>
            {labels?.skip ?? 'Skip'}
          </button>
          {index > 0 && (
            <button type="button" className="tour__back" onClick={back}>
              {labels?.back ?? 'Back'}
            </button>
          )}
          <button type="button" className="tour__next" onClick={next}>
            {isLast ? labels?.finish ?? 'Finish' : labels?.next ?? 'Next'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
