import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LatticeLoader } from '../LatticeLoader';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('LatticeLoader', () => {
  it('renders a status region with a full grid while working', () => {
    render(<LatticeLoader label="Loading" grid={3} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-status', 'working');
    expect(
      status.querySelectorAll('.lattice-loader__run .lattice-loader__cell'),
    ).toHaveLength(9);
    expect(status).toHaveTextContent('Loading');
  });

  it('shows the done mark and activates the done label when finished', () => {
    render(<LatticeLoader status="done" doneLabel="Done" showTimer={false} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-status', 'done');
    const active = status.querySelector('.lattice-loader__text[data-active]');
    expect(active).toHaveTextContent('Done');
  });
});
