import { describe, it, expect } from 'vitest';
import {
  funnelStages,
  radarAxes,
  radarPolygon,
  scatterPoints,
  heatmapCells,
  paretoLayout,
  gaugeArc,
  wordCloudLayout,
  multiLinePoints,
  stackedSeries,
} from '../chartGeometry';

const BOX = { width: 200, height: 100 };

/** Pull every "x,y" pair out of a path string. */
function pathPoints(path: string): Array<[number, number]> {
  return [...path.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]);
}

describe('funnelStages', () => {
  const values = [1000, 620, 465, 223];

  it('narrows monotonically', () => {
    const widths = funnelStages(values, BOX).map((s) => {
      const xs = pathPoints(s.path).map(([x]) => x);
      return Math.max(...xs) - Math.min(...xs);
    });
    for (let i = 1; i < widths.length; i += 1) {
      expect(widths[i]).toBeLessThanOrEqual(widths[i - 1]);
    }
  });

  it('reports each stage as a share of the first', () => {
    const stages = funnelStages(values, BOX);
    expect(stages[0].percent).toBe(100);
    expect(stages[1].percent).toBeCloseTo(62, 0);
  });

  it('reports drop-off from the previous stage, zero for the first', () => {
    const stages = funnelStages(values, BOX);
    expect(stages[0].dropOff).toBe(0);
    expect(stages[1].dropOff).toBeCloseTo(38, 0);
    expect(stages[2].dropOff).toBeCloseTo(25, 0);
  });

  it('returns [] for no stages', () => {
    expect(funnelStages([], BOX)).toEqual([]);
  });

  it('survives an all-zero funnel without NaN', () => {
    const stages = funnelStages([0, 0], BOX);
    expect(stages).toHaveLength(2);
    expect(stages.every((s) => Number.isFinite(s.percent))).toBe(true);
  });
});

describe('radar', () => {
  it('places one spoke per axis on a shared radius', () => {
    const geo = radarAxes(5, BOX);
    expect(geo.axes).toHaveLength(5);
    for (const axis of geo.axes) {
      const distance = Math.hypot(axis.x - geo.cx, axis.y - geo.cy);
      expect(distance).toBeCloseTo(geo.radius, 1);
    }
  });

  it('draws rings inside the radius, outermost last', () => {
    const geo = radarAxes(5, BOX, 3);
    expect(geo.rings).toHaveLength(3);
    expect(geo.rings[2]).toBeCloseTo(geo.radius, 5);
    expect(geo.rings[0]).toBeLessThan(geo.rings[2]);
  });

  it('closes a polygon with one point per value', () => {
    expect(radarPolygon([5, 3, 4, 2, 1], BOX)).toHaveLength(5);
  });

  it('shares a scale when max is given, so two series stay comparable', () => {
    const a = radarPolygon([5, 5, 5], BOX, 10);
    const b = radarPolygon([10, 10, 10], BOX, 10);
    const geo = radarAxes(3, BOX);
    const rA = Math.hypot(a[0].x - geo.cx, a[0].y - geo.cy);
    const rB = Math.hypot(b[0].x - geo.cx, b[0].y - geo.cy);
    expect(rB).toBeGreaterThan(rA);
    expect(rA).toBeCloseTo(rB / 2, 1);
  });

  it('returns [] for no values', () => {
    expect(radarPolygon([], BOX)).toEqual([]);
  });
});

describe('scatterPoints', () => {
  const data = [
    { x: 0, y: 0 },
    { x: 5, y: 10 },
    { x: 10, y: 5 },
  ];

  it('spans the box across the data extent', () => {
    const pts = scatterPoints(data, BOX);
    expect(Math.min(...pts.map((p) => p.x))).toBe(0);
    expect(Math.max(...pts.map((p) => p.x))).toBe(200);
  });

  it('inverts y, so bigger values sit higher', () => {
    const pts = scatterPoints(data, BOX);
    expect(pts[1].y).toBeLessThan(pts[0].y);
  });

  it('honours an explicit domain over the data extent', () => {
    const pts = scatterPoints(data, BOX, { xMin: 0, xMax: 20, yMin: 0, yMax: 20 });
    expect(Math.max(...pts.map((p) => p.x))).toBe(100);
  });

  it('centres a single point and handles a zero span', () => {
    const pts = scatterPoints([{ x: 3, y: 3 }], BOX);
    expect(pts[0]).toMatchObject({ x: 100, y: 50 });
  });

  it('returns [] for no data', () => {
    expect(scatterPoints([], BOX)).toEqual([]);
  });
});

