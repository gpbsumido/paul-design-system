import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { BlurReveal } from '../BlurReveal';

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

describe('BlurReveal', () => {
  it('animates by default and honours a custom element and delay', () => {
    stubReducedMotion(false);
    render(
      <BlurReveal as="h3" delayMs={120}>
        Heading
      </BlurReveal>,
    );
    const el = screen.getByText('Heading');
    expect(el.tagName).toBe('H3');
    expect(el).toHaveClass('blur-reveal');
    expect(el.style.animationDelay).toBe('120ms');
  });

  it('drops the animation class under reduced motion', async () => {
    stubReducedMotion(true);
    render(<BlurReveal>Heading</BlurReveal>);
    await waitFor(() =>
      expect(screen.getByText('Heading')).not.toHaveClass('blur-reveal'),
    );
  });
});
