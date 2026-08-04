import { describe, it, expect } from 'vitest';
import {
  linePoints,
  linePath,
  areaPath,
  barRects,
  barRectsHorizontal,
  donutSegments,
  polarToCartesian,
} from '../chartGeometry';

const box = { width: 100, height: 50 };

describe('linePoints', () => {
  it('maps N values to N points spread across the box width', () => {
    const pts = linePoints([0, 5, 10], box);
    expect(pts).toHaveLength(3);
    expect(pts.map((p) => p.x)).toEqual([0, 50, 100]);
  });

  it('inverts the y axis so the largest value sits at the top', () => {
    const [lo, mid, hi] = linePoints([0, 5, 10], box);
    expect(lo.y).toBeCloseTo(50); // min → bottom
    expect(mid.y).toBeCloseTo(25);
    expect(hi.y).toBeCloseTo(0); // max → top
  });

  it('centres a single point and never produces NaN', () => {
    const pts = linePoints([7], box);
    expect(pts).toHaveLength(1);
    expect(Number.isNaN(pts[0].x)).toBe(false);
    expect(Number.isNaN(pts[0].y)).toBe(false);
  });

  it('flattens a constant series to the vertical middle', () => {
    const pts = linePoints([4, 4, 4], box);
    expect(pts.every((p) => Math.abs(p.y - 25) < 1e-6)).toBe(true);
  });

  it('returns nothing for empty data', () => {
    expect(linePoints([], box)).toEqual([]);
  });
});

describe('linePath / areaPath', () => {
  it('linePath starts with a move command and has no NaN', () => {
    const d = linePath([1, 3, 2], box);
    expect(d.startsWith('M')).toBe(true);
    expect(d).not.toContain('NaN');
  });

  it('linePath is empty for empty data', () => {
    expect(linePath([], box)).toBe('');
  });

  it('areaPath closes back to the baseline', () => {
    const d = areaPath([0, 10], box);
    expect(d.startsWith('M')).toBe(true);
    expect(d.trimEnd().endsWith('Z')).toBe(true);
    // baseline is the bottom of the box (y === height)
    expect(d).toContain('50');
  });

  it('areaPath handles a single value without NaN', () => {
    const d = areaPath([5], box);
    expect(d).not.toContain('NaN');
    expect(d.trimEnd().endsWith('Z')).toBe(true);
  });
});

describe('barRects (vertical)', () => {
  it('draws one rect per value with heights proportional to value', () => {
    const rects = barRects([1, 2, 4], { width: 120, height: 100 });
    expect(rects).toHaveLength(3);
    expect(rects[2].height).toBeCloseTo(100); // tallest fills the plot
    expect(rects[0].height).toBeCloseTo(25); // 1/4 of the max
  });

  it('lays bars out left to right without overflowing the box', () => {
    const rects = barRects([3, 1, 2], { width: 120, height: 100 });
    const xs = rects.map((r) => r.x);
    expect([...xs]).toEqual([...xs].sort((a, b) => a - b));
    rects.forEach((r) => expect(r.x + r.width).toBeLessThanOrEqual(120 + 1e-6));
  });

  it('gives an all-zero series zero-height bars, no NaN', () => {
    const rects = barRects([0, 0], { width: 100, height: 50 });
    expect(rects.every((r) => r.height === 0)).toBe(true);
    expect(rects.every((r) => !Number.isNaN(r.width))).toBe(true);
  });

  it('returns nothing for empty data', () => {
    expect(barRects([], box)).toEqual([]);
  });
});

describe('barRectsHorizontal', () => {
  it('draws one rect per value with widths proportional to value', () => {
    const rects = barRectsHorizontal([1, 2, 4], { width: 100, height: 120 });
    expect(rects).toHaveLength(3);
    expect(rects[2].width).toBeCloseTo(100);
    expect(rects[0].width).toBeCloseTo(25);
  });

  it('stacks bars top to bottom within the box', () => {
    const rects = barRectsHorizontal([1, 2, 3], { width: 100, height: 120 });
    const ys = rects.map((r) => r.y);
    expect([...ys]).toEqual([...ys].sort((a, b) => a - b));
    rects.forEach((r) => expect(r.y + r.height).toBeLessThanOrEqual(120 + 1e-6));
  });
});

describe('donutSegments', () => {
  it('produces percents that sum to 100 and contiguous angles', () => {
    const segs = donutSegments([1, 1, 2], { size: 100, thickness: 20 });
    expect(segs).toHaveLength(3);
    const total = segs.reduce((s, seg) => s + seg.percent, 0);
    expect(total).toBeCloseTo(100);
    expect(segs[1].startAngle).toBeCloseTo(segs[0].endAngle);
    expect(segs[2].startAngle).toBeCloseTo(segs[1].endAngle);
    expect(segs[segs.length - 1].endAngle - segs[0].startAngle).toBeCloseTo(360);
  });

  it('gives every segment a drawable arc path with no NaN', () => {
    const segs = donutSegments([3, 7], { size: 120, thickness: 24 });
    segs.forEach((seg) => {
      expect(seg.path.startsWith('M')).toBe(true);
      expect(seg.path).not.toContain('NaN');
    });
  });

  it('draws a single non-zero slice as a full ring without NaN', () => {
    const segs = donutSegments([0, 5], { size: 100, thickness: 20 });
    expect(segs[0].percent).toBeCloseTo(0);
    expect(segs[1].percent).toBeCloseTo(100);
    expect(segs[1].path).not.toContain('NaN');
  });

  it('returns nothing for empty or all-zero data', () => {
    expect(donutSegments([], { size: 100, thickness: 20 })).toEqual([]);
    expect(donutSegments([0, 0], { size: 100, thickness: 20 })).toEqual([]);
  });
});

describe('polarToCartesian', () => {
  it('places 0deg at the top and 90deg to the right', () => {
    const top = polarToCartesian(0, 0, 10, 0);
    const right = polarToCartesian(0, 0, 10, 90);
    expect(top.x).toBeCloseTo(0);
    expect(top.y).toBeCloseTo(-10);
    expect(right.x).toBeCloseTo(10);
    expect(right.y).toBeCloseTo(0);
  });
});
