export type PosterWall = 'left' | 'right' | 'top' | 'bottom';
type Point = readonly [number, number];

export function posterPlacement(index: number, variant: 'tunnel' | 'corridor') {
  const walls: PosterWall[] = variant === 'tunnel' ? ['left', 'top', 'right', 'bottom'] : ['left', 'right'];
  const lanes = walls.length * 2;
  return {
    wall: walls[index % walls.length],
    lane: (Math.floor(index / walls.length) % 2) as 0 | 1,
    // A seeded, evenly distributed shuffle: stable during hydration, with no
    // synchronized columns of posters on opposing walls.
    phase: (0.17 + (index % lanes) * 0.61803398875 + Math.floor(index / lanes) * lanes / 16) % 1,
  };
}

export function posterCorners(wall: PosterWall, lane: 0 | 1): Point[] {
  // Image corners in a 1000-square perspective scene. Both horizontal edges
  // follow the corner seam or midline; the vertical edges share a depth plane.
  // The far edge sits at 84% of the near depth, leaving a gap even with four
  // posters per lane at the largest animated scale.
  const points: Point[] = lane === 0
    ? [[0, 0], [80, 80], [80, 500], [0, 500]]
    : [[0, 500], [80, 500], [80, 920], [0, 1000]];
  if (wall === 'right') return [points[1], points[0], points[3], points[2]].map(([x, y]) => [1000 - x, y] as Point);
  if (wall === 'top') return points.map(([x, y]) => [1000 - y, x] as Point);
  if (wall === 'bottom') return points.map(([x, y]) => [y, 1000 - x] as Point);
  return points;
}

/** Homography from a 100px square image to four coplanar perspective corners. */
export function projectPoster([p0, p1, p2, p3]: readonly Point[]): number[] {
  const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0];
  const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1];
  const sx = p0[0] - p1[0] + p2[0] - p3[0];
  const sy = p0[1] - p1[1] + p2[1] - p3[1];
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / determinant;
  const h = (dx1 * sy - sx * dy1) / determinant;
  return [
    (p1[0] - p0[0] + g * p1[0]) / 100, (p1[1] - p0[1] + g * p1[1]) / 100, 0, g / 100,
    (p3[0] - p0[0] + h * p3[0]) / 100, (p3[1] - p0[1] + h * p3[1]) / 100, 0, h / 100,
    0, 0, 1, 0, p0[0], p0[1], 0, 1,
  ];
}
