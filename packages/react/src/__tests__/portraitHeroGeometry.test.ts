import { describe, expect, it } from 'vitest';
import { posterCorners, posterPlacement, projectPoster } from '../portraitHeroGeometry';

describe('portrait wall projection', () => {
  it('covers both halves of all four tunnel walls and only side walls in corridor', () => {
    const tunnel = Array.from({ length: 16 }, (_, i) => posterPlacement(i, 'tunnel'));
    expect(new Set(tunnel.map(p => `${p.wall}-${p.lane}`)).size).toBe(8);
    const corridor = Array.from({ length: 16 }, (_, i) => posterPlacement(i, 'corridor'));
    expect(new Set(corridor.map(p => p.wall))).toEqual(new Set(['left', 'right']));
    expect(new Set(corridor.map(p => `${p.wall}-${p.lane}`)).size).toBe(4);
    expect(new Set(tunnel.map(p => p.phase)).size).toBe(16);
  });
  it('anchors the left upper poster between the corner seam and wall midline', () => {
    const corners = posterCorners('left', 0);
    expect(corners[0][0]).toBe(corners[0][1]);
    expect(corners[1][0]).toBe(corners[1][1]);
    expect(corners[2][1]).toBe(500);
    expect(corners[3][1]).toBe(500);
  });
  it('projects all four image corners onto the wall without clipping or faking the perspective', () => {
    for (const wall of ['left', 'right', 'top', 'bottom'] as const) {
      for (const lane of [0, 1] as const) {
        const corners = posterCorners(wall, lane);
        const m = projectPoster(corners);
        [[0, 0], [100, 0], [100, 100], [0, 100]].forEach(([x, y], i) => {
          const w = m[3] * x + m[7] * y + 1;
          expect((m[0] * x + m[4] * y + m[12]) / w).toBeCloseTo(corners[i][0]);
          expect((m[1] * x + m[5] * y + m[13]) / w).toBeCloseTo(corners[i][1]);
        });
      }
    }
  });
});
