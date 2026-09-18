import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Burst = { id: number; x: number; y: number };

type ClickSparkProps = {
  children: ReactNode;
  /** How many rays fly out per burst. */
  count?: number;
  className?: string;
};

/**
 * A ring of rays bursts outward from the press point, then clears itself when
 * the animation ends. Wrap it around a control — it doesn't intercept the
 * child's own click, it only decorates the press. Under prefers-reduced-motion
 * nothing is spawned.
 */
export function ClickSpark({ children, count = 8, className }: ClickSparkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // A monotonic id keeps React keys stable without a clock or randomness.
  const seq = useRef(0);
  const reduced = usePrefersReducedMotion();
  const [bursts, setBursts] = useState<Burst[]>([]);

  const spawn = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    seq.current += 1;
    setBursts((prev) => [
      ...prev,
      { id: seq.current, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
  };

  const clear = (id: number) =>
    setBursts((prev) => prev.filter((burst) => burst.id !== id));

  return (
    <span ref={ref} className={cx('click-spark', className)} onPointerDown={spawn}>
      {children}
      {bursts.map((burst) => (
        <span
          key={burst.id}
          aria-hidden="true"
          className="click-spark__burst"
          style={{ left: burst.x, top: burst.y }}
          onAnimationEnd={() => clear(burst.id)}
        >
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className="click-spark__ray"
              style={
                { '--paul-spark-angle': `${(360 / count) * i}deg` } as CSSProperties
              }
            />
          ))}
        </span>
      ))}
    </span>
  );
}
