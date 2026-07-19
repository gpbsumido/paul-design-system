import type { CSSProperties } from 'react';
import { cx } from './cx';

type SkeletonProps = {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
};

export function Skeleton({ variant, width, height }: SkeletonProps) {
  const style: CSSProperties | undefined =
    width || height
      ? ({
          '--skeleton-w': width,
          '--skeleton-h': height,
        } as CSSProperties)
      : undefined;

  return (
    <div
      className={cx('skeleton', variant && `skeleton--${variant}`)}
      style={style}
    />
  );
}