describe('heatmapCells', () => {
  const matrix = [
    [100, 60, 40],
    [100, 50, 0],
  ];

  it('emits one cell per value with row and column indices', () => {
    const cells = heatmapCells(matrix, BOX);
    expect(cells).toHaveLength(6);
    expect(cells[0]).toMatchObject({ row: 0, col: 0 });
    expect(cells[5]).toMatchObject({ row: 1, col: 2 });
  });

  it('normalises intensity 0..1 against the matrix max', () => {
    const cells = heatmapCells(matrix, BOX);
    expect(cells[0].intensity).toBe(1);
    expect(cells[1].intensity).toBeCloseTo(0.6, 5);
    expect(cells[5].intensity).toBe(0);
  });

  it('leaves a gap between cells', () => {
    const [first] = heatmapCells(matrix, BOX, 2);
    // The core rounds coordinates to 3 decimals.
    expect(first.width).toBeCloseTo(200 / 3 - 2, 2);
  });

  it('returns [] for an empty matrix', () => {
    expect(heatmapCells([], BOX)).toEqual([]);
    expect(heatmapCells([[]], BOX)).toEqual([]);
  });
});

describe('paretoLayout', () => {
  const values = [50, 30, 12, 5, 3];

  it('sorts descending', () => {
    const { bars } = paretoLayout([5, 50, 12], BOX);
    expect(bars.map((b) => b.value)).toEqual([50, 12, 5]);
  });

  it('puts bars and the cumulative line on one 0-100 scale', () => {
    const { bars, cumulative } = paretoLayout(values, BOX);
    const inner = { top: 0, bottom: 100, height: 100 };
    // The tallest bar is 50% of the total, so it fills half the height.
    expect(bars[0].height).toBeCloseTo(50, 5);
    // The line ends at 100%, which is the top of the box.
    expect(cumulative[cumulative.length - 1].y).toBeCloseTo(inner.top, 5);
  });

  it('reports the index where the cumulative line crosses 80%', () => {
    const { cutIndex, percents } = paretoLayout(values, BOX);
    expect(percents[0]).toBe(50);
    expect(cutIndex).toBe(1); // 50 + 30 = 80, so the top two items are the cut
  });

  it('drops non-positive values instead of producing NaN', () => {
    const { bars } = paretoLayout([10, 0, -4], BOX);
    expect(bars).toHaveLength(1);
  });

  it('returns an empty layout for a zero total', () => {
    expect(paretoLayout([0, 0], BOX)).toEqual({
      bars: [],
      cumulative: [],
      percents: [],
      cutIndex: -1,
    });
  });
});

describe('gaugeArc', () => {
  const opts = { size: 120, thickness: 20 };

  it('reports the value as a percentage of the range', () => {
    expect(gaugeArc(50, opts).percent).toBe(50);
    expect(gaugeArc(25, { ...opts, min: 0, max: 50 }).percent).toBe(50);
  });

  it('clamps below the minimum and above the maximum', () => {
    expect(gaugeArc(-10, opts).percent).toBe(0);
    expect(gaugeArc(140, opts).percent).toBe(100);
  });

  it('always draws the track, even at zero', () => {
    const geo = gaugeArc(0, opts);
    expect(geo.track).not.toBe('');
    expect(geo.fill).toBe('');
  });

  it('centres the dial, so a 270 degree sweep starts at -135', () => {
    expect(gaugeArc(0, opts).angle).toBe(-135);
    expect(gaugeArc(100, opts).angle).toBe(135);
  });

  it('handles a zero-width range without NaN', () => {
    expect(gaugeArc(5, { ...opts, min: 5, max: 5 }).percent).toBe(0);
  });
});

