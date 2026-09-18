import { useEffect, useRef, type CSSProperties } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Bloom = {
  hx: number;
  hy: number;
  hue: number;
  size: number;
  leaf: boolean;
  phase: number;
};

type BotanicalTextProps = {
  text: string;
  bloomHue?: number;
  leafHue?: number;
  /** Fraction of sprites drawn as leaves rather than blooms, 0–1. */
  leafMix?: number;
  background?: string;
  fontSize?: number;
  fontWeight?: number;
  density?: number;
  className?: string;
};

/**
 * Text grown from tiny flowers and leaves that sway. Reinterpreted on the tokens
 * from the OriginKit component — the original renders instanced sprites in
 * Three.js; this samples the text on the built-in 2D canvas and draws little
 * blooms at each point, so there's no WebGL and nothing to install. The canvas
 * is decorative; the container is a `role="img"` labelled with the text. Under
 * reduced motion the sway stops and the blooms are drawn at rest.
 */
export function BotanicalText({
  text,
  bloomHue = 330,
  leafHue = 120,
  leafMix = 0.28,
  background = 'transparent',
  fontSize = 120,
  fontWeight = 700,
  density = 8,
  className,
}: BotanicalTextProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let blooms: Bloom[] = [];
    let raf = 0;

    const build = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.round(fontSize * 1.7);
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
      const step = Math.max(2, Math.round(density * dpr));
      // Deterministic PRNG so re-renders and resizes keep the same arrangement.
      let seed = 1;
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
      blooms = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] > 128) {
            const leaf = rnd() < leafMix;
            blooms.push({
              hx: x / dpr,
              hy: y / dpr,
              hue: (leaf ? leafHue : bloomHue) + (rnd() * 40 - 20),
              size: 3 + rnd() * (leaf ? 3 : 4),
              leaf,
              phase: rnd() * 6.28,
            });
          }
        }
      }
      ctx.clearRect(0, 0, w, h);
    };

    const drawBloom = (b: Bloom, sway: number) => {
      const x = b.hx + sway;
      const y = b.hy;
      if (b.leaf) {
        ctx.fillStyle = `hsl(${b.hue}, 45%, 38%)`;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(b.phase);
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size, b.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
      ctx.fillStyle = `hsl(${b.hue}, 68%, 66%)`;
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2 + b.phase;
        ctx.beginPath();
        ctx.ellipse(
          x + Math.cos(a) * b.size * 0.7,
          y + Math.sin(a) * b.size * 0.7,
          b.size * 0.5,
          b.size * 0.32,
          a,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.fillStyle = `hsl(${(b.hue + 45) % 360}, 80%, 58%)`;
      ctx.beginPath();
      ctx.arc(x, y, b.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const paint = (t: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (const b of blooms) {
        drawBloom(b, reduced ? 0 : Math.sin(t / 900 + b.phase) * 2.2);
      }
    };

    build();
    if (reduced) {
      paint(0);
    } else {
      const loop = (ts: number) => {
        paint(ts);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const ro = new ResizeObserver(() => {
      build();
      if (reduced) paint(0);
    });
    ro.observe(container);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text, bloomHue, leafHue, leafMix, fontSize, fontWeight, density, reduced]);

  return (
    <div
      ref={containerRef}
      className={cx('botanical-text', className)}
      style={{ '--bt-bg': background } as CSSProperties}
      role="img"
      aria-label={text}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="botanical-text__canvas" />
    </div>
  );
}
