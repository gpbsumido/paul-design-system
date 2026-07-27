import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx';

type GradientBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  /** Gradient stops, in order. Defaults to the design-token brand palette. */
  colors?: string[];
  /** Gradient angle in degrees. */
  angle?: number;
  /** Ambient flow speed. */
  speed?: 'slow' | 'normal' | 'fast';
  /** Run the ambient flow animation. Defaults to true. */
  animate?: boolean;
  children?: ReactNode;
};

const DURATION: Record<'slow' | 'normal' | 'fast', string> = {
  slow: '18s',
  normal: '12s',
  fast: '6s',
};

/**
 * A decorative surface painted with a flowing multi-stop gradient. Content is
 * passed as children and renders on top, so the strip stays content-agnostic.
 * The ambient flow is pure CSS and is gated behind prefers-reduced-motion, so
 * it goes static for users who ask for reduced motion — no JS needed. When
 * `colors` is omitted it falls back to the token brand palette.
 */
export function GradientBackground({
  colors,
  angle = 120,
  speed = 'normal',
  animate = true,
  className,
  style,
  children,
  ...rest
}: GradientBackgroundProps) {
  const gradientStyle: CSSProperties = {
    ...(colors && colors.length > 0
      ? { ['--paul-gradient-image']: `linear-gradient(${angle}deg, ${colors.join(', ')})` }
      : {}),
    ['--paul-gradient-duration']: DURATION[speed],
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cx('gradient-bg', className)}
      data-animate={animate ? 'true' : undefined}
      style={gradientStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
