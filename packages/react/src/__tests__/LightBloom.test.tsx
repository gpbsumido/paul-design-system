import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LightBloom } from '../LightBloom';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('LightBloom', () => {
  it('renders a decorative glow layer', () => {
    const { container } = render(<LightBloom />);
    const glow = container.querySelector('.light-bloom__glow');
    expect(glow?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.light-bloom--bottom')).not.toBeNull();
  });

  it('adds drifting shafts in the shaft variant and layers content', () => {
    const { container } = render(
      <LightBloom variant="shaft">
        <h2>Bloom</h2>
      </LightBloom>,
    );
    expect(container.querySelector('.light-bloom__shafts')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Bloom' })).toBeInTheDocument();
  });
});
