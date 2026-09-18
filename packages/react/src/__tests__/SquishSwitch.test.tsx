import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { SquishSwitch } from '../SquishSwitch';

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

describe('SquishSwitch', () => {
  it('is a labelled switch that reflects and toggles its state', () => {
    stubReducedMotion(false);
    const onChange = vi.fn();
    render(<SquishSwitch checked={false} onChange={onChange} label="Dark mode" />);
    const control = screen.getByRole('switch', { name: 'Dark mode' });
    expect(control).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(control);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('marks the on state', () => {
    stubReducedMotion(false);
    render(<SquishSwitch checked onChange={() => {}} label="Dark mode" />);
    const control = screen.getByRole('switch');
    expect(control).toHaveClass('squish-switch--on');
    expect(control).toHaveAttribute('aria-checked', 'true');
  });
});
