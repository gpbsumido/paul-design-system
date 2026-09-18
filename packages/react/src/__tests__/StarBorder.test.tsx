import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { StarBorder } from '../StarBorder';

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('StarBorder', () => {
  it('renders its children over a decorative spinning ring', () => {
    stubReducedMotion(false);
    const { container } = render(
      <StarBorder>
        <p>Biggest underdog</p>
      </StarBorder>,
    );
    expect(
      screen.getByText('Biggest underdog').closest('.star-border__content'),
    ).toBeInTheDocument();
    const ring = container.querySelector('.star-border__ring');
    expect(ring?.getAttribute('aria-hidden')).toBe('true');
  });

  it('marks the ring static under reduced motion', async () => {
    stubReducedMotion(true);
    const { container } = render(
      <StarBorder>
        <p>x</p>
      </StarBorder>,
    );
    await waitFor(() =>
      expect(container.querySelector('.star-border')).toHaveClass(
        'star-border--static',
      ),
    );
  });
});
