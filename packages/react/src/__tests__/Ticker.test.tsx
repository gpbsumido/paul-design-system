import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Ticker } from '../Ticker';

/** Stub matchMedia so the reduced-motion hook sees the given preference. */
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
});

describe('Ticker', () => {
  it('scroll mode is a labelled region that shows its children', () => {
    stubReducedMotion(false);
    render(
      <Ticker label="News ticker">
        <span>Headline</span>
      </Ticker>,
    );
    const region = screen.getByLabelText('News ticker');
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('ticker');
    expect(screen.getAllByText('Headline').length).toBeGreaterThan(0);
  });

  it('marquee mode is decorative (aria-hidden) and duplicates content for a seamless loop', () => {
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="Flavor" mode="marquee">
        <span>Hi</span>
      </Ticker>,
    );
    const root = container.querySelector('.ticker');
    expect(root).toHaveClass('ticker--marquee');
    expect(root?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getAllByText('Hi')).toHaveLength(2);
  });

  it('edge picks the border side', () => {
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="t" edge="bottom">
        <span>x</span>
      </Ticker>,
    );
    expect(container.querySelector('.ticker')).toHaveClass('ticker--bottom');
  });

  it('reduced motion collapses scroll mode to a single, plain scrollable copy', async () => {
    stubReducedMotion(true);
    render(
      <Ticker label="News ticker">
        <span>Solo</span>
      </Ticker>,
    );
    await waitFor(() => expect(screen.getAllByText('Solo')).toHaveLength(1));
  });
});
