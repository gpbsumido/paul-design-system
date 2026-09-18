import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { LiquidGlass } from '../LiquidGlass';

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

describe('LiquidGlass', () => {
  it('renders its children on the glass surface with a drifting sheen', () => {
    stubReducedMotion(false);
    const { container } = render(
      <LiquidGlass as="section">
        <p>Bet slip</p>
      </LiquidGlass>,
    );
    expect(container.querySelector('section.liquid-glass')).not.toBeNull();
    expect(
      screen.getByText('Bet slip').closest('.liquid-glass__content'),
    ).toBeInTheDocument();
    expect(container.querySelector('.liquid-glass__sheen')).not.toBeNull();
  });

  it('holds the sheen still under reduced motion', async () => {
    stubReducedMotion(true);
    const { container } = render(
      <LiquidGlass>
        <p>x</p>
      </LiquidGlass>,
    );
    await waitFor(() =>
      expect(container.querySelector('.liquid-glass')).toHaveClass(
        'liquid-glass--static',
      ),
    );
  });
});
