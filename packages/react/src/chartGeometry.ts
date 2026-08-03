/**
 * Pure, dependency-free chart geometry. Every function turns a plain array of
 * numbers into SVG coordinates or path strings, so the React and Angular chart
 * components can render identical output without pulling in a charting runtime.
 *
 * This module is deliberately framework-agnostic and side-effect-free. It is
 * mirrored verbatim in @paul-portfolio/angular; the unit tests in each package
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

// ---------------------------------------------------------------------------
// Specialty forms
//
// Everything below follows the same contract as the primitives above: pure
// functions, no DOM, no randomness, deterministic for a given input. The
// components are thin wrappers that turn these numbers into SVG.
// ---------------------------------------------------------------------------

export interface FunnelStage {
  /** Trapezoid path for the stage band. */
  path: string;
  /** Share of the FIRST stage, 0..100 — what "conversion" means in a funnel. */
  percent: number;
  /** Loss from the previous stage, 0..100. 0 for the first stage. */
  dropOff: number;
  value: number;
  index: number;
}

/**
 * Stacked trapezoids narrowing stage to stage. Widths are proportional to the
 * value, centred, so the taper reads as the drop-off — which is the number a
 * funnel is actually read for, hence `dropOff` on every stage.
 */
export function funnelStages(values: number[], box: ChartBox, gap = 4): FunnelStage[] {
  if (values.length === 0) return [];
  const b = inner(box);
  const first = values[0];
  const max = Math.max(...values, 0);
  const bandHeight = b.height / values.length;
  const height = Math.max(0, bandHeight - gap);

  const widthFor = (v: number) => (max > 0 ? (Math.max(0, v) / max) * b.width : 0);

  return values.map((value, i) => {
    const top = b.top + bandHeight * i;
    const wTop = widthFor(value);
    // Taper toward the next stage so consecutive bands meet edge to edge.
    const wBottom = i + 1 < values.length ? widthFor(values[i + 1]) : wTop;
    const cx = b.left + b.width / 2;
    const path = [
      `M${round(cx - wTop / 2)},${round(top)}`,
      `L${round(cx + wTop / 2)},${round(top)}`,
      `L${round(cx + wBottom / 2)},${round(top + height)}`,
      `L${round(cx - wBottom / 2)},${round(top + height)}`,
      'Z',
    ].join(' ');
    return {
      path,
      percent: first > 0 ? round((Math.max(0, value) / first) * 100) : 0,
      dropOff:
        i === 0 || values[i - 1] <= 0
          ? 0
          : round(((values[i - 1] - value) / values[i - 1]) * 100),
      value,
      index: i,
    };
  });
}

export interface RadarAxis {
  /** Outer end of the spoke. */
  x: number;
  y: number;
  angle: number;
  index: number;
}

export interface RadarGeometry {
  cx: number;
  cy: number;
  radius: number;
  axes: RadarAxis[];
  /** Radii of the background rings, outermost last. */
  rings: number[];
}

/**
 * Spokes and rings for a radar chart. `radarPolygon` draws on the same centre
 * and radius, so the series and the frame can't disagree.
 */
export function radarAxes(count: number, box: ChartBox, ringCount = 4): RadarGeometry {
  const b = inner(box);
  const cx = round(b.left + b.width / 2);
  const cy = round(b.top + b.height / 2);
  const radius = round(Math.min(b.width, b.height) / 2);
  const axes: RadarAxis[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (360 / count) * i;
    const point = polarToCartesian(cx, cy, radius, angle);
    axes.push({ x: point.x, y: point.y, angle, index: i });
  }
  const rings = Array.from({ length: ringCount }, (_, i) =>
    round((radius * (i + 1)) / ringCount),
  );
  return { cx, cy, radius, axes, rings };
}

/**
 * A closed point list for one series. `max` fixes the scale so several series —
 * or several small multiples — are comparable; it defaults to the series max.
 */
