/**
 * Pure, dependency-free chart geometry. Every function turns a plain array of
 * numbers into SVG coordinates or path strings, so the React and Angular chart
 * components can render identical output without pulling in a charting runtime.
 *
 * This module is deliberately framework-agnostic and side-effect-free. It is
 * mirrored verbatim from @paul-portfolio/react; the unit tests in each package
 * guard the two copies against drifting.
 */

export interface ChartBox {
  width: number;
  height: number;
  /** Uniform inset, in px, between the drawing and the edges of the box. */
  padding?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

export interface BarOptions {
  /** Fraction of each band left empty as a gap, 0..1. Defaults to 0.25. */
  gap?: number;
}

export interface DonutOptions {
  /** Outer diameter of the ring, in px. */
  size: number;
  /** Ring thickness (outer radius − inner radius), in px. */
  thickness: number;
  /** Angle, in degrees, where the first slice starts. 0 is straight up. */
  startAngle?: number;
}

export interface DonutSegment {
  path: string;
  percent: number;
  startAngle: number;
  endAngle: number;
  index: number;
}

interface Inner {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
}

function inner(box: ChartBox): Inner {
  const pad = box.padding ?? 0;
  return {
    left: pad,
    top: pad,
    width: Math.max(0, box.width - pad * 2),
    height: Math.max(0, box.height - pad * 2),
    bottom: box.height - pad,
  };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Maps each value to a point, spread evenly across the inner width. */
export function linePoints(values: number[], box: ChartBox): Point[] {
  if (values.length === 0) return [];
  const b = inner(box);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const yFor = (v: number) =>
    span === 0 ? b.top + b.height / 2 : b.top + b.height * (1 - (v - min) / span);
  if (values.length === 1) {
    return [{ x: round(b.left + b.width / 2), y: round(yFor(values[0])) }];
  }
  const step = b.width / (values.length - 1);
  return values.map((v, i) => ({ x: round(b.left + step * i), y: round(yFor(v)) }));
}

export function linePath(values: number[], box: ChartBox): string {
  const pts = linePoints(values, box);
  if (pts.length === 0) return '';
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

export function areaPath(values: number[], box: ChartBox): string {
  const pts = linePoints(values, box);
  if (pts.length === 0) return '';
  const b = inner(box);
  const baseline = round(b.bottom);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L${last.x},${baseline} L${first.x},${baseline} Z`;
}

/** Vertical bars: one rect per value, heights proportional to the value. */
export function barRects(values: number[], box: ChartBox, opts: BarOptions = {}): Rect[] {
  if (values.length === 0) return [];
  const b = inner(box);
  const gap = opts.gap ?? 0.25;
  const max = Math.max(...values, 0);
  const band = b.width / values.length;
  const barWidth = band * (1 - gap);
  return values.map((value, i) => {
    const height = max > 0 ? (value / max) * b.height : 0;
    return {
      x: round(b.left + band * i + (band - barWidth) / 2),
      y: round(b.bottom - height),
      width: round(barWidth),
      height: round(height),
      value,
    };
  });
}

/** Horizontal bars: one rect per value, widths proportional to the value. */
export function barRectsHorizontal(
  values: number[],
  box: ChartBox,
  opts: BarOptions = {},
): Rect[] {
  if (values.length === 0) return [];
  const b = inner(box);
  const gap = opts.gap ?? 0.25;
  const max = Math.max(...values, 0);
  const band = b.height / values.length;
  const barHeight = band * (1 - gap);
  return values.map((value, i) => {
    const width = max > 0 ? (value / max) * b.width : 0;
    return {
      x: round(b.left),
      y: round(b.top + band * i + (band - barHeight) / 2),
      width: round(width),
      height: round(barHeight),
      value,
    };
  });
}

/** 0deg points straight up; angle increases clockwise. */
export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

/** SVG path for a ring wedge between two radii and two angles. */
export function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
): string {
  // A single SVG arc can't span a full turn, so nudge a 360° sweep just short.
  const sweep = endAngle - startAngle;
  const end = sweep >= 360 ? startAngle + 359.999 : endAngle;
  const largeArc = end - startAngle > 180 ? 1 : 0;
  const oStart = polarToCartesian(cx, cy, rOuter, startAngle);
  const oEnd = polarToCartesian(cx, cy, rOuter, end);
  const iEnd = polarToCartesian(cx, cy, rInner, end);
  const iStart = polarToCartesian(cx, cy, rInner, startAngle);
  return [
    `M${oStart.x},${oStart.y}`,
    `A${rOuter},${rOuter} 0 ${largeArc} 1 ${oEnd.x},${oEnd.y}`,
    `L${iEnd.x},${iEnd.y}`,
    `A${rInner},${rInner} 0 ${largeArc} 0 ${iStart.x},${iStart.y}`,
    'Z',
  ].join(' ');
}

export function donutSegments(values: number[], opts: DonutOptions): DonutSegment[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  if (values.length === 0 || total <= 0) return [];
  const { size, thickness } = opts;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2;
  const rInner = Math.max(0, rOuter - thickness);
  let angle = opts.startAngle ?? 0;
  return values.map((raw, index) => {
    const value = Math.max(0, raw);
    const sweep = (value / total) * 360;
    const startAngle = angle;
    const endAngle = angle + sweep;
    angle = endAngle;
    return {
      path: arcPath(cx, cy, rOuter, rInner, startAngle, endAngle),
      percent: (value / total) * 100,
      startAngle,
      endAngle,
      index,
    };
  });
}
