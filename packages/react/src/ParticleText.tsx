import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Particle = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };

type ParticleTextProps = {
  text: string;
  color?: string;
  background?: string;
  fontSize?: number;
  fontWeight?: number;
  /** Sampling step — larger is sparser/faster. */
  density?: number;
  className?: string;
};

/**
 * Text rendered as a cloud of particles that assemble into the letters, drift,
 * and scatter away from the pointer. Reinterpreted on the tokens from the
 * ReactBits component using the built-in 2D canvas — no renderer or dependency,
 * so nothing extra ships to consumers who don't use it. The canvas is
 * decorative; the container carries `role="img"` with the text as its label, so
 * the words are read regardless. Under reduced motion the particles are drawn
 * at rest, no animation.
 */
export function ParticleText({
  text,
  color = '#ffffff',
  background = 'transparent',
  fontSize = 120,
  fontWeight = 700,
  density = 4,
  className,
}: ParticleTextProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let particles: Particle[] = [];
    let raf = 0;

    const build = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.round(fontSize * 1.6);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);
      const width = canvas.width;
      const data = ctx.getImageData(0, 0, width, canvas.height).data;
      const step = Math.max(1, Math.round(density * dpr));
      particles = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] > 128) {
            const hx = x / dpr;
            const hy = y / dpr;
            particles.push({
              x: reduced ? hx : Math.random() * w,
              y: reduced ? hy : Math.random() * h,
              hx,
              hy,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      ctx.clearRect(0, 0, w, h);
    };

    const paint = (animate: boolean) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const p = pointerRef.current;
      for (const dot of particles) {
        if (animate) {
          const ax = (dot.hx - dot.x) * 0.06;
          const ay = (dot.hy - dot.y) * 0.06;
          const dx = dot.x - p.x;
          const dy = dot.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 46) {
            const push = ((1 - dist / 46) * 4) / Math.max(4, dist);
            dot.vx += dx * push;
            dot.vy += dy * push;
          }
          dot.vx = (dot.vx + ax) * 0.86;
          dot.vy = (dot.vy + ay) * 0.86;
          dot.x += dot.vx;
          dot.y += dot.vy;
        }
        ctx.fillRect(dot.x, dot.y, 1.6, 1.6);
      }
    };

    const loop = () => {
      paint(true);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (reduced) {
      paint(false);
    } else {
      raf = requestAnimationFrame(loop);
    }
    const ro = new ResizeObserver(() => {
      build();
      if (reduced) paint(false);
    });
    ro.observe(container);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text, color, fontSize, fontWeight, density, reduced]);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onPointerLeave = () => {
    pointerRef.current = { x: -9999, y: -9999 };
  };

  return (
    <div
      ref={containerRef}
      className={cx('particle-text', className)}
      style={{ '--pt-bg': background } as CSSProperties}
      role="img"
      aria-label={text}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="particle-text__canvas" />
    </div>
  );
}
