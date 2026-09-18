import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { ShineSweep } from '../ShineSweep';

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

describe('ShineSweep', () => {
  it('lays a decorative sheen over its children', () => {
    stubReducedMotion(false);
    const { container } = render(
      <ShineSweep>
        <button type="button">Place bet</button>
      </ShineSweep>,
    );
    expect(screen.getByRole('button', { name: 'Place bet' })).toBeInTheDocument();
    const sheen = container.querySelector('.shine-sweep__sheen');
    expect(sheen?.getAttribute('aria-hidden')).toBe('true');
  });

  it('drops the sheen entirely under reduced motion', async () => {
    stubReducedMotion(true);
    const { container } = render(
      <ShineSweep>
        <button type="button">Place bet</button>
      </ShineSweep>,
    );
    await waitFor(() =>
      expect(container.querySelector('.shine-sweep__sheen')).toBeNull(),
    );
  });
});