export function radarPolygon(values: number[], box: ChartBox, max?: number): Point[] {
  if (values.length === 0) return [];
  const { cx, cy, radius } = radarAxes(values.length, box);
  const ceiling = max ?? Math.max(...values, 0);
  return values.map((value, i) => {
    const r = ceiling > 0 ? (Math.max(0, value) / ceiling) * radius : 0;
    return polarToCartesian(cx, cy, r, (360 / values.length) * i);
  });
}

export interface ScatterDatum {
  x: number;
  y: number;
}

export interface ScatterPoint extends Point {
  datum: ScatterDatum;
  index: number;
}

export interface ScatterDomain {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/**
 * Maps points into the box. Pass an explicit `domain` when several plots must
 * share a scale — without it each plot silently rescales to its own extent and
 * they stop being comparable.
 */
export function scatterPoints(
  data: ScatterDatum[],
  box: ChartBox,
  domain?: ScatterDomain,
): ScatterPoint[] {
  if (data.length === 0) return [];
  const b = inner(box);
  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const d: ScatterDomain = domain ?? {
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
  };
  const spanX = d.xMax - d.xMin;
  const spanY = d.yMax - d.yMin;
  return data.map((datum, index) => ({
    x: round(spanX === 0 ? b.left + b.width / 2 : b.left + ((datum.x - d.xMin) / spanX) * b.width),
    y: round(
      spanY === 0 ? b.top + b.height / 2 : b.top + b.height * (1 - (datum.y - d.yMin) / spanY),
    ),
    datum,
    index,
  }));
}

export interface HeatmapCell extends Rect {
  /** 0..1 against the matrix max — the input to the SEQUENTIAL ramp. */
  intensity: number;
  row: number;
  col: number;
}

/**
 * A grid of cells with a normalised intensity per cell. Intensity is deliberately
 * 0..1 rather than a colour: the component maps it onto the sequential ramp, and
 * a categorical palette here would double-encode the value as hue.
 */
export function heatmapCells(matrix: number[][], box: ChartBox, gap = 2): HeatmapCell[] {
  if (matrix.length === 0 || matrix.every((row) => row.length === 0)) return [];
  const b = inner(box);
  const rows = matrix.length;
  const cols = Math.max(...matrix.map((row) => row.length));
  const max = Math.max(...matrix.flat(), 0);
  const cellW = b.width / cols;
  const cellH = b.height / rows;

  const cells: HeatmapCell[] = [];
  matrix.forEach((row, r) => {
    row.forEach((value, c) => {
      cells.push({
        x: round(b.left + cellW * c),
        y: round(b.top + cellH * r),
        width: round(Math.max(0, cellW - gap)),
        height: round(Math.max(0, cellH - gap)),
        value,
        intensity: max > 0 ? round(Math.max(0, value) / max) : 0,
        row: r,
        col: c,
      });
    });
  });
  return cells;
}

export interface ParetoLayout {
  /** Bars as PERCENT of total, so they share the cumulative line's scale. */
  bars: Rect[];
  /** Cumulative percentage points, in the same coordinate space as the bars. */
  cumulative: Point[];
  /** Percent value per index, sorted descending like the bars. */
  percents: number[];
  /** Index where the cumulative line first crosses 80% — the Pareto cut. */
  cutIndex: number;
}

/**
 * Bars plus a cumulative line on ONE axis.
 *
 * The textbook Pareto puts counts on the left and cumulative percent on the
 * right. Two y-scales on one plot invent a relationship the data doesn't have —
 * the alignment between them is arbitrary. Here the bars are percent-of-total
 * and the line is cumulative percent, so both live on the same 0–100 scale and
 * the crossing point means something.
 *
 * Values are sorted descending, as a Pareto requires.
 */
export function paretoLayout(values: number[], box: ChartBox, gap = 0.25): ParetoLayout {
  const sorted = [...values].filter((v) => v > 0).sort((a, b) => b - a);
  if (sorted.length === 0) return { bars: [], cumulative: [], percents: [], cutIndex: -1 };

  const b = inner(box);
  const total = sorted.reduce((sum, v) => sum + v, 0);
  const percents = sorted.map((v) => round((v / total) * 100));

  const band = b.width / sorted.length;
  const barWidth = band * (1 - gap);
  const bars = sorted.map((value, i) => {
    const height = (value / total) * 100 * (b.height / 100);
    return {
      x: round(b.left + band * i + (band - barWidth) / 2),
      y: round(b.bottom - height),
      width: round(barWidth),
      height: round(height),
      value,
    };
  });

  let running = 0;
  let cutIndex = -1;
  const cumulative = sorted.map((value, i) => {
    running += (value / total) * 100;
    if (cutIndex === -1 && running >= 80) cutIndex = i;
    return {
      x: round(b.left + band * i + band / 2),
      y: round(b.bottom - running * (b.height / 100)),
    };
  });

  return { bars, cumulative, percents, cutIndex };
}

export interface GaugeOptions {
  size: number;
  thickness: number;
  min?: number;
  max?: number;
  /** Total sweep in degrees. Defaults to 270 — a dial, not a full ring. */
  sweep?: number;
}

export interface GaugeGeometry {
  track: string;
  fill: string;
  /** 0..100, clamped. */
  percent: number;
  /** Where the fill ends, in degrees. */
  angle: number;
}

/**
 * A single ratio against a limit. Values outside [min, max] clamp rather than
 * overflowing the arc — a gauge reading 140% of its own dial is a bug, not data.
 */
export function gaugeArc(value: number, opts: GaugeOptions): GaugeGeometry {
  const { size, thickness } = opts;
  const min = opts.min ?? 0;
  const max = opts.max ?? 100;
  const sweep = opts.sweep ?? 270;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2;
  const rInner = Math.max(0, rOuter - thickness);
  const span = max - min;
  const ratio = span === 0 ? 0 : Math.min(1, Math.max(0, (value - min) / span));
  // Centre the dial on straight-up: a 270° sweep starts at -135°.
  const start = -sweep / 2;
  const angle = round(start + sweep * ratio);
  return {
    track: arcPath(cx, cy, rOuter, rInner, start, start + sweep),
    fill: ratio === 0 ? '' : arcPath(cx, cy, rOuter, rInner, start, angle),
    percent: round(ratio * 100),
    angle,
  };
}

export interface WordCloudTerm {
  text: string;
  weight: number;
}

export interface PlacedWord extends WordCloudTerm {
  x: number;
  y: number;
  fontSize: number;
  index: number;
}

export interface WordCloudOptions {
  minFontSize?: number;
  maxFontSize?: number;
  /** Terms considered, highest weight first. Beyond this the tail is dropped. */
  limit?: number;
}

/**
 * Deterministic spiral packing for a word cloud.
 *
 * Caveat, stated where it can't be missed: glyph AREA is not a comparable
 * encoding, and a long word reads as bigger than a short one at the same
 * weight. A ranked bar chart shows the same data honestly. This exists because
 * a gallery wants one; reach for `BarChart` when the numbers matter.
 *
 * No randomness anywhere — the same input must produce the same picture, or the
 * server and the client disagree and visual regression never settles.
 */
export function wordCloudLayout(
  terms: WordCloudTerm[],
  box: ChartBox,
  opts: WordCloudOptions = {},
): PlacedWord[] {
  if (terms.length === 0) return [];
  const b = inner(box);
  const minFont = opts.minFontSize ?? 12;
  const maxFont = opts.maxFontSize ?? 40;
  const limit = opts.limit ?? 50;

  const ranked = [...terms]
    .filter((t) => t.weight > 0)
    .sort((a, b2) => b2.weight - a.weight)
    .slice(0, limit);
  if (ranked.length === 0) return [];

  const top = ranked[0].weight;
  const bottom = ranked[ranked.length - 1].weight;
  const span = top - bottom;

  const cx = b.left + b.width / 2;
  const cy = b.top + b.height / 2;
  const placed: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  const overlaps = (r: { x1: number; y1: number; x2: number; y2: number }) =>
    placed.some((p) => !(r.x2 < p.x1 || r.x1 > p.x2 || r.y2 < p.y1 || r.y1 > p.y2));

  const out: PlacedWord[] = [];
  ranked.forEach((term, index) => {
    const t = span === 0 ? 1 : (term.weight - bottom) / span;
    const fontSize = round(minFont + t * (maxFont - minFont));
    // Character-width approximation: no DOM here, so no text measurement.
    const width = term.text.length * fontSize * 0.55;
    const height = fontSize * 1.1;

    // Archimedean spiral out from the centre until the box has no room left.
    let step = 0;
    let x = cx;
    let y = cy;
    let rect = { x1: x - width / 2, y1: y - height / 2, x2: x + width / 2, y2: y + height / 2 };
    const maxSteps = 600;
    while (
      step < maxSteps &&
      (overlaps(rect) ||
        rect.x1 < b.left ||
        rect.x2 > b.left + b.width ||
        rect.y1 < b.top ||
        rect.y2 > b.top + b.height)
    ) {
      step += 1;
      const angle = step * 0.35;
      const radius = 2 + angle * 2.2;
      x = cx + Math.cos(angle) * radius;
      y = cy + Math.sin(angle) * radius * 0.62; // wider than tall, like the box
      rect = { x1: x - width / 2, y1: y - height / 2, x2: x + width / 2, y2: y + height / 2 };
    }
    // Out of room: drop the term rather than stacking it on top of another.
    if (step >= maxSteps) return;

    placed.push(rect);
    out.push({ ...term, x: round(x), y: round(y), fontSize, index });
  });

  return out;
}

export interface StackedBand {
  path: string;
  index: number;
}

/**
 * One y-domain across every series, computed once. Series scaled independently
 * look comparable and aren't.
 */
export function multiLinePoints(series: number[][], box: ChartBox): Point[][] {
  if (series.length === 0) return [];
  const all = series.flat();
  if (all.length === 0) return series.map(() => []);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const b = inner(box);
  const span = max - min;

  return series.map((values) => {
    if (values.length === 0) return [];
    if (values.length === 1) {
      const y = span === 0 ? b.top + b.height / 2 : b.top + b.height * (1 - (values[0] - min) / span);
      return [{ x: round(b.left + b.width / 2), y: round(y) }];
    }
    const step = b.width / (values.length - 1);
    return values.map((v, i) => ({
      x: round(b.left + step * i),
      y: round(span === 0 ? b.top + b.height / 2 : b.top + b.height * (1 - (v - min) / span)),
    }));
  });
}

/**
 * Part-to-whole over time: each series is a band stacked on the ones before it,
 * scaled so the tallest total fills the box.
 */
export function stackedSeries(series: number[][], box: ChartBox): StackedBand[] {
  if (series.length === 0) return [];
  const length = Math.max(...series.map((s) => s.length), 0);
  if (length === 0) return [];
  const b = inner(box);

  const totals = Array.from({ length }, (_, i) =>
    series.reduce((sum, s) => sum + Math.max(0, s[i] ?? 0), 0),
  );
  const max = Math.max(...totals, 0);
  const step = length === 1 ? 0 : b.width / (length - 1);
  const xAt = (i: number) => round(length === 1 ? b.left + b.width / 2 : b.left + step * i);
  const yFor = (v: number) => round(b.bottom - (max > 0 ? (v / max) * b.height : 0));

  const running = new Array(length).fill(0);
  return series.map((values, index) => {
    const lower = [...running];
    for (let i = 0; i < length; i += 1) running[i] += Math.max(0, values[i] ?? 0);

    const upperPath = running.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yFor(v)}`).join(' ');
    const lowerPath = lower
      .map((v, i) => `L${xAt(length - 1 - i)},${yFor(lower[length - 1 - i])}`)
      .slice(0, length)
      .join(' ');
    return { path: `${upperPath} ${lowerPath} Z`, index };
  });
}
