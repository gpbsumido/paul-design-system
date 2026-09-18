import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DriftWall } from '../DriftWall';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('DriftWall', () => {
  it('renders a labelled group of focusable tiles', () => {
    render(
      <DriftWall
        items={[
          { image: 'a.jpg', title: 'Alpha' },
          { image: 'b.jpg', title: 'Beta' },
        ]}
        columns={2}
      />,
    );
    expect(
      screen.getByRole('group', { name: /drifting wall/i }),
    ).toBeInTheDocument();
    // Tiles are duplicated for the seamless loop, so there's at least one per item.
    expect(screen.getAllByRole('button', { name: 'Alpha' }).length).toBeGreaterThan(0);
  });

  it('renders items that carry an href as links', () => {
    render(
      <DriftWall
        items={[{ image: 'a.jpg', title: 'Alpha', href: 'https://example.com' }]}
        columns={1}
      />,
    );
    expect(screen.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });
});