describe('wordCloudLayout', () => {
  const terms = [
    { text: 'typescript', weight: 40 },
    { text: 'angular', weight: 28 },
    { text: 'react', weight: 22 },
    { text: 'svg', weight: 12 },
    { text: 'css', weight: 8 },
  ];
  const cloudBox = { width: 400, height: 240 };

  it('is deterministic — the same input twice gives the same picture', () => {
    expect(wordCloudLayout(terms, cloudBox)).toEqual(wordCloudLayout(terms, cloudBox));
  });

  it('scales font size with weight', () => {
    const placed = wordCloudLayout(terms, cloudBox);
    expect(placed[0].fontSize).toBeGreaterThan(placed[placed.length - 1].fontSize);
  });

  it('places nothing on top of anything else', () => {
    const placed = wordCloudLayout(terms, cloudBox);
    const rects = placed.map((w) => ({
      x1: w.x - (w.text.length * w.fontSize * 0.55) / 2,
      x2: w.x + (w.text.length * w.fontSize * 0.55) / 2,
      y1: w.y - (w.fontSize * 1.1) / 2,
      y2: w.y + (w.fontSize * 1.1) / 2,
    }));
    for (let i = 0; i < rects.length; i += 1) {
      for (let j = i + 1; j < rects.length; j += 1) {
        const a = rects[i];
        const b = rects[j];
        const overlap = !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
        expect(overlap, `${placed[i].text} overlaps ${placed[j].text}`).toBe(false);
      }
    }
  });

  it('keeps every placed word inside the box', () => {
    for (const w of wordCloudLayout(terms, cloudBox)) {
      expect(w.x).toBeGreaterThanOrEqual(0);
      expect(w.x).toBeLessThanOrEqual(cloudBox.width);
      expect(w.y).toBeGreaterThanOrEqual(0);
      expect(w.y).toBeLessThanOrEqual(cloudBox.height);
    }
  });

  it('honours the term limit and drops non-positive weights', () => {
    expect(wordCloudLayout(terms, cloudBox, { limit: 2 })).toHaveLength(2);
    expect(wordCloudLayout([{ text: 'zero', weight: 0 }], cloudBox)).toEqual([]);
  });

  it('returns [] for no terms', () => {
    expect(wordCloudLayout([], cloudBox)).toEqual([]);
  });
});

describe('multiLinePoints', () => {
  it('scales every series against one shared domain', () => {
    const [low, high] = multiLinePoints(
      [
        [0, 5],
        [0, 10],
      ],
      BOX,
    );
    // The 10 tops the box; the 5 lands halfway, not at the top of its own series.
    expect(high[1].y).toBe(0);
    expect(low[1].y).toBeCloseTo(50, 5);
  });

  it('centres a single-value series', () => {
    expect(multiLinePoints([[7]], BOX)[0][0]).toMatchObject({ x: 100, y: 50 });
  });

  it('returns [] for no series and empty lists for empty series', () => {
    expect(multiLinePoints([], BOX)).toEqual([]);
    expect(multiLinePoints([[], []], BOX)).toEqual([[], []]);
  });
});

describe('stackedSeries', () => {
  const series = [
    [10, 20],
    [10, 10],
  ];

  it('emits one closed band per series', () => {
    const bands = stackedSeries(series, BOX);
    expect(bands).toHaveLength(2);
    for (const band of bands) expect(band.path.endsWith('Z')).toBe(true);
  });

  it('stacks: the second band sits above the first', () => {
    const [first, second] = stackedSeries(series, BOX);
    const firstTop = Math.min(...pathPoints(first.path).map(([, y]) => y));
    const secondTop = Math.min(...pathPoints(second.path).map(([, y]) => y));
    expect(secondTop).toBeLessThan(firstTop);
  });

  it('scales so the tallest total fills the box', () => {
    const [, second] = stackedSeries(series, BOX);
    // Column 1 totals 30, the tallest, so the top band reaches y=0 there.
    expect(Math.min(...pathPoints(second.path).map(([, y]) => y))).toBe(0);
  });

  it('returns [] for no series or all-empty series', () => {
    expect(stackedSeries([], BOX)).toEqual([]);
    expect(stackedSeries([[], []], BOX)).toEqual([]);
  });
});
